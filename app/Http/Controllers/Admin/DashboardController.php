<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard summary.
     */
    public function index(): Response
    {
        $productsTotal = Product::count();
        $productsActive = Product::where('is_active', true)->count();

        $categoryCounts = [
            'Paket Lebaran' => Product::where('category', 'Paket Lebaran')->count(),
            'Paket Kantor' => Product::where('category', 'Paket Kantor')->count(),
            'Natal & Tahun Baru' => Product::where('category', 'Natal & Tahun Baru')->count(),
            'Wedding' => Product::where('category', 'Wedding')->count(),
            'Custom' => Product::where('category', 'Custom')->count(),
        ];

        $inquiriesTotal = Inquiry::count();
        $inquiriesNew = Inquiry::where('status', 'new')->count();
        $inquiriesRecent = Inquiry::latest()->take(5)->get();

        $whatsappNumber = Setting::get('whatsapp_number', '6281572414233');

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'productsTotal' => $productsTotal,
                'productsActive' => $productsActive,
                'categoryCounts' => $categoryCounts,
                'inquiriesTotal' => $inquiriesTotal,
                'inquiriesNew' => $inquiriesNew,
            ],
            'recentInquiries' => $inquiriesRecent,
            'whatsappNumber' => $whatsappNumber,
        ]);
    }
}
