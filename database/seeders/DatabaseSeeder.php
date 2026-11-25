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
        // 1. Role: Admin Utama (Super Admin) - Akses Penuh
        User::updateOrCreate(
            ['email' => 'admin@galuh.co.id'],
            [
                'name' => 'Admin Utama (Super Admin)',
                'role' => 'super_admin',
                'phone_number' => '081234567890',
                'password' => Hash::make('password'),
            ],
        );

        // 2. Role: Admin Marketing - Pengelola Konten & Event
        User::updateOrCreate(
            ['email' => 'marketing@galuh.co.id'],
            [
                'name' => 'Admin Marketing',
                'role' => 'admin_marketing',
                'phone_number' => '081234567891',
                'password' => Hash::make('password'),
            ],
        );

        // 3. Role: User / Pembeli - Transaksi Langsung di Website
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
