<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\Setting;
use App\Models\User;
use App\Models\WaLead;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the Atelier Operations Overview.
     */
    public function index(): Response
    {
        $startOfWeek = Carbon::now()->startOfWeek();

        // 1. Real E-Commerce & Atelier Performance Metrics
        $totalOrdersCount = Order::count();
        $totalRevenue = (int) Order::sum('total_amount');
        $ordersInTrackingCount = Order::whereIn('shipping_status', ['studio_processing', 'quality_check', 'in_delivery'])->count();
        $deliveredOrdersCount = Order::where('shipping_status', 'delivered')->count();
        $registeredCustomersCount = User::where('role', 'user')->count();
        $totalReviewsCount = Review::count();
        $averageRating = (float) round((float) (Review::avg('rating') ?: 5.0), 1);

        $waClicksThisWeek = WaLead::where('created_at', '>=', $startOfWeek)->count();
        $activeB2bNegotiations = Order::where('order_type', 'corporate')->count() + WaLead::where('status', 'negosiasi_custom')->count();

        // Most popular package (based on actual order items or leads fallback)
        $popularOrderItem = OrderItem::selectRaw('product_name, SUM(quantity) as total_qty')
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->first();

        $mostPopularPackage = $popularOrderItem?->product_name;
        if (! $mostPopularPackage) {
            $popularLead = WaLead::selectRaw('package_name, COUNT(*) as count')
                ->whereNotNull('package_name')
                ->groupBy('package_name')
                ->orderByDesc('count')
                ->first();
            $mostPopularPackage = ($popularLead instanceof WaLead && $popularLead->package_name)
                ? (string) $popularLead->package_name
                : 'Seri Emerald Royal Nusantara';
        }

        // 2. Tracking & Order Pipeline Breakdown
        $orderPipeline = [
            'studio_processing' => Order::where('shipping_status', 'studio_processing')->count(),
            'quality_check' => Order::where('shipping_status', 'quality_check')->count(),
            'in_delivery' => Order::where('shipping_status', 'in_delivery')->count(),
            'delivered' => $deliveredOrdersCount,
        ];

        // 3. Recent Real E-Commerce Orders
        $recentOrders = Order::with('items')
            ->latest()
            ->take(6)
            ->get();

        // 4. Recent Verified Customer Reviews
        $recentReviews = Review::latest()
            ->take(4)
            ->get();

        // 5. Lead Source Distribution
        $sourceDistribution = [
            [
                'source' => 'Pesanan E-Commerce Langsung',
                'key' => 'ecommerce_direct',
                'count' => $totalOrdersCount,
                'color' => '#16233B',
            ],
            [
                'source' => 'Hero Customizer',
                'key' => 'hero_customizer',
                'count' => WaLead::where('source', 'hero_customizer')->count(),
                'color' => '#A88B54',
            ],
            [
                'source' => 'Katalog Corporate B2B',
                'key' => 'catalog_corporate',
                'count' => WaLead::where('source', 'catalog_corporate')->count() + Order::where('order_type', 'corporate')->count(),
                'color' => '#2B3B5C',
            ],
            [
                'source' => 'Floating WA Button',
                'key' => 'floating_wa',
                'count' => WaLead::where('source', 'floating_wa')->count(),
                'color' => '#8C7240',
            ],
            [
                'source' => 'Edisi Khusus / Festive',
                'key' => 'festive_banner',
                'count' => WaLead::where('source', 'festive_banner')->count(),
                'color' => '#6E675D',
            ],
        ];

        // 6. Recent WhatsApp Inquiries Feed
        $recentWaLeads = WaLead::latest()
            ->take(6)
            ->get();

        // 7. Catalog Stats
        $catalogStats = [
            'total_hampers' => Product::count(),
            'active_hampers' => Product::where('is_active', true)->count(),
            'total_inquiries' => WaLead::count() + Inquiry::count(),
            'deal_orders_count' => $totalOrdersCount,
        ];

        $whatsappConcierge = Setting::get('whatsapp_number', '6281572414233');

        $recentInquiries = Inquiry::latest()->take(5)->get();
        $legacyStats = [
            'productsTotal' => Product::count(),
            'productsActive' => Product::where('is_active', true)->count(),
            'categoryCounts' => Product::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category')->toArray(),
            'inquiriesTotal' => Inquiry::count(),
            'inquiriesNew' => Inquiry::where('status', 'new')->count(),
            'totalOrders' => $totalOrdersCount,
            'totalRevenue' => $totalRevenue,
        ];

        return Inertia::render('admin/dashboard', [
            'kpis' => [
                'total_orders' => $totalOrdersCount,
                'total_revenue' => $totalRevenue,
                'total_revenue_formatted' => 'Rp '.number_format($totalRevenue, 0, ',', '.'),
                'orders_in_tracking' => $ordersInTrackingCount,
                'registered_customers' => $registeredCustomersCount,
                'total_reviews' => $totalReviewsCount,
                'average_rating' => $averageRating,
                'wa_clicks_this_week' => $waClicksThisWeek,
                'active_b2b_negotiations' => $activeB2bNegotiations,
                'most_popular_package' => $mostPopularPackage,
            ],
            'order_pipeline' => $orderPipeline,
            'recent_orders' => $recentOrders,
            'recent_reviews' => $recentReviews,
            'lead_source_stats' => $sourceDistribution,
            'recent_wa_leads' => $recentWaLeads,
            'catalog_stats' => $catalogStats,
            'whatsapp_concierge' => $whatsappConcierge,
            'stats' => $legacyStats,
            'recentInquiries' => $recentInquiries,
            'whatsappNumber' => $whatsappConcierge,
        ]);
    }
}
