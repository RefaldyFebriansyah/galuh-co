<?php

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
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\TrackWaLeadController;
use Illuminate\Support\Facades\Route;

// Public Landing Page & Inquiry
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/inquiry', [InquiryController::class, 'store'])
    ->middleware(['throttle:5,1'])
    ->name('inquiry.store');

// Silent Public WhatsApp Lead Tracker (Triggered on WA link click from catalog/hero)
Route::post('/api/track-wa-lead', TrackWaLeadController::class)->name('api.track-wa-lead');
Route::post('/track-wa-lead', TrackWaLeadController::class)->name('track-wa-lead');

// Admin Guest Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.store');

    // Admin Authenticated Routes
    Route::middleware(['auth'])->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

        // DOMAIN I: RINGKASAN & AKTIVITAS WA
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // DOMAIN II: KATALOG & KONTEN WEBSITE (CMS)
        // 1. Master Katalog Hampers
        Route::get('/katalog', [KatalogController::class, 'index'])->name('katalog.index');
        Route::post('/katalog', [KatalogController::class, 'store'])->name('katalog.store');
        Route::post('/katalog/{product}', [KatalogController::class, 'update'])->name('katalog.update');
        Route::post('/katalog/{product}/toggle-hero', [KatalogController::class, 'toggleHero'])->name('katalog.toggle-hero');
        Route::post('/katalog/{product}/toggle-visibility', [KatalogController::class, 'toggleVisibility'])->name('katalog.toggle-visibility');
        Route::delete('/katalog/{product}', [KatalogController::class, 'destroy'])->name('katalog.destroy');

        // 2. Komponen Isian & Kemasan
        Route::get('/komponen', [KomponenController::class, 'index'])->name('komponen.index');
        Route::post('/komponen', [KomponenController::class, 'store'])->name('komponen.store');
        Route::post('/komponen/{komponen}', [KomponenController::class, 'update'])->name('komponen.update');
        Route::post('/komponen/{komponen}/update-stock', [KomponenController::class, 'updateStock'])->name('komponen.update-stock');
        Route::delete('/komponen/{komponen}', [KomponenController::class, 'destroy'])->name('komponen.destroy');

        // 3. CMS Konten Landing Page
        Route::get('/cms-halaman', [CmsHalamanController::class, 'index'])->name('cms-halaman.index');
        Route::post('/cms-halaman/hero', [CmsHalamanController::class, 'updateHero'])->name('cms-halaman.hero');
        Route::post('/cms-halaman/pillars', [CmsHalamanController::class, 'updatePillars'])->name('cms-halaman.pillars');
        Route::post('/cms-halaman/testimonials', [CmsHalamanController::class, 'storeTestimonial'])->name('cms-halaman.testimonials.store');
        Route::post('/cms-halaman/testimonials/{testimonial}', [CmsHalamanController::class, 'updateTestimonial'])->name('cms-halaman.testimonials.update');
        Route::delete('/cms-halaman/testimonials/{testimonial}', [CmsHalamanController::class, 'destroyTestimonial'])->name('cms-halaman.testimonials.destroy');
        Route::post('/cms-halaman/faqs', [CmsHalamanController::class, 'storeFaq'])->name('cms-halaman.faqs.store');
        Route::post('/cms-halaman/faqs/{faq}', [CmsHalamanController::class, 'updateFaq'])->name('cms-halaman.faqs.update');
        Route::delete('/cms-halaman/faqs/{faq}', [CmsHalamanController::class, 'destroyFaq'])->name('cms-halaman.faqs.destroy');

        // DOMAIN III: WHATSAPP LEADS & B2B CORPORATE
        // 4. WhatsApp Leads Tracker
        Route::get('/wa-leads', [WaLeadController::class, 'index'])->name('wa-leads.index');
        Route::post('/wa-leads', [WaLeadController::class, 'store'])->name('wa-leads.store');
        Route::post('/wa-leads/{lead}', [WaLeadController::class, 'update'])->name('wa-leads.update');
        Route::patch('/wa-leads/{lead}/status', [WaLeadController::class, 'updateStatus'])->name('wa-leads.status');
        Route::post('/wa-leads/{lead}/follow-up', [WaLeadController::class, 'logFollowUp'])->name('wa-leads.follow-up');
        Route::delete('/wa-leads/{lead}', [WaLeadController::class, 'destroy'])->name('wa-leads.destroy');

        // 5. WhatsApp Reply Templates
        Route::get('/template-wa', [WaTemplateController::class, 'index'])->name('template-wa.index');
        Route::post('/template-wa', [WaTemplateController::class, 'store'])->name('template-wa.store');
        Route::post('/template-wa/{templateWa}', [WaTemplateController::class, 'update'])->name('template-wa.update');
        Route::delete('/template-wa/{templateWa}', [WaTemplateController::class, 'destroy'])->name('template-wa.destroy');

        // 6. Corporate B2B Quotation Calculator
        Route::get('/corporate-b2b', [CorporateB2bController::class, 'index'])->name('corporate-b2b.index');

        // DOMAIN IV: STUDIO PRODUKSI & PENGATURAN
        // 7. Studio Produksi Kanban Board
        Route::get('/produksi', [ProduksiController::class, 'index'])->name('produksi.index');
        Route::post('/produksi', [ProduksiController::class, 'store'])->name('produksi.store');
        Route::post('/produksi/{order}', [ProduksiController::class, 'update'])->name('produksi.update');
        Route::patch('/produksi/{order}/update-stage', [ProduksiController::class, 'updateStage'])->name('produksi.update-stage');
        Route::delete('/produksi/{order}', [ProduksiController::class, 'destroy'])->name('produksi.destroy');

        // 8. Cetak Kartu Ucapan & Grafir
        Route::get('/kartu-grafir', [KartuGrafirController::class, 'index'])->name('kartu-grafir.index');
        Route::post('/kartu-grafir/{order}/toggle-card', [KartuGrafirController::class, 'toggleCardStatus'])->name('kartu-grafir.toggle-card');
        Route::post('/kartu-grafir/{order}/toggle-engraving', [KartuGrafirController::class, 'toggleEngravingStatus'])->name('kartu-grafir.toggle-engraving');

        // 9. Pengaturan Concierge & Staff Management
        Route::get('/pengaturan', [AdminSettingController::class, 'index'])->name('pengaturan.index');
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('/pengaturan', [AdminSettingController::class, 'update'])->name('pengaturan.update');
        Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
        Route::post('/pengaturan/users', [AdminSettingController::class, 'storeUser'])->name('pengaturan.users.store');
        Route::post('/pengaturan/users/{user}', [AdminSettingController::class, 'updateUser'])->name('pengaturan.users.update');
        Route::delete('/pengaturan/users/{user}', [AdminSettingController::class, 'destroyUser'])->name('pengaturan.users.destroy');

        // Legacy compatibility routes
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
        Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
        Route::post('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
        Route::post('/products/{product}/toggle', [AdminProductController::class, 'toggleActive'])->name('products.toggle');

        Route::get('/inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
        Route::patch('/inquiries/{inquiry}/status', [AdminInquiryController::class, 'updateStatus'])->name('inquiries.status');
        Route::delete('/inquiries/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
    });
});
