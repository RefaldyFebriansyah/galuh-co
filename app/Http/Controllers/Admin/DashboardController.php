<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\ProductionOrder;
use App\Models\Setting;
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

        // 1. KPI Strip Metrics
        $waClicksThisWeek = WaLead::where('created_at', '>=', $startOfWeek)->count();
        $activeB2bNegotiations = WaLead::where('status', 'negosiasi_custom')->count();

        // Most popular package based on leads
        $popularLead = WaLead::selectRaw('package_name, COUNT(*) as count')
            ->whereNotNull('package_name')
            ->groupBy('package_name')
            ->orderByDesc('count')
            ->first();

        $mostPopularPackage = ($popularLead instanceof WaLead && $popularLead->package_name)
            ? (string) $popularLead->package_name
            : 'Seri Emerald Royal Nusantara';

        // Nearest confirmed delivery
        $nearestDeliveryOrder = ProductionOrder::where('target_delivery_date', '>=', Carbon::today())
            ->orderBy('target_delivery_date', 'asc')
            ->first();

        $deliveryDate = $nearestDeliveryOrder?->target_delivery_date;

        $nearestDelivery = $nearestDeliveryOrder ? [
            'order_code' => $nearestDeliveryOrder->order_code,
            'client_name' => $nearestDeliveryOrder->client_name,
            'company_name' => $nearestDeliveryOrder->company_name,
            'package_name' => $nearestDeliveryOrder->package_name,
            'quantity' => $nearestDeliveryOrder->quantity,
            'date' => $deliveryDate?->format('d M Y'),
            'days_left' => $deliveryDate ? Carbon::today()->diffInDays($deliveryDate, false) : 0,
        ] : null;

        // 2. Lead Source & Edition Interest Distribution
        $sourceDistribution = [
            [
                'source' => 'Hero Customizer',
                'key' => 'hero_customizer',
                'count' => WaLead::where('source', 'hero_customizer')->count(),
                'color' => '#0B291E',
            ],
            [
                'source' => 'Katalog Corporate B2B',
                'key' => 'catalog_corporate',
                'count' => WaLead::where('source', 'catalog_corporate')->count(),
                'color' => '#B89352',
            ],
            [
                'source' => 'Katalog Personal',
                'key' => 'catalog_personal',
                'count' => WaLead::where('source', 'catalog_personal')->count(),
                'color' => '#2E614D',
            ],
            [
                'source' => 'Floating WA Button',
                'key' => 'floating_wa',
                'count' => WaLead::where('source', 'floating_wa')->count(),
                'color' => '#143628',
            ],
            [
                'source' => 'Edisi Khusus / Festive',
                'key' => 'festive_banner',
                'count' => WaLead::where('source', 'festive_banner')->count(),
                'color' => '#9E7E45',
            ],
        ];

        // 3. Recent WhatsApp Inquiries Feed with 1-click follow up
        $recentWaLeads = WaLead::latest()
            ->take(6)
            ->get();

        // 4. Upcoming Studio Assembly & Delivery Schedule
        $upcomingDeliveries = ProductionOrder::orderBy('target_delivery_date', 'asc')
            ->take(5)
            ->get();

        // 5. Studio & Catalog Overview
        $catalogStats = [
            'total_hampers' => Product::count(),
            'active_hampers' => Product::where('is_active', true)->count(),
            'total_inquiries' => WaLead::count(),
            'deal_orders_count' => ProductionOrder::count(),
        ];

        $whatsappConcierge = Setting::get('whatsapp_number', '6281572414233');

        $recentInquiries = Inquiry::latest()->take(5)->get();
        $legacyStats = [
            'productsTotal' => Product::count(),
            'productsActive' => Product::where('is_active', true)->count(),
            'categoryCounts' => Product::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category')->toArray(),
            'inquiriesTotal' => Inquiry::count(),
            'inquiriesNew' => Inquiry::where('status', 'new')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'kpis' => [
                'wa_clicks_this_week' => $waClicksThisWeek,
                'active_b2b_negotiations' => $activeB2bNegotiations,
                'most_popular_package' => $mostPopularPackage,
                'nearest_delivery' => $nearestDelivery,
            ],
            'lead_source_stats' => $sourceDistribution,
            'recent_wa_leads' => $recentWaLeads,
            'upcoming_deliveries' => $upcomingDeliveries,
            'catalog_stats' => $catalogStats,
            'whatsapp_concierge' => $whatsappConcierge,
            'stats' => $legacyStats,
            'recentInquiries' => $recentInquiries,
            'whatsappNumber' => $whatsappConcierge,
        ]);
    }
}
