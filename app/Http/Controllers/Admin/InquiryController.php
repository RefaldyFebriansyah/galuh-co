<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\ProductionOrder;
use App\Models\Setting;
use App\Models\WaTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    /**
     * Display a listing of client inquiries.
     */
    public function index(Request $request): Response
    {
        $query = Inquiry::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('whatsapp_number', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        $inquiries = $query->latest()
            ->paginate(15)
            ->withQueryString();

        $whatsappNumber = Setting::get('whatsapp_number', '6281572414233');

        $statusCounts = [
            'total' => Inquiry::count(),
            'new' => Inquiry::where('status', 'new')->count(),
            'contacted' => Inquiry::where('status', 'contacted')->count(),
            'completed' => Inquiry::where('status', 'completed')->count(),
            'cancelled' => Inquiry::where('status', 'cancelled')->count(),
        ];

        $templates = WaTemplate::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', 'all'),
            ],
            'statusCounts' => $statusCounts,
            'templates' => $templates,
            'whatsappNumber' => $whatsappNumber,
        ]);
    }

    /**
     * Update inquiry status and admin notes.
     */
    public function updateStatus(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:new,contacted,completed,cancelled'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $inquiry->update($validated);

        // If marked as completed / deal, automatically create production order if not already created
        if ($validated['status'] === 'completed') {
            $this->createProductionOrderFromInquiry($inquiry);
        }

        return back()->with('success', "Status inquiry dari \"{$inquiry->name}\" berhasil diperbarui.");
    }

    /**
     * Delete an inquiry.
     */
    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $name = $inquiry->name;
        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', "Inquiry dari \"{$name}\" berhasil dihapus.");
    }

    /**
     * Create studio production order from confirmed inquiry.
     */
    private function createProductionOrderFromInquiry(Inquiry $inquiry): void
    {
        $existing = ProductionOrder::where('client_name', $inquiry->name)
            ->where('company_name', $inquiry->company_name)
            ->first();

        if ($existing) {
            return;
        }

        $orderCount = ProductionOrder::count() + 1;
        $orderCode = 'GLH-'.date('Y').'-'.str_pad((string) $orderCount, 3, '0', STR_PAD_LEFT);

        ProductionOrder::create([
            'order_code' => $orderCode,
            'client_name' => $inquiry->name,
            'company_name' => $inquiry->company_name,
            'package_name' => 'Paket Corporate B2B'.($inquiry->estimated_packages ? " ({$inquiry->estimated_packages} Box)" : ''),
            'quantity' => (int) ($inquiry->estimated_packages ?? 50),
            'greeting_card_text' => $inquiry->notes ?: 'Salam Hangat dari '.($inquiry->company_name ?: $inquiry->name),
            'greeting_card_status' => 'pending',
            'engraving_names' => $inquiry->company_name ? [$inquiry->company_name] : [$inquiry->name],
            'engraving_status' => 'pending',
            'target_delivery_date' => $inquiry->needed_at ?: now()->addDays(7),
            'stage' => 'persiapan_bahan',
            'priority' => 'normal',
            'notes' => 'Otomatis dibuat dari Deal Inquiry Web. No. WA: '.$inquiry->whatsapp_number,
        ]);
    }
}
