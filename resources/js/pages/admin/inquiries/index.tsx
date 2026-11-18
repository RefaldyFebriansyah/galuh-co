import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Search,
    Building2,
    Mail,
    Phone,
    Calendar,
    Package,
    Coins,
    MessageSquare,
    ExternalLink,
    Trash2,
    FileEdit,
    X,
} from 'lucide-react';

interface Inquiry {
    id: number;
    name: string;
    company_name: string | null;
    email: string;
    whatsapp_number: string;
    estimated_packages: number | null;
    budget_per_package: number | null;
    needed_at: string | null;
    notes: string | null;
    status: 'new' | 'contacted' | 'completed' | 'cancelled';
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    inquiries: {
        data: Inquiry[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search?: string;
        status?: string;
    };
    whatsappNumber: string;
}

const STATUS_MAP: Record<
    string,
    { label: string; badge: string; dot: string }
> = {
    new: {
        label: 'Menunggu Follow-Up',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
    },
    contacted: {
        label: 'Sedang Dihubungi',
        badge: 'bg-sky-50 text-sky-800 border-sky-200',
        dot: 'bg-sky-500',
    },
    completed: {
        label: 'Deal / Selesai',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
    },
    cancelled: {
        label: 'Dibatalkan',
        badge: 'bg-stone-100 text-stone-600 border-stone-200',
        dot: 'bg-stone-400',
    },
};

export default function AdminInquiriesIndex({ inquiries, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [editingNoteInquiry, setEditingNoteInquiry] =
        useState<Inquiry | null>(null);
    const [noteDraft, setNoteDraft] = useState('');
    const [deletingInquiry, setDeletingInquiry] = useState<Inquiry | null>(
        null,
    );

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/inquiries',
            { search, status: statusFilter },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(
            '/admin/inquiries',
            { search, status: newStatus },
            { preserveState: true, replace: true },
        );
    };

    const handleUpdateStatus = (inquiry: Inquiry, newStatus: string) => {
        router.patch(
            `/admin/inquiries/${inquiry.id}/status`,
            {
                status: newStatus,
                admin_notes: inquiry.admin_notes,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleSaveNote = () => {
        if (!editingNoteInquiry) return;

        router.patch(
            `/admin/inquiries/${editingNoteInquiry.id}/status`,
            {
                status: editingNoteInquiry.status,
                admin_notes: noteDraft,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingNoteInquiry(null);
                    setNoteDraft('');
                },
            },
        );
    };

    const handleDelete = () => {
        if (!deletingInquiry) return;
        router.delete(`/admin/inquiries/${deletingInquiry.id}`, {
            onSuccess: () => setDeletingInquiry(null),
        });
    };

    const formatIdr = (val: number | null) => {
        if (!val) return 'Fleksibel';
        return `Rp ${val.toLocaleString('id-ID')}`;
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const getWhatsAppChatUrl = (inquiry: Inquiry) => {
        let cleanNumber = (inquiry.whatsapp_number || '').replace(
            /[^0-9]/g,
            '',
        );
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '62' + cleanNumber.slice(1);
        }
        const greeting = `Halo Kak ${inquiry.name}${inquiry.company_name ? ` dari *${inquiry.company_name}*` : ''}, salam hangat dari GALUH & CO. Hampers.\n\nKami telah menerima permintaan konsultasi hampers Anda:\n• Estimasi Jumlah: ${inquiry.estimated_packages ? `${inquiry.estimated_packages} pax` : 'Sesuai kebutuhan'}\n• Budget per Paket: ${formatIdr(inquiry.budget_per_package)}\n• Tanggal Dibutuhkan: ${formatDate(inquiry.needed_at)}\n\nApakah kami dapat mengirimkan katalog PDF resmi dan mendiskusikan opsi kustomisasi pita atau kartu logo perusahaan? Terima kasih.`;
        return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
    };

    return (
        <AdminLayout
            title="Kelola Inquiries & Leads Klien"
            subtitle="Pantau permintaan hampers korporat dan tindaklanjuti via WhatsApp"
        >
            <Head title="Inquiries & Leads — Galuh & Co. CMS Studio" />

            <div className="space-y-4">
                {/* Search & Status Filter Bar */}
                <div className="flex flex-col gap-3 rounded-xl border border-[#E7E2D8] bg-white p-3.5 shadow-2xs md:flex-row md:items-center md:justify-between">
                    {/* Search Field */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative max-w-md flex-1"
                    >
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8C8479]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama, perusahaan, nomor WA, atau email..."
                            className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] py-2 pr-8 pl-9 text-xs text-[#1C1A18] placeholder:text-[#8C8479] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(
                                        '/admin/inquiries',
                                        { search: '', status: statusFilter },
                                        { preserveState: true, replace: true },
                                    );
                                }}
                                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                            >
                                <X className="size-3" />
                            </button>
                        )}
                    </form>

                    {/* Filter Segmented Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                        <span className="mr-1 shrink-0 text-[10px] font-semibold tracking-wider text-[#8C8479] uppercase">
                            Status:
                        </span>
                        {[
                            { key: 'all', label: 'Semua' },
                            { key: 'new', label: 'Menunggu' },
                            { key: 'contacted', label: 'Dihubungi' },
                            { key: 'completed', label: 'Deal' },
                            { key: 'cancelled', label: 'Batal' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                    handleStatusFilterChange(tab.key)
                                }
                                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                                    statusFilter === tab.key
                                        ? 'bg-[#0E2A1E] font-semibold text-white'
                                        : 'bg-[#FAF8F5] text-[#4D4841] hover:bg-[#F0EBE1]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Inquiry Cards Stream */}
                {inquiries.data.length === 0 ? (
                    <div className="rounded-xl border border-[#E7E2D8] bg-white p-12 text-center shadow-2xs">
                        <MessageSquare className="mx-auto size-8 stroke-1 text-[#C0B9AD]" />
                        <h3 className="mt-2 text-xs font-bold text-[#1C1A18]">
                            Tidak ada inquiries ditemukan
                        </h3>
                        <p className="mt-1 text-[11px] text-[#7A746B]">
                            Belum ada formulir inquiry yang cocok dengan filter
                            yang dipilih.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3.5">
                        {inquiries.data.map((item) => {
                            const statusInfo =
                                STATUS_MAP[item.status] || STATUS_MAP.new;

                            return (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-[#E7E2D8] bg-white p-4 shadow-2xs transition-all hover:border-[#D0C7B7] sm:p-5"
                                >
                                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                                        {/* Left Side: Client Data & Requirements */}
                                        <div className="min-w-0 flex-1 space-y-3">
                                            {/* Header Row: Name, Company, Status, Timestamp */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-sm font-bold text-[#1C1A18]">
                                                    {item.name}
                                                </h3>

                                                {item.company_name && (
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-[#E0D8CB] bg-[#FAF8F5] px-2 py-0.5 text-[11px] font-medium text-[#0E2A1E]">
                                                        <Building2 className="size-3 text-[#9E7E45]" />
                                                        {item.company_name}
                                                    </span>
                                                )}

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium ${statusInfo.badge}`}
                                                >
                                                    <span
                                                        className={`size-1.5 rounded-full ${statusInfo.dot}`}
                                                    />
                                                    {statusInfo.label}
                                                </span>

                                                <span className="ml-auto font-mono text-[11px] text-[#8C8479] lg:ml-0">
                                                    {formatDate(
                                                        item.created_at,
                                                    )}
                                                </span>
                                            </div>

                                            {/* Contact Details */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4D4841]">
                                                <a
                                                    href={`mailto:${item.email}`}
                                                    className="flex items-center gap-1.5 transition-colors hover:text-[#0E2A1E]"
                                                >
                                                    <Mail className="size-3 text-[#8C8479]" />
                                                    <span>{item.email}</span>
                                                </a>
                                                <a
                                                    href={`tel:${item.whatsapp_number}`}
                                                    className="flex items-center gap-1.5 font-mono transition-colors hover:text-[#0E2A1E]"
                                                >
                                                    <Phone className="size-3 text-[#8C8479]" />
                                                    <span>
                                                        {item.whatsapp_number}
                                                    </span>
                                                </a>
                                            </div>

                                            {/* Inquiry Specification Grid */}
                                            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#EAE5DC] bg-[#FAF8F5] p-2.5 text-xs sm:grid-cols-3">
                                                <div>
                                                    <span className="block text-[10px] font-semibold text-[#8C8479] uppercase">
                                                        Estimasi Jumlah
                                                    </span>
                                                    <span className="mt-0.5 flex items-center gap-1 font-semibold text-[#1C1A18]">
                                                        <Package className="size-3 text-[#0E2A1E]" />
                                                        {item.estimated_packages
                                                            ? `${item.estimated_packages} Paket`
                                                            : 'Konsultasi'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-semibold text-[#8C8479] uppercase">
                                                        Budget per Paket
                                                    </span>
                                                    <span className="mt-0.5 flex items-center gap-1 font-semibold text-[#1C1A18] tabular-nums">
                                                        <Coins className="size-3 text-[#9E7E45]" />
                                                        {formatIdr(
                                                            item.budget_per_package,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <span className="block text-[10px] font-semibold text-[#8C8479] uppercase">
                                                        Target Pengiriman
                                                    </span>
                                                    <span className="mt-0.5 flex items-center gap-1 font-semibold text-[#1C1A18]">
                                                        <Calendar className="size-3 text-[#0E2A1E]" />
                                                        {formatDate(
                                                            item.needed_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Client Message */}
                                            {item.notes && (
                                                <div className="rounded-r-lg border-l-2 border-[#C5A880] bg-[#FAF8F5]/80 py-1 pl-3 text-xs text-[#2C2925]">
                                                    <span className="mb-0.5 block text-[10px] font-bold text-[#8C8479] uppercase">
                                                        Pesan Klien:
                                                    </span>
                                                    <p className="leading-relaxed whitespace-pre-line">
                                                        {item.notes}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Internal Admin Follow-up Note */}
                                            {item.admin_notes && (
                                                <div className="rounded-lg border border-[#E8DEC8] bg-[#FFFDF9] p-2.5 text-xs text-[#4D4841]">
                                                    <div className="mb-1 flex items-center justify-between font-semibold">
                                                        <span className="flex items-center gap-1 text-[11px] text-[#876822]">
                                                            <FileEdit className="size-3" />
                                                            Catatan Internal
                                                            Admin
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingNoteInquiry(
                                                                    item,
                                                                );
                                                                setNoteDraft(
                                                                    item.admin_notes ||
                                                                        '',
                                                                );
                                                            }}
                                                            className="text-[10px] text-[#876822] underline hover:text-[#523e12]"
                                                        >
                                                            Ubah Catatan
                                                        </button>
                                                    </div>
                                                    <p className="text-[11px] leading-relaxed whitespace-pre-line">
                                                        {item.admin_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side: Operational Action Group */}
                                        <div className="flex shrink-0 flex-col gap-2 border-t border-[#F0EBE1] pt-3 lg:w-56 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
                                            {/* 1-Click WhatsApp Button */}
                                            <a
                                                href={getWhatsAppChatUrl(item)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#20ba5a]"
                                            >
                                                <MessageSquare className="size-3.5 fill-white" />
                                                <span>Chat WhatsApp</span>
                                                <ExternalLink className="size-3 opacity-70" />
                                            </a>

                                            {/* Status Selector Dropdown */}
                                            <div>
                                                <label className="mb-1 block text-[10px] font-semibold tracking-wider text-[#8C8479] uppercase">
                                                    Status Respon
                                                </label>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) =>
                                                        handleUpdateStatus(
                                                            item,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#1C1A18] focus:border-[#0E2A1E] focus:outline-hidden"
                                                >
                                                    <option value="new">
                                                        Menunggu Follow-Up
                                                    </option>
                                                    <option value="contacted">
                                                        Sedang Dihubungi
                                                    </option>
                                                    <option value="completed">
                                                        Deal / Selesai
                                                    </option>
                                                    <option value="cancelled">
                                                        Dibatalkan
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Add/Edit Note Button */}
                                            {!item.admin_notes && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingNoteInquiry(
                                                            item,
                                                        );
                                                        setNoteDraft('');
                                                    }}
                                                    className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-[#E0D8CB] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#4D4841] transition-colors hover:bg-[#F0EBE1]"
                                                >
                                                    <FileEdit className="size-3 text-[#7A746B]" />
                                                    <span>Tambah Catatan</span>
                                                </button>
                                            )}

                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeletingInquiry(item)
                                                }
                                                className="inline-flex w-full items-center justify-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="size-3" />
                                                <span>Hapus Inquiry</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {inquiries.links.length > 3 && (
                    <div className="flex items-center justify-between rounded-xl border border-[#E7E2D8] bg-white px-4 py-3 text-xs shadow-2xs">
                        <div className="text-[#7A746B]">
                            Menampilkan{' '}
                            <span className="font-semibold text-[#1C1A18]">
                                {inquiries.from || 0}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold text-[#1C1A18]">
                                {inquiries.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-[#1C1A18]">
                                {inquiries.total}
                            </span>{' '}
                            inquiries
                        </div>
                        <div className="flex items-center gap-1">
                            {inquiries.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-[#0E2A1E] font-semibold text-white'
                                            : link.url
                                              ? 'border border-[#D5CEC2] bg-white text-[#2C2925] hover:border-[#0E2A1E]'
                                              : 'pointer-events-none text-stone-300'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal: Edit Admin Internal Note */}
            {editingNoteInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-3 rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2.5">
                            <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#1C1A18] uppercase">
                                <FileEdit className="size-3.5 text-[#9E7E45]" />
                                <span>Catatan Internal Follow-Up</span>
                            </h4>
                            <button
                                type="button"
                                onClick={() => setEditingNoteInquiry(null)}
                                className="text-stone-400 hover:text-stone-600"
                            >
                                <X className="size-3.5" />
                            </button>
                        </div>

                        <div>
                            <p className="mb-2 text-[11px] text-[#7A746B]">
                                Catat progres tindak lanjut untuk{' '}
                                <strong className="text-[#1C1A18]">
                                    {editingNoteInquiry.name}
                                </strong>
                                {editingNoteInquiry.company_name
                                    ? ` (${editingNoteInquiry.company_name})`
                                    : ''}
                                :
                            </p>
                            <textarea
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                rows={4}
                                placeholder="Contoh: Sudah dikirim katalog PDF via WhatsApp. Menunggu approval anggaran direksi..."
                                className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setEditingNoteInquiry(null)}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#4D4841] hover:bg-stone-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className="rounded-lg bg-[#0E2A1E] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#153e2d]"
                            >
                                Simpan Catatan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Confirm Delete */}
            {deletingInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-sm space-y-3 rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xl">
                        <h4 className="text-sm font-bold text-[#1C1A18]">
                            Hapus Inquiry Klien?
                        </h4>
                        <p className="text-xs text-[#7A746B]">
                            Apakah Anda yakin ingin menghapus inquiry dari{' '}
                            <strong className="text-[#1C1A18]">
                                {deletingInquiry.name}
                            </strong>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingInquiry(null)}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#4D4841] hover:bg-stone-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
