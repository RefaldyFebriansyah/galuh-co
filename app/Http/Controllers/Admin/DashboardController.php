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
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the Atelier Operations Overview with revenue chart and date range filtering.
     */
    public function index(Request $request): Response
    {
        $now = Carbon::now();
        $period = $request->input('period', 'this_month');

        switch ($period) {
            case 'today':
                $startDate = $now->copy()->startOfDay();
                $endDate = $now->copy()->endOfDay();
                $periodLabel = 'Hari Ini ('.$now->translatedFormat('d M Y').')';
                break;
            case 'this_week':
                $startDate = $now->copy()->startOfWeek();
                $endDate = $now->copy()->endOfWeek();
                $periodLabel = 'Minggu Ini ('.$startDate->translatedFormat('d M').' - '.$endDate->translatedFormat('d M Y').')';
                break;
            case 'custom':
                $startDate = $request->filled('start_date')
                    ? Carbon::parse($request->input('start_date'))->startOfDay()
                    : $now->copy()->subDays(30)->startOfDay();
                $endDate = $request->filled('end_date')
                    ? Carbon::parse($request->input('end_date'))->endOfDay()
                    : $now->copy()->endOfDay();
                $periodLabel = $startDate->translatedFormat('d M Y').' - '.$endDate->translatedFormat('d M Y');
                break;
            case 'this_month':
            default:
                $period = 'this_month';
                $startDate = $now->copy()->startOfMonth();
                $endDate = $now->copy()->endOfMonth();
                $periodLabel = 'Bulan '.$now->translatedFormat('F Y');
                break;
        }

        // 1. Metrics for selected period
        $periodOrdersQuery = Order::whereBetween('created_at', [$startDate, $endDate]);
        $periodRevenue = (int) (clone $periodOrdersQuery)->sum('total_amount');
        $periodOrdersCount = (int) (clone $periodOrdersQuery)->count();
        $periodAov = $periodOrdersCount > 0 ? (int) round($periodRevenue / $periodOrdersCount) : 0;

        // All-time metrics
        $allTimeRevenue = (int) Order::sum('total_amount');
        $allTimeOrders = Order::count();
        $ordersInTrackingCount = Order::whereIn('shipping_status', ['studio_processing', 'quality_check', 'in_delivery'])->count();
        $deliveredOrdersCount = Order::where('shipping_status', 'delivered')->count();
        $registeredCustomersCount = User::where('role', 'user')->count();
        $totalReviewsCount = Review::count();
        $averageRating = (float) round((float) (Review::avg('rating') ?: 5.0), 1);

        // 2. Generate Chart Data
        $chartData = [];
        if ($period === 'today') {
            $intervals = [
                ['00:00', '03:59', '00:00 - 03:59'],
                ['04:00', '07:59', '04:00 - 07:59'],
                ['08:00', '11:59', '08:00 - 11:59'],
                ['12:00', '15:59', '12:00 - 15:59'],
                ['16:00', '19:59', '16:00 - 19:59'],
                ['20:00', '23:59', '20:00 - 23:59'],
            ];
            foreach ($intervals as $interval) {
                $blockStart = $now->copy()->setTimeFromTimeString($interval[0]);
                $blockEnd = $now->copy()->setTimeFromTimeString($interval[1]);
                $blockOrders = Order::whereBetween('created_at', [$blockStart, $blockEnd]);
                $chartData[] = [
                    'date' => $interval[0],
                    'label' => $interval[0],
                    'full_label' => $interval[2],
                    'revenue' => (int) (clone $blockOrders)->sum('total_amount'),
                    'orders' => (int) (clone $blockOrders)->count(),
                ];
            }
        } else {
            $diffDays = $startDate->diffInDays($endDate);
            if ($diffDays > 45) {
                $cursor = $startDate->copy();
                while ($cursor <= $endDate) {
                    $weekStart = $cursor->copy()->startOfWeek();
                    $weekEnd = $cursor->copy()->endOfWeek();
                    if ($weekEnd > $endDate) {
                        $weekEnd = $endDate->copy();
                    }

                    $weekOrders = Order::whereBetween('created_at', [$weekStart, $weekEnd]);
                    $chartData[] = [
                        'date' => $weekStart->format('Y-m-d'),
                        'label' => $weekStart->translatedFormat('d M'),
                        'full_label' => $weekStart->translatedFormat('d M').' - '.$weekEnd->translatedFormat('d M Y'),
                        'revenue' => (int) (clone $weekOrders)->sum('total_amount'),
                        'orders' => (int) (clone $weekOrders)->count(),
                    ];
                    $cursor->addWeek();
                }
            } else {
                $cursor = $startDate->copy()->startOfDay();
                $actualEnd = $endDate->copy()->startOfDay();
                while ($cursor <= $actualEnd) {
                    $dayStart = $cursor->copy()->startOfDay();
                    $dayEnd = $cursor->copy()->endOfDay();
                    $dayOrders = Order::whereBetween('created_at', [$dayStart, $dayEnd]);

                    $chartData[] = [
                        'date' => $cursor->format('Y-m-d'),
                        'label' => $cursor->format('d/m'),
                        'full_label' => $cursor->translatedFormat('l, d F Y'),
                        'revenue' => (int) (clone $dayOrders)->sum('total_amount'),
                        'orders' => (int) (clone $dayOrders)->count(),
                    ];
                    $cursor->addDay();
                }
            }
        }

        // 3. Most popular package
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

        // 4. Recent Real Orders
        $recentOrders = Order::with('items')
            ->latest()
            ->take(5)
            ->get();

        // 5. Recent Verified Reviews
        $recentReviews = Review::latest()
            ->take(3)
            ->get();

        // 6. Legacy compatibility for existing tests
        $recentInquiries = Inquiry::latest()->take(5)->get();
        $legacyStats = [
            'productsTotal' => Product::count(),
            'productsActive' => Product::where('is_active', true)->count(),
            'categoryCounts' => Product::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category')->toArray(),
            'inquiriesTotal' => Inquiry::count(),
            'inquiriesNew' => Inquiry::where('status', 'new')->count(),
            'totalOrders' => $allTimeOrders,
            'totalRevenue' => $allTimeRevenue,
        ];

        $whatsappConcierge = Setting::get('whatsapp_number', '6281572414233');

        return Inertia::render('admin/dashboard', [
            'filter' => [
                'period' => $period,
                'period_label' => $periodLabel,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
            'chart_data' => $chartData,
            'metrics' => [
                'period_revenue' => $periodRevenue,
                'period_revenue_formatted' => 'Rp '.number_format($periodRevenue, 0, ',', '.'),
                'period_orders_count' => $periodOrdersCount,
                'period_aov_formatted' => 'Rp '.number_format($periodAov, 0, ',', '.'),
                'all_time_revenue_formatted' => 'Rp '.number_format($allTimeRevenue, 0, ',', '.'),
                'all_time_orders' => $allTimeOrders,
                'orders_in_tracking' => $ordersInTrackingCount,
                'registered_customers' => $registeredCustomersCount,
                'total_reviews' => $totalReviewsCount,
                'average_rating' => $averageRating,
                'most_popular_package' => $mostPopularPackage,
            ],
            'kpis' => [
                'total_orders' => $periodOrdersCount,
                'total_revenue' => $periodRevenue,
                'total_revenue_formatted' => 'Rp '.number_format($periodRevenue, 0, ',', '.'),
                'orders_in_tracking' => $ordersInTrackingCount,
                'registered_customers' => $registeredCustomersCount,
                'total_reviews' => $totalReviewsCount,
                'average_rating' => $averageRating,
                'wa_clicks_this_week' => WaLead::where('created_at', '>=', $now->copy()->startOfWeek())->count(),
                'active_b2b_negotiations' => Order::where('order_type', 'corporate')->count(),
                'most_popular_package' => $mostPopularPackage,
            ],
            'order_pipeline' => [
                'studio_processing' => Order::where('shipping_status', 'studio_processing')->count(),
                'quality_check' => Order::where('shipping_status', 'quality_check')->count(),
                'in_delivery' => Order::where('shipping_status', 'in_delivery')->count(),
                'delivered' => $deliveredOrdersCount,
            ],
            'recent_orders' => $recentOrders,
            'recent_reviews' => $recentReviews,
            'whatsapp_concierge' => $whatsappConcierge,
            'stats' => $legacyStats,
            'recentInquiries' => $recentInquiries,
            'whatsappNumber' => $whatsappConcierge,
        ]);
    }
}
