<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CmsHalamanController extends Controller
{
    /**
     * Display the CMS page settings editor.
     */
    public function index(): Response
    {
        $heroSettings = [
            'active_edition' => Setting::get('active_edition', 'Idul Fitri & Ramadan 1447 H'),
            'hero_eyebrow' => Setting::get('hero_eyebrow', 'GALUH & CO. • ATELIER BINGKISAN'),
            'hero_title' => Setting::get('hero_title', 'Kriya Bingkisan untuk Momen yang Tak Diulang.'),
            'hero_subtitle' => Setting::get('hero_subtitle', 'Kurasi hantaran mewah berbalut hardbox zamrud dan anyaman bambu artisanal untuk representasi prestisius keluarga dan korporat.'),
            'hero_tagline' => Setting::get('hero_tagline', 'Sentuhan Ketulusan di Setiap Kotak Hadiah'),
        ];

        $aboutPillars = Setting::get('about_pillars', [
            [
                'num' => '01',
                'title' => 'Kurasi Pilihan',
                'description' => 'Bahan bermutu tinggi dan higienis—butter Wijsman autentik, madu hutan murni, dan kopi single-origin pilihan.',
                'image' => '/images/product_bamboo_box.jpg',
            ],
            [
                'num' => '02',
                'title' => 'Kemasan Eksklusif',
                'description' => 'Anyaman bambu kriya & hardbox linen kokoh dengan pita satin ganda serta stempel segel lilin manual.',
                'image' => '/images/product_emerald_box.jpg',
            ],
            [
                'num' => '03',
                'title' => 'Sentuhan Personal',
                'description' => 'Kustomisasi kartu ucapan kaligrafi, grafir nama pada tumbler termal, dan sleeve logo perusahaan.',
                'image' => '/images/product_rattan_box.jpg',
            ],
        ]);

        $testimonials = Testimonial::orderBy('sort_order', 'asc')->get();
        $faqs = Faq::orderBy('sort_order', 'asc')->get();

        return Inertia::render('admin/cms-halaman/index', [
            'heroSettings' => $heroSettings,
            'aboutPillars' => $aboutPillars,
            'testimonials' => $testimonials,
            'faqs' => $faqs,
        ]);
    }

    /**
     * Update Hero & Seasonal Theme settings.
     */
    public function updateHero(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'active_edition' => 'required|string|max:255',
            'hero_eyebrow' => 'required|string|max:255',
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'required|string',
            'hero_tagline' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('landing_page_settings');

        return redirect()->back()->with('success', 'Pengaturan Hero & Edisi Musiman berhasil diperbarui.');
    }

    /**
     * Update About / Atelier Pillars.
     */
    public function updatePillars(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pillars' => 'required|array|min:3',
            'pillars.*.title' => 'required|string|max:255',
            'pillars.*.description' => 'required|string',
            'pillars.*.image' => 'required|string',
        ]);

        Setting::set('about_pillars', $validated['pillars']);
        Cache::forget('landing_page_settings');

        return redirect()->back()->with('success', 'Pilar Filosofi Kriya About section berhasil diperbarui.');
    }

    /**
     * Store a testimonial.
     */
    public function storeTestimonial(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'order_type' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'quote' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        Testimonial::create([
            ...$validated,
            'sort_order' => (Testimonial::max('sort_order') ?? 0) + 1,
            'is_active' => true,
        ]);

        Cache::forget('landing_page_testimonials_v1');

        return redirect()->back()->with('success', 'Testimoni klien berhasil ditambahkan.');
    }

    /**
     * Update a testimonial.
     */
    public function updateTestimonial(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'order_type' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'quote' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_active' => 'boolean',
        ]);

        $testimonial->update($validated);
        Cache::forget('landing_page_testimonials_v1');

        return redirect()->back()->with('success', 'Testimoni klien berhasil diperbarui.');
    }

    /**
     * Delete a testimonial.
     */
    public function destroyTestimonial(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();
        Cache::forget('landing_page_testimonials_v1');

        return redirect()->back()->with('success', 'Testimoni klien berhasil dihapus.');
    }

    /**
     * Store a FAQ.
     */
    public function storeFaq(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'required|string|in:pemesanan,custom_branding,pengiriman,pembayaran',
        ]);

        Faq::create([
            ...$validated,
            'sort_order' => (Faq::max('sort_order') ?? 0) + 1,
            'is_active' => true,
        ]);

        Cache::forget('landing_page_faqs_v1');

        return redirect()->back()->with('success', 'Pertanyaan FAQ berhasil ditambahkan.');
    }

    /**
     * Update a FAQ.
     */
    public function updateFaq(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category' => 'required|string|in:pemesanan,custom_branding,pengiriman,pembayaran',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);
        Cache::forget('landing_page_faqs_v1');

        return redirect()->back()->with('success', 'Pertanyaan FAQ berhasil diperbarui.');
    }

    /**
     * Delete a FAQ.
     */
    public function destroyFaq(Faq $faq): RedirectResponse
    {
        $faq->delete();
        Cache::forget('landing_page_faqs_v1');

        return redirect()->back()->with('success', 'Pertanyaan FAQ berhasil dihapus.');
    }
}
