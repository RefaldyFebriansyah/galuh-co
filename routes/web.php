<?php

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\CmsHalamanController;
use App\Http\Controllers\Admin\CorporateB2bController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Admin\KartuGrafirController;
use App\Http\Controllers\Admin\KatalogController;
use App\Http\Controllers\Admin\KomponenController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProduksiController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\WaLeadController;
use App\Http\Controllers\Admin\WaTemplateController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderTrackingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TrackWaLeadController;
use Illuminate\Support\Facades\Route;

// Public Landing Page, Lacak Pesanan & Ulasan
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/lacak-pesanan', [OrderTrackingController::class, 'index'])->name('tracking.index');
Route::get('/tracking', [OrderTrackingController::class, 'index'])->name('tracking');

// Public Reviews & Likes
Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
Route::post('/reviews/{review}/like', [ReviewController::class, 'like'])->name('reviews.like');

// In-Website Orders (Authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.index');
});

// Authentication Routes (Login, Register, Logout, Socialite Google)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Legacy compatibility routes for inquiry
Route::post('/inquiry', [InquiryController::class, 'store'])
    ->middleware(['throttle:5,1'])
    ->name('inquiry.store');

Route::post('/api/track-wa-lead', TrackWaLeadController::class)->name('api.track-wa-lead');
Route::post('/track-wa-lead', TrackWaLeadController::class)->name('track-wa-lead');

// Admin Guest Routes (Redirects to unified login)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.store');

    // Admin Authenticated Routes (Single Unified Admin Role)
    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

        // ==========================================
        // 1. SUPER (Dashboard, Orders, Tracking)
        // ==========================================
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Inquiries & Pesanan Masuk (Personal & Corporate)
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::post('/orders/{order}/accept', [AdminOrderController::class, 'accept'])->name('orders.accept');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
        Route::delete('/orders/{order}', [AdminOrderController::class, 'destroy'])->name('orders.destroy');

        // Tracking Pesanan (Studio Process -> Kurir / Resi -> Diterima Konsumen)
        Route::get('/tracking', [AdminOrderController::class, 'trackingIndex'])->name('tracking.index');
        Route::post('/tracking/{order}', [AdminOrderController::class, 'updateTracking'])->name('tracking.update');

        // ==========================================
        // 2. MARKETING (Katalog Hampers & Event Musiman)
        // ==========================================
        // Master Katalog Hampers
        Route::get('/katalog', [KatalogController::class, 'index'])->name('katalog.index');
        Route::post('/katalog', [KatalogController::class, 'store'])->name('katalog.store');
        Route::post('/katalog/{product}', [KatalogController::class, 'update'])->name('katalog.update');
        Route::post('/katalog/{product}/toggle-hero', [KatalogController::class, 'toggleHero'])->name('katalog.toggle-hero');
        Route::post('/katalog/{product}/toggle-visibility', [KatalogController::class, 'toggleVisibility'])->name('katalog.toggle-visibility');
        Route::delete('/katalog/{product}', [KatalogController::class, 'destroy'])->name('katalog.destroy');

        // Event Musiman (Ramadhan, Natal, Corporate, dll.)
        Route::get('/events', [CmsHalamanController::class, 'eventsIndex'])->name('events.index');
        Route::post('/events', [CmsHalamanController::class, 'updateEvents'])->name('events.update');

        // ==========================================
        // 3. LANDING PAGE (CMS Subpages)
        // ==========================================
        // Hero Showcase
        Route::get('/cms/hero', [CmsHalamanController::class, 'heroIndex'])->name('cms.hero');
        Route::post('/cms/hero', [CmsHalamanController::class, 'updateHero'])->name('cms.hero.update');

        // Tentang Galuh
        Route::get('/cms/about', [CmsHalamanController::class, 'aboutIndex'])->name('cms.about');
        Route::post('/cms/about', [CmsHalamanController::class, 'updateAbout'])->name('cms.about.update');

        // Katalog Teks
        Route::get('/cms/katalog-teks', [CmsHalamanController::class, 'katalogTeksIndex'])->name('cms.katalog-teks');
        Route::post('/cms/katalog-teks', [CmsHalamanController::class, 'updateKatalogTeks'])->name('cms.katalog-teks.update');

        // Integritas Atelier
        Route::get('/cms/atelier', [CmsHalamanController::class, 'atelierIndex'])->name('cms.atelier');
        Route::post('/cms/atelier', [CmsHalamanController::class, 'updateAtelier'])->name('cms.atelier.update');

        // Panduan Pesanan
        Route::get('/cms/cara-pesan', [CmsHalamanController::class, 'caraPesanIndex'])->name('cms.cara-pesan');
        Route::post('/cms/cara-pesan', [CmsHalamanController::class, 'updateCaraPesan'])->name('cms.cara-pesan.update');

        // FAQ
        Route::get('/cms/faq', [CmsHalamanController::class, 'faqIndex'])->name('cms.faq');
        Route::post('/cms/faq', [CmsHalamanController::class, 'storeFaq'])->name('cms.faq.store');
        Route::post('/cms/faq/restore-defaults', [CmsHalamanController::class, 'restoreDefaultFaqs'])->name('cms.faq.restore-defaults');
        Route::post('/cms/faq/{faq}', [CmsHalamanController::class, 'updateFaq'])->name('cms.faq.update');
        Route::delete('/cms/faq/{faq}', [CmsHalamanController::class, 'destroyFaq'])->name('cms.faq.destroy');

        // Legacy compatibility alias
        Route::get('/cms-halaman', [CmsHalamanController::class, 'index'])->name('cms-halaman.index');
        Route::post('/cms-halaman/hero', [CmsHalamanController::class, 'updateHero'])->name('cms-halaman.hero');
        Route::post('/cms-halaman/pillars', [CmsHalamanController::class, 'updatePillars'])->name('cms-halaman.pillars');
        Route::post('/cms-halaman/testimonials', [CmsHalamanController::class, 'storeTestimonial'])->name('cms-halaman.testimonials.store');
        Route::post('/cms-halaman/testimonials/{testimonial}', [CmsHalamanController::class, 'updateTestimonial'])->name('cms-halaman.testimonials.update');
        Route::delete('/cms-halaman/testimonials/{testimonial}', [CmsHalamanController::class, 'destroyTestimonial'])->name('cms-halaman.testimonials.destroy');
        Route::post('/cms-halaman/faqs', [CmsHalamanController::class, 'storeFaq'])->name('cms-halaman.faqs.store');
        Route::post('/cms-halaman/faqs/{faq}', [CmsHalamanController::class, 'updateFaq'])->name('cms-halaman.faqs.update');
        Route::delete('/cms-halaman/faqs/{faq}', [CmsHalamanController::class, 'destroyFaq'])->name('cms-halaman.faqs.destroy');

        // ==========================================
        // 4. PENGATURAN (Profil Studio & Keamanan)
        // ==========================================
        Route::get('/pengaturan/profil', [AdminSettingController::class, 'profilIndex'])->name('pengaturan.profil');
        Route::post('/pengaturan/profil', [AdminSettingController::class, 'updateProfil'])->name('pengaturan.profil.update');

        Route::get('/pengaturan/keamanan', [AdminSettingController::class, 'keamananIndex'])->name('pengaturan.keamanan');
        Route::post('/pengaturan/keamanan', [AdminSettingController::class, 'updateKeamanan'])->name('pengaturan.keamanan.update');

        // Legacy Settings compatibility
        Route::get('/pengaturan', [AdminSettingController::class, 'profilIndex'])->name('pengaturan.index');
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('/pengaturan', [AdminSettingController::class, 'updateProfil'])->name('pengaturan.update');
        Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
        Route::post('/pengaturan/users', [AdminSettingController::class, 'storeUser'])->name('pengaturan.users.store');
        Route::post('/pengaturan/users/{user}', [AdminSettingController::class, 'updateUser'])->name('pengaturan.users.update');
        Route::delete('/pengaturan/users/{user}', [AdminSettingController::class, 'destroyUser'])->name('pengaturan.users.destroy');

        // Products alias for compatibility
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
        Route::post('/products/{product}/toggle', [AdminProductController::class, 'toggleActive'])->name('products.toggle');
        Route::put('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

        // Komponen Isian & Kemasan
        Route::get('/komponen', [KomponenController::class, 'index'])->name('komponen.index');
        Route::post('/komponen', [KomponenController::class, 'store'])->name('komponen.store');
        Route::post('/komponen/{komponen}', [KomponenController::class, 'update'])->name('komponen.update');
        Route::post('/komponen/{komponen}/update-stock', [KomponenController::class, 'updateStock'])->name('komponen.update-stock');
        Route::delete('/komponen/{komponen}', [KomponenController::class, 'destroy'])->name('komponen.destroy');

        // CRM Leads & Reply Templates
        Route::get('/wa-leads', [WaLeadController::class, 'index'])->name('wa-leads.index');
        Route::post('/wa-leads', [WaLeadController::class, 'store'])->name('wa-leads.store');
        Route::post('/wa-leads/{lead}', [WaLeadController::class, 'update'])->name('wa-leads.update');
        Route::patch('/wa-leads/{lead}/status', [WaLeadController::class, 'updateStatus'])->name('wa-leads.status');
        Route::post('/wa-leads/{lead}/follow-up', [WaLeadController::class, 'logFollowUp'])->name('wa-leads.follow-up');
        Route::delete('/wa-leads/{lead}', [WaLeadController::class, 'destroy'])->name('wa-leads.destroy');

        Route::get('/template-wa', [WaTemplateController::class, 'index'])->name('template-wa.index');
        Route::post('/template-wa', [WaTemplateController::class, 'store'])->name('template-wa.store');
        Route::post('/template-wa/{templateWa}', [WaTemplateController::class, 'update'])->name('template-wa.update');
        Route::delete('/template-wa/{templateWa}', [WaTemplateController::class, 'destroy'])->name('template-wa.destroy');

        Route::get('/corporate-b2b', [CorporateB2bController::class, 'index'])->name('corporate-b2b.index');

        // Studio Produksi & Pengaturan Staff
        Route::get('/produksi', [ProduksiController::class, 'index'])->name('produksi.index');
        Route::post('/produksi', [ProduksiController::class, 'store'])->name('produksi.store');
        Route::post('/produksi/{order}', [ProduksiController::class, 'update'])->name('produksi.update');
        Route::patch('/produksi/{order}/update-stage', [ProduksiController::class, 'updateStage'])->name('produksi.update-stage');
        Route::delete('/produksi/{order}', [ProduksiController::class, 'destroy'])->name('produksi.destroy');

        Route::get('/kartu-grafir', [KartuGrafirController::class, 'index'])->name('kartu-grafir.index');
        Route::post('/kartu-grafir/{order}/toggle-card', [KartuGrafirController::class, 'toggleCardStatus'])->name('kartu-grafir.toggle-card');
        Route::post('/kartu-grafir/{order}/toggle-engraving', [KartuGrafirController::class, 'toggleEngravingStatus'])->name('kartu-grafir.toggle-engraving');

        Route::get('/inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
        Route::patch('/inquiries/{inquiry}/status', [AdminInquiryController::class, 'updateStatus'])->name('inquiries.status');
        Route::delete('/inquiries/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
    });
});
