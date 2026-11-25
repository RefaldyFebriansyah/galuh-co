<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\TrackingLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of all customer orders (Super Admin).
     */
    public function index(Request $request): Response
    {
        $type = $request->query('type', 'all');
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = Order::with(['user', 'items.product', 'trackingLogs'])->latest();

        if ($type !== 'all') {
            $query->where('order_type', $type);
        }

        if ($status !== 'all') {
            $query->where('shipping_status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('tracking_number', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate(20)->withQueryString();

        $stats = [
            'total_orders' => Order::count(),
            'personal_orders' => Order::where('order_type', 'personal')->count(),
            'corporate_orders' => Order::where('order_type', 'corporate')->count(),
            'studio_processing' => Order::where('shipping_status', 'studio_processing')->count(),
            'in_delivery' => Order::where('shipping_status', 'in_delivery')->count(),
            'delivered' => Order::where('shipping_status', 'delivered')->count(),
            'total_revenue' => Order::sum('total_amount'),
        ];

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'type' => $type,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Update order status, tracking receipt number, and delivery stage.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'shipping_status' => ['required', 'in:studio_processing,quality_check,in_delivery,delivered'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'shipping_courier' => ['nullable', 'string', 'max:100'],
            'log_note' => ['nullable', 'string', 'max:500'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $prevStatus = $order->shipping_status;
        $newStatus = $validated['shipping_status'];

        $order->update([
            'shipping_status' => $newStatus,
            'tracking_number' => $validated['tracking_number'] ?: ($order->tracking_number ?: Order::generateTrackingNumber()),
            'shipping_courier' => $validated['shipping_courier'] ?: ($order->shipping_courier ?: 'Kurir Khusus Galuh Atelier'),
            'admin_notes' => $validated['admin_notes'] ?? $order->admin_notes,
            'status' => $newStatus === 'delivered' ? 'completed' : 'processing',
        ]);

        // Add tracking timeline log if status changed or note provided
        if ($prevStatus !== $newStatus || ! empty($validated['log_note'])) {
            $stageTitles = [
                'studio_processing' => 'Diproses di Studio Atelier',
                'quality_check' => 'Quality Check & Packing Pita/Foil',
                'in_delivery' => 'Pesanan Dalam Pengiriman Kurir',
                'delivered' => 'Pesanan Telah Diterima Konsumen',
            ];

            TrackingLog::create([
                'order_id' => $order->id,
                'stage' => $newStatus,
                'title' => $stageTitles[$newStatus] ?? 'Pembaruan Status Pengiriman',
                'description' => $validated['log_note'] ?: "Status pengiriman diperbarui menjadi {$stageTitles[$newStatus]}.",
                'location' => 'Studio Atelier Galuh & Co., Ciamis',
                'logged_at' => now(),
            ]);
        }

        return back()->with('success', "Status pesanan {$order->order_number} berhasil diperbarui.");
    }

    /**
     * Accept a pending order/inquiry from customer or corporate client.
     */
    public function accept(Order $order): RedirectResponse
    {
        $order->update([
            'status' => 'processing',
            'shipping_status' => 'studio_processing',
            'tracking_number' => $order->tracking_number ?: Order::generateTrackingNumber(),
            'shipping_courier' => $order->shipping_courier ?: 'Kurir Khusus Galuh Atelier',
        ]);

        TrackingLog::create([
            'order_id' => $order->id,
            'stage' => 'studio_processing',
            'title' => 'Pesanan Diterima & Masuk Antrean Studio',
            'description' => 'Pesanan telah diterima dan diverifikasi oleh Admin. Tim kurator atelier mulai merangkai paket hampers.',
            'location' => 'Studio Atelier Galuh & Co., Ciamis',
            'logged_at' => now(),
        ]);

        return back()->with('success', "Pesanan #{$order->order_number} berhasil di-accept dan diteruskan ke Tracking Studio.");
    }

    /**
     * Delete an order if canceled or erroneous.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $orderNum = $order->order_number;
        $order->items()->delete();
        $order->trackingLogs()->delete();
        $order->delete();

        return back()->with('success', "Pesanan #{$orderNum} berhasil dihapus.");
    }

    /**
     * Display the dedicated Tracking Pesanan page for Admin.
     * Allows monitoring orders through Studio Process, Delivery, and Delivered.
     */
    public function trackingIndex(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = Order::with(['user', 'items.product', 'trackingLogs' => fn ($q) => $q->latest()])
            ->whereIn('status', ['processing', 'completed'])
            ->latest();

        if ($status !== 'all') {
            $query->where('shipping_status', $status);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('tracking_number', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate(20)->withQueryString();

        $stats = [
            'total_active_tracking' => Order::whereIn('status', ['processing', 'completed'])->count(),
            'studio_processing' => Order::where('shipping_status', 'studio_processing')->count(),
            'quality_check' => Order::where('shipping_status', 'quality_check')->count(),
            'in_delivery' => Order::where('shipping_status', 'in_delivery')->count(),
            'delivered' => Order::where('shipping_status', 'delivered')->count(),
        ];

        return Inertia::render('admin/tracking/index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Update tracking stage & resi number directly from Tracking Pesanan page.
     */
    public function updateTracking(Request $request, Order $order): RedirectResponse
    {
        return $this->updateStatus($request, $order);
    }
}
