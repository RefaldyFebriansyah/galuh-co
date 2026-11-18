<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the landing page with active hampers products, settings, and contact number.
     */
    public function index(): Response
    {
        $products = Product::query()
            ->active()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $settings = Setting::forLandingPage();
        $whatsappNumber = $settings['whatsapp_number'] ?? (string) config('services.whatsapp.number', '6281572414233');

        return Inertia::render('welcome', [
            'products' => $products,
            'whatsappNumber' => $whatsappNumber,
            'settings' => $settings,
        ]);
    }
}
