import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Copy,
    Edit3,
    ExternalLink,
    FileText,
    Inbox,
    Mail,
    Phone,
    Search,
    Send,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface Inquiry {
    id: number;
    name: string;
    company_name: string | null;
    email: string;
    whatsapp_number: string;
    estimated_packages: string | number | null;
    budget_per_package: string | number | null;
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
    statusCounts: {
        total: number;
        new: number;
        contacted: number;
        completed: number;
        cancelled: number;
    };
    whatsappNumber: string;
}

const STATUS_CONFIG: Record<
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
        label: 'Deal / Masuk Produksi',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
    },
    cancelled: {
        label: 'Dibatalkan',
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
    },
};

export default function AdminInquiriesIndex({
    inquiries,
    filters,
    statusCounts,
    whatsappNumber,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Edit Notes Modal State
    const [editingNoteInquiry, setEditingNoteInquiry] = useState<Inquiry | null>(null);
    const [noteDraft, setNoteDraft] = useState('');

    // Delete Modal State
    const [deletingInquiry, setDeletingInquiry] = useState<Inquiry | null>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/inquiries',
            { search: search.trim() || undefined, status: statusFilter === 'all' ? undefined : statusFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(
            '/admin/inquiries',
            { search: search.trim() || undefined, status: newStatus === 'all' ? undefined : newStatus },
            { preserveState: true, replace: true }
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
            }
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
            }
        );
    };

    const handleDelete = () => {
        if (!deletingInquiry) return;
        router.delete(`/admin/inquiries/${deletingInquiry.id}`, {
            onSuccess: () => setDeletingInquiry(null),
        });
    };

    const formatIdr = (val: string | number | null) => {
        if (!val) return 'Fleksibel';
        const num = typeof val === 'string' ? parseFloat(val.replace(/\D/g, '')) : val;
        if (isNaN(num) || num === 0) return 'Fleksibel';
        return `Rp ${num.toLocaleString('id-ID')}`;
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

    const getCleanPhone = (phoneStr: string) => {
        let clean = (phoneStr || '').replace(/\D/g, '');
        if (clean.startsWith('0')) {
            clean = '62' + clean.slice(1);
        }
        return clean;
    };

    return (
        <AdminLayout
            title="Inquiries Website"
            subtitle="Daftar permintaan proposal penawaran corporate yang masuk melalui formulir landing page"
            headerAction={
                whatsappNumber ? (
                    <div className="flex items-center gap-2">
                        <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                        >
                            <ExternalLink className="size-3.5" />
                            <span>WhatsApp Web</span>
                        </a>
                    </div>
                ) : null
            }
        >
            <Head title="Inquiries Website — Galuh & Co." />

            <div className="space-y-6">
                {/* 1. Metric Stat Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    {/* Total */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            Total Inquiries
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">
                                {statusCounts.total}
                            </span>
                            <span className="text-xs text-slate-400">Data</span>
                        </div>
                    </div>

                    {/* New */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                            Perlu Follow-Up
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-amber-700">
                                {statusCounts.new}
                            </span>
                            <span className="text-xs text-amber-600/70">Baru</span>
                        </div>
                    </div>

                    {/* Contacted */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="text-[10px] font-bold tracking-wider text-sky-700 uppercase">
                            Sedang Dihubungi
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-sky-800">
                                {statusCounts.contacted}
                            </span>
                            <span className="text-xs text-sky-600/70">Proses</span>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                            Deal / Produksi
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-emerald-800">
                                {statusCounts.completed}
                            </span>
                            <span className="text-xs text-emerald-600/70">Deal</span>
                        </div>
                    </div>

                    {/* Cancelled */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                            Dibatalkan
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-600">
                                {statusCounts.cancelled}
                            </span>
                            <span className="text-xs text-slate-400">Batal</span>
                        </div>
                    </div>
                </div>

                {/* 2. Search & Status Filter Tabs Bar */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                        {/* Search Form */}
                        <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] flex-1 max-w-md">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama klien, instansi, email, atau no. WA..."
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-8 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        router.get(
                                            '/admin/inquiries',
                                            { status: statusFilter === 'all' ? undefined : statusFilter },
                                            { preserveState: true }
                                        );
                                    }}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                >
                                    <X className="size-3" />
                                </button>
                            )}
                        </form>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>Menampilkan {inquiries.total} permintaan</span>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
                        {[
                            { key: 'all', label: 'Semua Inquiries', count: statusCounts.total },
                            { key: 'new', label: 'Menunggu Follow-Up', count: statusCounts.new },
                            { key: 'contacted', label: 'Sedang Dihubungi', count: statusCounts.contacted },
                            { key: 'completed', label: 'Deal / Masuk Produksi', count: statusCounts.completed },
                            { key: 'cancelled', label: 'Dibatalkan', count: statusCounts.cancelled },
                        ].map((tab) => {
                            const active = statusFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleStatusFilterChange(tab.key)}
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                        active
                                            ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                                            active
                                                ? 'bg-emerald-600 text-white font-bold'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Inquiries Master Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                                    <th className="py-3 px-4">Klien &amp; Instansi</th>
                                    <th className="py-3 px-4">Kontak (WhatsApp / Email)</th>
                                    <th className="py-3 px-4">Kebutuhan Hampers</th>
                                    <th className="py-3 px-4">Catatan Klien &amp; Internal</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                                {inquiries.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-14 text-center">
                                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                                                <Inbox className="size-6" />
                                            </div>
                                            <h4 className="text-sm font-semibold text-slate-900">
                                                Tidak Ada Permintaan Ditemukan
                                            </h4>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Coba ubah kata kunci pencarian atau ganti filter status.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    inquiries.data.map((item) => {
                                        const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                                        const cleanPhone = getCleanPhone(item.whatsapp_number);

                                        return (
                                            <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                                                {/* Client Name & Company */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-bold text-xs text-slate-700">
                                                            {item.name ? item.name.charAt(0).toUpperCase() : 'K'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs font-bold text-slate-900">
                                                                {item.name}
                                                            </h4>
                                                            {item.company_name ? (
                                                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 mt-0.5">
                                                                    <Building2 className="size-2.5 text-slate-500" />
                                                                    <span>{item.company_name}</span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                                                    Pesanan Personal
                                                                </span>
                                                            )}
                                                            <span className="block text-[10px] text-slate-400 mt-0.5">
                                                                Tgl: {formatDate(item.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* WhatsApp & Email */}
                                                <td className="py-3.5 px-4">
                                                    <div className="space-y-1">
                                                        <a
                                                            href={`https://wa.me/${cleanPhone}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                                                            title="Buka Chat WhatsApp"
                                                        >
                                                            <Phone className="size-3 text-emerald-600" />
                                                            <span>+{cleanPhone}</span>
                                                        </a>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                                            <Mail className="size-3 text-slate-400 shrink-0" />
                                                            <span className="truncate max-w-[150px]">{item.email}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Requirements */}
                                                <td className="py-3.5 px-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                                                                {item.estimated_packages ? `${item.estimated_packages} Box` : 'Kustom'}
                                                            </span>
                                                            <span className="text-[11px] font-medium text-slate-600">
                                                                {formatIdr(item.budget_per_package)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10.5px] text-slate-500">
                                                            <Calendar className="size-3 text-slate-400" />
                                                            <span>Target: {formatDate(item.needed_at)}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Notes */}
                                                <td className="py-3.5 px-4 max-w-[220px]">
                                                    <div className="space-y-1.5">
                                                        {item.notes ? (
                                                            <p className="line-clamp-2 text-[11px] text-slate-600 italic">
                                                                "{item.notes}"
                                                            </p>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">
                                                                Tanpa catatan khusus
                                                            </span>
                                                        )}
                                                        {item.admin_notes && (
                                                            <div className="rounded border border-amber-200 bg-amber-50 p-1.5 text-[10.5px] text-amber-900">
                                                                <span className="font-semibold block text-[9px] uppercase tracking-wider text-amber-700">
                                                                    Catatan Admin:
                                                                </span>
                                                                <p className="line-clamp-2">{item.admin_notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status Selector */}
                                                <td className="py-3.5 px-4">
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleUpdateStatus(item, e.target.value)}
                                                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold focus:outline-hidden transition-colors ${statusCfg.badge}`}
                                                    >
                                                        <option value="new">Menunggu Follow-Up</option>
                                                        <option value="contacted">Sedang Dihubungi</option>
                                                        <option value="completed">Deal / Masuk Produksi</option>
                                                        <option value="cancelled">Dibatalkan</option>
                                                    </select>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Direct Chat WhatsApp */}
                                                        <a
                                                            href={`https://wa.me/${cleanPhone}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors"
                                                            title="Chat Klien via WhatsApp"
                                                        >
                                                            <Phone className="size-3 text-emerald-600" />
                                                            <span>Chat WA</span>
                                                        </a>

                                                        {/* Edit Notes */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingNoteInquiry(item);
                                                                setNoteDraft(item.admin_notes || '');
                                                            }}
                                                            className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                                            title="Catatan Internal"
                                                        >
                                                            <Edit3 className="size-3.5" />
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeletingInquiry(item)}
                                                            className="rounded-lg p-1 text-rose-600 hover:bg-rose-50"
                                                            title="Hapus Permintaan"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {inquiries.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                            <div>
                                Menampilkan {inquiries.from ?? 0} - {inquiries.to ?? 0} dari {inquiries.total} data
                            </div>
                            <div className="flex items-center gap-1">
                                {inquiries.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-slate-900 text-white font-bold'
                                                : link.url
                                                ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Internal Notes Modal */}
            <AnimatePresence>
                {editingNoteInquiry && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                        onClick={() => setEditingNoteInquiry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Catatan Internal Klien
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        Klien: {editingNoteInquiry.name}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingNoteInquiry(null)}
                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-2 text-xs">
                                <label className="font-semibold text-slate-700">
                                    Catatan Tambahan (Internal Admin)
                                </label>
                                <textarea
                                    rows={4}
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    placeholder="Contoh: Klien minta diskon 10%, butuh faktur pajak, logo format .AI sudah diterima..."
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                                />
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingNoteInquiry(null)}
                                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveNote}
                                    className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                                >
                                    Simpan Catatan
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingInquiry && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                        onClick={() => setDeletingInquiry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm rounded-xl border border-rose-200 bg-white p-6 shadow-xl"
                        >
                            <h4 className="text-sm font-bold text-slate-900">
                                Hapus Permintaan Klien?
                            </h4>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Apakah Anda yakin ingin menghapus permintaan dari{' '}
                                <strong className="text-slate-900">{deletingInquiry.name}</strong>? Tindakan ini
                                tidak dapat dibatalkan.
                            </p>
                            <div className="mt-5 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDeletingInquiry(null)}
                                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
                                >
                                    Hapus Permanen
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
