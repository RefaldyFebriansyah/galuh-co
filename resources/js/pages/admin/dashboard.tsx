import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    Gift,
    MessageSquare,
    Package,
    Palette,
    Plus,
    Send,
    Settings,
    Sparkles,
    TrendingUp,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface LeadSourceStat {
    source: string;
    key: string;
    count: number;
    color: string;
}

interface WaLeadItem {
    id: number;
    client_name: string;
    client_company?: string | null;
    company_name?: string | null;
    whatsapp_number?: string | null;
    wa_number?: string | null;
    source: string;
    package_name?: string | null;
    quantity_estimate?: number | null;
    estimated_packages?: string | null;
    status: string;
    status_label?: string;
    notes?: string | null;
    created_at: string;
    wa_link?: string;
}

interface DashboardProps {
    kpis: {
        wa_clicks_this_week: number;
        active_b2b_negotiations: number;
        most_popular_package: string;
        nearest_delivery?: unknown;
    };
    lead_source_stats: LeadSourceStat[];
    recent_wa_leads: WaLeadItem[];
    catalog_stats: {
        total_hampers: number;
        active_hampers: number;
        total_inquiries: number;
        deal_orders_count: number;
    };
    whatsapp_concierge: string;
    stats?: {
        productsTotal: number;
        productsActive: number;
        categoryCounts: Record<string, number>;
        inquiriesTotal: number;
        inquiriesNew: number;
    };
}

export default function AdminDashboard({
    kpis,
    lead_source_stats,
    recent_wa_leads,
    catalog_stats,
    whatsapp_concierge,
    stats,
}: DashboardProps) {
    const totalLeadSourcesCount = lead_source_stats.reduce(
        (acc, curr) => acc + curr.count,
        0
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'deal':
            case 'deal_produksi':
                return {
                    label: 'Deal / Selesai',
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                };
            case 'negosiasi_custom':
                return {
                    label: 'Negosiasi',
                    bg: 'bg-purple-50 text-purple-700 border-purple-200',
                };
            case 'kirim_katalog':
                return {
                    label: 'Kirim Katalog',
                    bg: 'bg-sky-50 text-sky-700 border-sky-200',
                };
            case 'batal':
                return {
                    label: 'Batal',
                    bg: 'bg-slate-100 text-slate-600 border-slate-200',
                };
            default:
                return {
                    label: 'Chat Baru',
                    bg: 'bg-amber-50 text-amber-800 border-amber-200',
                };
        }
    };

    return (
        <AdminLayout
            title="Dashboard Operasional"
            subtitle="Ringkasan katalog hampers, inquiries masuk, dan performa interaksi website"
            headerAction={
                <div className="flex items-center gap-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                    >
                        <ExternalLink className="size-3.5 text-slate-500" />
                        <span>Lihat Website</span>
                    </a>
                    <Link
                        href="/admin/katalog"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                        <Package className="size-3.5" />
                        <span>Kelola Katalog</span>
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard — Admin Galuh & Co." />

            <div className="space-y-6">
                {/* 1. Standard Admin KPI Metric Cards (Grid 4 Cols) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Inquiries */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Inquiries Masuk
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <FileText className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-slate-900">
                                {catalog_stats.total_inquiries}
                            </span>
                            <span className="text-xs text-slate-500">
                                Permintaan
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Proposal corporate dari website
                        </p>
                    </div>

                    {/* Card 2: Active Catalog Hampers */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Katalog Hampers Aktif
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <Package className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-slate-900">
                                {catalog_stats.active_hampers}
                            </span>
                            <span className="text-xs text-slate-500">
                                Dari {catalog_stats.total_hampers} Paket
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Paket tayang di landing page
                        </p>
                    </div>

                    {/* Card 3: Most Popular Package */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Paket Paling Diminati
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                <Sparkles className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                                {kpis.most_popular_package}
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                Paling sering ditanyakan di WhatsApp
                            </p>
                        </div>
                    </div>

                    {/* Card 4: WhatsApp Clicks This Week */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Interaksi WA Minggu Ini
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                <MessageSquare className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-slate-900">
                                {kpis.wa_clicks_this_week}
                            </span>
                            <span className="text-xs text-slate-500">
                                Interaksi
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Klik konsultasi WhatsApp dari web
                        </p>
                    </div>
                </div>

                {/* 2. Middle Row: Lead Source Analytics & Quick Actions */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: Lead Sources Distribution (2 Cols) */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Distribusi Sumber Lead Website
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Bagian halaman yang paling banyak memicu percakapan WhatsApp
                                </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                Total {totalLeadSourcesCount} Interaksi
                            </span>
                        </div>

                        <div className="mt-5 space-y-4">
                            {lead_source_stats.map((stat) => {
                                const percentage =
                                    totalLeadSourcesCount > 0
                                        ? Math.round((stat.count / totalLeadSourcesCount) * 100)
                                        : 0;

                                return (
                                    <div key={stat.key} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-slate-700">
                                                {stat.source}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">
                                                    {stat.count} leads
                                                </span>
                                                <span className="font-bold text-slate-900">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.max(percentage, 4)}%`,
                                                    backgroundColor: stat.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Quick Action Hub (1 Col) */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900">
                                    Pusat Aksi Cepat
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Pintasan navigasi modul backoffice
                                </p>
                            </div>

                            <div className="mt-4 space-y-2">
                                <Link
                                    href="/admin/inquiries"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 hover:text-emerald-900 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                                            <FileText className="size-3.5" />
                                        </div>
                                        <div>
                                            <span className="font-semibold block">Inquiries Website</span>
                                            <span className="text-[11px] text-slate-500">Proposal corporate masuk</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-3.5 text-slate-400" />
                                </Link>

                                <Link
                                    href="/admin/katalog"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 hover:text-emerald-900 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                            <Package className="size-3.5" />
                                        </div>
                                        <div>
                                            <span className="font-semibold block">Katalog Hampers</span>
                                            <span className="text-[11px] text-slate-500">Kelola paket &amp; foto</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-3.5 text-slate-400" />
                                </Link>

                                <Link
                                    href="/admin/pengaturan"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 hover:text-emerald-900 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                                            <Settings className="size-3.5" />
                                        </div>
                                        <div>
                                            <span className="font-semibold block">Pengaturan Sistem</span>
                                            <span className="text-[11px] text-slate-500">Nomor WA &amp; akun staf</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-3.5 text-slate-400" />
                                </Link>

                                <Link
                                    href="/admin/cms-halaman"
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 hover:text-emerald-900 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-md bg-purple-100 text-purple-700">
                                            <Palette className="size-3.5" />
                                        </div>
                                        <div>
                                            <span className="font-semibold block">Konten Website</span>
                                            <span className="text-[11px] text-slate-500">Banner, testimoni &amp; FAQ</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="size-3.5 text-slate-400" />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>WhatsApp Resmi:</span>
                            <span className="font-mono font-semibold text-slate-800">
                                +{whatsapp_concierge}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Row: Recent Inquiries & Catalog Breakdown */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Inquiries List */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Inquiries Website Terbaru
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Permintaan proposal penawaran yang baru masuk dari website
                                </p>
                            </div>
                            <Link
                                href="/admin/inquiries"
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Lihat Semua →
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100">
                            {recent_wa_leads.length === 0 ? (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    Belum ada aktivitas konsultasi WhatsApp terbaru.
                                </div>
                            ) : (
                                recent_wa_leads.map((lead) => {
                                    const badge = getStatusBadge(lead.status);
                                    const phoneNum = lead.wa_number || lead.whatsapp_number || '';
                                    const cleanPhone = phoneNum.replace(/\D/g, '');
                                    const clientName = lead.client_name || 'Bpk/Ibu';
                                    const directWa =
                                        lead.wa_link ||
                                        (cleanPhone
                                            ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                                `Halo ${clientName}, terima kasih telah menghubungi Concierge GALUH & CO.`
                                            )}`
                                            : '#');
                                    const compName = lead.company_name || lead.client_company;
                                    const boxQty =
                                        lead.estimated_packages ||
                                        (lead.quantity_estimate ? `${lead.quantity_estimate} box` : null);

                                    return (
                                        <div
                                            key={lead.id}
                                            className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="truncate text-xs font-bold text-slate-900">
                                                        {lead.client_name || 'Klien Concierge'}
                                                    </h4>
                                                    {compName && (
                                                        <span className="truncate text-xs text-slate-400">
                                                            • {compName}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                    {lead.package_name ?? 'Konsultasi Kustom'}
                                                    {boxQty ? ` • ${boxQty}` : ''}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <span
                                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.bg}`}
                                                >
                                                    {badge.label}
                                                </span>
                                                <a
                                                    href={directWa}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors"
                                                    title="Follow up via WhatsApp"
                                                >
                                                    <Send className="size-3 text-emerald-600" />
                                                    <span>Follow Up</span>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Catalog & System Overview */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Status Katalog &amp; Website
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Distribusi kategori hampers dan integrasi WhatsApp
                                    </p>
                                </div>
                                <Link
                                    href="/admin/katalog"
                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                                >
                                    Kelola Katalog →
                                </Link>
                            </div>

                            {/* Category Distribution */}
                            <div className="mt-4 space-y-3">
                                <span className="text-xs font-semibold text-slate-700 block">
                                    Kategori Paket Hampers:
                                </span>
                                {stats?.categoryCounts && Object.keys(stats.categoryCounts).length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {Object.entries(stats.categoryCounts).map(([cat, count]) => (
                                            <div
                                                key={cat}
                                                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                                            >
                                                <span className="font-medium text-slate-700 truncate">
                                                    {cat}
                                                </span>
                                                <span className="font-bold text-slate-900 bg-white border border-slate-200 rounded-md px-2 py-0.5 text-[11px]">
                                                    {count} paket
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-400 py-2">
                                        {catalog_stats.active_hampers} paket aktif terdaftar di sistem.
                                    </div>
                                )}
                            </div>

                            {/* System Status Banner */}
                            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3.5">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                    <span className="text-xs font-bold text-emerald-900">
                                        Concierge WhatsApp Siap Menerima Pesan
                                    </span>
                                </div>
                                <p className="mt-1 text-[11px] text-emerald-700 leading-relaxed">
                                    Semua tombol konsultasi di halaman utama terhubung langsung ke nomor WhatsApp resmi +{whatsapp_concierge}.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Konfigurasi Concierge:</span>
                            <Link
                                href="/admin/pengaturan"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                            >
                                <Settings className="size-3.5" />
                                <span>Buka Pengaturan</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
