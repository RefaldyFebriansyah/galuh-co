<?php

use App\Models\ProductionOrder;
use App\Models\User;
use App\Models\WaLead;

test('public track-wa-lead endpoint silently creates lead', function () {
    $response = $this->postJson(route('track-wa-lead'), [
        'source' => 'hero_customizer',
        'package_name' => 'Seri Emerald Royal Nusantara',
        'estimated_packages' => '50 Box',
        'notes' => 'Visitor clicked WhatsApp consultation on hero',
    ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $this->assertDatabaseHas('wa_leads', [
        'source' => 'hero_customizer',
        'package_name' => 'Seri Emerald Royal Nusantara',
        'status' => 'chat_baru',
    ]);
});

test('authenticated admin can view wa leads list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    WaLead::create([
        'client_name' => 'Dewi Lestari',
        'wa_number' => '6281234567890',
        'source' => 'catalog_personal',
        'status' => 'chat_baru',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.wa-leads.index'));

    $response->assertOk();
});

test('moving lead to deal automatically creates studio production order', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $lead = WaLead::create([
        'client_name' => 'Bpk. Hendra Gunawan',
        'company_name' => 'PT Mandiri Ventura',
        'wa_number' => '6281987654321',
        'package_name' => 'Seri Kencana Lebaran',
        'estimated_packages' => '100 Box',
        'greeting_card_message' => 'Selamat Hari Raya Idul Fitri 1447 H',
        'engraving_name' => 'Hendra Gunawan',
        'source' => 'catalog_corporate',
        'status' => 'negosiasi_custom',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.wa-leads.status', $lead), [
        'status' => 'deal_produksi',
    ]);

    $response->assertRedirect();
    $lead->refresh();
    expect($lead->status)->toBe('deal_produksi');

    $this->assertDatabaseHas('production_orders', [
        'wa_lead_id' => $lead->id,
        'client_name' => 'Bpk. Hendra Gunawan',
        'company_name' => 'PT Mandiri Ventura',
        'package_name' => 'Seri Kencana Lebaran',
        'stage' => 'persiapan_bahan',
    ]);
});

test('admin can manage hamper in master katalog', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.katalog.store'), [
        'name' => 'Seri Mahligai Royal',
        'category' => 'Paket Lebaran',
        'packaging' => 'hardbox_emerald',
        'price_from' => 750000,
        'short_description' => 'Kurasi mewah nastar Wijsman dan madu hutan.',
        'contents' => ['Nastar Wijsman 350g', 'Kastengel Keju Edam 300g'],
        'image' => '/images/product_emerald_box.jpg',
        'is_halal' => true,
        'is_featured_hero' => true,
        'visibility' => 'published',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('products', [
        'name' => 'Seri Mahligai Royal',
        'visibility' => 'published',
        'is_featured_hero' => true,
    ]);
});

test('admin can advance production order stage in kanban', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $order = ProductionOrder::create([
        'order_code' => 'GLH-2026-TEST',
        'client_name' => 'Ibu Ratna',
        'package_name' => 'Paket Besek Natural',
        'quantity' => 35,
        'target_delivery_date' => now()->addDays(5),
        'stage' => 'persiapan_bahan',
        'priority' => 'normal',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.produksi.update-stage', $order), [
        'stage' => 'cetak_grafir',
    ]);

    $response->assertRedirect();
    expect($order->fresh()->stage)->toBe('cetak_grafir');
});

test('admin can toggle card and engraving checklist statuses', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $order = ProductionOrder::create([
        'order_code' => 'GLH-2026-CHK',
        'client_name' => 'Pak Budi',
        'package_name' => 'Paket Bambu',
        'quantity' => 20,
        'greeting_card_text' => 'Semoga berkah',
        'greeting_card_status' => 'pending',
        'engraving_names' => ['Budi'],
        'engraving_status' => 'pending',
        'target_delivery_date' => now()->addDays(3),
        'stage' => 'cetak_grafir',
        'priority' => 'normal',
    ]);

    $this->actingAs($admin)->post(route('admin.kartu-grafir.toggle-card', $order))->assertRedirect();
    expect($order->fresh()->greeting_card_status)->toBe('printed');

    $this->actingAs($admin)->post(route('admin.kartu-grafir.toggle-engraving', $order))->assertRedirect();
    expect($order->fresh()->engraving_status)->toBe('engraved');
});

test('admin can view corporate b2b quotation calculator', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.corporate-b2b.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/corporate-b2b/index')
            ->has('hampers')
            ->has('tierDiscounts')
            ->has('addOns')
        );
});
