<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInquiryRequest;
use App\Mail\CorporateInquiryNotification;
use App\Models\Inquiry;
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

        // 3. Queue notification email to corporate sales team
        $recipient = (string) config('mail.from.address', 'admin@galuh.co');
        Mail::to($recipient)->queue(
            (new CorporateInquiryNotification($inquiry))->afterCommit()
        );

        // 4. Return back with flash success message
        return back()->with(
            'success',
            'Permintaan penawaran corporate Anda berhasil dikirim! Tim konsultan GALUH & CO. akan segera menghubungi Anda.',
        );
    }
}
