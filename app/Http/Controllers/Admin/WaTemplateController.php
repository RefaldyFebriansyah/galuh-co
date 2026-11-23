<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WaTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WaTemplateController extends Controller
{
    /**
     * Display a listing of WhatsApp templates.
     */
    public function index(Request $request): Response
    {
        $query = WaTemplate::query();

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $templates = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $categories = [
            'sambutan_awal' => 'Sambutan Awal & Salam',
            'kirim_pricelist' => 'Pricelist & Penawaran B2B',
            'desain_kartu' => 'Konfirmasi Kartu & Grafir',
            'info_pengiriman' => 'Pengiriman & Nomor Resi',
            'follow_up' => 'Follow Up Penawaran',
        ];

        return Inertia::render('admin/template-wa/index', [
            'templates' => $templates,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    /**
     * Store a newly created template in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:sambutan_awal,kirim_pricelist,desain_kartu,info_pengiriman,follow_up',
            'content' => 'required|string',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        WaTemplate::create([
            ...$validated,
            'sort_order' => (WaTemplate::max('sort_order') ?? 0) + 1,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->back()->with('success', 'Template pesan WhatsApp berhasil ditambahkan.');
    }

    /**
     * Update the specified template in storage.
     */
    public function update(Request $request, WaTemplate $templateWa): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|in:sambutan_awal,kirim_pricelist,desain_kartu,info_pengiriman,follow_up',
            'content' => 'required|string',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $templateWa->update($validated);

        return redirect()->back()->with('success', 'Template pesan WhatsApp berhasil diperbarui.');
    }

    /**
     * Remove the specified template from storage.
     */
    public function destroy(WaTemplate $templateWa): RedirectResponse
    {
        $templateWa->delete();

        return redirect()->back()->with('success', 'Template pesan WhatsApp berhasil dihapus.');
    }
}
