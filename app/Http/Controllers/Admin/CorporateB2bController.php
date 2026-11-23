<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class CorporateB2bController extends Controller
{
    /**
     * Display the B2B Quotation Calculator & Proposal Generator.
     */
    public function index(): Response
    {
        $hampers = Product::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        $tierDiscounts = [
            ['min_qty' => 20, 'max_qty' => 49, 'discount_pct' => 0, 'label' => '20 - 49 Box (Harga Normal)'],
            ['min_qty' => 50, 'max_qty' => 99, 'discount_pct' => 5, 'label' => '50 - 99 Box (Diskon 5%)'],
            ['min_qty' => 100, 'max_qty' => 249, 'discount_pct' => 10, 'label' => '100 - 249 Box (Diskon 10%)'],
            ['min_qty' => 250, 'max_qty' => 10000, 'discount_pct' => 15, 'label' => '250+ Box (Diskon 15% VIP)'],
        ];

        $addOns = [
            ['id' => 'custom_sleeve', 'name' => 'Custom Hardbox Sleeve & Foil Logo PT', 'price_per_box' => 25000, 'is_default' => true],
            ['id' => 'laser_engraving', 'name' => 'Laser Grafir Nama Monogram pada Tumbler', 'price_per_box' => 35000, 'is_default' => false],
            ['id' => 'wax_seal_custom', 'name' => 'Stempel Segel Lilin Wax Manual Kustom', 'price_per_box' => 15000, 'is_default' => true],
            ['id' => 'multi_drop_handling', 'name' => 'Penanganan Multi-Alamat & QC Pengiriman', 'price_per_box' => 20000, 'is_default' => false],
        ];

        $studioInfo = [
            'brand' => 'GALUH & CO. ATELIER BINGKISAN',
            'company' => 'PT Galuh Kriya Nusantara',
            'npwp' => '01.234.567.8-401.000',
            'phone' => Setting::get('whatsapp_number', '6281572414233'),
            'address' => Setting::get('studio_address', 'Jl. Sukajadi No. 128, Pasteur, Bandung, Jawa Barat 40162'),
            'bank_info' => 'BCA 008-888-2345 a.n PT Galuh Kriya Nusantara',
        ];

        return Inertia::render('admin/corporate-b2b/index', [
            'hampers' => $hampers,
            'tierDiscounts' => $tierDiscounts,
            'addOns' => $addOns,
            'studioInfo' => $studioInfo,
        ]);
    }
}
