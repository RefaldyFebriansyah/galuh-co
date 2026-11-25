<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public landing page with dynamic real-life database statistics,
     * active event hampers promotion, interactive reviews, and studio location.
     */
    public function index(Request $request): Response
    {
        $settings = Setting::forLandingPage();
        $activeEvent = $settings['active_event'] ?? Setting::get('active_event', 'ramadhan');
        $whatsappNumber = (string) ($settings['whatsapp_number'] ?? Setting::get('whatsapp_number', config('services.whatsapp.number', '6281572414233')));

        // Products with event promotion (Event-tagged products promoted to the top)
        $products = Product::query()
            ->active()
            ->orderByRaw('CASE WHEN event_tag = ? THEN 0 ELSE 1 END', [$activeEvent])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        // Dynamic Real-Life Statistics starting from 0
        $totalHampersSold = (int) Order::whereIn('status', ['processing', 'completed'])->sum('total_quantity');
        $totalCorporateClients = (int) Order::where('order_type', 'corporate')
            ->whereNotNull('company_name')
            ->distinct('company_name')
            ->count('company_name');

        $reviewsQuery = Review::where('is_published', true);
        $totalReviews = (int) $reviewsQuery->count();
        $averageRating = $totalReviews > 0
            ? round((float) $reviewsQuery->avg('rating'), 1)
            : 0.0;

        $stats = [
            'total_hampers_sold' => $totalHampersSold,
            'total_corporate_clients' => $totalCorporateClients,
            'average_rating' => $averageRating,
            'total_reviews' => $totalReviews,
        ];

        // Interactive Reviews from database (supports sorting by likes, rating, or newest)
        $sort = $request->query('review_sort', 'likes'); // likes, rating, newest
        $starFilter = $request->query('star', 'all');

        $reviewsBuilder = Review::where('is_published', true);
        if (in_array((int) $starFilter, [1, 2, 3, 4, 5], true)) {
            $reviewsBuilder->where('rating', (int) $starFilter);
        }

        match ($sort) {
            'rating' => $reviewsBuilder->orderByDesc('rating')->orderByDesc('likes_count'),
            'newest' => $reviewsBuilder->latest(),
            default => $reviewsBuilder->orderByDesc('likes_count')->orderByDesc('created_at'),
        };

        $reviews = $reviewsBuilder->get()->map(fn (Review $r) => [
            'id' => $r->id,
            'name' => $r->customer_name,
            'role' => $r->customer_title ?: 'Pembeli Terverifikasi',
            'orderType' => $r->product?->name ?: 'Koleksi Signature Hampers',
            'quote' => $r->comment,
            'rating' => (int) $r->rating,
            'likesCount' => (int) $r->likes_count,
            'createdAt' => $r->created_at?->diffForHumans() ?: 'Baru saja',
        ])->toArray();

        // Check if current user can submit a review (must be logged in and have at least 1 order)
        $userCanReview = Auth::check() && Order::where('user_id', Auth::id())->exists();

        Faq::seedDefaultsIfEmpty();

        $faqs = Faq::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'question' => $item->question,
                'answer' => $item->answer,
                'category' => $item->category,
            ])
            ->toArray();

        return Inertia::render('welcome', [
            'products' => array_values($products->toArray()),
            'whatsappNumber' => $whatsappNumber,
            'settings' => $settings,
            'activeEvent' => $activeEvent,
            'dynamicStats' => $stats,
            'reviews' => array_values($reviews),
            'userCanReview' => $userCanReview,
            'faqs' => array_values($faqs),
        ]);
    }
}
