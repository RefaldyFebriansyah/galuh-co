<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\TrackingLog;
use App\Models\User;

test('guest cannot create order directly and is redirected to login', function () {
    $product = Product::factory()->create();

    $response = $this->post(route('orders.store'), [
        'order_type' => 'personal',
        'product_id' => $product->id,
        'quantity' => 1,
        'recipient_name' => 'Budi Santoso',
        'recipient_phone' => '081234567890',
        'shipping_address' => 'Jl. Ir. H. Juanda No. 10, Ciamis',
    ]);

    $response->assertRedirect(route('login'));
});

test('authenticated user can create personal order with multiple quantities', function () {
    $user = User::factory()->user()->create();
    $product = Product::factory()->create([
        'price_from' => 350000,
    ]);

    $response = $this->actingAs($user)->post(route('orders.store'), [
        'order_type' => 'personal',
        'product_id' => $product->id,
        'quantity' => 3,
        'recipient_name' => 'Ibu Ratna',
        'recipient_phone' => '081298765432',
        'shipping_address' => 'Jl. Merdeka No. 45, Bandung',
        'greeting_card_text' => 'Selamat Idul Fitri, mohon maaf lahir dan batin.',
    ]);

    $order = Order::where('user_id', $user->id)->first();
    expect($order)->not->toBeNull();
    expect($order->order_type)->toBe('personal');
    expect($order->total_quantity)->toBe(3);
    expect($order->subtotal)->toBe(1050000);
    expect($order->tracking_number)->not->toBeEmpty();
    expect($order->shipping_status)->toBe('studio_processing');

    $response->assertRedirect(route('tracking.index', ['resi' => $order->tracking_number]));
});

test('corporate order enforces strictly minimum 25 packages and uses wholesale price', function () {
    $user = User::factory()->user()->create();
    $product = Product::factory()->create([
        'price_from' => 500000,
        'corporate_price' => 400000,
    ]);

    // Validation fails if quantity < 25
    $failResponse = $this->actingAs($user)->post(route('orders.store'), [
        'order_type' => 'corporate',
        'product_id' => $product->id,
        'quantity' => 10,
        'company_name' => 'PT. Adhi Kencana',
        'recipient_name' => 'Ibu Rina Sastrowardoyo',
        'recipient_phone' => '081234567890',
        'shipping_address' => 'Gedung Wisma Antara Lt. 12, Jakarta',
    ]);

    $failResponse->assertSessionHasErrors('quantity');

    // Validation succeeds when quantity >= 25
    $successResponse = $this->actingAs($user)->post(route('orders.store'), [
        'order_type' => 'corporate',
        'product_id' => $product->id,
        'quantity' => 30,
        'company_name' => 'PT. Adhi Kencana',
        'recipient_name' => 'Ibu Rina Sastrowardoyo',
        'recipient_phone' => '081234567890',
        'shipping_address' => 'Gedung Wisma Antara Lt. 12, Jakarta',
        'customer_notes' => 'Tolong pita warna navy dan logo emas PT Adhi Kencana.',
    ]);

    $order = Order::where('company_name', 'PT. Adhi Kencana')->first();
    expect($order)->not->toBeNull();
    expect($order->order_type)->toBe('corporate');
    expect($order->total_quantity)->toBe(30);
    expect($order->subtotal)->toBe(12000000); // 30 x 400,000 corporate wholesale price

    $successResponse->assertRedirect(route('tracking.index', ['resi' => $order->tracking_number]));
});

test('public order tracking page can find order by receipt number and display status', function () {
    $order = Order::create([
        'order_number' => 'ORD-TEST-001',
        'user_id' => User::factory()->create()->id,
        'order_type' => 'personal',
        'recipient_name' => 'Ahmad Dahlan',
        'recipient_phone' => '081211223344',
        'shipping_address' => 'Jl. Ahmad Yani No. 1, Ciamis',
        'total_quantity' => 1,
        'subtotal' => 250000,
        'shipping_cost' => 0,
        'total_amount' => 250000,
        'payment_status' => 'paid',
        'status' => 'processing',
        'tracking_number' => 'GLH-EXP-TEST-999',
        'shipping_courier' => 'Kurir Khusus Galuh Atelier',
        'shipping_status' => 'studio_processing',
    ]);

    TrackingLog::create([
        'order_id' => $order->id,
        'stage' => 'studio_processing',
        'title' => 'Pesanan Berhasil Masuk ke Studio Atelier',
        'description' => 'Mulai dipersiapkan oleh tim kriya Galuh & Co.',
        'location' => 'Studio Atelier Galuh & Co., Ciamis',
        'logged_at' => now(),
    ]);

    $response = $this->get(route('tracking.index', ['resi' => 'GLH-EXP-TEST-999']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('lacak-pesanan')
        ->where('resiQuery', 'GLH-EXP-TEST-999')
        ->where('order.tracking_number', 'GLH-EXP-TEST-999')
        ->where('order.shipping_status', 'studio_processing')
    );
});

test('only user with completed orders can submit interactive review', function () {
    $userWithoutOrder = User::factory()->user()->create();

    // User without order gets rejected
    $failResponse = $this->actingAs($userWithoutOrder)->post(route('reviews.store'), [
        'rating' => 5,
        'comment' => 'Hampers sangat bagus dan mewah!',
    ]);

    $failResponse->assertSessionHas('error');
    expect(Review::count())->toBe(0);

    // User with verified order can submit review
    $order = Order::create([
        'order_number' => 'ORD-TEST-REV',
        'user_id' => $userWithoutOrder->id,
        'order_type' => 'personal',
        'recipient_name' => $userWithoutOrder->name,
        'recipient_phone' => '081234567890',
        'shipping_address' => 'Jl. Ciamis No. 1',
        'total_quantity' => 1,
        'subtotal' => 300000,
        'shipping_cost' => 0,
        'total_amount' => 300000,
        'payment_status' => 'paid',
        'status' => 'completed',
        'tracking_number' => 'GLH-TEST-REV',
        'shipping_courier' => 'Kurir Khusus Galuh Atelier',
        'shipping_status' => 'delivered',
    ]);

    $successResponse = $this->actingAs($userWithoutOrder)->post(route('reviews.store'), [
        'rating' => 5,
        'comment' => 'Pengalaman berbelanja luar biasa! Nastar wisjman lumer dan stempel wax-nya sangat rapi.',
    ]);

    $successResponse->assertSessionHas('success');
    expect(Review::count())->toBe(1);
    expect(Review::first()->rating)->toBe(5);
});

test('users can like a review interactively and increment like count', function () {
    $review = Review::create([
        'customer_name' => 'Bambang',
        'customer_title' => 'Pembeli Terverifikasi',
        'rating' => 5,
        'comment' => 'Pelayanan ramah dan pengiriman sangat aman.',
        'likes_count' => 0,
        'is_published' => true,
    ]);

    $user = User::factory()->user()->create();

    // First like increments count
    $response = $this->actingAs($user)->postJson(route('reviews.like', $review));
    $response->assertOk()
        ->assertJson([
            'success' => true,
            'liked' => true,
            'likes_count' => 1,
        ]);

    expect($review->fresh()->likes_count)->toBe(1);

    // Second like toggles it off
    $response2 = $this->actingAs($user)->postJson(route('reviews.like', $review));
    $response2->assertOk()
        ->assertJson([
            'success' => true,
            'liked' => false,
            'likes_count' => 0,
        ]);

    expect($review->fresh()->likes_count)->toBe(0);
});

test('admin can view orders list and update shipping stage & resi number', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $order = Order::create([
        'order_number' => 'ORD-ADMIN-01',
        'user_id' => $admin->id,
        'order_type' => 'personal',
        'recipient_name' => 'Dewi Sartika',
        'recipient_phone' => '081299887766',
        'shipping_address' => 'Jl. R.E. Martadinata No. 8, Ciamis',
        'total_quantity' => 2,
        'subtotal' => 700000,
        'shipping_cost' => 0,
        'total_amount' => 700000,
        'payment_status' => 'paid',
        'status' => 'processing',
        'tracking_number' => 'GLH-EXP-ADMIN-01',
        'shipping_courier' => 'Kurir Khusus Galuh Atelier',
        'shipping_status' => 'studio_processing',
    ]);

    // Admin views order list
    $response = $this->actingAs($admin)->get(route('admin.orders.index'));
    $response->assertOk();

    // Admin advances shipping stage to in_delivery
    $updateResponse = $this->actingAs($admin)->patch(route('admin.orders.status', $order), [
        'shipping_status' => 'in_delivery',
        'tracking_number' => 'GLH-EXP-ADMIN-01-UPDATED',
        'shipping_courier' => 'Kurir Khusus Galuh Atelier',
        'log_note' => 'Paket telah dibawa kurir menuju alamat tujuan.',
    ]);

    $updateResponse->assertRedirect();
    $freshOrder = $order->fresh();
    expect($freshOrder->shipping_status)->toBe('in_delivery');
    expect($freshOrder->tracking_number)->toBe('GLH-EXP-ADMIN-01-UPDATED');
    expect($freshOrder->trackingLogs()->count())->toBe(1);
    expect($freshOrder->trackingLogs()->first()->stage)->toBe('in_delivery');
});
