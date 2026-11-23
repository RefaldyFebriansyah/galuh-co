<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductionOrder;
use App\Models\WaLead;
use App\Models\WaTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class WaLeadController extends Controller
{
    /**
     * Display a listing of WhatsApp leads.
     */
    public function index(Request $request): Response
    {
        $query = WaLead::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('client_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('wa_number', 'like', "%{$search}%")
                    ->orWhere('package_name', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($source = $request->input('source')) {
            $query->where('source', $source);
        }

        $leads = $query->orderBy('last_follow_up_at', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $templates = WaTemplate::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        $statusCounts = [
            'total' => WaLead::count(),
            'chat_baru' => WaLead::where('status', 'chat_baru')->count(),
            'kirim_katalog' => WaLead::where('status', 'kirim_katalog')->count(),
            'negosiasi_custom' => WaLead::where('status', 'negosiasi_custom')->count(),
            'deal_produksi' => WaLead::where('status', 'deal_produksi')->count(),
            'batal' => WaLead::where('status', 'batal')->count(),
        ];

        return Inertia::render('admin/wa-leads/index', [
            'leads' => $leads,
            'templates' => $templates,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['search', 'status', 'source']),
        ]);
    }

    /**
     * Store a newly created lead (manual entry).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'wa_number' => 'required|string|max:50',
            'source' => 'required|string',
            'package_name' => 'nullable|string|max:255',
            'estimated_packages' => 'nullable|string|max:50',
            'budget_range' => 'nullable|string|max:100',
            'greeting_card_message' => 'nullable|string',
            'engraving_name' => 'nullable|string|max:255',
            'delivery_date' => 'nullable|date',
            'status' => 'required|string|in:chat_baru,kirim_katalog,negosiasi_custom,deal_produksi,batal',
            'notes' => 'nullable|string',
        ]);

        $lead = WaLead::create([
            ...$validated,
            'last_follow_up_at' => now(),
        ]);

        // If directly deal, create production order
        if ($lead->status === 'deal_produksi') {
            $this->createProductionOrderFromLead($lead);
        }

        return redirect()->back()->with('success', 'Lead WhatsApp berhasil dicatat.');
    }

    /**
     * Update lead details.
     */
    public function update(Request $request, WaLead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'wa_number' => 'required|string|max:50',
            'source' => 'required|string',
            'package_name' => 'nullable|string|max:255',
            'estimated_packages' => 'nullable|string|max:50',
            'budget_range' => 'nullable|string|max:100',
            'greeting_card_message' => 'nullable|string',
            'engraving_name' => 'nullable|string|max:255',
            'delivery_date' => 'nullable|date',
            'status' => 'required|string|in:chat_baru,kirim_katalog,negosiasi_custom,deal_produksi,batal',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $lead->status;
        $lead->update($validated);

        if ($oldStatus !== 'deal_produksi' && $lead->status === 'deal_produksi') {
            $this->createProductionOrderFromLead($lead);
        }

        return redirect()->back()->with('success', 'Data lead berhasil diperbarui.');
    }

    /**
     * Update lead pipeline status.
     */
    public function updateStatus(Request $request, WaLead $lead): RedirectResponse
    {
        $status = $request->input('status');
        $oldStatus = $lead->status;

        $lead->update([
            'status' => $status,
            'last_follow_up_at' => now(),
        ]);

        if ($oldStatus !== 'deal_produksi' && $status === 'deal_produksi') {
            $this->createProductionOrderFromLead($lead);
        }

        return redirect()->back()->with('success', "Status lead dipindahkan ke {$lead->status_label}.");
    }

    /**
     * Log follow up action.
     */
    public function logFollowUp(WaLead $lead): RedirectResponse
    {
        $lead->update(['last_follow_up_at' => now()]);

        return redirect()->back()->with('success', 'Waktu follow-up WhatsApp telah diperbarui.');
    }

    /**
     * Delete lead.
     */
    public function destroy(WaLead $lead): RedirectResponse
    {
        $lead->delete();

        return redirect()->back()->with('success', 'Lead berhasil dihapus.');
    }

    /**
     * Helper to spawn a studio production order once a lead deals.
     */
    protected function createProductionOrderFromLead(WaLead $lead): void
    {
        if (ProductionOrder::where('wa_lead_id', $lead->id)->exists()) {
            return;
        }

        $qtyNumber = (int) filter_var($lead->estimated_packages, FILTER_SANITIZE_NUMBER_INT) ?: 25;
        $orderCode = 'GLH-'.date('Y').'-'.str_pad((string) (ProductionOrder::count() + 1), 3, '0', STR_PAD_LEFT);

        ProductionOrder::create([
            'order_code' => $orderCode,
            'wa_lead_id' => $lead->id,
            'client_name' => $lead->client_name,
            'company_name' => $lead->company_name,
            'package_name' => $lead->package_name ?: 'Paket Custom Atelier',
            'quantity' => $qtyNumber,
            'greeting_card_text' => $lead->greeting_card_message,
            'greeting_card_status' => 'pending',
            'engraving_names' => $lead->engraving_name ? [$lead->engraving_name] : null,
            'engraving_status' => 'pending',
            'target_delivery_date' => $lead->delivery_date ?: Carbon::now()->addDays(10),
            'stage' => 'persiapan_bahan',
            'priority' => $qtyNumber >= 100 ? 'high' : 'normal',
            'notes' => 'Otomatis dibuat dari deal lead WhatsApp #'.$lead->id,
        ]);
    }
}
