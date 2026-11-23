<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductionOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProduksiController extends Controller
{
    /**
     * Display the Studio Assembly Kanban Board.
     */
    public function index(Request $request): Response
    {
        $query = ProductionOrder::query();

        if ($priority = $request->input('priority')) {
            $query->where('priority', $priority);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                    ->orWhere('client_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('package_name', 'like', "%{$search}%");
            });
        }

        $allOrders = $query->orderBy('target_delivery_date', 'asc')->get();

        $stages = [
            'persiapan_bahan' => [
                'title' => 'Persiapan Bahan & Box',
                'description' => 'Kurasi toples kue, madu, dan perakitan hardbox/anyaman.',
                'orders' => $allOrders->where('stage', 'persiapan_bahan')->values(),
            ],
            'cetak_grafir' => [
                'title' => 'Cetak Kartu & Grafir Laser',
                'description' => 'Kaligrafi kartu ucapan & grafir laser monogram nama.',
                'orders' => $allOrders->where('stage', 'cetak_grafir')->values(),
            ],
            'perakitan_wax' => [
                'title' => 'Perakitan & Stempel Wax Seal',
                'description' => 'Penataan pita satin, kartu foil, dan segel lilin wax manual.',
                'orders' => $allOrders->where('stage', 'perakitan_wax')->values(),
            ],
            'siap_kirim' => [
                'title' => 'Siap Kirim / Pickup',
                'description' => 'Pemeriksaan QC akhir & penyerahan ke kurir pengantaran.',
                'orders' => $allOrders->where('stage', 'siap_kirim')->values(),
            ],
        ];

        $summary = [
            'total_orders' => $allOrders->count(),
            'total_boxes' => $allOrders->sum('quantity'),
            'urgent_count' => $allOrders->where('priority', 'urgent')->count(),
            'ready_count' => $allOrders->where('stage', 'siap_kirim')->count(),
        ];

        return Inertia::render('admin/produksi/index', [
            'stages' => $stages,
            'summary' => $summary,
            'filters' => $request->only(['priority', 'search']),
        ]);
    }

    /**
     * Update the Kanban stage of an order.
     */
    public function updateStage(Request $request, ProductionOrder $order): RedirectResponse
    {
        $validated = $request->validate([
            'stage' => 'required|string|in:persiapan_bahan,cetak_grafir,perakitan_wax,siap_kirim',
        ]);

        $order->update(['stage' => $validated['stage']]);

        return redirect()->back()->with('success', "Pesanan #{$order->order_code} dipindahkan ke tahapan baru.");
    }

    /**
     * Store a newly created production order.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'package_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'greeting_card_text' => 'nullable|string',
            'engraving_names' => 'nullable|array',
            'target_delivery_date' => 'required|date',
            'stage' => 'required|string|in:persiapan_bahan,cetak_grafir,perakitan_wax,siap_kirim',
            'priority' => 'required|string|in:normal,high,urgent',
            'notes' => 'nullable|string',
        ]);

        $orderCode = 'GLH-'.date('Y').'-'.str_pad((string) (ProductionOrder::count() + 1), 3, '0', STR_PAD_LEFT);

        ProductionOrder::create([
            'order_code' => $orderCode,
            ...$validated,
        ]);

        return redirect()->back()->with('success', "Pesanan produksi #{$orderCode} berhasil dibuat.");
    }

    /**
     * Update order details.
     */
    public function update(Request $request, ProductionOrder $order): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'package_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'greeting_card_text' => 'nullable|string',
            'engraving_names' => 'nullable|array',
            'target_delivery_date' => 'required|date',
            'stage' => 'required|string|in:persiapan_bahan,cetak_grafir,perakitan_wax,siap_kirim',
            'priority' => 'required|string|in:normal,high,urgent',
            'notes' => 'nullable|string',
        ]);

        $order->update($validated);

        return redirect()->back()->with('success', "Pesanan #{$order->order_code} berhasil diperbarui.");
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(ProductionOrder $order): RedirectResponse
    {
        $code = $order->order_code;
        $order->delete();

        return redirect()->back()->with('success', "Pesanan #{$code} berhasil dihapus.");
    }
}
