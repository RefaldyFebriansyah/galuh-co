<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Testimonial;
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

        $testimonials = Cache::remember('landing_page_testimonials_v1', 3600, function () {
            return Testimonial::where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'quote' => $item->quote,
                    'name' => $item->name,
                    'role' => $item->role,
                    'orderType' => $item->order_type ?? 'Koleksi Signature Hampers',
                    'city' => $item->city,
                    'rating' => (int) $item->rating,
                ])
                ->toArray();
        });

        $faqs = Cache::remember('landing_page_faqs_v1', 3600, function () {
            return Faq::where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'question' => $item->question,
                    'answer' => $item->answer,
                    'category' => $item->category,
                ])
                ->toArray();
        });

        return Inertia::render('welcome', [
            'products' => array_values($products),
            'whatsappNumber' => $whatsappNumber,
            'settings' => $settings,
            'testimonials' => array_values($testimonials),
            'faqs' => array_values($faqs),
        ]);
    }
}
