import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
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
        0,
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
                <Link
                    href="/admin/katalog"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-3.5 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-colors hover:bg-[#A88B54] hover:text-[#16233B]"
                >
                    <Package className="size-3.5 text-[#A88B54]" />
                    <span>Kelola Katalog</span>
                </Link>
            }
        >
            <Head title="Dashboard — Admin Galuh & Co." />

            <div className="space-y-6">
                {/* 1. Standard Admin KPI Metric Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    {/* Card 1: Inquiries */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(22,35,59,0.05)] transition-all duration-300 hover:border-[#A88B54]/50 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.1)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6E675D] uppercase">
                                Inquiries Masuk
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl border border-[#A88B54]/30 bg-[#A88B54]/10 text-[#A88B54]">
                                <FileText className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-bold tracking-tight text-[#16233B]">
                                {catalog_stats.total_inquiries}
                            </span>
                            <span className="text-xs font-medium text-[#6E675D]">
                                Permintaan
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-[#6E675D]">
                            Proposal corporate dari website
                        </p>
                    </div>

                    {/* Card 2: Active Catalog Hampers */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(22,35,59,0.05)] transition-all duration-300 hover:border-[#A88B54]/50 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.1)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6E675D] uppercase">
                                Katalog Hampers Aktif
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl border border-[#16233B]/20 bg-[#16233B]/10 text-[#16233B]">
                                <Package className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-bold tracking-tight text-[#16233B]">
                                {catalog_stats.active_hampers}
                            </span>
                            <span className="text-xs font-medium text-[#6E675D]">
                                Dari {catalog_stats.total_hampers} Paket
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-[#6E675D]">
                            Paket tayang di landing page
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
                                Paling sering ditanyakan di WhatsApp
                            </p>
                        </div>
                    </div>

                    {/* Card 4: WhatsApp Clicks This Week */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(22,35,59,0.05)] transition-all duration-300 hover:border-[#A88B54]/50 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.1)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6E675D] uppercase">
                                Interaksi WA Minggu Ini
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-300/60 bg-emerald-50 text-emerald-700">
                                <MessageSquare className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-serif text-3xl font-bold tracking-tight text-[#16233B]">
                                {kpis.wa_clicks_this_week}
                            </span>
                            <span className="text-xs font-medium text-[#6E675D]">
                                Interaksi
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-[#6E675D]">
                            Klik konsultasi WhatsApp dari web
                        </p>
                    </div>
                </div>

                {/* 2. Middle Row: Lead Source Analytics & Quick Actions */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left: Lead Sources Distribution (2 Cols) */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-[#DFD7C5]/60 pb-4">
                            <div>
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Distribusi Sumber Lead Website
                                </h3>
                                <p className="text-xs text-[#6E675D]">
                                    Bagian halaman yang paling banyak memicu
                                    percakapan WhatsApp
                                </p>
                            </div>
                            <span className="rounded-full border border-[#A88B54]/30 bg-[#FAF6EE] px-3 py-1 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                                Total {totalLeadSourcesCount} Interaksi
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
                                                <span className="text-[#6E675D]">
                                                    {stat.count} leads
                                                </span>
                                                <span className="font-bold text-[#16233B]">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full border border-[#DFD7C5]/50 bg-[#FAF6EE]">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.max(percentage, totalLeadSourcesCount === 0 ? 0 : 4)}%`,
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
                    <div className="flex flex-col justify-between rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs">
                        <div>
                            <div className="border-b border-[#DFD7C5]/60 pb-3">
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Pusat Aksi Cepat
                                </h3>
                                <p className="text-xs text-[#6E675D]">
                                    Pintasan navigasi modul backoffice
                                </p>
                            </div>

                            <div className="mt-4 space-y-2.5">
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
                                                Inquiries &amp; Pesanan
                                            </span>
                                            <span className="text-[11px] text-[#6E675D]">
                                                Kelola pesanan masuk &amp;
                                                status
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

                {/* 3. Bottom Row: Recent Inquiries & Catalog Breakdown */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Inquiries List */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b border-[#DFD7C5]/60 pb-4">
                            <div>
                                <h3 className="font-serif text-base font-bold text-[#16233B]">
                                    Inquiries Website Terbaru
                                </h3>
                                <p className="text-xs text-[#6E675D]">
                                    Permintaan proposal penawaran yang baru
                                    masuk dari website
                                </p>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="text-xs font-bold text-[#A88B54] transition-colors hover:text-[#16233B]"
                            >
                                Lihat Semua →
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-[#DFD7C5]/40">
                            {recent_wa_leads.length === 0 ? (
                                <div className="py-8 text-center text-xs text-[#6E675D]/70">
                                    Belum ada aktivitas konsultasi WhatsApp
                                    terbaru.
                                </div>
                            ) : (
                                recent_wa_leads.map((lead) => {
                                    const badge = getStatusBadge(lead.status);
                                    const phoneNum =
                                        lead.wa_number ||
                                        lead.whatsapp_number ||
                                        '';
                                    const cleanPhone = phoneNum.replace(
                                        /\D/g,
                                        '',
                                    );
                                    const clientName =
                                        lead.client_name || 'Bpk/Ibu';
                                    const directWa =
                                        lead.wa_link ||
                                        (cleanPhone
                                            ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                                  `Halo ${clientName}, terima kasih telah menghubungi Concierge GALUH & CO.`,
                                              )}`
                                            : '#');
                                    const compName =
                                        lead.company_name ||
                                        lead.client_company;
                                    const boxQty =
                                        lead.estimated_packages ||
                                        (lead.quantity_estimate
                                            ? `${lead.quantity_estimate} box`
                                            : null);

                                    return (
                                        <div
                                            key={lead.id}
                                            className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="truncate text-xs font-bold text-[#16233B]">
                                                        {lead.client_name ||
                                                            'Klien Concierge'}
                                                    </h4>
                                                    {compName && (
                                                        <span className="truncate text-xs text-[#6E675D]">
                                                            • {compName}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 truncate text-xs text-[#6E675D]">
                                                    {lead.package_name ??
                                                        'Konsultasi Kustom'}
                                                    {boxQty
                                                        ? ` • ${boxQty}`
                                                        : ''}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <span
                                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.bg}`}
                                                >
                                                    {badge.label}
                                                </span>
                                                <a
                                                    href={directWa}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#DFD7C5] bg-[#FAF8F5] px-2.5 py-1 text-xs font-semibold text-[#16233B] shadow-2xs transition-colors hover:border-[#A88B54] hover:bg-white hover:text-[#A88B54]"
                                                    title="Follow up via WhatsApp"
                                                >
                                                    <Send className="size-3 text-[#A88B54]" />
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
                    <div className="flex flex-col justify-between rounded-2xl border border-[#DFD7C5] bg-white p-6 shadow-xs">
                        <div>
                            <div className="flex items-center justify-between border-b border-[#DFD7C5]/60 pb-4">
                                <div>
                                    <h3 className="font-serif text-base font-bold text-[#16233B]">
                                        Status Katalog &amp; Website
                                    </h3>
                                    <p className="text-xs text-[#6E675D]">
                                        Distribusi kategori hampers dan
                                        integrasi WhatsApp
                                    </p>
                                </div>
                                <Link
                                    href="/admin/katalog"
                                    className="text-xs font-bold text-[#A88B54] transition-colors hover:text-[#16233B]"
                                >
                                    Kelola Katalog →
                                </Link>
                            </div>

                            {/* Category Distribution */}
                            <div className="mt-4 space-y-3">
                                <span className="block text-xs font-bold text-[#16233B]">
                                    Kategori Paket Hampers:
                                </span>
                                {stats?.categoryCounts &&
                                Object.keys(stats.categoryCounts).length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {Object.entries(
                                            stats.categoryCounts,
                                        ).map(([cat, count]) => (
                                            <div
                                                key={cat}
                                                className="flex items-center justify-between rounded-xl border border-[#DFD7C5]/70 bg-[#FAF8F5] px-3 py-2 text-xs"
                                            >
                                                <span className="truncate font-medium text-[#16233B]">
                                                    {cat}
                                                </span>
                                                <span className="rounded-md border border-[#DFD7C5] bg-white px-2 py-0.5 text-[11px] font-bold text-[#16233B]">
                                                    {count} paket
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-2 text-xs text-[#6E675D]">
                                        {catalog_stats.active_hampers} paket
                                        aktif terdaftar di sistem.
                                    </div>
                                )}
                            </div>

                            {/* System Status Banner */}
                            <div className="mt-5 rounded-xl border border-emerald-300/70 bg-emerald-50/70 p-3.5">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                    <span className="text-xs font-bold text-emerald-950">
                                        Concierge WhatsApp Siap Menerima Pesan
                                    </span>
                                </div>
                                <p className="mt-1 text-[11px] leading-relaxed text-emerald-800">
                                    Semua tombol konsultasi di halaman utama
                                    terhubung langsung ke nomor WhatsApp resmi +
                                    {whatsapp_concierge}.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-[#DFD7C5]/60 pt-3 text-xs text-[#6E675D]">
                            <span>Konfigurasi Profil Studio:</span>
                            <Link
                                href="/admin/pengaturan/profil"
                                className="inline-flex items-center gap-1 font-bold text-[#A88B54] hover:text-[#16233B]"
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
