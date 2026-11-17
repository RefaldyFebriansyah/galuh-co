<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = rtrim(fake()->sentence(3), '.');

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'category' => fake()->randomElement(['Lebaran', 'Natal', 'Corporate', 'Wedding', 'Custom']),
            'short_description' => fake()->sentence(12),
            'contents' => [
                'Artisan Gourmet Tea 100g',
                'Handmade Soy Wax Scented Candle',
                'Pure Forest Honey 250ml',
                'Gold-foiled Keepsake Hardbox & Greeting Card',
            ],
            'price_from' => fake()->numberBetween(350, 2500) * 1000,
            'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
            'sort_order' => fake()->numberBetween(1, 50),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
