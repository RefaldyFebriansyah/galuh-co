<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the landing page with active hampers products and WhatsApp contact number.
     */
    public function index(): Response
    {
        $products = Product::query()
            ->active()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $whatsappNumber = (string) config('services.whatsapp.number', '6281572414233');

        return Inertia::render('welcome', [
            'products' => $products,
            'whatsappNumber' => $whatsappNumber,
        ]);
    }
}
