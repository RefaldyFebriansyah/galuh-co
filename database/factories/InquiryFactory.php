<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'company_name' => fake()->company(),
            'email' => fake()->safeEmail(),
            'whatsapp_number' => '628'.fake()->numerify('##########'),
            'estimated_packages' => fake()->randomElement(['25 - 50 paket', '50 - 100 paket', '100 - 250 paket', '250+ paket']),
            'budget_per_package' => fake()->randomElement(['Rp 350.000 - Rp 500.000', 'Rp 500.000 - Rp 1.000.000', 'Rp > 1.000.000']),
            'needed_at' => fake()->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d'),
            'notes' => fake()->paragraph(),
        ];
    }
}
