import { Link } from '@inertiajs/react';
import {
    Building2,
    ChevronRight,
    Gift,
    Inbox,
    MessageSquare,
    Package,
    Plus,
    Sliders,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import type { Inquiry } from '@/types';

interface DashboardProps {
    stats: {
        productsTotal: number;
        productsActive: number;
        categoryCounts: Record<string, number>;
        inquiriesTotal: number;
        inquiriesNew: number;
    };
    recentInquiries: Inquiry[];
    whatsappNumber: string;
}

export default function AdminDashboard({
    stats,
    recentInquiries,
    whatsappNumber: _whatsappNumber,
}: DashboardProps) {
    // Stat cards without rainbow AI boxes - quiet luxury atelier style
    const statCards = [
        {
            label: 'Total Katalog',
            value: stats.productsTotal,
            unit: 'Hampers',
            statusDot: 'bg-emerald-500',
            statusText: `${stats.productsActive} produk aktif di website`,
            icon: Gift,
        },
        {
            label: 'Produk Aktif',
            value: stats.productsActive,
            unit: 'Tayang',
            statusDot: 'bg-emerald-500',
            statusText: 'Ditampilkan ke pengunjung',
            icon: Package,
        },
        {
            label: 'Leads & Inquiry',
            value: stats.inquiriesTotal,
            unit: 'Permintaan',
            statusDot: 'bg-stone-400',
            statusText: 'Total formulir masuk',
            icon: Inbox,
        },
        {
            label: 'Perlu Respon Segera',
            value: stats.inquiriesNew,
            unit: 'Menunggu',
            statusDot: stats.inquiriesNew > 0 ? 'bg-amber-500' : 'bg-stone-300',
            statusText:
                stats.inquiriesNew > 0
                    ? `${stats.inquiriesNew} leads belum dihubungi`
                    : 'Semua leads sudah ditindaklanjuti',
            icon: MessageSquare,
        },
    ];

    const getStatusChip = (status: string | undefined) => {
        switch (status) {
            case 'completed':
                return {
                    label: 'Deal / Selesai',
                    dot: 'bg-emerald-500',
                    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                };
            case 'contacted':
                return {
                    label: 'Dihubungi',
                    dot: 'bg-sky-500',
                    badge: 'bg-sky-50 text-sky-800 border-sky-200',
                };
            case 'cancelled':
                return {
                    label: 'Dibatalkan',
                    dot: 'bg-stone-400',
                    badge: 'bg-stone-100 text-stone-600 border-stone-200',
                };
            default:
                return {
                    label: 'Menunggu',
                    dot: 'bg-amber-500',
                    badge: 'bg-amber-50 text-amber-800 border-amber-200',
                };
        }
    };

    const formatIdr = (val: string | number | null | undefined) => {
        if (!val) return 'Fleksibel';
        if (typeof val === 'number') {
            return `Rp ${val.toLocaleString('id-ID')}`;
        }
        const numeric = Number(val.replace(/[^0-9]/g, ''));
        if (isNaN(numeric) || numeric === 0) return val;
        return `Rp ${numeric.toLocaleString('id-ID')}`;
    };

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
            });
        } catch {
            return dateStr;
        }
    };

    const getWhatsAppUrl = (inquiry: Inquiry) => {
        let cleanNumber = (inquiry.whatsapp_number || '').replace(
            /[^0-9]/g,
            '',
        );
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '62' + cleanNumber.slice(1);
        }
        const greeting = `Halo Kak ${inquiry.name}${inquiry.company_name ? ` dari *${inquiry.company_name}*` : ''}, salam dari GALUH & CO. Hampers. Kami ingin mengonfirmasi permintaan konsultasi hampers Anda.`;
        return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
    };

    const totalCategoryCount = Object.values(stats.categoryCounts).reduce(
        (a, b) => a + b,
        0,
    );

    return (
        <AdminLayout title="Dashboard Studio">
            <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-serif text-base font-bold text-[#1C1A18]">
                            Atelier CMS &amp; Sales Command
                        </h2>
                        <p className="mt-0.5 text-xs text-[#7A746B]">
                            Kelola koleksi hampers eksklusif, pantau permintaan
                            korporat, dan kelola identitas brand.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0E2A1E] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#153e2d]"
                        >
                            <Plus className="size-3.5" />
                            <span>Tambah Hampers</span>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D5CEC2] bg-white px-3.5 py-2 text-xs font-medium text-[#2C2925] shadow-2xs transition-colors hover:border-[#0E2A1E]"
                        >
                            <Sliders className="size-3.5 text-[#9E7E45]" />
                            <span>Pengaturan Situs</span>
                        </Link>
                    </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className="group rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs transition-all hover:border-[#D0C7B7]"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold tracking-wider text-[#827A6E] uppercase">
                                        {card.label}
                                    </span>
                                    <Icon className="size-4 text-[#A8A196] transition-colors group-hover:text-[#0E2A1E]" />
                                </div>

                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="font-sans text-3xl font-bold tracking-tight text-[#1C1A18] tabular-nums">
                                        {card.value}
                                    </span>
                                    <span className="text-xs font-medium text-[#8C8479]">
                                        {card.unit}
                                    </span>
                                </div>

                                <div className="mt-2.5 flex items-center gap-1.5 border-t border-[#F2EDE4] pt-2.5 text-[11px] text-[#6E675D]">
                                    <span
                                        className={`size-1.5 shrink-0 rounded-full ${card.statusDot}`}
                                    />
                                    <span className="truncate">
                                        {card.statusText}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main 2-Column Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Category Breakdown (5 Cols) */}
                    <div className="flex flex-col rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs lg:col-span-5">
                        <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3.5">
                            <div>
                                <h3 className="text-xs font-bold tracking-wider text-[#1C1A18] uppercase">
                                    Distribusi Katalog
                                </h3>
                                <p className="text-[11px] text-[#7A746B]">
                                    Sebaran hampers aktif per kategori
                                </p>
                            </div>
                            <Link
                                href="/admin/products"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E2A1E] hover:underline"
                            >
                                <span>Lihat Semua</span>
                                <ChevronRight className="size-3" />
                            </Link>
                        </div>

                        <div className="mt-4 flex-1 space-y-3.5">
                            {Object.entries(stats.categoryCounts).map(
                                ([cat, count]) => {
                                    const percentage =
                                        totalCategoryCount > 0
                                            ? Math.round(
                                                  (count / totalCategoryCount) *
                                                      100,
                                              )
                                            : 0;

                                    return (
                                        <div key={cat} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-[#2C2925]">
                                                    {cat}
                                                </span>
                                                <span className="font-semibold text-[#1C1A18] tabular-nums">
                                                    {count}{' '}
                                                    <span className="text-[10px] font-normal text-[#8C8479]">
                                                        ({percentage}%)
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0EBE1]">
                                                <div
                                                    className="h-full rounded-full bg-[#0E2A1E] transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>

                        <div className="mt-5 rounded-lg border border-[#EBE3D5] bg-[#FAF8F5] p-3.5 text-center">
                            <p className="text-[11px] text-[#6E675D]">
                                Butuh menambah varian edisi spesial baru?
                            </p>
                            <Link
                                href="/admin/products/create"
                                className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[#0E2A1E] hover:underline"
                            >
                                <Plus className="size-3" />
                                <span>Tambah Hampers Baru Sekarang</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Recent Inquiries (7 Cols) */}
                    <div className="flex flex-col rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs lg:col-span-7">
                        <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3.5">
                            <div>
                                <h3 className="text-xs font-bold tracking-wider text-[#1C1A18] uppercase">
                                    Inquiries &amp; Leads Terbaru
                                </h3>
                                <p className="text-[11px] text-[#7A746B]">
                                    Permintaan konsultasi hampers korporat
                                </p>
                            </div>
                            <Link
                                href="/admin/inquiries"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E2A1E] hover:underline"
                            >
                                <span>
                                    Semua Leads ({stats.inquiriesTotal})
                                </span>
                                <ChevronRight className="size-3" />
                            </Link>
                        </div>

                        {recentInquiries.length === 0 ? (
                            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                                <Inbox className="size-8 stroke-1 text-[#C0B9AD]" />
                                <p className="mt-2 text-xs font-medium text-[#4D4841]">
                                    Belum ada inquiry masuk
                                </p>
                                <p className="text-[11px] text-[#8C8479]">
                                    Form konsultasi di landing page siap
                                    menerima leads klien.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-3 divide-y divide-[#F2EDE4]">
                                {recentInquiries.slice(0, 5).map((inquiry) => {
                                    const chip = getStatusChip(inquiry.status);
                                    return (
                                        <div
                                            key={inquiry.id}
                                            className="flex items-center justify-between gap-3 py-3 text-xs"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate font-semibold text-[#1C1A18]">
                                                        {inquiry.name}
                                                    </span>
                                                    {inquiry.company_name && (
                                                        <span className="inline-flex shrink-0 items-center gap-1 rounded bg-[#F4EFE6] px-1.5 py-0.5 text-[10px] font-medium text-[#0E2A1E]">
                                                            <Building2 className="size-2.5 text-[#9E7E45]" />
                                                            {
                                                                inquiry.company_name
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#7A746B]">
                                                    <span>
                                                        {inquiry.estimated_packages
                                                            ? `${inquiry.estimated_packages} pax`
                                                            : 'Kustom'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatIdr(
                                                            inquiry.budget_per_package,
                                                        )}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatDate(
                                                            inquiry.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${chip.badge}`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${chip.dot}`}
                                                    />
                                                    {chip.label}
                                                </span>

                                                <a
                                                    href={getWhatsAppUrl(
                                                        inquiry,
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Chat via WhatsApp"
                                                    className="inline-flex size-7 items-center justify-center rounded-lg border border-[#D5CEC2] bg-white text-[#25D366] transition-colors hover:border-[#25D366] hover:bg-[#25D366]/5"
                                                >
                                                    <MessageSquare className="size-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
