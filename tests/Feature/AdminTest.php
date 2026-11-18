<?php

use App\Models\Inquiry;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('unauthenticated users are redirected to admin login', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('admin.login'));
});

test('admin login page renders correctly', function () {
    $response = $this->get(route('admin.login'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/login')
    );
});

test('admin can log in with valid credentials', function () {
    $admin = User::factory()->create([
        'email' => 'admin_test@galuh.co',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->post(route('admin.login.store'), [
        'email' => 'admin_test@galuh.co',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($admin);
    $response->assertRedirect(route('admin.dashboard'));
});

test('admin cannot log in with invalid credentials', function () {
    $response = $this->from(route('admin.login'))->post(route('admin.login.store'), [
        'email' => 'wrong@galuh.co',
        'password' => 'wrongpassword',
    ]);

    $this->assertGuest();
    $response->assertRedirect(route('admin.login'));
    $response->assertSessionHasErrors('email');
});

test('authenticated admin can view dashboard with stats', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->has('stats')
        ->has('recentInquiries')
        ->has('whatsappNumber')
    );
});

test('admin can create and toggle active status of a product', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'name' => 'Seri Test Hamper',
        'category' => 'Paket Lebaran',
        'price_from' => 500000,
        'short_description' => 'Deskripsi test hampers',
        'contents' => ['Toples Nastar 500g', 'Madu Hutan Murni', 'Kartu Ucapan Gold'],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $response->assertRedirect(route('admin.products.index'));

    $product = Product::where('name', 'Seri Test Hamper')->first();
    expect($product)->not->toBeNull();
    expect($product->is_active)->toBeTrue();

    // Toggle active status
    $toggleResponse = $this->actingAs($admin)->post(route('admin.products.toggle', $product));
    $toggleResponse->assertRedirect();

    expect($product->fresh()->is_active)->toBeFalse();
});

test('admin can update inquiry status and internal notes', function () {
    $admin = User::factory()->create();

    $inquiry = Inquiry::create([
        'name' => 'Budi Santoso',
        'company_name' => 'PT Sinar Abadi',
        'email' => 'budi@sinarabadi.co.id',
        'whatsapp_number' => '081234567890',
        'estimated_packages' => 50,
        'budget_per_package' => 350000,
        'needed_at' => now()->addWeeks(2)->toDateString(),
        'notes' => 'Kebutuhan hampers Idul Fitri',
        'status' => 'new',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.inquiries.status', $inquiry), [
        'status' => 'contacted',
        'admin_notes' => 'Sudah dikirim penawaran via WhatsApp.',
    ]);

    $response->assertRedirect();

    $inquiry->refresh();
    expect($inquiry->status)->toBe('contacted');
    expect($inquiry->admin_notes)->toBe('Sudah dikirim penawaran via WhatsApp.');
});

test('admin can update site settings', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.settings.update'), [
        'whatsapp_number' => '081572414233',
        'contact_phone' => '+62 815-7241-4233',
        'contact_email' => 'admin@galuh.co',
        'company_address' => 'Jl. Galuh Mas Raya No. 88, Karawang Barat',
        'operational_hours' => 'Senin - Sabtu: 08.00 - 20.00 WIB',
        'hero_badge' => '✦ SIGNATURE ATELIER ✦',
        'hero_title_prefix' => 'Hampers Mewah',
        'hero_description' => 'Kurasi bingkisan istimewa untuk momen terbaik Anda.',
    ]);

    $response->assertRedirect();

    expect(Setting::get('whatsapp_number'))->toBe('6281572414233');
    expect(Setting::get('hero_title_prefix'))->toBe('Hampers Mewah');
});

test('admin can log out', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.logout'));

    $this->assertGuest();
    $response->assertRedirect(route('admin.login'));
});
