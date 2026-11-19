<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the landing page with active hampers products, settings, and contact number.
     */
    public function index(): Response
    {
        $products = Cache::remember('landing_page_active_products_v4', 3600, function () {
            return Product::query()
                ->active()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->toArray();
        });

        $settings = Setting::forLandingPage();
        $whatsappNumber = $settings['whatsapp_number'] ?? (string) config('services.whatsapp.number', '6281572414233');

        return Inertia::render('welcome', [
            'products' => array_values($products),
            'whatsappNumber' => $whatsappNumber,
            'settings' => $settings,
        ]);
    }
}
