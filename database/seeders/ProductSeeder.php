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
            // 1. Lebaran (Idul Fitri)
            [
                'name' => 'Noor Mubarak Royal Hamper',
                'category' => 'Lebaran',
                'short_description' => 'Hantaran Idul Fitri megah dengan sentuhan beludru zamrud, kue kering artisan mentega Wijsman, dan sajadah sutra eksklusif.',
                'contents' => [
                    'Kastengel Keju Edam Tua 350g',
                    'Nastar Nanas Madu Organik 350g',
                    'Kurma Ajwa Madinah Grade A dalam Toples Kaca',
                    'Sajadah Tenun Sutra Halus Eksklusif',
                    'Artisan Green Jasmine Tea Tin 75g',
                    'Hardbox Beludru Zamrud Aksen Foil Emas & Kartu Ucapan Kaligrafi',
                ],
                'price_from' => 1450000,
                'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Safiya Signature Eid Box',
                'category' => 'Lebaran',
                'short_description' => 'Sentuhan kehangatan hari raya dalam kotak kayu jati ukir berisi kue premium dan madu hutan murni.',
                'contents' => [
                    'Putri Salju Mede Mentega Wijsman 300g',
                    'Sagu Keju Istimewa 300g',
                    'Madu Hutan Liar Kalimantan 250ml',
                    'Sendok Madu Kayu Jati Handmade',
                    'Tasbih Kristal Khusus & Kartu Idul Fitri',
                ],
                'price_from' => 850000,
                'image' => 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 2,
                'is_active' => true,
            ],

            // 2. Natal (Christmas & New Year)
            [
                'name' => 'Starlight Noel Prestige Hamper',
                'category' => 'Natal',
                'short_description' => 'Kemewahan suasana Natal hangat dengan aroma rempah kayu manis, sparkling cuvée non-alkohol, dan cokelat Belgia artisan.',
                'contents' => [
                    'Sparkling White Grape Cuvée (Non-Alcohol) 750ml',
                    'Gingerbread & Cinnamon Speculoos Cookies 250g',
                    'Dark Chocolate Truffle Belgia Artisan 180g',
                    'Lilin Aromaterapi Pine & Cedarwood Soy Candle',
                    'Ornamen Natal Kaca Emas & Pinecone Hiasan',
                    'Kotak Kulit Sintetis Vintage Ivory dengan Sabuk Gesper Emas',
                ],
                'price_from' => 1650000,
                'image' => 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Winter Solstice Petite Gift',
                'category' => 'Natal',
                'short_description' => 'Bingkisan Natal elegan untuk sahabat terdekat dengan cokelat artisanal dan cangkir keramik handmade.',
                'contents' => [
                    'Cangkir Keramik Handmade Glaze Ivory',
                    'Artisan Hot Cocoa Mix with Mini Marshmallows 200g',
                    'Peppermint Chocolate Bark 200g',
                    'Kartu Ucapan Merry Christmas dengan Segel Wax Seal Merah Bata',
                ],
                'price_from' => 550000,
                'image' => 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 4,
                'is_active' => true,
            ],

            // 3. Corporate (B2B & Executive Gifting)
            [
                'name' => 'The Executive Legacy Suite',
                'category' => 'Corporate',
                'short_description' => 'Hadiah korporat representatif bagi dewan direksi, mitra strategis, dan klien VIP dengan personalisasi logo perusahaan.',
                'contents' => [
                    'Buku Agenda Kulit Asli dengan Grafir Emboss Foil Emas',
                    'Pulpen Metal Rollerball Aksen Gold Brass',
                    'Single Origin Specialty Coffee Beans Toraja 250g',
                    'Stainless Steel Tumbler Termos Double Wall Matte Emerald 500ml',
                    'Artisan Dark Chocolate Almond Bark 150g',
                    'Kotak Kayu Solid dengan Sablon Logo Korporat & Sertifikat Kurasi',
                ],
                'price_from' => 1850000,
                'image' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Apex Business Appreciation Box',
                'category' => 'Corporate',
                'short_description' => 'Paket apresiasi karyawan dan rekanan bisnis dengan kurasi produk fungsional dan estetika modern berkelas.',
                'contents' => [
                    'Wireless Desktop Charger Pad Bamboo Finish 15W',
                    'Gourmet Drip Coffee Sachets (5 Variasi Nusantara)',
                    'Artisan Granola Bites Honey Cranberry 150g',
                    'Custom Corporate Sleeve & Foil Gold Greeting Card',
                ],
                'price_from' => 750000,
                'image' => 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 6,
                'is_active' => true,
            ],

            // 4. Wedding (Seserahan & Souvenir Mewah)
            [
                'name' => 'Eternal Vows Bridal Seserahan',
                'category' => 'Wedding',
                'short_description' => 'Set hantaran pernikahan berbalut kain satin silk mewah, parfum signature, dan bunga preserved abadi yang memikat hati.',
                'contents' => [
                    'Parfum Artisan Eau de Parfum Amber & Peony 50ml',
                    'Silk Robe Kimono dengan Bordir Monogram Pengantin',
                    'Diffuser Reed Aromatic Jasmine Blossom 100ml',
                    'Handmade Marble Trinket Tray Aksen Kuningan',
                    'Bunga Preserved Rose & Baby Breath Abadi dalam Kubah Kaca',
                ],
                'price_from' => 2250000,
                'image' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Opulence Wedding Favors Box',
                'category' => 'Wedding',
                'short_description' => 'Kenang-kenangan eksklusif untuk tamu VIP pernikahan bernuansa champagne dan perak mewah.',
                'contents' => [
                    'Mini Tin Tea Blend Rose Lavender 40g',
                    'Lilin Aromaterapi Mini Tin Gold',
                    'Handmade Honey Dipper & Jar Madu Murni Mini',
                    'Pita Sutra Organza & Kartu Terima Kasih Custom Cetak Timbul',
                ],
                'price_from' => 450000,
                'image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 8,
                'is_active' => true,
            ],

            // 5. Custom (Bespoke Hampers)
            [
                'name' => 'Bespoke Royal Heritage Chest',
                'category' => 'Custom',
                'short_description' => 'Pilihan hampers kustom penuh yang dirancang khusus bersama desainer GALUH & CO. untuk momen sakral Anda.',
                'contents' => [
                    'Kustomisasi Penuh Item Sesuai Permintaan Klien',
                    'Pilihan Wadah: Peti Kayu Mahoni / Hardbox Beludru / Anyaman Pandan Halus',
                    'Konsultasi Desain & Kartu Tulisan Tangan Seniman Kaligrafi',
                    'Pita Sutra Impor & Wax Seal Stempel Logo Khusus',
                ],
                'price_from' => 2500000,
                'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 9,
                'is_active' => true,
            ],

            // Inactive product for testing query filters
            [
                'name' => 'Limited Edition Amber Reserve (Archive)',
                'category' => 'Custom',
                'short_description' => 'Produk arsip terbatas musim lalu untuk verifikasi filter produk aktif.',
                'contents' => [
                    'Vintage Harvest Black Tea 100g',
                    'Rare Organic Wild Honey 300g',
                ],
                'price_from' => 980000,
                'image' => 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80',
                'sort_order' => 10,
                'is_active' => false,
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
