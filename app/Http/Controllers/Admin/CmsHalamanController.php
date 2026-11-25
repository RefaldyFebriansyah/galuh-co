<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsHalamanController extends Controller
{
    /**
     * Display the CMS page settings editor (Compatibility Index).
     */
    public function index(): Response
    {
        return $this->heroIndex();
    }

    /**
     * 1. EVENT MUSIMAN (Marketing Menu)
     * Promosikan/demo event hampers apa saja (Lebaran, Natal, Corporate, dll.)
     * Paket hampers bertema event otomatis dipromosikan di urutan paling atas.
     */
    public function eventsIndex(): Response
    {
        $activeEvent = (string) Setting::get('active_event', 'ramadhan');
        $eventBannerTitle = (string) Setting::get('event_banner_title', 'Kurasi Hantaran Istimewa Hari Raya');
        $eventBannerSubtitle = (string) Setting::get('event_banner_subtitle', 'Sambut momen suci dengan bingkisan mewah berbalut hardbox zamrud dan anyaman bambu artisanal.');
        $eventBannerImage = (string) Setting::get('event_banner_image', '/images/product_emerald_box.jpg');
        $eventBannerActive = (bool) Setting::get('event_banner_active', true);

        $products = Product::select(['id', 'name', 'category', 'event_tag', 'price_from', 'corporate_price', 'image', 'is_active'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $customEventName = (string) Setting::get('custom_event_name', 'Koleksi Kustom & Tematik Sendiri');
        $customEventBadge = (string) Setting::get('custom_event_badge', 'Custom Edition');

        $availableEvents = [
            ['id' => 'ramadhan', 'name' => 'Idul Fitri & Ramadhan 1447 H', 'badge' => 'Edisi Lebaran'],
            ['id' => 'natal', 'name' => 'Natal & Tahun Baru', 'badge' => 'Festive Season'],
            ['id' => 'corporate', 'name' => 'Apresiasi Korporat & Kemitraan B2B', 'badge' => 'Corporate Annual'],
            ['id' => 'imlek', 'name' => 'Tahun Baru Imlek & Musim Semi', 'badge' => 'Spring Blossom'],
            ['id' => 'pernikahan', 'name' => 'Seserahan & Hantaran Pernikahan', 'badge' => 'Wedding Atelier'],
            ['id' => 'custom', 'name' => $customEventName, 'badge' => $customEventBadge],
        ];

        return Inertia::render('admin/events/index', [
            'activeEvent' => $activeEvent,
            'eventBannerTitle' => $eventBannerTitle,
            'eventBannerSubtitle' => $eventBannerSubtitle,
            'eventBannerImage' => $eventBannerImage,
            'eventBannerActive' => $eventBannerActive,
            'products' => $products,
            'availableEvents' => $availableEvents,
            'customEventName' => $customEventName,
            'customEventBadge' => $customEventBadge,
        ]);
    }

    /**
     * Update active seasonal event & assigned products.
     */
    public function updateEvents(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'active_event' => ['required', 'string', 'max:50'],
            'event_banner_title' => ['required', 'string', 'max:255'],
            'event_banner_subtitle' => ['required', 'string', 'max:500'],
            'event_banner_image' => ['nullable', 'string', 'max:500'],
            'event_banner_active' => ['required', 'boolean'],
            'custom_event_name' => ['nullable', 'string', 'max:100'],
            'custom_event_badge' => ['nullable', 'string', 'max:50'],
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ]);

        if (! empty($validated['custom_event_name'])) {
            Setting::set('custom_event_name', $validated['custom_event_name'], 'marketing', 'string', 'Nama Event Kustom');
        }
        if (! empty($validated['custom_event_badge'])) {
            Setting::set('custom_event_badge', $validated['custom_event_badge'], 'marketing', 'string', 'Badge Event Kustom');
        }

        Setting::set('active_event', $validated['active_event'], 'marketing', 'string', 'Event Musiman Aktif');
        Setting::set('event_banner_title', $validated['event_banner_title'], 'marketing', 'string', 'Judul Banner Demo Event');
        Setting::set('event_banner_subtitle', $validated['event_banner_subtitle'], 'marketing', 'string', 'Subjudul Banner Demo Event');

        if (! empty($validated['event_banner_image'])) {
            $bannerImg = $this->handleImageUpload($validated['event_banner_image'], 'event_banner');
            Setting::set('event_banner_image', $bannerImg, 'marketing', 'string', 'Gambar Banner Demo Event');
        }

        Setting::set('event_banner_active', $validated['event_banner_active'] ? '1' : '0', 'marketing', 'boolean', 'Status Banner Demo Event');

        // Tag selected products with active event, clear event tag for others
        $selectedIds = $validated['product_ids'] ?? [];
        if (! empty($selectedIds)) {
            Product::whereIn('id', $selectedIds)->update(['event_tag' => $validated['active_event']]);
            Product::whereNotIn('id', $selectedIds)->where('event_tag', $validated['active_event'])->update(['event_tag' => null]);
        }

        Cache::forget('landing_page_settings');

        return back()->with('success', 'Event musiman berhasil diaktifkan. Produk terkait otomatis dipromosikan di urutan teratas!');
    }

    /**
     * 2. HERO SHOWCASE (Landing Page Menu)
     * Mengatur foto hampers melayang (auto-hapus background & auto-kompresi WebP),
     * teks yang berganti-ganti, headline, dan teks berjalan (marquee).
     */
    public function heroIndex(): Response
    {
        $heroSettings = [
            'hero_badge' => (string) Setting::get('hero_badge', 'ATELIER HAMPERS & KADO KORPORAT'),
            'hero_title_prefix' => (string) Setting::get('hero_title_prefix', 'Hampers Eksklusif'),
            'hero_title' => (string) Setting::get('hero_title', 'Kriya Bingkisan untuk Momen yang Tak Diulang.'),
            'hero_subtitle' => (string) Setting::get('hero_subtitle', 'Kurasi hantaran mewah berbalut hardbox zamrud dan anyaman bambu artisanal untuk representasi prestisius keluarga dan korporat.'),
            'hero_tagline' => (string) Setting::get('hero_tagline', 'Sentuhan Ketulusan di Setiap Kotak Hadiah'),
            'active_edition' => (string) Setting::get('active_edition', ''),
            'hero_floating_image_left' => (string) Setting::get('hero_floating_image_left', '/images/floating-hamper-rattan.webp'),
            'hero_floating_image_right' => (string) Setting::get('hero_floating_image_right', '/images/floating-hamper-emerald.webp'),
            'hero_rotating_words' => Setting::get('hero_rotating_words', [
                'Personal & Perusahaan',
                'Mitra Perusahaan',
                'Momen Istimewa',
                'Momen yang Tak Diulang',
            ]),
            'hero_marquee_text' => (string) Setting::get('hero_marquee_text', 'Sentuhan Ketulusan di Setiap Kotak Hadiah • Kemasan Hardbox Linen 1200 GSM • Kartu Ucapan Stempel Wax Personal • Pelacakan Resi Transparan'),
        ];

        return Inertia::render('admin/cms/hero', [
            'heroSettings' => $heroSettings,
        ]);
    }

    /**
     * Update Hero Showcase settings with auto-compressed WebP support.
     */
    public function updateHero(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_badge' => ['required', 'string', 'max:255'],
            'hero_title_prefix' => ['required', 'string', 'max:255'],
            'hero_title' => ['required', 'string', 'max:255'],
            'hero_subtitle' => ['required', 'string'],
            'hero_tagline' => ['nullable', 'string', 'max:255'],
            'active_edition' => ['nullable', 'string', 'max:255'],
            'hero_marquee_text' => ['nullable', 'string', 'max:1000'],
            'hero_rotating_words' => ['nullable', 'array'],
            'hero_rotating_words.*' => ['string', 'max:100'],
            'hero_floating_image_left' => ['nullable', 'string'],
            'hero_floating_image_right' => ['nullable', 'string'],
        ]);

        if (! empty($validated['hero_floating_image_left'])) {
            $validated['hero_floating_image_left'] = $this->handleImageUpload($validated['hero_floating_image_left'], 'hero_left');
        }

        if (! empty($validated['hero_floating_image_right'])) {
            $validated['hero_floating_image_right'] = $this->handleImageUpload($validated['hero_floating_image_right'], 'hero_right');
        }

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        Setting::set('hero_eyebrow', 'GALUH & CO. • '.$validated['hero_badge']);
        Cache::forget('landing_page_settings');

        return back()->with('success', 'Hero Showcase berhasil diperbarui.');
    }

    /**
     * 3. TENTANG GALUH (Landing Page Menu)
     * Mengatur teks tentang Galuh lengkap hingga 3 pilar filosofi kriya dan foto card.
     */
    public function aboutIndex(): Response
    {
        $aboutSettings = [
            'about_badge' => (string) Setting::get('about_badge', 'TENTANG GALUH & CO.'),
            'about_title' => (string) Setting::get('about_title', 'Menghadirkan Kehangatan di Setiap Kotak Hadiah'),
            'about_description' => (string) Setting::get('about_description', "GALUH & CO. lahir dari keyakinan bahwa bingkisan terbaik bukan sekadar benda di dalam wadah, melainkan bahasa ketulusan yang merajut ikatan emosional dan apresiasi berkelas. Kami mendedikasikan ketelitian kriya pada setiap lembar pita, lipatan linen, dan segel lilin wax.\n\nMulai dari bahan kudapan butter Wijsman autentik, madu hutan murni, hingga kemasan anyaman bambu eksklusif—setiap pesanan diproses langsung di website dengan sistem pelacakan resi transparan untuk perayaan keluarga maupun representasi resmi korporat."),
            'about_pillars' => Setting::get('about_pillars', [
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
            ]),
        ];

        return Inertia::render('admin/cms/about', [
            'aboutSettings' => $aboutSettings,
        ]);
    }

    /**
     * Update Tentang Galuh settings & 3 pillars.
     */
    public function updateAbout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'about_badge' => ['required', 'string', 'max:255'],
            'about_title' => ['required', 'string', 'max:255'],
            'about_description' => ['required', 'string'],
            'about_pillars' => ['required', 'array', 'size:3'],
            'about_pillars.*.num' => ['required', 'string', 'max:10'],
            'about_pillars.*.title' => ['required', 'string', 'max:255'],
            'about_pillars.*.description' => ['required', 'string'],
            'about_pillars.*.image' => ['required', 'string'],
        ]);

        foreach ($validated['about_pillars'] as $idx => $pillar) {
            if (! empty($pillar['image'])) {
                $validated['about_pillars'][$idx]['image'] = $this->handleImageUpload($pillar['image'], "pillar_{$idx}");
            }
        }

        Setting::set('about_badge', $validated['about_badge']);
        Setting::set('about_title', $validated['about_title']);
        Setting::set('about_description', $validated['about_description']);
        Setting::set('about_pillars', $validated['about_pillars']);

        Cache::forget('landing_page_settings');

        return back()->with('success', 'Konten Tentang Galuh & 3 Pilar berhasil diperbarui.');
    }

    /**
     * 4. KATALOG TEKS (Landing Page Menu)
     * Mengatur teks badge edisi musiman, judul Koleksi Bingkisan Istimewa, dan deskripsi bawahnya.
     */
    public function katalogTeksIndex(): Response
    {
        $catalogTextSettings = [
            'catalog_badge' => (string) Setting::get('catalog_badge', 'KOLEKSI HAMPERS • IDUL FITRI & RAMADHAN 1447H'),
            'catalog_title' => (string) Setting::get('catalog_title', 'Koleksi Bingkisan Istimewa'),
            'catalog_subtitle' => (string) Setting::get('catalog_subtitle', 'Pilihan kurasi hampers eksklusif dengan wadah anyaman bambu kriya dan hardbox linen berstempel wax personal untuk melengkapi kebersamaan Anda.'),
        ];

        return Inertia::render('admin/cms/katalog-teks', [
            'catalogTextSettings' => $catalogTextSettings,
        ]);
    }

    /**
     * Update Katalog Teks settings.
     */
    public function updateKatalogTeks(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'catalog_badge' => ['required', 'string', 'max:255'],
            'catalog_title' => ['required', 'string', 'max:255'],
            'catalog_subtitle' => ['required', 'string'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('landing_page_settings');

        return back()->with('success', 'Teks Koleksi Katalog berhasil diperbarui.');
    }

    /**
     * 5. INTEGRITAS ATELIER (Landing Page Menu)
     * Mengatur teks headline integritas atelier dan 4 card keunggulan standar kriya.
     */
    public function atelierIndex(): Response
    {
        $atelierSettings = [
            'atelier_badge' => (string) Setting::get('atelier_badge', 'STANDAR MUTU ATELIER'),
            'atelier_title' => (string) Setting::get('atelier_title', 'Integritas Atelier Galuh & Co.'),
            'atelier_subtitle' => (string) Setting::get('atelier_subtitle', 'Dedikasi tanpa kompromi dalam setiap detail kurasi, pengemasan, dan penghantaran bingkisan Anda.'),
            'atelier_cards' => Setting::get('atelier_cards', [
                [
                    'title' => 'Kurasi Bahan Pilihan',
                    'shortDescription' => 'Bahan pangan bermutu tinggi & higienis untuk kesan istimewa.',
                    'description' => 'Setiap isi hampers dipilih secara teliti dari produk bermutu terbaik dan higienis untuk menghadirkan pengalaman membuka hadiah yang berkesan.',
                ],
                [
                    'title' => 'Kustom Grafir & Stempel Wax',
                    'shortDescription' => 'Kustomisasi logo korporat, pita satin, & kartu ucapan wax seal.',
                    'description' => 'Bebas menambahkan logo perusahaan via grafir laser, pita warna korporat, serta kartu ucapan khusus berstempel lilin wax mewah.',
                ],
                [
                    'title' => 'Pengiriman Aman Terproteksi',
                    'shortDescription' => 'Kemasan hardbox berlapis aman dengan perlindungan kurir.',
                    'description' => 'Dikemas rapi dengan perlindungan berlapis dan kurir atelier terlatih untuk memastikan kotak hadiah tiba dalam kondisi utuh.',
                ],
                [
                    'title' => 'Pelacakan Resi Real-Time',
                    'shortDescription' => 'Sistem monitoring pengerjaan hingga tiba di tangan penerima.',
                    'description' => 'Pantau setiap proses kurasi studio hingga pengantaran kurir melalui nomor resi resmi langsung di website.',
                ],
            ]),
        ];

        return Inertia::render('admin/cms/atelier', [
            'atelierSettings' => $atelierSettings,
        ]);
    }

    /**
     * Update Integritas Atelier settings & 4 cards.
     */
    public function updateAtelier(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'atelier_badge' => ['required', 'string', 'max:255'],
            'atelier_title' => ['required', 'string', 'max:255'],
            'atelier_subtitle' => ['required', 'string'],
            'atelier_cards' => ['required', 'array', 'size:4'],
            'atelier_cards.*.title' => ['required', 'string', 'max:255'],
            'atelier_cards.*.shortDescription' => ['required', 'string', 'max:255'],
            'atelier_cards.*.description' => ['required', 'string'],
        ]);

        Setting::set('atelier_badge', $validated['atelier_badge']);
        Setting::set('atelier_title', $validated['atelier_title']);
        Setting::set('atelier_subtitle', $validated['atelier_subtitle']);
        Setting::set('atelier_cards', $validated['atelier_cards']);

        Cache::forget('landing_page_settings');

        return back()->with('success', 'Integritas Atelier & 4 Card Keunggulan berhasil diperbarui.');
    }

    /**
     * 6. PANDUAN PESANAN (Landing Page Menu)
     * Mengatur teks panduan pemesanan dan 4 tahapan alur pesanan resmi.
     */
    public function caraPesanIndex(): Response
    {
        $caraPesanSettings = [
            'order_guide_badge' => (string) Setting::get('order_guide_badge', 'PANDUAN PEMESANAN • SISTEM WEBSITE RESMI'),
            'order_guide_title' => (string) Setting::get('order_guide_title', 'Alur Pemesanan Mudah & Transparan'),
            'order_guide_subtitle' => (string) Setting::get('order_guide_subtitle', 'Seluruh transaksi diproses langsung di dalam website setelah Anda mendaftar atau masuk ke akun Anda, lengkap dengan konfirmasi instan dan pelacakan resi.'),
            'order_guide_steps' => Setting::get('order_guide_steps', [
                [
                    'number' => '01',
                    'title' => 'Pilih Koleksi & Detail Isi',
                    'description' => 'Jelajahi kurasi katalog musiman kami dan periksa rincian daftar isi setiap paket hampers melalui modal detail produk.',
                ],
                [
                    'number' => '02',
                    'title' => 'Personal atau Corporate (Min. 25)',
                    'description' => 'Pesan langsung di website untuk paket personal (>1 paket) atau paket corporate dengan harga grosir resmi minimal 25 paket.',
                ],
                [
                    'number' => '03',
                    'title' => 'Lengkapi Alamat & Ucapan',
                    'description' => 'Isi data penerima, gunakan fitur deteksi alamat otomatis, dan tuliskan pesan kartu ucapan berstempel wax personal.',
                ],
                [
                    'number' => '04',
                    'title' => 'Lacak Pesanan via Nomor Resi',
                    'description' => 'Pantau status pengerjaan di studio hingga perjalanan kurir secara real-time langsung di menu Lacak Pesanan website.',
                ],
            ]),
        ];

        return Inertia::render('admin/cms/cara-pesan', [
            'caraPesanSettings' => $caraPesanSettings,
        ]);
    }

    /**
     * Update Panduan Pesanan settings & 4 steps.
     */
    public function updateCaraPesan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_guide_badge' => ['required', 'string', 'max:255'],
            'order_guide_title' => ['required', 'string', 'max:255'],
            'order_guide_subtitle' => ['required', 'string'],
            'order_guide_steps' => ['required', 'array', 'size:4'],
            'order_guide_steps.*.number' => ['required', 'string', 'max:10'],
            'order_guide_steps.*.title' => ['required', 'string', 'max:255'],
            'order_guide_steps.*.description' => ['required', 'string'],
        ]);

        Setting::set('order_guide_badge', $validated['order_guide_badge']);
        Setting::set('order_guide_title', $validated['order_guide_title']);
        Setting::set('order_guide_subtitle', $validated['order_guide_subtitle']);
        Setting::set('order_guide_steps', $validated['order_guide_steps']);

        Cache::forget('landing_page_settings');

        return back()->with('success', 'Panduan Pemesanan & 4 Tahapan Langkah berhasil diperbarui.');
    }

    /**
     * 7. FAQ (Landing Page Menu)
     * Mengatur daftar pertanyaan umum seputar pesanan hampers.
     */
    public function faqIndex(): Response
    {
        Faq::seedDefaultsIfEmpty();

        $faqs = Faq::orderBy('sort_order', 'asc')->get();

        return Inertia::render('admin/cms/faq', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Store a FAQ item.
     */
    public function storeFaq(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'category' => ['required', 'string', 'in:pemesanan,custom_branding,pengiriman,pembayaran'],
        ]);

        Faq::create([
            ...$validated,
            'sort_order' => (Faq::max('sort_order') ?? 0) + 1,
            'is_active' => true,
        ]);

        Cache::forget('landing_page_faqs_v1');

        return back()->with('success', 'Pertanyaan FAQ berhasil ditambahkan.');
    }

    /**
     * Update a FAQ item.
     */
    public function updateFaq(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'category' => ['required', 'string', 'in:pemesanan,custom_branding,pengiriman,pembayaran'],
            'is_active' => ['boolean'],
        ]);

        $faq->update($validated);
        Cache::forget('landing_page_faqs_v1');

        return back()->with('success', 'Pertanyaan FAQ berhasil diperbarui.');
    }

    /**
     * Delete a FAQ item.
     */
    public function destroyFaq(Faq $faq): RedirectResponse
    {
        $faq->delete();
        Cache::forget('landing_page_faqs_v1');

        return back()->with('success', 'Pertanyaan FAQ berhasil dihapus.');
    }

    /**
     * Restore default FAQs from landing page.
     */
    public function restoreDefaultFaqs(): RedirectResponse
    {
        Faq::truncate();
        Faq::seedDefaultsIfEmpty();
        Cache::forget('landing_page_faqs_v1');

        return back()->with('success', 'FAQ bawaan landing page berhasil dipulihkan.');
    }

    /**
     * Backward compatibility pillar updater.
     */
    public function updatePillars(Request $request): RedirectResponse
    {
        return $this->updateAbout($request);
    }

    /**
     * Helper to process base64 WebP canvas images or uploaded image strings.
     */
    protected function handleImageUpload(string $imageData, string $prefix): string
    {
        if (str_starts_with($imageData, 'data:image/')) {
            $parts = explode(',', $imageData, 2);
            if (count($parts) === 2) {
                // Determine mime type / extension (SVG, JPG, PNG, WEBP, etc.)
                $extension = 'webp';
                if (preg_match('/^data:image\/([a-zA-Z0-9\+\-\.]+);base64/', $parts[0], $matches)) {
                    $mimeSub = strtolower($matches[1]);
                    if (str_contains($mimeSub, 'svg')) {
                        $extension = 'svg';
                    } elseif (str_contains($mimeSub, 'png')) {
                        $extension = 'png';
                    } elseif (str_contains($mimeSub, 'jpeg') || str_contains($mimeSub, 'jpg')) {
                        $extension = 'jpg';
                    } elseif (str_contains($mimeSub, 'gif')) {
                        $extension = 'gif';
                    } elseif (str_contains($mimeSub, 'webp')) {
                        $extension = 'webp';
                    }
                }

                $decoded = base64_decode($parts[1]);
                $dir = public_path('images/uploads');
                if (! File::exists($dir)) {
                    File::makeDirectory($dir, 0755, true);
                }

                $filename = "{$prefix}_".time().'_'.Str::random(6).".{$extension}";
                File::put("{$dir}/{$filename}", $decoded);

                return "/images/uploads/{$filename}";
            }
        }

        return $imageData;
    }
}
