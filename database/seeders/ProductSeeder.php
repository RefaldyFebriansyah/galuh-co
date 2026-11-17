<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // 1. Ramadan & Eid (Lebaran)
            [
                'name' => 'Seri Kencana Lebaran',
                'category' => 'Ramadan & Eid',
                'short_description' => 'Kotak beludru hijau dengan nastar pilihan, kurma premium, dan teh spesialisasi.',
                'contents' => [
                    'Nastar Nanas Madu Wijsman 350g',
                    'Kastengel Keju Edam Tua 350g',
                    'Kurma Medjool Grade A dalam Jar Kaca',
                    'Artisan Royal Jasmine Tea Tin 75g',
                    'Sajadah Tenun Sutra Halus Eksklusif',
                    'Hardbox Beludru Zamrud Aksen Foil Emas & Kartu Kaligrafi',
                ],
                'price_from' => 2150000,
                'image' => '/images/hero_hamper.jpg',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Safiya Mubarak',
                'category' => 'Ramadan & Eid',
                'short_description' => 'Sentuhan kehangatan hari raya dalam kotak kayu jati ukir berisi kue premium dan madu hutan murni.',
                'contents' => [
                    'Putri Salju Mede Mentega Wijsman 300g',
                    'Sagu Keju Istimewa 300g',
                    'Madu Hutan Liar Kalimantan 250ml',
                    'Sendok Madu Kayu Jati Handmade',
                    'Kartu Idul Fitri Wax Seal',
                ],
                'price_from' => 850000,
                'image' => null,
                'sort_order' => 2,
                'is_active' => true,
            ],

            // 2. Wedding
            [
                'name' => 'Seri Zamrud Klasik',
                'category' => 'Wedding',
                'short_description' => 'Set cangkir keramik beraksen emas, teh pilihan, dan madu murni dalam kotak satin.',
                'contents' => [
                    'Cangkir Keramik Beraksen Emas Handmade (2 pcs)',
                    'Teh Putih Silver Needle Artisan 50g',
                    'Madu Murni Acacia dalam Jar Kaca Mewah 250ml',
                    'Sendok Emas Brass & Marble Coaster',
                    'Kotak Beludru Satin dengan Grafir Monogram Pengantin',
                ],
                'price_from' => 1450000,
                'image' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Mahligai Seserahan',
                'category' => 'Wedding',
                'short_description' => 'Hampers hantaran eksklusif dengan sentuhan anyaman nusantara dan dekorasi bunga kering abadi.',
                'contents' => [
                    'Aromatherapy Scented Candle Botanical Wax',
                    'Reed Diffuser Essential Oil Bergamot & Jasmine 100ml',
                    'Handwoven Linen Hand Towel Set (2 pcs)',
                    'Kue Kering Artisan Lavender Butter Cookies 250g',
                    'Peti Kayu Mahoni dengan Tutup Akrilik Transparan',
                ],
                'price_from' => 1750000,
                'image' => null,
                'sort_order' => 4,
                'is_active' => true,
            ],

            // 3. Natal & Tahun Baru
            [
                'name' => 'Seri Noel Luminary',
                'category' => 'Natal & Tahun Baru',
                'short_description' => 'Rayakan sukacita akhir tahun dengan kurasi kue jahe, cokelat artisan, dan lilin beraroma pinus.',
                'contents' => [
                    'Gingerbread Cookies Artisan Jar 200g',
                    'Dark Chocolate Truffles Sea Salt 16 pcs',
                    'Sparkling Red Grape Non-Alcoholic 750ml',
                    'Pine & Cinnamon Scented Soy Candle',
                    'Hardbox Merah Marun Pita Beludru Emas',
                ],
                'price_from' => 1250000,
                'image' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Winter Harmony',
                'category' => 'Natal & Tahun Baru',
                'short_description' => 'Bingkisan manis akhir tahun yang menghangatkan suasana bersama keluarga tercinta.',
                'contents' => [
                    'Cranberry Almond Biscotti 200g',
                    'Belgian Hot Chocolate Mix Tin 150g',
                    'Enamel Mug Vintage Pine Green',
                    'Kartu Tahun Baru dengan Foil Timbul',
                ],
                'price_from' => 650000,
                'image' => null,
                'sort_order' => 6,
                'is_active' => true,
            ],

            // 4. Paket Kantor (Corporate)
            [
                'name' => 'Seri Eksekutif Kantor',
                'category' => 'Paket Kantor',
                'short_description' => 'Kotak eksklusif berisi botol minum grafir logo, pulpen elegan, dan kartu ucapan.',
                'contents' => [
                    'Stainless Steel Tumbler Termos Double Wall Matte Emerald 500ml (Grafir Logo)',
                    'Pulpen Metal Rollerball Aksen Gold Brass dalam Kotak Beludru',
                    'Buku Agenda Kulit Asli dengan Grafir Emboss Foil Emas',
                    'Single Origin Drip Bag Coffee 5 Sachet',
                    'Kotak Kayu Solid dengan Sablon Logo Korporat & Kartu Ucapan',
                ],
                'price_from' => 1850000,
                'image' => null,
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Apresiasi Bisnis',
                'category' => 'Paket Kantor',
                'short_description' => 'Paket apresiasi karyawan dan rekanan bisnis dengan kurasi fungsional dan estetika modern berkelas.',
                'contents' => [
                    'Wireless Desktop Charger Pad Bamboo Finish 15W',
                    'Gourmet Drip Coffee Sachets (5 Variasi Nusantara)',
                    'Artisan Granola Bites Honey Cranberry 150g',
                    'Custom Corporate Sleeve & Foil Gold Greeting Card',
                ],
                'price_from' => 750000,
                'image' => null,
                'sort_order' => 8,
                'is_active' => true,
            ],

            // 5. Custom
            [
                'name' => 'Seri Bespoke Royal Heritage',
                'category' => 'Custom',
                'short_description' => 'Pilihan hampers kustom penuh yang dirancang khusus bersama desainer GALUH & CO. untuk momen sakral Anda.',
                'contents' => [
                    'Kustomisasi Penuh Item Sesuai Permintaan Klien',
                    'Pilihan Wadah: Peti Kayu Mahoni / Hardbox Beludru / Anyaman Pandan Halus',
                    'Konsultasi Desain & Kartu Tulisan Tangan Seniman Kaligrafi',
                    'Pita Sutra Impor & Wax Seal Stempel Logo Khusus',
                ],
                'price_from' => 2500000,
                'image' => null,
                'sort_order' => 9,
                'is_active' => true,
            ],
        ];

        foreach ($products as $productData) {
            Product::updateOrCreate(
                ['slug' => Str::slug($productData['name'])],
                [
                    ...$productData,
                    'slug' => Str::slug($productData['name']),
                ],
            );
        }
    }
}
