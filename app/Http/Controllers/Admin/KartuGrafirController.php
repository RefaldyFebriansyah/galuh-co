<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductionOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KartuGrafirController extends Controller
{
    /**
     * Display the greeting card print & engraving checklist.
     */
    public function index(Request $request): Response
    {
        $query = ProductionOrder::query();

        if ($type = $request->input('filter_type')) {
            if ($type === 'pending_cards') {
                $query->where('greeting_card_status', 'pending')->whereNotNull('greeting_card_text');
            } elseif ($type === 'pending_engraving') {
                $query->where('engraving_status', 'pending')->whereNotNull('engraving_names');
            }
        }

        $orders = $query->orderBy('target_delivery_date', 'asc')->get();

        $stats = [
            'total_pending_cards' => ProductionOrder::where('greeting_card_status', 'pending')->whereNotNull('greeting_card_text')->count(),
            'total_printed_cards' => ProductionOrder::where('greeting_card_status', 'printed')->count(),
            'total_pending_engraving' => ProductionOrder::where('engraving_status', 'pending')->whereNotNull('engraving_names')->count(),
            'total_completed_engraving' => ProductionOrder::where('engraving_status', 'engraved')->count(),
        ];

        return Inertia::render('admin/kartu-grafir/index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['filter_type']),
        ]);
    }

    /**
     * Toggle greeting card printed status.
     */
    public function toggleCardStatus(ProductionOrder $order): RedirectResponse
    {
        $newStatus = $order->greeting_card_status === 'printed' ? 'pending' : 'printed';
        $order->update(['greeting_card_status' => $newStatus]);

        $label = $newStatus === 'printed' ? 'Selesai Dicetak' : 'Belum Dicetak';

        return redirect()->back()->with('success', "Status kartu ucapan #{$order->order_code} diubah menjadi {$label}.");
    }

    /**
     * Toggle laser engraving status.
     */
    public function toggleEngravingStatus(ProductionOrder $order): RedirectResponse
    {
        $newStatus = $order->engraving_status === 'engraved' ? 'pending' : 'engraved';
        $order->update(['engraving_status' => $newStatus]);

        $label = $newStatus === 'engraved' ? 'Selesai Digrafir' : 'Belum Digrafir';

        return redirect()->back()->with('success', "Status grafir tumbler #{$order->order_code} diubah menjadi {$label}.");
    }
}
