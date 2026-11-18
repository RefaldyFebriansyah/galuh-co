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
        // Bersihkan data lama agar kategori dan duplikasi bersih & konsisten
        Product::query()->delete();

        $products = [
            // 1. Paket Lebaran (Ramadan & Idul Fitri) - 4 Slots Lengkap
            [
                'name' => 'Seri Kencana Lebaran',
                'category' => 'Paket Lebaran',
                'short_description' => 'Kotak beludru hijau zamrud dengan nastar wijsman pilihan, kurma medjool, teh spesialisasi, dan sajadah sutra eksklusif.',
                'contents' => [
                    'Nastar Nanas Madu Wijsman 350g',
                    'Kastengel Keju Edam Tua 350g',
                    'Kurma Medjool Grade A dalam Jar Kaca',
                    'Artisan Royal Jasmine Tea Tin 75g',
                    'Sajadah Tenun Sutra Halus Eksklusif',
                    'Hardbox Beludru Zamrud Aksen Foil Emas & Kartu Kaligrafi',
                ],
                'price_from' => 2150000,
                'image' => '/images/product_emerald_box.jpg',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Rayyan Mubarak',
                'category' => 'Paket Lebaran',
                'short_description' => 'Kemewahan hantaran peti rotan anyaman nusantara berisi kurasi kue kering, madu hutan, teh melati, sendok kayu jati, dan termos eksklusif.',
                'contents' => [
                    'Nastar Nanas Madu Wijsman Toples 350g',
                    'Kastengel Keju Edam Tua Toples 350g',
                    'Madu Hutan Liar Nusantara Jar 250ml',
                    'Teh Melati Organik Royal Blend Jar 50g',
                    'Stainless Steel Tumbler Termos Double Wall Matte Cream (Grafir GALUH & CO.)',
                    'Sendok Madu Kayu Jati Handmade (2 pcs)',
                    'Peti Anyaman Rotan Alami Aksen Pita Zamrud & Amplop Wax Seal',
                ],
                'price_from' => 1250000,
                'image' => '/images/product_rattan_box.jpg',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Safiya Mubarak',
                'category' => 'Paket Lebaran',
                'short_description' => 'Sentuhan kehangatan hari raya dalam kotak kemasan besek anyaman bambu mewah berisi kue premium, madu hutan, dan sendok kayu handmade.',
                'contents' => [
                    'Nastar Nanas Madu Wijsman 350g',
                    'Kastengel Keju Edam Tua 350g',
                    'Madu Hutan Liar Kalimantan 250ml',
                    'Sendok Madu Kayu Jati Handmade',
                    'Kartu Idul Fitri Wax Seal',
                ],
                'price_from' => 850000,
                'image' => '/images/product_bamboo_box.jpg',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Marhaban Mubarak',
                'category' => 'Paket Lebaran',
                'short_description' => 'Bingkisan manis hari raya berisi kurasi kue kering favorit dengan packaging elegan beraksen pita sutra zamrud.',
                'contents' => [
                    'Nastar Nanas Madu Wijsman 250g',
                    'Kastengel Keju Edam 250g',
                    'Pouch Beludru Zamrud Tasbih Kristal',
                    'Kartu Ucapan Idul Fitri Foil Emas',
                ],
                'price_from' => 550000,
                'image' => null,
                'sort_order' => 4,
                'is_active' => true,
            ],

            // 2. Paket Kantor (Corporate & B2B Gifting) - 4 Slots Lengkap Berfoto Asli
            [
                'name' => 'Seri Eksekutif Kantor',
                'category' => 'Paket Kantor',
                'short_description' => 'Hardbox hijau zamrud eksklusif berisi tumbler vacuum cream, buku agenda kulit beige, pulpen emas, cangkir artisan, dan chocolate truffles untuk mitra VIP.',
                'contents' => [
                    'Stainless Steel Tumbler Termos Double Wall Matte Cream (Grafir GALUH & CO.)',
                    'Buku Agenda Kulit Vegan Beige dengan Grafir Emboss Foil Emas',
                    'Executive Metal Rollerball Pen Aksen Gold Brass',
                    'Cangkir Keramik Handmade Glaze Artisan Mug',
                    'Artisan Chocolate Praline Truffles Box',
                    'Kacang Almond Panggang Premium dalam Jar Kaca',
                    'Hardbox Zamrud Hijau Tutup Magnetik, Pita Satin & Kartu Partner Appreciation Wax Seal',
                ],
                'price_from' => 1850000,
                'image' => '/images/product_office_partner.jpg',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Sinergi Korporat',
                'category' => 'Paket Kantor',
                'short_description' => 'Hampers audio tech & artisanal coffee modern dengan headphone wireless champagne, french press kayu, kopi Mandailing, powerbank, dan tumbler eksklusif.',
                'contents' => [
                    'Wireless Over-Ear Headphone High Definition Matte Champagne',
                    'French Press Kopi Borosilikat Tutup & Gagang Kayu Jati Alami',
                    'Single Origin Specialty Coffee Beans Mandailing 200g',
                    'Slim Fast-Charging Powerbank Woven Fabric 10.000mAh',
                    'Buku Agenda Hardcover Charcoal Grey & Metal Rollerball Gold Pen',
                    'Stainless Steel Tumbler Termos Double Wall Matte Cream 500ml',
                    'Kacang Pistachio & Mede Panggang Gurih dalam Jar Kaca',
                    'Hardbox Hijau Zamrud Foil Emas & Kartu Corporate Appreciation Wax Seal',
                ],
                'price_from' => 1650000,
                'image' => '/images/product_office_tech.jpg',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Apresiasi Bisnis',
                'category' => 'Paket Kantor',
                'short_description' => 'Paket bingkisan mewah berisi tumbler, agenda kulit cokelat klasik, wooden desk organizer, kalender meja kayu, kacang roasted premium, dan drip coffee.',
                'contents' => [
                    'Stainless Steel Tumbler Termos Double Wall Matte Cream 500ml',
                    'Buku Agenda Kulit Cokelat Klasik dengan Pen Loop & Slot Kartu',
                    'Metal Rollerball Pen Aksen Perak & Gold',
                    'Wooden Desktop Organizer Caddy & Kalender Meja Kayu Multifungsi',
                    'Gourmet Specialty Drip Bag Coffee Box (GALUH & CO. Blend)',
                    'Kacang Mede & Almond Panggang Gurih Jar Kaca',
                    'Hardbox Hijau Zamrud dengan Kain Satin Champagne & Kartu In Appreciation Wax Seal',
                ],
                'price_from' => 1450000,
                'image' => '/images/product_office_appreciation.jpg',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Harmoni Bisnis',
                'category' => 'Paket Kantor',
                'short_description' => 'Hampers wellness & workspace sanctuary berisi ceramic ultrasonic aroma diffuser, essential oils murni, tanaman sukulen, teh herbal, madu, dan tumbler kaca bambu.',
                'contents' => [
                    'Ultrasonic Ceramic Aromatherapy Diffuser Matte White Wood Base',
                    'Pure Essential Oils Set (Lavender & Eucalyptus Mint 2x10ml)',
                    'Tanaman Mini Sukulen Hidup dalam Pot Terakota Natural',
                    'Glass Tumbler Infuser Double Wall dengan Tutup & Sleeve Bambu',
                    'Hand-Bound Canvas Linen Journal Notebook',
                    'Artisan Flower Herbal Tea Jar 50g & Jar Madu Murni Alami 150ml',
                    'Sendok Madu Kayu Jati Handmade (2 pcs) & 3 Mini Jar Healthy Dried Fruits',
                    'Hardbox Hijau Zamrud Aksen Pita Satin & Kartu Corporate Appreciation Wax Seal',
                ],
                'price_from' => 1250000,
                'image' => '/images/product_office_wellness.jpg',
                'sort_order' => 8,
                'is_active' => true,
            ],

            // 3. Natal & Tahun Baru - 4 Slots Lengkap Berfoto Asli
            [
                'name' => 'Seri Noel Luminary',
                'category' => 'Natal & Tahun Baru',
                'short_description' => 'Kemewahan suasana Natal hangat dengan nastar wijsman, kastengel, gingerbread cookies, sarang madu murni, lilin pine & clove, dan tumbler gold.',
                'contents' => [
                    'Signature Nastar Nanas Madu Wijsman Toples 350g',
                    'Kastengel Keju Edam Tua Toples 350g',
                    'Artisan Gingerbread & Cinnamon Cookies Jar',
                    'Honeycomb Madu Murni Asli dengan Sarang Lebah Jar Kaca',
                    'Artisan Holiday Tea Tin Kaleng Zamrud Emas 75g',
                    'Aromatherapy Scented Candle Amber Jar (Pine & Clove)',
                    'Diamond Textured Vacuum Tumbler Termos Gold Champagne',
                    'Tanaman Mini Sukulen Hidup Pouch Karung Goni & Sendok Madu Kayu',
                    'Hardbox Hijau Zamrud Tutup Magnetik, Pita Satin & Kartu Warmest Wishes Wax Seal',
                ],
                'price_from' => 1750000,
                'image' => '/images/product_noel_luminary.jpg',
                'sort_order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Starlight Prestige',
                'category' => 'Natal & Tahun Baru',
                'short_description' => 'Rayakan tahun baru berkesan dengan executive leather planner, reed diffuser pine & clove, holiday tea, sarang madu murni, dan roasted almonds.',
                'contents' => [
                    'Executive Hardcover Leather New Year Planner (Emboss Gold GALUH & CO.)',
                    'Executive Metal Rollerball Pen Aksen Gold Brass',
                    'Reed Diffuser Essential Oil Amber Jar (Pine & Clove Blend 100ml)',
                    'Honeycomb Madu Murni Asli dengan Sarang Lebah Jar Kaca',
                    'Festive Holiday Tea Blend Tin Kaleng Zamrud Emas 75g',
                    'Diamond Textured Vacuum Tumbler Termos Gold Champagne',
                    'Roasted Whole Almonds & Mixed Nuts Jar Kaca',
                    'Tanaman Mini Sukulen Hidup Pouch Karung Goni & Sendok Madu Kayu',
                    'Hardbox Hijau Zamrud Tutup Magnetik, Pita Satin & Kartu Warmest Wishes Wax Seal',
                ],
                'price_from' => 1550000,
                'image' => '/images/product_noel_starlight.jpg',
                'sort_order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Winter Harmony',
                'category' => 'Natal & Tahun Baru',
                'short_description' => 'Bingkisan manis akhir tahun yang menghangatkan suasana bersama keluarga tercinta dengan hot chocolate artisan dan kue biscotti.',
                'contents' => [
                    'Cranberry Almond Biscotti Jar 200g',
                    'Belgian Hot Chocolate Mix Tin Kaleng 150g',
                    'Enamel Mug Vintage Pine Green',
                    'Kartu Tahun Baru dengan Foil Timbul & Wax Seal',
                ],
                'price_from' => 850000,
                'image' => null,
                'sort_order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Joyful Petite',
                'category' => 'Natal & Tahun Baru',
                'short_description' => 'Paket bingkisan praktis dan manis berisi cookies jahe artisan, mug enamel, dan kartu ucapan tahun baru untuk kerabat.',
                'contents' => [
                    'Artisan Gingerbread Cookies Mini Jar 150g',
                    'Artisan Hot Cocoa Mix Pouch',
                    'Kartu Ucapan Happy New Year & Pita Sutra Emas',
                ],
                'price_from' => 450000,
                'image' => null,
                'sort_order' => 12,
                'is_active' => true,
            ],

            // 4. Wedding (Hantaran & Seserahan)
            [
                'name' => 'Seri Mahligai Seserahan',
                'category' => 'Wedding',
                'short_description' => 'Hampers hantaran eksklusif dengan sentuhan anyaman nusantara, aromaterapi mewah, dan dekorasi bunga kering abadi.',
                'contents' => [
                    'Aromatherapy Scented Candle Botanical Wax',
                    'Reed Diffuser Essential Oil Bergamot & Jasmine 100ml',
                    'Handwoven Linen Hand Towel Set (2 pcs)',
                    'Kue Kering Artisan Lavender Butter Cookies 250g',
                    'Peti Kayu Mahoni dengan Tutup Akrilik Transparan',
                ],
                'price_from' => 1750000,
                'image' => null,
                'sort_order' => 13,
                'is_active' => true,
            ],
            [
                'name' => 'Seri Zamrud Klasik',
                'category' => 'Wedding',
                'short_description' => 'Set cangkir keramik beraksen emas, teh putih artisan, dan madu murni acacia dalam kotak satin.',
                'contents' => [
                    'Cangkir Keramik Beraksen Emas Handmade (2 pcs)',
                    'Teh Putih Silver Needle Artisan 50g',
                    'Madu Murni Acacia dalam Jar Kaca Mewah 250ml',
                    'Sendok Emas Brass & Marble Coaster',
                    'Kotak Beludru Satin dengan Grafir Monogram Pengantin',
                ],
                'price_from' => 1450000,
                'image' => null,
                'sort_order' => 14,
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
                'sort_order' => 15,
                'is_active' => true,
            ],
        ];

        foreach ($products as $productData) {
            Product::create([
                ...$productData,
                'slug' => Str::slug($productData['name']),
            ]);
        }
    }
}
