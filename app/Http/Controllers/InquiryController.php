<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInquiryRequest;
use App\Mail\CorporateInquiryNotification;
use App\Models\Inquiry;
use App\Models\WaLead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * Handle the incoming corporate inquiry request.
     */
    public function store(StoreInquiryRequest $request): RedirectResponse
    {
        // 1. Double check honeypot (silent drop for automated bots)
        if ($request->filled('website')) {
            return back()->with('success', 'Permintaan penawaran corporate Anda berhasil dikirim.');
        }

        // 2. Persist valid inquiry to database
        $inquiry = Inquiry::create($request->safe()->except(['website']));

        // 3. Also sync into WhatsApp Leads (Domain III) for seamless backoffice tracking
        try {
            $isPersonal = $inquiry->order_type === 'personal';
            WaLead::create([
                'client_name' => $inquiry->name,
                'company_name' => $inquiry->company_name,
                'wa_number' => $inquiry->whatsapp_number,
                'address' => $inquiry->address,
                'source' => $isPersonal ? 'catalog_personal' : 'form_corporate_web',
                'package_name' => $isPersonal
                    ? ($inquiry->notes ? "Pesanan Personal: {$inquiry->notes}" : 'Pesanan Personal Hamper')
                    : 'Konsultasi Corporate B2B'.($inquiry->estimated_packages ? " ({$inquiry->estimated_packages})" : ''),
                'estimated_packages' => $inquiry->estimated_packages ?: '1 Box',
                'budget_range' => $inquiry->budget_per_package ? 'Rp '.number_format((float) $inquiry->budget_per_package, 0, ',', '.') : null,
                'delivery_date' => $inquiry->needed_at,
                'notes' => ($inquiry->address ? "Alamat: {$inquiry->address}\n" : '').($inquiry->notes ?: '-'),
                'status' => 'chat_baru',
            ]);
        } catch (\Throwable $e) {
            // Silently log or continue if wa_lead sync fails so user submission succeeds
            report($e);
        }

        // 4. Queue notification email to corporate sales team
        $recipient = (string) config('mail.from.address', 'admin@galuh.co');
        Mail::to($recipient)->queue(
            (new CorporateInquiryNotification($inquiry))->afterCommit()
        );

        // 5. Return back with flash success message
        return back()->with(
            'success',
            'Permintaan penawaran corporate Anda berhasil dikirim! Tim konsultan GALUH & CO. akan segera menghubungi Anda.',
        );
    }
}
