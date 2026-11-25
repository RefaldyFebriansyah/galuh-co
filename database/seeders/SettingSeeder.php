<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Contact & WhatsApp
            [
                'key' => 'whatsapp_number',
                'value' => '6282321773434',
                'group' => 'contact',
                'type' => 'string',
                'label' => 'Nomor WhatsApp Pemesanan',
                'description' => 'Nomor WhatsApp format internasional (tanpa tanda + atau spasi, contoh: 6282321773434)',
            ],
            [
                'key' => 'contact_phone',
                'value' => '+62 823-2177-3434',
                'group' => 'contact',
                'type' => 'string',
                'label' => 'Nomor Telepon Display',
                'description' => 'Nomor telepon yang ditampilkan di footer dan halaman kontak',
            ],
            [
                'key' => 'contact_email',
                'value' => 'halo@galuh.co',
                'group' => 'contact',
                'type' => 'string',
                'label' => 'Alamat Email Resmi',
                'description' => 'Email korespondensi resmi perusahaan',
            ],
            [
                'key' => 'company_address',
                'value' => 'Jl. Galuh Mas Raya No. 88, Karawang Barat, Jawa Barat 41361',
                'group' => 'contact',
                'type' => 'text',
                'label' => 'Alamat Workshop / Gallery',
                'description' => 'Alamat fisik galeri & workshop Galuh & Co.',
            ],
            [
                'key' => 'operational_hours',
                'value' => 'Senin - Sabtu: 08.00 - 20.00 WIB',
                'group' => 'contact',
                'type' => 'string',
                'label' => 'Jam Operasional',
                'description' => 'Waktu layanan konsultasi & operasional pengiriman',
            ],

            // Branding & Logo
            [
                'key' => 'logo_gold',
                'value' => '/images/galuh_logo_gold.png',
                'group' => 'branding',
                'type' => 'image',
                'label' => 'Logo Brand (Gold)',
                'description' => 'Logo utama beraksen foil emas untuk latar belakang terang (navbar)',
            ],
            [
                'key' => 'logo_white',
                'value' => '/images/galuh_logo_white.png',
                'group' => 'branding',
                'type' => 'image',
                'label' => 'Logo Brand (White)',
                'description' => 'Logo putih untuk latar belakang gelap (footer)',
            ],

            // Hero Section
            [
                'key' => 'hero_badge',
                'value' => '✦ ATELIER HAMPERS & KADO KORPORAT ✦',
                'group' => 'hero',
                'type' => 'string',
                'label' => 'Teks Badge Hero',
                'description' => 'Badge kecil di atas judul utama hero section',
            ],
            [
                'key' => 'hero_title_prefix',
                'value' => 'Hampers Eksklusif',
                'group' => 'hero',
                'type' => 'string',
                'label' => 'Judul Awalan Hero',
                'description' => 'Teks judul utama sebelum tulisan mesin ketik',
            ],
            [
                'key' => 'hero_description',
                'value' => 'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.',
                'group' => 'hero',
                'type' => 'text',
                'label' => 'Deskripsi Hero Section',
                'description' => 'Paragraf pengantar di bawah judul utama',
            ],

            // Social Media
            [
                'key' => 'instagram_url',
                'value' => 'https://instagram.com/galuh.co',
                'group' => 'social',
                'type' => 'string',
                'label' => 'Tautan Instagram',
                'description' => 'URL profil Instagram resmi',
            ],
            [
                'key' => 'tiktok_url',
                'value' => 'https://tiktok.com/@galuh.co',
                'group' => 'social',
                'type' => 'string',
                'label' => 'Tautan TikTok',
                'description' => 'URL akun TikTok resmi',
            ],
            [
                'key' => 'linkedin_url',
                'value' => 'https://linkedin.com/company/galuh-co',
                'group' => 'social',
                'type' => 'string',
                'label' => 'Tautan LinkedIn',
                'description' => 'URL halaman LinkedIn perusahaan (opsional)',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
