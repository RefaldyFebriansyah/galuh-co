<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\HamperComponent;
use App\Models\Product;
use App\Models\ProductionOrder;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\WaLead;
use App\Models\WaTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class AdminOperationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Update existing admin user & create staff accounts
        User::updateOrCreate(
            ['email' => 'admin@galuh.co'],
            [
                'name' => 'Galuh Citra (Administrator)',
                'role' => 'admin',
                'phone_number' => '081234567890',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'cs@galuh.co'],
            [
                'name' => 'Siti Rahma (Administrator)',
                'role' => 'admin',
                'phone_number' => '081298765432',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'produksi@galuh.co'],
            [
                'name' => 'Budi Santoso (Administrator)',
                'role' => 'admin',
                'phone_number' => '081211223344',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Enhance existing products with packaging, halal, hero features
        $products = Product::all();
        foreach ($products as $idx => $p) {
            $packaging = match ($idx % 4) {
                0 => 'hardbox_emerald',
                1 => 'anyaman_bambu',
                2 => 'hardbox_linen',
                default => 'rotan_eksklusif',
            };

            $p->update([
                'packaging' => $packaging,
                'is_halal' => true,
                'is_featured_hero' => $idx === 0 || $idx === 1,
                'visibility' => 'published',
                'images' => [
                    $p->image,
                    '/images/product_emerald_box.jpg',
                    '/images/product_bamboo_box.jpg',
                ],
            ]);
        }

        // 3. Seed Hamper Components (Mix & Match Items)
        $components = [
            // Kudapan
            [
                'name' => 'Nastar Nanas Madu Wijsman 350g',
                'category' => 'kudapan',
                'sku' => 'KUD-NST-01',
                'unit_cost' => 85000,
                'stock_status' => 'in_stock',
                'description' => 'Butter Wijsman autentik dengan selai nanas madu Subang karamelisasi manual.',
                'is_active' => true,
            ],
            [
                'name' => 'Kastengel Keju Edam Tua 350g',
                'category' => 'kudapan',
                'sku' => 'KUD-KST-02',
                'unit_cost' => 95000,
                'stock_status' => 'in_stock',
                'description' => 'Keju Edam aged 12 bulan berpadu taburan keju gouda renyah gurih.',
                'is_active' => true,
            ],
            [
                'name' => 'Putri Salju Mede Premium 350g',
                'category' => 'kudapan',
                'sku' => 'KUD-PSL-03',
                'unit_cost' => 80000,
                'stock_status' => 'in_stock',
                'description' => 'Kacang mede sangrai halus berbalut gula dingin lembut premium.',
                'is_active' => true,
            ],
            [
                'name' => 'Kurma Medjool Grade A Jar 250g',
                'category' => 'kudapan',
                'sku' => 'KUD-KRM-04',
                'unit_cost' => 75000,
                'stock_status' => 'low_stock',
                'description' => 'Kurma Medjool jumbo berdaging tebal manis alami dalam jar kaca kedap udara.',
                'is_active' => true,
            ],
            // Minuman & Artisan Brew
            [
                'name' => 'Madu Hutan Liar Nusantara 250ml',
                'category' => 'minuman',
                'sku' => 'MNM-MDH-01',
                'unit_cost' => 65000,
                'stock_status' => 'in_stock',
                'description' => 'Madu raw murni dari hutan Riau dengan aroma floral yang pekat.',
                'is_active' => true,
            ],
            [
                'name' => 'Kopi Single-Origin Mandailing 150g',
                'category' => 'minuman',
                'sku' => 'MNM-KPI-02',
                'unit_cost' => 55000,
                'stock_status' => 'in_stock',
                'description' => 'Biji kopi arabika medium roast dengan notes dark chocolate dan herba lembut.',
                'is_active' => true,
            ],
            [
                'name' => 'Teh Melati Organik Royal Blend 50g',
                'category' => 'minuman',
                'sku' => 'MNM-TEH-03',
                'unit_cost' => 45000,
                'stock_status' => 'in_stock',
                'description' => 'Daun teh hijau pucuk pilihan beraroma melati segar alami tanpa perisa buatan.',
                'is_active' => true,
            ],
            // Merchandise & Aksesoris
            [
                'name' => 'Stainless Steel Tumbler Termal 500ml',
                'category' => 'merchandise',
                'sku' => 'MRC-TMB-01',
                'unit_cost' => 85000,
                'stock_status' => 'in_stock',
                'description' => 'Double wall vacuum insulation, finishing matte cream, siap grafir nama laser.',
                'is_active' => true,
            ],
            [
                'name' => 'French Press Kaca Borosilikat 350ml',
                'category' => 'merchandise',
                'sku' => 'MRC-FRP-02',
                'unit_cost' => 60000,
                'stock_status' => 'low_stock',
                'description' => 'Plunger stainless tahan karat dengan bodi kaca tahan panas borosilikat.',
                'is_active' => true,
            ],
            [
                'name' => 'Sendok Madu Kayu Jati Handmade',
                'category' => 'aksesoris',
                'sku' => 'AKS-SDK-01',
                'unit_cost' => 15000,
                'stock_status' => 'in_stock',
                'description' => 'Kayu jati perhutani food grade, ukiran halus dan tahan lama.',
                'is_active' => true,
            ],
            [
                'name' => 'Sajadah Tenun Sutra Halus Eksklusif',
                'category' => 'merchandise',
                'sku' => 'MRC-SJD-03',
                'unit_cost' => 120000,
                'stock_status' => 'in_stock',
                'description' => 'Tenun jacquard sutra lembut bermotif geometris timur tengah elegan.',
                'is_active' => true,
            ],
            // Kemasan Box & Sleeve
            [
                'name' => 'Hardbox Linen Emerald 1200 GSM',
                'category' => 'kemasan',
                'sku' => 'KMS-HDB-01',
                'unit_cost' => 110000,
                'stock_status' => 'in_stock',
                'description' => 'Karton tebal 1200 GSM berlapis kain linen hijau zamrud dengan magnet cover.',
                'is_active' => true,
            ],
            [
                'name' => 'Peti Anyaman Bambu Kriya Halus 25x25cm',
                'category' => 'kemasan',
                'sku' => 'KMS-BMB-02',
                'unit_cost' => 75000,
                'stock_status' => 'in_stock',
                'description' => 'Anyaman bambu apus pilihan perajin Tasikmalaya dengan vernis ramah lingkungan.',
                'is_active' => true,
            ],
            [
                'name' => 'Pita Satin Sutra Double-Faced + Wax Seal',
                'category' => 'aksesoris',
                'sku' => 'AKS-PTA-01',
                'unit_cost' => 25000,
                'stock_status' => 'in_stock',
                'description' => 'Pita satin ganda 3.8cm warna emas/zamrud dengan cap segel lilin wax stempel manual.',
                'is_active' => true,
            ],
        ];

        foreach ($components as $item) {
            HamperComponent::updateOrCreate(['name' => $item['name']], $item);
        }

        // 4. Seed WhatsApp Leads
        $leads = [
            [
                'client_name' => 'Bapak Hendra Wijaya',
                'company_name' => 'PT Astra Agro Lestari Tbk',
                'wa_number' => '081288990011',
                'source' => 'catalog_corporate',
                'package_name' => 'Seri Sinergi Eksekutif B2B',
                'estimated_packages' => '150 Paket',
                'budget_range' => 'Rp 500.000 - Rp 750.000',
                'greeting_card_message' => 'Dengan apresiasi tertinggi atas sinergi dan kemitraan kokoh sepanjang tahun 2026.',
                'engraving_name' => 'Logo PT Astra Agro Lestari',
                'delivery_date' => Carbon::now()->addDays(12),
                'status' => 'negosiasi_custom',
                'notes' => 'Klien minta invoice resmi atas nama PT dan split pengiriman ke 3 kantor cabang.',
                'last_follow_up_at' => Carbon::now()->subHours(2),
            ],
            [
                'client_name' => 'Ibu Natasha Pramudita',
                'company_name' => 'PT Bank Mandiri (Persero) Tbk',
                'wa_number' => '081377441122',
                'source' => 'hero_customizer',
                'package_name' => 'Seri Kencana Lebaran',
                'estimated_packages' => '300 Paket',
                'budget_range' => '> Rp 1.000.000',
                'greeting_card_message' => 'Selamat Hari Raya Idul Fitri 1447 H. Mohon Maaf Lahir dan Batin dari Direksi & Manajemen Bank Mandiri.',
                'engraving_name' => 'Bank Mandiri Private Banking',
                'delivery_date' => Carbon::now()->addDays(18),
                'status' => 'deal_produksi',
                'notes' => 'PO sudah terbit. DP 50% sudah diterima. Masuk ke antrean perakitan studio.',
                'last_follow_up_at' => Carbon::now()->subDay(),
            ],
            [
                'client_name' => 'Ibu Felicia Tan',
                'company_name' => 'Unilever Indonesia',
                'wa_number' => '081822334455',
                'source' => 'catalog_corporate',
                'package_name' => 'Seri Rayyan Mubarak',
                'estimated_packages' => '80 Paket',
                'budget_range' => 'Rp 750.000 - Rp 1.000.000',
                'greeting_card_message' => 'Warmest Eid greetings to our valued executive partners.',
                'engraving_name' => 'Unilever Leadership Team',
                'delivery_date' => Carbon::now()->addDays(7),
                'status' => 'kirim_katalog',
                'notes' => 'Menunggu approval internal procurement untuk revisi sleeve logo.',
                'last_follow_up_at' => Carbon::now()->subHours(6),
            ],
            [
                'client_name' => 'Dr. Adrian Wicaksono',
                'company_name' => 'Pribadi (Wedding Hampers)',
                'wa_number' => '082155667788',
                'source' => 'floating_wa',
                'package_name' => 'Seri Safiya Mubarak (Besek Bambu)',
                'estimated_packages' => '45 Paket',
                'budget_range' => 'Rp 400.000 - Rp 600.000',
                'greeting_card_message' => 'Terima kasih telah menjadi bagian dari hari bahagia kami. Adrian & Meutia.',
                'engraving_name' => 'A & M',
                'delivery_date' => Carbon::now()->addDays(5),
                'status' => 'deal_produksi',
                'notes' => 'Kartu ucapan kaligrafi dengan stempel lilin warna emas rosegold.',
                'last_follow_up_at' => Carbon::now()->subDays(2),
            ],
            [
                'client_name' => 'Ibu Claudia Melati',
                'company_name' => 'Gojek Tokopedia (GoTo)',
                'wa_number' => '081299887766',
                'source' => 'hero_customizer',
                'package_name' => 'Seri Emerald Royal Nusantara',
                'estimated_packages' => '200 Paket',
                'budget_range' => '> Rp 1.000.000',
                'greeting_card_message' => 'Apresiasi tulus dari Tim People & Culture GoTo.',
                'engraving_name' => 'GoTo Ecosystem VIP',
                'delivery_date' => Carbon::now()->addDays(14),
                'status' => 'chat_baru',
                'notes' => 'Lead baru masuk dari Hero Customizer web. Perlu kirim surat penawaran resmi.',
                'last_follow_up_at' => Carbon::now()->subMinutes(40),
            ],
            [
                'client_name' => 'Bapak Farhan Alamsyah',
                'company_name' => 'PT Pertamina Hulu Rokan',
                'wa_number' => '081122334411',
                'source' => 'catalog_corporate',
                'package_name' => 'Seri Sinergi Eksekutif B2B',
                'estimated_packages' => '120 Paket',
                'budget_range' => 'Rp 600.000 - Rp 850.000',
                'greeting_card_message' => 'Salam Hormat & Apresiasi Kemitraan dari PHR.',
                'engraving_name' => 'Pertamina Hulu Rokan',
                'delivery_date' => Carbon::now()->addDays(20),
                'status' => 'negosiasi_custom',
                'notes' => 'Klien minta opsi penambahan kopi single-origin Gayo.',
                'last_follow_up_at' => Carbon::now()->subHours(4),
            ],
        ];

        foreach ($leads as $lead) {
            WaLead::updateOrCreate(
                ['wa_number' => $lead['wa_number'], 'client_name' => $lead['client_name']],
                $lead
            );
        }

        // 5. Seed WhatsApp Templates
        $templates = [
            [
                'title' => 'Sambutan Awal & Salam Hangat Concierge',
                'category' => 'sambutan_awal',
                'content' => "Halo {nama_klien}, selamat datang di Concierge Resmi GALUH & CO. ✨\n\nTerima kasih atas ketertarikan Anda terhadap koleksi {nama_paket}. Kami dengan senang hati membantu merangkai kurasi hantaran terbaik sesuai kebutuhan dan anggaran Anda.\n\nApakah bingkisan ini diperuntukkan untuk perayaan keluarga atau representasi resmi korporat?",
                'variables' => ['nama_klien', 'nama_paket'],
                'sort_order' => 1,
            ],
            [
                'title' => 'Kirim Pricelist & Penawaran B2B Bertingkat',
                'category' => 'kirim_pricelist',
                'content' => "Yth. {nama_klien} di {nama_perusahaan},\n\nTerlampir proposal penawaran resmi untuk pesanan {jumlah_box} box paket {nama_paket}.\n\nKami memberikan penawaran khusus diskon volume B2B sebesar {persen_diskon} serta gratis kustomisasi logo perusahaan pada pita satin dan sleeve kartu kaligrafi.\n\nApakah kami dapat mengirimkan 1 box sample kurasi ke kantor Anda besok?",
                'variables' => ['nama_klien', 'nama_perusahaan', 'jumlah_box', 'nama_paket', 'persen_diskon'],
                'sort_order' => 2,
            ],
            [
                'title' => 'Konfirmasi Desain Kartu & Laser Grafir Nama',
                'category' => 'desain_kartu',
                'content' => "Halo {nama_klien}, berikut adalah pratinjau mockup cetak kartu ucapan dan grafir laser monogram nama pada tumbler:\n\n• Teks Kartu: \"{teks_kartu}\"\n• Grafir Tumbler: \"{nama_grafir}\"\n\nMohon dicek kembali ejaan dan susunan namanya. Jika sudah sesuai, tim studio kami akan segera memproses cetak hari ini.",
                'variables' => ['nama_klien', 'teks_kartu', 'nama_grafir'],
                'sort_order' => 3,
            ],
            [
                'title' => 'Konfirmasi DP & Masuk Antrean Studio',
                'category' => 'follow_up',
                'content' => "Kabar baik {nama_klien}! Pembayaran uang muka untuk pesanan #{kode_pesanan} ({jumlah_box} box) telah kami verifikasi dengan baik.\n\nPesanan Anda kini resmi masuk ke antrean perakitan studio GALUH & CO. Target pengiriman dijadwalkan pada {tanggal_kirim}. Kami akan mengirimkan update foto hasil perakitan sebelum kurir berangkat.",
                'variables' => ['nama_klien', 'kode_pesanan', 'jumlah_box', 'tanggal_kirim'],
                'sort_order' => 4,
            ],
            [
                'title' => 'Notifikasi Pengiriman & Resi Kurir',
                'category' => 'info_pengiriman',
                'content' => "Yth. {nama_klien},\n\nSeluruh rangkaian hampers pesanan Anda ({jumlah_box} box) telah selesai disegel lilin manual dan diserahkan ke tim logistik kurir khusus kami.\n\n• Nomor Pengantaran: {nomor_resi}\n• Armada: Pengantaran Aman Berpendingin\n\nTerima kasih telah mempercayakan momen berharga Anda kepada GALUH & CO. Semoga membawa senyum hangat bagi para penerima.",
                'variables' => ['nama_klien', 'jumlah_box', 'nomor_resi'],
                'sort_order' => 5,
            ],
            [
                'title' => 'Follow Up Penawaran yang Masih Tertunda',
                'category' => 'follow_up',
                'content' => "Selamat siang {nama_klien}, semoga selalu dalam keadaan sehat.\n\nSekadar mengonfirmasi kembali terkait draf penawaran hampers {nama_paket} yang kami kirimkan sebelumnya. Mengingat ketersediaan slot pita linen dan box edisi terbatas, apakah ada hal yang perlu kami diskusikan atau sesuaikan kembali?",
                'variables' => ['nama_klien', 'nama_paket'],
                'sort_order' => 6,
            ],
        ];

        foreach ($templates as $t) {
            WaTemplate::updateOrCreate(['title' => $t['title']], $t);
        }

        // 6. Seed Production Orders (Studio Assembly Kanban)
        $orders = [
            [
                'order_code' => 'GLH-2026-001',
                'client_name' => 'Ibu Natasha Pramudita',
                'company_name' => 'PT Bank Mandiri (Persero) Tbk',
                'package_name' => 'Seri Kencana Lebaran',
                'quantity' => 300,
                'greeting_card_text' => 'Selamat Hari Raya Idul Fitri 1447 H. Mohon Maaf Lahir dan Batin dari Direksi & Manajemen Bank Mandiri.',
                'greeting_card_status' => 'printed',
                'engraving_names' => ['Direksi Bank Mandiri', 'Komisaris Utama', 'Nasabah Prioritas Utama'],
                'engraving_status' => 'engraved',
                'target_delivery_date' => Carbon::now()->addDays(5),
                'stage' => 'perakitan_wax',
                'priority' => 'urgent',
                'notes' => 'Pita satin warna emas dengan stempel wax seal logo Bank Mandiri.',
            ],
            [
                'order_code' => 'GLH-2026-002',
                'client_name' => 'Dr. Adrian Wicaksono',
                'company_name' => 'Pribadi (Wedding Souvenir)',
                'package_name' => 'Seri Safiya Mubarak (Besek Bambu)',
                'quantity' => 45,
                'greeting_card_text' => 'Terima kasih telah menjadi bagian dari hari bahagia kami. Adrian & Meutia.',
                'greeting_card_status' => 'printed',
                'engraving_names' => ['Adrian & Meutia Wedding'],
                'engraving_status' => 'engraved',
                'target_delivery_date' => Carbon::now()->addDays(3),
                'stage' => 'siap_kirim',
                'priority' => 'high',
                'notes' => 'Sudah dipacking kayu untuk pengiriman via kurir instan Bandung.',
            ],
            [
                'order_code' => 'GLH-2026-003',
                'client_name' => 'Bapak Hendra Wijaya',
                'company_name' => 'PT Astra Agro Lestari Tbk',
                'package_name' => 'Seri Sinergi Eksekutif B2B',
                'quantity' => 150,
                'greeting_card_text' => 'Dengan apresiasi tertinggi atas sinergi dan kemitraan kokoh sepanjang tahun 2026.',
                'greeting_card_status' => 'pending',
                'engraving_names' => ['Executive Astra Agro', 'Partner Representative'],
                'engraving_status' => 'pending',
                'target_delivery_date' => Carbon::now()->addDays(10),
                'stage' => 'cetak_grafir',
                'priority' => 'normal',
                'notes' => 'Menunggu finalisasi 10 nama direksi untuk grafir tumbler laser.',
            ],
            [
                'order_code' => 'GLH-2026-004',
                'client_name' => 'Ibu Felicia Tan',
                'company_name' => 'Unilever Indonesia',
                'package_name' => 'Seri Rayyan Mubarak',
                'quantity' => 80,
                'greeting_card_text' => 'Warmest Eid greetings to our valued executive partners from Unilever.',
                'greeting_card_status' => 'pending',
                'engraving_names' => ['Unilever VIP Partner'],
                'engraving_status' => 'pending',
                'target_delivery_date' => Carbon::now()->addDays(8),
                'stage' => 'persiapan_bahan',
                'priority' => 'normal',
                'notes' => 'Pastikan stok madu hutan dan toples Wijsman sudah di-reserve dari dapur.',
            ],
            [
                'order_code' => 'GLH-2026-005',
                'client_name' => 'Bapak Farhan Alamsyah',
                'company_name' => 'PT Pertamina Hulu Rokan',
                'package_name' => 'Seri Sinergi Eksekutif B2B',
                'quantity' => 120,
                'greeting_card_text' => 'Salam Hormat & Apresiasi Kemitraan dari PT Pertamina Hulu Rokan.',
                'greeting_card_status' => 'printed',
                'engraving_names' => ['PHR Executive Partner'],
                'engraving_status' => 'engraved',
                'target_delivery_date' => Carbon::now()->addDays(6),
                'stage' => 'perakitan_wax',
                'priority' => 'high',
                'notes' => 'Wax seal menggunakan warna Deep Emerald sesuai warna identitas.',
            ],
            [
                'order_code' => 'GLH-2026-006',
                'client_name' => 'Ibu Claudia Melati',
                'company_name' => 'Gojek Tokopedia (GoTo)',
                'package_name' => 'Seri Emerald Royal Nusantara',
                'quantity' => 200,
                'greeting_card_text' => 'Apresiasi tulus dari Tim People & Culture GoTo.',
                'greeting_card_status' => 'pending',
                'engraving_names' => ['GoTo Ecosystem Partner'],
                'engraving_status' => 'pending',
                'target_delivery_date' => Carbon::now()->addDays(14),
                'stage' => 'persiapan_bahan',
                'priority' => 'normal',
                'notes' => 'Menunggu pengiriman sleeve kemasan dari percetakan rekanan.',
            ],
        ];

        foreach ($orders as $order) {
            ProductionOrder::updateOrCreate(['order_code' => $order['order_code']], $order);
        }

        // 7. Seed Testimonials
        $testimonials = [
            [
                'name' => 'Asep Saepuloh',
                'role' => 'Pelanggan Paket Wedding & Personal',
                'order_type' => 'Bespoke Anyaman Bambu & Kudapan Wijsman',
                'city' => 'Bandung',
                'quote' => 'Untuk hampers keluarga dan suvenir pernikahan kami, GALUH & CO. benar-benar memuaskan. Tulisan kartu ucapannya rapi, kemasannya mewah, dan harum saat pertama kali kotak dibuka.',
                'rating' => 5,
                'sort_order' => 1,
            ],
            [
                'name' => 'Rasya Syahreza',
                'role' => 'HRD & GA, Perusahaan Fintech',
                'order_type' => '350 Paket Executive Hardbox Emerald',
                'city' => 'Jakarta Selatan',
                'quote' => 'Kami memesan 350 paket hampers akhir tahun untuk klien dan mitra perusahaan. Pengirimannya tepat waktu, kemasannya aman sampai tujuan, dan semua penerima memberikan kesan yang sangat baik.',
                'rating' => 5,
                'sort_order' => 2,
            ],
            [
                'name' => 'Muhammad Rizky P.',
                'role' => 'Pembeli Paket Lebaran',
                'order_type' => 'Heritage Besek & Single-Origin Roast',
                'city' => 'Surabaya',
                'quote' => 'Sudah tiga tahun berturut-turut memesan bingkisan Lebaran di GALUH & CO. Pilihan kue kering dan isinya selalu berkualitas, kemasannya pun terasa eksklusif dan berbeda dari yang lain.',
                'rating' => 5,
                'sort_order' => 3,
            ],
            [
                'name' => 'Dian Paramitha',
                'role' => 'Marketing Director, Logistics Corp',
                'order_type' => 'Custom Wax Seal & Monogram Tumbler',
                'city' => 'Jakarta Pusat',
                'quote' => 'Pelayanan konsultasi sangat ramah dan responsif. Custom logo perusahaan pada pita dan wax seal terlihat sangat profesional. Klien kami sangat terkesan.',
                'rating' => 5,
                'sort_order' => 4,
            ],
            [
                'name' => 'Clara Widjaja',
                'role' => 'Executive Assistant, Investment Firm',
                'order_type' => 'Emerald Hardbox & Engraved Tumbler',
                'city' => 'Jakarta Barat',
                'quote' => 'Pengerjaan grafir laser logo dan box linen hijau zamrud sangat presisi. Sangat prestisius sebagai cinderamata untuk dewan komisaris dan mitra investor VIP kami.',
                'rating' => 5,
                'sort_order' => 5,
            ],
            [
                'name' => 'Bambang Haryanto',
                'role' => 'Pelanggan Seri Tradisi Halal Bihalal',
                'order_type' => 'Anyaman Bambu & Madu Hutan Murni',
                'city' => 'Semarang',
                'quote' => 'Rasa nastar butter Wijsman autentik lumer di mulut dan madu hutannya harum murni. Kerabat keluarga besar sangat memuji kerapian anyaman bambunya.',
                'rating' => 5,
                'sort_order' => 6,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::updateOrCreate(['name' => $t['name']], $t);
        }

        // 8. Seed FAQs
        $faqs = [
            [
                'question' => 'Bagaimana alur pemesanan dan kustomisasi hampers di GALUH & CO.?',
                'answer' => 'Pemesanan dilakukan melalui konsultasi personal via WhatsApp Concierge resmi kami. Anda dapat memilih koleksi katalog yang tersedia atau mengajukan kustomisasi khusus (kartu ucapan kaligrafi, stempel wax seal, grafir laser nama, hingga isi kue kering pilihan). Setelah detail disepakati, tim kami akan menerbitkan draf penawaran/invoice resmi sebelum pesanan masuk ke antrean perakitan studio.',
                'category' => 'pemesanan',
                'sort_order' => 1,
            ],
            [
                'question' => 'Berapa jumlah minimum pemesanan untuk hampers corporate B2B?',
                'answer' => 'Untuk paket pesanan korporat dengan kustomisasi logo perusahaan pada pita, sleeve, dan kartu ucapan, minimum pemesanan adalah 20 paket. Kami menyediakan penawaran harga bertingkat khusus (tiered volume pricing) untuk pemesanan di atas 50, 100, hingga 500+ paket.',
                'category' => 'custom_branding',
                'sort_order' => 2,
            ],
            [
                'question' => 'Apakah dapat memesan sampel hampers sebelum konfirmasi pesanan besar?',
                'answer' => 'Tentu. Kami menyediakan layanan pengiriman 1 box sampel prototipe lengkap dengan mockup kartu ucapan dan kemasan yang diinginkan untuk peninjauan dewan direksi atau tim manajemen Anda sebelum produksi massal dimulai.',
                'category' => 'custom_branding',
                'sort_order' => 3,
            ],
            [
                'question' => 'Apakah semua produk makanan dan kue kering dijamin Halal dan higienis?',
                'answer' => 'Semua kue kering dan kudapan artisanal kami dibuat dari bahan-bahan bermutu tinggi bersertifikat Halal (butter Wijsman autentik, keju Edam tua impor bersertifikat, madu murni tanpa pengawet) dan diproduksi secara higienis di bawah standar kebersihan atelier terbaik.',
                'category' => 'pemesanan',
                'sort_order' => 4,
            ],
            [
                'question' => 'Bagaimana mekanisme pengiriman hampers ke berbagai alamat berbeda (multi-drop delivery)?',
                'answer' => 'Kami melayani pengiriman terkoordinasi ke ratusan alamat penerima di seluruh wilayah Jabodetabek dan kota-kota besar di Indonesia. Anda cukup melampirkan daftar spreadsheet alamat penerima, dan tim logistik kami akan mengatur pengantaran aman berpendingin dilengkapi bukti tanda terima real-time.',
                'category' => 'pengiriman',
                'sort_order' => 5,
            ],
            [
                'question' => 'Berapa lama waktu perakitan dan waktu ideal untuk memesan sebelum hari H?',
                'answer' => 'Untuk pesanan personal (1–15 box), waktu pengerjaan berkisar 2–3 hari kerja. Untuk pesanan korporat skala besar (50–500+ box), kami menyarankan konfirmasi pemesanan dilakukan 2–3 minggu sebelum tanggal pengiriman yang diinginkan untuk menjamin ketersediaan pita linen dan slot grafir nama.',
                'category' => 'pengiriman',
                'sort_order' => 6,
            ],
        ];

        foreach ($faqs as $f) {
            Faq::updateOrCreate(['question' => $f['question']], $f);
        }
    }
}
