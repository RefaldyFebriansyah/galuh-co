import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    CheckCircle2,
    Clock,
    FileText,
    MessageSquare,
    Package,
    Palette,
    Settings,
    ShoppingBag,
    Star,
    TrendingUp,
    Truck,
    Users,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import type { Order, Review } from '@/types/models';

interface LeadSourceStat {
    source: string;
    key: string;
    count: number;
    color: string;
}

interface DashboardProps {
    kpis: {
        total_orders: number;
        total_revenue: number;
        total_revenue_formatted: string;
        orders_in_tracking: number;
        registered_customers: number;
        total_reviews: number;
        average_rating: number;
        wa_clicks_this_week: number;
        active_b2b_negotiations: number;
        most_popular_package: string;
    };
    order_pipeline: {
        studio_processing: number;
        quality_check: number;
        in_delivery: number;
        delivered: number;
    };
    recent_orders: Order[];
    recent_reviews: Review[];
    lead_source_stats: LeadSourceStat[];
    whatsapp_concierge: string;
}

export default function AdminDashboard({
    kpis,
    order_pipeline,
    recent_orders,
    recent_reviews,
    lead_source_stats,
    whatsapp_concierge,
}: DashboardProps) {
    const totalLeadSourcesCount = lead_source_stats.reduce(
        (acc, curr) => acc + curr.count,
        0,
    );

    const getStageBadge = (stage: string) => {
        switch (stage) {
            case 'studio_processing':
                return {
                    label: 'Kurasi Studio',
                    bg: 'bg-amber-50 text-amber-800 border-amber-200',
                };
            case 'quality_check':
                return {
                    label: 'QC & Segel Wax',
                    bg: 'bg-purple-50 text-purple-800 border-purple-200',
                };
            case 'in_delivery':
                return {
                    label: 'Dalam Kurir',
                    bg: 'bg-sky-50 text-sky-800 border-sky-200',
                };
            case 'delivered':
                return {
                    label: 'Telah Diterima',
                    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                };
            default:
                return {
                    label: 'Diproses',
                    bg: 'bg-slate-50 text-slate-700 border-slate-200',
                };
        }
    };

    return (
        <AdminLayout
            title="Dashboard Operasional"
            subtitle="Ringkasan performa penjualan hampers, alur tracking pesanan, dan kepuasan pelanggan"
            headerAction={
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#A88B54]/40 bg-white px-3.5 py-1.5 text-xs font-bold text-[#16233B] shadow-2xs transition-colors hover:border-[#16233B]"
                    >
                        <FileText className="size-3.5 text-[#A88B54]" />
                        <span>Kelola Pesanan</span>
                    </Link>
                    <Link
                        href="/admin/tracking"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-3.5 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-colors hover:bg-[#A88B54] hover:text-[#16233B]"
                    >
                        <Truck className="size-3.5 text-[#A88B54]" />
                        <span>Update Resi &amp; Tracking</span>
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard — Admin Galuh & Co." />

            <div className="space-y-6">
                {/* 1. Real Performance KPI Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    {/* Card 1: Total Orders */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(22,35,59,0.05)] transition-all duration-300 hover:border-[#A88B54]/50 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.1)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6E675D] uppercase">
                                Total Pesanan Masuk
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl border border-[#16233B]/20 bg-[#16233B]/10 text-[#16233B]">
                                <ShoppingBag className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-bold tracking-tight text-[#16233B]">
                                {kpis.total_orders}
                            </span>
                            <span className="text-xs font-medium text-[#6E675D]">
                                Pesanan Aktif
                            </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#6E675D]">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-semibold text-amber-800">
                                <Clock className="size-3" />
                                {kpis.orders_in_tracking} Sedang Diproses
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Total Revenue */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(22,35,59,0.05)] transition-all duration-300 hover:border-[#A88B54]/50 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.1)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6E675D] uppercase">
                                Total Omset Penjualan
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-300/60 bg-emerald-50 text-emerald-700">
                                <TrendingUp className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="font-serif text-2xl font-bold tracking-tight text-[#16233B]">
                                {kpis.total_revenue_formatted}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-[#6E675D]">
                            Akumulasi pesanan personal &amp; B2B
                        </p>
                    </div>

                    {/* Card 3: Most Popular Package */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(22,35,59,0.05)] transition-all duration-300 hover:border-[#A88B54]/50 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.1)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6E675D] uppercase">
                                Paket Paling Diminati
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl border border-[#A88B54]/30 bg-[#A88B54]/10 text-[#A88B54]">
                                <Award className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h4 className="line-clamp-1 font-serif text-lg font-bold text-[#16233B]">
                                {kpis.most_popular_package}
                            </h4>
                            <p className="mt-1 text-xs text-[#6E675D]">
                                Paling banyak dipesan &amp; diminati
                            </p>
                        </div>
                    </div>

                    {/* Card 4: Customer Satisfaction & Rating */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(22,35,59,0.05)] transition-all duration-300 hover:border-[#A88B54]/50 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.1)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6E675D] uppercase">
                                Kepuasan &amp; Ulasan
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl border border-[#A88B54]/30 bg-[#A88B54]/10 text-[#A88B54]">
                                <Star className="size-4.5 fill-[#A88B54]" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-bold tracking-tight text-[#16233B]">
                                {kpis.average_rating}
                            </span>
                            <span className="text-xs font-semibold text-[#A88B54]">
                                / 5.0 Bintang
                            </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-[#6E675D]">
                            <span>{kpis.total_reviews} Ulasan Masuk</span>
                            <span className="font-semibold text-[#16233B]">
                                {kpis.registered_customers} Pelanggan
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Visual Tracking Pipeline Progress */}
                <div className="rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFD7C5]/60 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Alur Pengerjaan &amp; Pengiriman (Tracking
                                    Pipeline)
                                </h3>
                            </div>
                            <p className="mt-0.5 text-xs text-[#6E675D]">
                                Pantau pergerakan fisik setiap hampers dari meja
                                kurasi atelier hingga sampai di tangan penerima
                            </p>
                        </div>
                        <Link
                            href="/admin/tracking"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A88B54] hover:text-[#16233B]"
                        >
                            <span>Buka Papan Pelacakan Resi</span>
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Step 1 */}
                        <div className="relative rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-4 transition-all hover:border-[#A88B54]">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                    Tahap 01
                                </span>
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-xs font-bold text-amber-900">
                                    {order_pipeline.studio_processing} Paket
                                </span>
                            </div>
                            <h4 className="mt-2 text-xs font-bold text-[#16233B]">
                                Kurasi &amp; Penataan Studio
                            </h4>
                            <p className="mt-1 text-[11px] text-[#6E675D]">
                                Pemilihan anyaman &amp; isian artisanal
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-4 transition-all hover:border-[#A88B54]">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                    Tahap 02
                                </span>
                                <span className="rounded-full bg-purple-100 px-2 py-0.5 font-mono text-xs font-bold text-purple-900">
                                    {order_pipeline.quality_check} Paket
                                </span>
                            </div>
                            <h4 className="mt-2 text-xs font-bold text-[#16233B]">
                                QC &amp; Segel Lilin Wax
                            </h4>
                            <p className="mt-1 text-[11px] text-[#6E675D]">
                                Kartu ucapan, grafir &amp; stempel emas
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-4 transition-all hover:border-[#A88B54]">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                    Tahap 03
                                </span>
                                <span className="rounded-full bg-sky-100 px-2 py-0.5 font-mono text-xs font-bold text-sky-900">
                                    {order_pipeline.in_delivery} Paket
                                </span>
                            </div>
                            <h4 className="mt-2 text-xs font-bold text-[#16233B]">
                                Dalam Pengiriman Kurir
                            </h4>
                            <p className="mt-1 text-[11px] text-[#6E675D]">
                                Armada khusus berpenyejuk kabin
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-4 transition-all hover:border-[#A88B54]">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                    Tahap 04
                                </span>
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-900">
                                    {order_pipeline.delivered} Paket
                                </span>
                            </div>
                            <h4 className="mt-2 text-xs font-bold text-[#16233B]">
                                Telah Diterima Konsumen
                            </h4>
                            <p className="mt-1 text-[11px] text-[#6E675D]">
                                Tiba dengan aman &amp; sempurna
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Live Feeds: Recent Orders & Recent Customer Reviews */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: Recent Real Orders (2 Columns) */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-[#DFD7C5]/60 pb-4">
                            <div>
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Pesanan E-Commerce Terbaru
                                </h3>
                                <p className="text-xs text-[#6E675D]">
                                    Daftar pesanan langsung yang baru masuk dari
                                    keranjang website
                                </p>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="text-xs font-bold text-[#A88B54] transition-colors hover:text-[#16233B]"
                            >
                                Kelola Semua Pesanan →
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-[#DFD7C5]/40">
                            {recent_orders.length === 0 ? (
                                <div className="py-12 text-center text-xs text-[#6E675D]">
                                    <ShoppingBag className="mx-auto mb-2 size-8 text-[#A88B54]/40" />
                                    Belum ada pesanan masuk. Pesanan pelanggan
                                    dari website akan otomatis tampil di sini.
                                </div>
                            ) : (
                                recent_orders.map((order) => {
                                    const stageBadge = getStageBadge(
                                        order.shipping_status,
                                    );
                                    const firstItem = order.items?.[0];
                                    const otherItemsCount =
                                        (order.items?.length || 1) - 1;

                                    return (
                                        <div
                                            key={order.id}
                                            className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-[#16233B]">
                                                        #{order.order_number}
                                                    </span>
                                                    <span
                                                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${stageBadge.bg}`}
                                                    >
                                                        {stageBadge.label}
                                                    </span>
                                                    <span className="rounded-md bg-[#FAF6EE] px-2 py-0.5 text-[10px] font-semibold text-[#A88B54] uppercase">
                                                        {order.order_type ===
                                                        'corporate'
                                                            ? 'Corporate B2B'
                                                            : 'Personal'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-[#6E675D]">
                                                    <span className="font-semibold text-[#16233B]">
                                                        {order.recipient_name}
                                                    </span>
                                                    {firstItem && (
                                                        <span>
                                                            {' '}
                                                            •{' '}
                                                            {
                                                                firstItem.product_name
                                                            }{' '}
                                                            (
                                                            {firstItem.quantity}{' '}
                                                            pcs)
                                                            {otherItemsCount >
                                                                0 &&
                                                                ` +${otherItemsCount} produk lain`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                <span className="font-mono text-xs font-bold text-[#16233B]">
                                                    {order.formatted_total}
                                                </span>
                                                <Link
                                                    href={`/admin/tracking?resi=${order.tracking_number || order.order_number}`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#A88B54]/30 bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-semibold text-[#16233B] hover:border-[#16233B] hover:bg-white"
                                                >
                                                    <span>Update Resi</span>
                                                    <ArrowUpRight className="size-3 text-[#A88B54]" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: Verified Customer Reviews (1 Column) */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#DFD7C5]/60 pb-4">
                            <div>
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Ulasan Pembeli Terbaru
                                </h3>
                                <p className="text-xs text-[#6E675D]">
                                    Feedback &amp; rating nyata pelanggan
                                </p>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-800">
                                {kpis.total_reviews} Ulasan
                            </span>
                        </div>

                        <div className="mt-4 space-y-3.5">
                            {recent_reviews.length === 0 ? (
                                <div className="py-12 text-center text-xs text-[#6E675D]">
                                    <Star className="mx-auto mb-2 size-7 text-[#A88B54]/40" />
                                    Belum ada ulasan yang masuk dari pelanggan.
                                </div>
                            ) : (
                                recent_reviews.map((rev) => (
                                    <div
                                        key={rev.id}
                                        className="rounded-xl border border-[#DFD7C5]/70 bg-[#FAF8F5] p-3 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[#16233B]">
                                                {rev.customer_name}
                                            </span>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`size-3 ${
                                                            i < rev.rating
                                                                ? 'fill-[#A88B54] text-[#A88B54]'
                                                                : 'text-slate-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-1.5 line-clamp-2 text-[#6E675D] italic">
                                            "{rev.comment}"
                                        </p>
                                        <div className="mt-2 flex items-center justify-between text-[10.5px] text-[#A88B54]">
                                            <span className="inline-flex items-center gap-1">
                                                <CheckCircle2 className="size-3 text-emerald-600" />
                                                {rev.customer_title ||
                                                    'Pembeli Terverifikasi'}
                                            </span>
                                            <span className="text-slate-400">
                                                {rev.likes_count} Suka
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. Bottom Row: Traffic Lead Distribution & Quick Actions */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: Lead Sources Distribution (2 Cols) */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-[#DFD7C5]/60 pb-4">
                            <div>
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Distribusi Sumber Pesanan &amp; Interaksi
                                </h3>
                                <p className="text-xs text-[#6E675D]">
                                    Kanal pemesanan dan konversi paling aktif di
                                    platform Galuh &amp; Co.
                                </p>
                            </div>
                            <span className="rounded-full border border-[#A88B54]/30 bg-[#FAF6EE] px-3 py-1 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                                Total {totalLeadSourcesCount} Konversi
                            </span>
                        </div>

                        <div className="mt-5 space-y-4">
                            {lead_source_stats.map((stat) => {
                                const percentage =
                                    totalLeadSourcesCount > 0
                                        ? Math.round(
                                              (stat.count /
                                                  totalLeadSourcesCount) *
                                                  100,
                                          )
                                        : 0;

                                return (
                                    <div key={stat.key} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-[#16233B]">
                                                {stat.source}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[#6E675D]">
                                                    {stat.count} aktivitas
                                                </span>
                                                <span className="w-10 text-right font-bold text-[#16233B]">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF6EE]">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: stat.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex flex-col justify-between rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs">
                        <div>
                            <div className="border-b border-[#DFD7C5]/60 pb-4">
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Pusat Aksi Cepat
                                </h3>
                                <p className="text-xs text-[#6E675D]">
                                    Pintasan navigasi langsung modul backoffice
                                </p>
                            </div>

                            <div className="mt-4 space-y-2">
                                <Link
                                    href="/admin/orders"
                                    className="group flex items-center justify-between rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-2.5 text-xs text-[#16233B] transition-all hover:border-[#A88B54] hover:bg-white hover:shadow-2xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#16233B] text-[#A88B54] transition-colors group-hover:bg-[#A88B54] group-hover:text-[#16233B]">
                                            <FileText className="size-4" />
                                        </div>
                                        <div>
                                            <span className="block font-bold">
                                                Inquiries &amp; Pesanan Masuk
                                            </span>
                                            <span className="text-[11px] text-[#6E675D]">
                                                Kelola pesanan e-commerce &amp;
                                                B2B
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-4 text-[#6E675D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#16233B]" />
                                </Link>

                                <Link
                                    href="/admin/tracking"
                                    className="group flex items-center justify-between rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-2.5 text-xs text-[#16233B] transition-all hover:border-[#A88B54] hover:bg-white hover:shadow-2xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#16233B] text-[#A88B54] transition-colors group-hover:bg-[#A88B54] group-hover:text-[#16233B]">
                                            <Truck className="size-4" />
                                        </div>
                                        <div>
                                            <span className="block font-bold">
                                                Pelacakan Resi &amp; Ekspedisi
                                            </span>
                                            <span className="text-[11px] text-[#6E675D]">
                                                Tahapan studio hingga kurir
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-4 text-[#6E675D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#16233B]" />
                                </Link>

                                <Link
                                    href="/admin/katalog"
                                    className="group flex items-center justify-between rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-2.5 text-xs text-[#16233B] transition-all hover:border-[#A88B54] hover:bg-white hover:shadow-2xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#16233B] text-[#A88B54] transition-colors group-hover:bg-[#A88B54] group-hover:text-[#16233B]">
                                            <Package className="size-4" />
                                        </div>
                                        <div>
                                            <span className="block font-bold">
                                                Katalog Hampers
                                            </span>
                                            <span className="text-[11px] text-[#6E675D]">
                                                Kelola paket &amp; foto produk
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-4 text-[#6E675D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#16233B]" />
                                </Link>

                                <Link
                                    href="/admin/pengaturan/profil"
                                    className="group flex items-center justify-between rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-2.5 text-xs text-[#16233B] transition-all hover:border-[#A88B54] hover:bg-white hover:shadow-2xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#16233B] text-[#A88B54] transition-colors group-hover:bg-[#A88B54] group-hover:text-[#16233B]">
                                            <Settings className="size-4" />
                                        </div>
                                        <div>
                                            <span className="block font-bold">
                                                Pengaturan Profil &amp; WA
                                            </span>
                                            <span className="text-[11px] text-[#6E675D]">
                                                Nomor WA Concierge &amp; studio
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-4 text-[#6E675D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#16233B]" />
                                </Link>

                                <Link
                                    href="/admin/cms/hero"
                                    className="group flex items-center justify-between rounded-xl border border-[#DFD7C5]/80 bg-[#FAF8F5] p-2.5 text-xs text-[#16233B] transition-all hover:border-[#A88B54] hover:bg-white hover:shadow-2xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#16233B] text-[#A88B54] transition-colors group-hover:bg-[#A88B54] group-hover:text-[#16233B]">
                                            <Palette className="size-4" />
                                        </div>
                                        <div>
                                            <span className="block font-bold">
                                                Konten Landing Page
                                            </span>
                                            <span className="text-[11px] text-[#6E675D]">
                                                Hero, Tentang, FAQ, &amp; Teks
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-4 text-[#6E675D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#16233B]" />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-[#DFD7C5]/60 pt-3 text-xs text-[#6E675D]">
                            <span>WhatsApp Resmi:</span>
                            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                                +{whatsapp_concierge}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
