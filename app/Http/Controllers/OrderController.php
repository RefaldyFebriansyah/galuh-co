<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\TrackingLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a list of the user's orders.
     */
    public function index(): Response
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.product', 'trackingLogs'])
            ->latest()
            ->get();

        return Inertia::render('my-orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Store a new in-website order (Personal or Corporate).
     */
    public function store(Request $request): RedirectResponse
    {
        if (! Auth::check()) {
            return redirect()->route('login')
                ->with('error', 'Silakan masuk atau daftar akun terlebih dahulu untuk menyelesaikan pemesanan.');
        }

        $orderType = $request->input('order_type', 'personal');

        $validated = $request->validate([
            'order_type' => ['required', 'in:personal,corporate'],
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => [
                'required',
                'integer',
                $orderType === 'corporate' ? 'min:25' : 'min:1',
            ],
            'company_name' => [$orderType === 'corporate' ? 'required' : 'nullable', 'string', 'max:255'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string', 'max:2000'],
            'city' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'needed_at' => ['nullable', 'date'],
            'greeting_card_text' => ['nullable', 'string', 'max:1000'],
            'engraving_name' => ['nullable', 'string', 'max:255'],
            'customer_notes' => ['nullable', 'string', 'max:1500'],
        ], [
            'quantity.min' => $orderType === 'corporate'
                ? 'Pemesanan paket corporate/perusahaan wajib minimal 25 paket ke atas.'
                : 'Jumlah pesanan minimal 1 paket.',
            'company_name.required' => 'Nama perusahaan/instansi wajib diisi untuk pesanan corporate.',
            'shipping_address.required' => 'Alamat lengkap pengiriman wajib diisi.',
            'recipient_name.required' => 'Nama lengkap penerima wajib diisi.',
            'recipient_phone.required' => 'Nomor kontak/telepon penerima wajib diisi.',
        ]);

        /** @var Product $product */
        $product = Product::findOrFail($validated['product_id']);

        // Pricing logic: corporate price for bulk corporate >= 25 pcs; standard price for personal
        $unitPrice = $orderType === 'corporate'
            ? ($product->corporate_price ?: (int) round($product->price_from * 0.85, -3))
            : $product->price_from;

        $quantity = (int) $validated['quantity'];
        $subtotal = $unitPrice * $quantity;
        $shippingCost = 0; // Gratis ongkir protektif kurir atelier
        $totalAmount = $subtotal + $shippingCost;

        $orderNumber = Order::generateOrderNumber();
        $trackingNumber = Order::generateTrackingNumber();

        $order = DB::transaction(function () use ($validated, $orderType, $quantity, $subtotal, $shippingCost, $totalAmount, $orderNumber, $trackingNumber, $product, $unitPrice) {
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => Auth::id(),
                'order_type' => $orderType,
                'company_name' => $validated['company_name'] ?? null,
                'recipient_name' => $validated['recipient_name'],
                'recipient_phone' => $validated['recipient_phone'],
                'shipping_address' => $validated['shipping_address'],
                'city' => $validated['city'] ?? null,
                'postal_code' => $validated['postal_code'] ?? null,
                'needed_at' => $validated['needed_at'] ?? null,
                'greeting_card_text' => $validated['greeting_card_text'] ?? null,
                'engraving_name' => $validated['engraving_name'] ?? null,
                'total_quantity' => $quantity,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total_amount' => $totalAmount,
                'payment_status' => 'paid',
                'status' => 'processing',
                'tracking_number' => $trackingNumber,
                'shipping_courier' => 'Kurir Khusus Galuh Atelier',
                'shipping_status' => 'studio_processing',
                'customer_notes' => $validated['customer_notes'] ?? null,
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
            ]);

            TrackingLog::create([
                'order_id' => $order->id,
                'stage' => 'studio_processing',
                'title' => 'Pesanan Berhasil Masuk ke Studio Atelier',
                'description' => 'Pesanan Anda telah dikonfirmasi dan mulai disiapkan oleh tim kurasi kriya studio Galuh & Co.',
                'location' => 'Studio Atelier Galuh & Co., Ciamis',
                'logged_at' => now(),
            ]);

            return $order;
        });

        return redirect()->route('tracking.index', ['resi' => $order->tracking_number])
            ->with('success', "Pesanan Anda berhasil dibuat! Nomor Resi Pelacakan: {$order->tracking_number}");
    }
}
