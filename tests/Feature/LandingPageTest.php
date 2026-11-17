<?php

use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('landing page loads successfully with active products and whatsapp number', function () {
    Product::factory()->create([
        'name' => 'Active Hamper Premium',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    Product::factory()->create([
        'name' => 'Inactive Hamper Old',
        'is_active' => false,
        'sort_order' => 2,
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('products')
        ->where('whatsappNumber', (string) config('services.whatsapp.number'))
        ->where('products', fn ($products) => collect($products)->every(fn ($p) => $p['is_active'] === true)
            && collect($products)->contains(fn ($p) => $p['name'] === 'Active Hamper Premium')
            && ! collect($products)->contains(fn ($p) => $p['name'] === 'Inactive Hamper Old')
        )
    );
});
