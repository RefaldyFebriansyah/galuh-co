<?php

namespace App\Http\Controllers;

use App\Models\WaLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackWaLeadController extends Controller
{
    /**
     * Silently track a WhatsApp consultation click from the website.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_name' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'wa_number' => 'nullable|string|max:50',
            'source' => 'required|string|max:50',
            'package_name' => 'nullable|string|max:255',
            'estimated_packages' => 'nullable|string|max:50',
            'budget_range' => 'nullable|string|max:100',
            'greeting_card_message' => 'nullable|string|max:1000',
            'engraving_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $lead = WaLead::create([
            'client_name' => ($validated['client_name'] ?? null) ?: 'Pengunjung Web (WA Klik)',
            'company_name' => $validated['company_name'] ?? null,
            'wa_number' => ($validated['wa_number'] ?? null) ?: '081200000000',
            'source' => $validated['source'],
            'package_name' => $validated['package_name'] ?? 'Koleksi Umum Galuh & Co.',
            'estimated_packages' => $validated['estimated_packages'] ?? null,
            'budget_range' => $validated['budget_range'] ?? null,
            'greeting_card_message' => $validated['greeting_card_message'] ?? null,
            'engraving_name' => $validated['engraving_name'] ?? null,
            'status' => 'chat_baru',
            'notes' => $validated['notes'] ?? 'Auto-logged from public website button click.',
            'last_follow_up_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'lead_id' => $lead->id,
            'wa_link' => $lead->wa_link,
        ]);
    }
}
