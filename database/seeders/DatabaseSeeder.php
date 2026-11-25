<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database with 3 default accounts and initial catalog.
     * All sales and review counts start at 0 real-life.
     */
    public function run(): void
    {
        // 1. Role: Admin Galuh & Co.
        User::updateOrCreate(
            ['email' => 'admin@galuhco.id'],
            [
                'name' => 'Admin Galuh & Co.',
                'role' => 'admin',
                'phone_number' => '081234567890',
                'password' => Hash::make('password'),
            ],
        );

        User::updateOrCreate(
            ['email' => 'admin@galuh.co.id'],
            [
                'name' => 'Admin Galuh & Co.',
                'role' => 'admin',
                'phone_number' => '081234567890',
                'password' => Hash::make('password'),
            ],
        );

        // 2. Role: User / Pelanggan
        User::updateOrCreate(
            ['email' => 'user@galuh.co.id'],
            [
                'name' => 'Pelanggan Galuh',
                'role' => 'user',
                'phone_number' => '081234567892',
                'password' => Hash::make('password'),
            ],
        );

        $this->call([
            SettingSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
