<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderTrackingController extends Controller
{
    /**
     * Display the public order tracking search & status page.
     */
    public function index(Request $request): Response
    {
        $resi = trim((string) $request->input('resi', ''));
        $order = null;

        if ($resi !== '') {
            $order = Order::where('tracking_number', $resi)
                ->orWhere('order_number', $resi)
                ->with(['items.product', 'trackingLogs'])
                ->first();
        }

        return Inertia::render('lacak-pesanan', [
            'resiQuery' => $resi,
            'order' => $order,
        ]);
    }
}
