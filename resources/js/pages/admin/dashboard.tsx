import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Filter,
    Package,
    ShoppingBag,
    Star,
    TrendingUp,
    Truck,
} from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import type { Order, Review } from '@/types/models';

interface ChartDataPoint {
    date: string;
    label: string;
    full_label?: string;
    revenue: number;
    orders: number;
}

interface FilterProps {
    period: 'today' | 'this_week' | 'this_month' | 'custom' | string;
    period_label: string;
    start_date: string;
    end_date: string;
}

interface MetricsProps {
    period_revenue: number;
    period_revenue_formatted: string;
    period_orders_count: number;
    period_aov_formatted: string;
    all_time_revenue_formatted: string;
    all_time_orders: number;
    orders_in_tracking: number;
    registered_customers: number;
    total_reviews: number;
    average_rating: number;
    most_popular_package: string;
}

interface DashboardProps {
    filter: FilterProps;
    chart_data?: ChartDataPoint[];
    metrics: MetricsProps;
    recent_orders?: Order[];
    recent_reviews?: Review[];
    whatsapp_concierge?: string;
}

export default function AdminDashboard({
    filter,
    chart_data = [],
    metrics,
    recent_orders = [],
    recent_reviews = [],
}: DashboardProps) {
    const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>(
        'revenue',
    );
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [customStart, setCustomStart] = useState<string>(filter.start_date);
    const [customEnd, setCustomEnd] = useState<string>(filter.end_date);
    const [isCustomMode, setIsCustomMode] = useState<boolean>(
        filter.period === 'custom',
    );

    const gradientId = useId();

    const handlePeriodChange = (periodKey: string) => {
        if (periodKey === 'custom') {
            setIsCustomMode(true);
            return;
        }

        setIsCustomMode(false);
        router.get(
            '/admin/dashboard',
            { period: periodKey },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleApplyCustomDate = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/dashboard',
            {
                period: 'custom',
                start_date: customStart,
                end_date: customEnd,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // Chart dimensions and calculations
    const svgWidth = 860;
    const svgHeight = 240;
    const paddingLeft = 70;
    const paddingRight = 30;
    const paddingTop = 25;
    const paddingBottom = 40;
    const plotWidth = svgWidth - paddingLeft - paddingRight;
    const plotHeight = svgHeight - paddingTop - paddingBottom;

    const { points, yTicks } = useMemo(() => {
        const values = chart_data.map((d) =>
            chartMetric === 'revenue' ? d.revenue : d.orders,
        );
        const rawMax = Math.max(...values, 0);
        let max = rawMax > 0 ? rawMax : chartMetric === 'revenue' ? 1000000 : 5;

        // Round max up to nice round number for clean ticks
        if (chartMetric === 'revenue') {
            const step = Math.pow(10, Math.floor(Math.log10(max)));
            max = Math.ceil(max / step) * step;
            if (max === rawMax) {
                max = rawMax * 1.15;
            }
        } else {
            max = Math.ceil(max * 1.25);
            if (max < 4) {
                max = 4;
            }
        }

        const count = chart_data.length;
        const pts = chart_data.map((d, i) => {
            const val = chartMetric === 'revenue' ? d.revenue : d.orders;
            const x =
                count <= 1
                    ? paddingLeft + plotWidth / 2
                    : paddingLeft + (i / (count - 1)) * plotWidth;
            const y = paddingTop + plotHeight - (val / max) * plotHeight;
            return { x, y, val, data: d };
        });

        // 4 Y axis ticks: 100%, 66%, 33%, 0%
        const ticks = [
            {
                y: paddingTop,
                label:
                    chartMetric === 'revenue'
                        ? max >= 1000000
                            ? `${(max / 1000000).toFixed(1)} jt`
                            : `${Math.round(max / 1000)} rb`
                        : `${Math.round(max)}`,
            },
            {
                y: paddingTop + plotHeight * 0.33,
                label:
                    chartMetric === 'revenue'
                        ? max * 0.66 >= 1000000
                            ? `${((max * 0.66) / 1000000).toFixed(1)} jt`
                            : `${Math.round((max * 0.66) / 1000)} rb`
                        : `${Math.round(max * 0.66)}`,
            },
            {
                y: paddingTop + plotHeight * 0.66,
                label:
                    chartMetric === 'revenue'
                        ? max * 0.33 >= 1000000
                            ? `${((max * 0.33) / 1000000).toFixed(1)} jt`
                            : `${Math.round((max * 0.33) / 1000)} rb`
                        : `${Math.round(max * 0.33)}`,
            },
            {
                y: paddingTop + plotHeight,
                label: '0',
            },
        ];

        return { maxValue: max, points: pts, yTicks: ticks };
    }, [
        chart_data,
        chartMetric,
        paddingLeft,
        paddingTop,
        plotHeight,
        plotWidth,
    ]);

    // Build SVG path strings
    const pathString = useMemo(() => {
        if (points.length === 0) {
            return '';
        }
        if (points.length === 1) {
            return `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`;
        }
        return points.reduce((acc, pt, idx) => {
            return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
        }, '');
    }, [points]);

    const areaString = useMemo(() => {
        if (points.length === 0) {
            return '';
        }
        const bottomY = paddingTop + plotHeight;
        if (points.length === 1) {
            return `M ${points[0].x - 30} ${bottomY} L ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y} L ${points[0].x + 30} ${bottomY} Z`;
        }
        const first = points[0];
        const last = points[points.length - 1];
        return `${pathString} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
    }, [points, pathString, paddingTop, plotHeight]);

    // Format currency helper
    const formatRp = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

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
                    bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
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
                    bg: 'bg-slate-100 text-slate-800 border-slate-200',
                };
        }
    };

    return (
        <AdminLayout
            title="Dashboard Operasional"
            subtitle="Ringkasan performa omset, tren grafik transaksi, dan pesanan hampers atelier"
            headerAction={
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#16233B] shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50"
                    >
                        <ShoppingBag className="h-3.5 w-3.5 text-slate-600" />
                        <span>Kelola Pesanan</span>
                    </Link>
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#16233B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#0F172A]"
                    >
                        <span>Lihat Website</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-300" />
                    </a>
                </div>
            }
        >
            <Head title="Dashboard Operasional - Admin Galuh & Co." />

            <div className="space-y-6">
                {/* 1. Bar Pengaturan Periode & Rentang Tanggal Omset */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#16233B] uppercase">
                                <Calendar className="h-3.5 w-3.5 text-slate-600" />
                                Periode Omset:
                            </span>

                            <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handlePeriodChange('today')}
                                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                                        filter.period === 'today' &&
                                        !isCustomMode
                                            ? 'bg-[#16233B] text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Hari Ini
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePeriodChange('this_week')
                                    }
                                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                                        filter.period === 'this_week' &&
                                        !isCustomMode
                                            ? 'bg-[#16233B] text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Minggu Ini
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePeriodChange('this_month')
                                    }
                                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                                        filter.period === 'this_month' &&
                                        !isCustomMode
                                            ? 'bg-[#16233B] text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Bulan Ini
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCustomMode(true)}
                                    className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                                        filter.period === 'custom' ||
                                        isCustomMode
                                            ? 'bg-[#16233B] text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    <Filter className="h-3 w-3 text-slate-500" />
                                    <span>Pilih Rentang Tanggal</span>
                                </button>
                            </div>
                        </div>

                        {/* Form Input Rentang Tanggal (Kustom Tanggal) */}
                        {isCustomMode && (
                            <form
                                onSubmit={handleApplyCustomDate}
                                className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-slate-500">
                                        Dari:
                                    </span>
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) =>
                                            setCustomStart(e.target.value)
                                        }
                                        style={{ colorScheme: 'light' }}
                                        required
                                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-2xs focus:border-[#16233B] focus:outline-hidden"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-slate-500">
                                        Sampai:
                                    </span>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) =>
                                            setCustomEnd(e.target.value)
                                        }
                                        style={{ colorScheme: 'light' }}
                                        required
                                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-2xs focus:border-[#16233B] focus:outline-hidden"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-[#16233B] px-3.5 py-1 text-xs font-bold text-white shadow-2xs transition-all hover:bg-[#0F172A]"
                                >
                                    Terapkan
                                </button>
                            </form>
                        )}

                        <div className="text-right text-xs text-slate-500">
                            Rentang Aktif:{' '}
                            <span className="font-bold text-[#16233B]">
                                {filter.period_label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Hanya 3 Kartu Metrik Utama (Biru Navy, Putih, Bersih & Elegan) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Kartu 1: Omset Penjualan */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                    Omset Penjualan Terpilih
                                </span>
                                <div className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-[#16233B]">
                                    {metrics.period_revenue_formatted}
                                </div>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    <span>
                                        Rata-rata order:{' '}
                                        <b className="text-slate-900">
                                            {metrics.period_aov_formatted}
                                        </b>
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#16233B] shadow-2xs">
                                <TrendingUp className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                            Total Omset Keseluruhan:{' '}
                            <span className="font-bold text-[#16233B]">
                                {metrics.all_time_revenue_formatted}
                            </span>
                        </div>
                    </div>

                    {/* Kartu 2: Total Pesanan Masuk */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                    Total Pesanan Masuk
                                </span>
                                <div className="mt-1 font-sans text-3xl font-extrabold tracking-tight text-[#16233B]">
                                    {metrics.period_orders_count}{' '}
                                    <span className="text-sm font-semibold text-slate-500">
                                        Pesanan
                                    </span>
                                </div>
                                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                                        <Clock className="h-3 w-3 text-amber-600" />
                                        {metrics.orders_in_tracking} dalam
                                        proses kirim
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#16233B] shadow-2xs">
                                <ShoppingBag className="h-6 w-6 text-[#16233B]" />
                            </div>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                            Paket Paling Laris:{' '}
                            <span className="font-bold text-[#16233B]">
                                {metrics.most_popular_package}
                            </span>
                        </div>
                    </div>

                    {/* Kartu 3: Kepuasan & Ulasan Pelanggan */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                    Rating &amp; Kepuasan
                                </span>
                                <div className="mt-1 flex items-baseline gap-2 font-sans text-3xl font-extrabold tracking-tight text-[#16233B]">
                                    <span>
                                        {metrics.average_rating.toFixed(1)}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-500">
                                        / 5.0
                                    </span>
                                </div>
                                <div className="mt-1.5 flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className="h-4 w-4 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                    <span className="ml-1 text-xs font-semibold text-slate-500">
                                        ({metrics.total_reviews} ulasan)
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#16233B] shadow-2xs">
                                <Award className="h-6 w-6 text-[#16233B]" />
                            </div>
                        </div>
                        <div className="mt-4 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                            Pelanggan Terdaftar:{' '}
                            <span className="font-bold text-[#16233B]">
                                {metrics.registered_customers} Akun
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Section Grafik Interaktif Omset & Pesanan */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-[#16233B]">
                                Grafik Tren{' '}
                                {chartMetric === 'revenue'
                                    ? 'Omset Penjualan'
                                    : 'Volume Pesanan'}
                            </h2>
                            <p className="text-xs text-slate-500">
                                Pergerakan transaksi atelier untuk periode{' '}
                                <b className="text-[#16233B]">
                                    {filter.period_label}
                                </b>
                            </p>
                        </div>

                        {/* Switch Metric: Omset (Rp) vs Pesanan */}
                        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setChartMetric('revenue')}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                                    chartMetric === 'revenue'
                                        ? 'bg-[#16233B] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Omset (Rp)
                            </button>
                            <button
                                type="button"
                                onClick={() => setChartMetric('orders')}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                                    chartMetric === 'orders'
                                        ? 'bg-[#16233B] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Jumlah Pesanan
                            </button>
                        </div>
                    </div>

                    {/* SVG Graphic Area */}
                    <div className="relative mt-6 w-full">
                        {chart_data.length === 0 ? (
                            <div className="flex h-56 flex-col items-center justify-center rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                                <Calendar className="mb-2 h-7 w-7 text-slate-400" />
                                <p className="font-semibold text-slate-900">
                                    Belum ada transaksi di rentang tanggal ini
                                </p>
                                <p className="mt-1 text-slate-500">
                                    Silakan pilih rentang tanggal lain pada
                                    filter di atas
                                </p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto pb-2">
                                <div className="relative min-w-[700px]">
                                    <svg
                                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                        className="h-64 w-full overflow-visible"
                                    >
                                        <defs>
                                            <linearGradient
                                                id={gradientId}
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#16233B"
                                                    stopOpacity="0.25"
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#16233B"
                                                    stopOpacity="0.0"
                                                />
                                            </linearGradient>
                                        </defs>

                                        {/* Y-Axis Horizontal Grid Lines */}
                                        {yTicks.map((t, idx) => (
                                            <g key={idx}>
                                                <line
                                                    x1={paddingLeft}
                                                    y1={t.y}
                                                    x2={svgWidth - paddingRight}
                                                    y2={t.y}
                                                    stroke="#E2E8F0"
                                                    strokeWidth="1"
                                                    strokeDasharray="4 4"
                                                />
                                                <text
                                                    x={paddingLeft - 10}
                                                    y={t.y + 4}
                                                    textAnchor="end"
                                                    className="fill-slate-400 font-mono text-[10px]"
                                                >
                                                    {t.label}
                                                </text>
                                            </g>
                                        ))}

                                        {/* Area Fill */}
                                        {areaString && (
                                            <path
                                                d={areaString}
                                                fill={`url(#${gradientId})`}
                                            />
                                        )}

                                        {/* Main Curve Line (Biru Navy) */}
                                        {pathString && (
                                            <path
                                                d={pathString}
                                                fill="none"
                                                stroke="#16233B"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}

                                        {/* Hover Guide Line */}
                                        {hoveredIndex !== null &&
                                            points[hoveredIndex] && (
                                                <line
                                                    x1={points[hoveredIndex].x}
                                                    y1={paddingTop}
                                                    x2={points[hoveredIndex].x}
                                                    y2={paddingTop + plotHeight}
                                                    stroke="#16233B"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="3 3"
                                                />
                                            )}

                                        {/* Data Dots (Clean White with Navy Stroke) */}
                                        {points.map((pt, idx) => {
                                            const isHovered =
                                                hoveredIndex === idx;
                                            return (
                                                <g key={idx}>
                                                    <circle
                                                        cx={pt.x}
                                                        cy={pt.y}
                                                        r={
                                                            isHovered
                                                                ? 5.5
                                                                : 3.5
                                                        }
                                                        fill={
                                                            isHovered
                                                                ? '#16233B'
                                                                : '#ffffff'
                                                        }
                                                        stroke="#16233B"
                                                        strokeWidth={
                                                            isHovered ? 2.5 : 2
                                                        }
                                                    />
                                                </g>
                                            );
                                        })}

                                        {/* X-Axis Labels */}
                                        {points.map((pt, idx) => {
                                            const count = points.length;
                                            const step =
                                                count > 25
                                                    ? 4
                                                    : count > 14
                                                      ? 2
                                                      : 1;
                                            if (
                                                idx % step !== 0 &&
                                                idx !== count - 1
                                            ) {
                                                return null;
                                            }
                                            return (
                                                <text
                                                    key={idx}
                                                    x={pt.x}
                                                    y={svgHeight - 14}
                                                    textAnchor="middle"
                                                    className="fill-slate-400 font-mono text-[10px]"
                                                >
                                                    {pt.data.label}
                                                </text>
                                            );
                                        })}

                                        {/* Invisible Mouse Target Columns */}
                                        {points.map((pt, idx) => {
                                            const stepWidth =
                                                plotWidth /
                                                Math.max(points.length, 1);
                                            return (
                                                <rect
                                                    key={idx}
                                                    x={pt.x - stepWidth / 2}
                                                    y={paddingTop}
                                                    width={stepWidth}
                                                    height={plotHeight}
                                                    fill="transparent"
                                                    className="cursor-pointer"
                                                    onMouseEnter={() =>
                                                        setHoveredIndex(idx)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredIndex(null)
                                                    }
                                                />
                                            );
                                        })}
                                    </svg>

                                    {/* Tooltip Overlay */}
                                    {hoveredIndex !== null &&
                                        points[hoveredIndex] && (
                                            <div
                                                className="pointer-events-none absolute z-20 rounded-xl border border-slate-700 bg-[#16233B] p-2.5 text-xs text-white shadow-xl transition-all"
                                                style={{
                                                    left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
                                                    top: `${Math.max((points[hoveredIndex].y / svgHeight) * 100 - 35, 5)}%`,
                                                    transform:
                                                        'translateX(-50%)',
                                                }}
                                            >
                                                <div className="font-bold text-slate-200">
                                                    {points[hoveredIndex].data
                                                        .full_label ||
                                                        points[hoveredIndex]
                                                            .data.label}
                                                </div>
                                                <div className="mt-1 flex items-center justify-between gap-4 font-mono text-[11px]">
                                                    <span className="text-slate-300">
                                                        Omset:
                                                    </span>
                                                    <span className="font-bold text-white">
                                                        {formatRp(
                                                            points[hoveredIndex]
                                                                .data.revenue,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
                                                    <span className="text-slate-300">
                                                        Pesanan:
                                                    </span>
                                                    <span className="font-bold text-white">
                                                        {
                                                            points[hoveredIndex]
                                                                .data.orders
                                                        }{' '}
                                                        transaksi
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Dua Kolom Ringkas: Pesanan Terbaru & Ulasan Pembeli */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Kolom Kiri: Pesanan E-Commerce Terbaru */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-7">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-[#16233B]" />
                                <h3 className="text-base font-extrabold text-[#16233B]">
                                    Pesanan E-Commerce Terbaru
                                </h3>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#16233B] transition-colors hover:text-slate-600"
                            >
                                <span>Lihat Semua</span>
                                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                            </Link>
                        </div>

                        <div className="mt-3 divide-y divide-slate-100">
                            {recent_orders.length === 0 ? (
                                <div className="py-8 text-center text-xs text-slate-500">
                                    Belum ada transaksi pesanan e-commerce
                                    masuk.
                                </div>
                            ) : (
                                recent_orders.map((order) => {
                                    const badge = getStageBadge(
                                        order.shipping_status,
                                    );
                                    return (
                                        <div
                                            key={order.id}
                                            className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-[#16233B]">
                                                        {order.order_number}
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.bg}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {order.recipient_name}{' '}
                                                    &bull;{' '}
                                                    <span className="font-semibold text-slate-800">
                                                        {order.total_quantity}{' '}
                                                        item
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                <span className="font-mono text-xs font-bold text-[#16233B]">
                                                    {formatRp(
                                                        order.total_amount,
                                                    )}
                                                </span>
                                                <Link
                                                    href={`/admin/tracking?search=${order.order_number}`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-[#16233B] transition-colors hover:bg-[#16233B] hover:text-white"
                                                >
                                                    <Truck className="h-3 w-3 text-slate-500" />
                                                    <span>Resi</span>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Ulasan Pembeli & Pintasan Modul */}
                    <div className="space-y-6 lg:col-span-5">
                        {/* Ulasan Konsumen */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <h3 className="text-base font-extrabold text-[#16233B]">
                                        Ulasan Pembeli Terbaru
                                    </h3>
                                </div>
                                <span className="text-xs font-semibold text-slate-500">
                                    Terverifikasi
                                </span>
                            </div>

                            <div className="mt-3 space-y-3">
                                {recent_reviews.length === 0 ? (
                                    <div className="py-6 text-center text-xs text-slate-500">
                                        Belum ada ulasan yang ditinggalkan
                                        pembeli.
                                    </div>
                                ) : (
                                    recent_reviews.map((rev) => (
                                        <div
                                            key={rev.id}
                                            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-bold text-[#16233B]">
                                                        {rev.customer_name}
                                                    </span>
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({
                                                        length: rev.rating,
                                                    }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="h-3 w-3 fill-amber-400 text-amber-400"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-1.5 text-xs text-slate-600 italic">
                                                &ldquo;{rev.comment}&rdquo;
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Akses Cepat Modul */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                            <h3 className="border-b border-slate-100 pb-2 text-sm font-extrabold text-[#16233B]">
                                Akses Cepat Modul Backoffice
                            </h3>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <Link
                                    href="/admin/orders"
                                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#16233B] transition-all hover:border-[#16233B] hover:bg-white"
                                >
                                    <ShoppingBag className="h-4 w-4 text-slate-600" />
                                    <span>Semua Pesanan</span>
                                </Link>
                                <Link
                                    href="/admin/tracking"
                                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#16233B] transition-all hover:border-[#16233B] hover:bg-white"
                                >
                                    <Truck className="h-4 w-4 text-slate-600" />
                                    <span>Lacak &amp; Resi</span>
                                </Link>
                                <Link
                                    href="/admin/products"
                                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#16233B] transition-all hover:border-[#16233B] hover:bg-white"
                                >
                                    <Package className="h-4 w-4 text-slate-600" />
                                    <span>Katalog Hampers</span>
                                </Link>
                                <Link
                                    href="/admin/cms-halaman"
                                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#16233B] transition-all hover:border-[#16233B] hover:bg-white"
                                >
                                    <FileText className="h-4 w-4 text-slate-600" />
                                    <span>Konten Website</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
