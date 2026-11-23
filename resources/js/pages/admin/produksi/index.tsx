import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Boxes,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Flame,
    Kanban,
    PenTool,
    Plus,
    Search,
    ShieldAlert,
    Sparkles,
    Trash2,
    Truck,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

type StageKey =
    | 'persiapan_bahan'
    | 'cetak_grafir'
    | 'perakitan_wax'
    | 'siap_kirim';

interface ProductionOrderItem {
    id: number;
    order_code: string;
    client_name: string;
    company_name?: string | null;
    package_name: string;
    quantity: number;
    stage: StageKey;
    priority: 'normal' | 'high' | 'urgent';
    target_delivery_date: string;
    greeting_card_text?: string | null;
    engraving_names?: string[] | null;
    is_card_printed: boolean;
    is_engraved: boolean;
    notes?: string | null;
}

interface StageColumn {
    title: string;
    description: string;
    orders: ProductionOrderItem[];
}

interface ProduksiProps {
    stages: Record<StageKey, StageColumn>;
    summary: {
        total_orders: number;
        total_boxes: number;
        urgent_count: number;
        ready_count: number;
    };
    filters: {
        priority?: string;
        search?: string;
    };
}

export default function AdminProduksiIndex({
    stages,
    summary,
    filters,
}: ProduksiProps) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedPriority, setSelectedPriority] = useState(
        filters.priority || '',
    );
    const [modalOpen, setModalOpen] = useState(false);

    const form = useForm({
        client_name: '',
        company_name: '',
        package_name: 'Seri Emerald Royal Nusantara',
        quantity: 50,
        greeting_card_text: '',
        engraving_names: [] as string[],
        target_delivery_date: new Date(Date.now() + 7 * 86400000)
            .toISOString()
            .split('T')[0],
        stage: 'persiapan_bahan' as StageKey,
        priority: 'normal' as 'normal' | 'high' | 'urgent',
        notes: '',
    });

    const stageOrder: StageKey[] = [
        'persiapan_bahan',
        'cetak_grafir',
        'perakitan_wax',
        'siap_kirim',
    ];

    const moveStage = (
        order: ProductionOrderItem,
        direction: 'prev' | 'next',
    ) => {
        const currentIdx = stageOrder.indexOf(order.stage);
        const nextIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
        if (nextIdx >= 0 && nextIdx < stageOrder.length) {
            const nextStage = stageOrder[nextIdx];
            router.patch(
                `/admin/produksi/${order.id}/update-stage`,
                { stage: nextStage },
                { preserveScroll: true },
            );
        }
    };

    const handleFilterApply = () => {
        router.get(
            '/admin/produksi',
            {
                search: searchVal || undefined,
                priority: selectedPriority || undefined,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (order: ProductionOrderItem) => {
        if (confirm(`Hapus pesanan produksi #${order.order_code}?`)) {
            router.delete(`/admin/produksi/${order.id}`, {
                preserveScroll: true,
            });
        }
    };

    const submitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/produksi', {
            onSuccess: () => setModalOpen(false),
        });
    };

    const getPriorityBadge = (priority: ProductionOrderItem['priority']) => {
        switch (priority) {
            case 'urgent':
                return {
                    label: 'Urgent',
                    bg: 'bg-rose-50 text-rose-700 border-rose-200',
                    icon: Flame,
                };
            case 'high':
                return {
                    label: 'Prioritas Tinggi',
                    bg: 'bg-amber-50 text-amber-800 border-amber-200',
                    icon: AlertTriangle,
                };
            default:
                return {
                    label: 'Normal',
                    bg: 'bg-stone-50 text-stone-600 border-stone-200',
                    icon: Clock,
                };
        }
    };

    return (
        <AdminLayout
            title="Papan Antrean Perakitan Studio"
            subtitle="Alur Kerja 4 Tahap Studio: Bahan → Kartu & Grafir → Wax Seal → Siap Kirim"
            headerAction={
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E]"
                >
                    <Plus className="size-3.5 text-[#B89352]" />
                    <span>Buat Pesanan Produksi</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Studio Operational Summary Strip */}
                <div className="grid grid-cols-2 divide-y divide-[#0B291E]/10 overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#B89352] uppercase">
                            TOTAL ANTREAN
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-[#0B291E]">
                                {summary.total_orders}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Batch Pesanan
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#B89352] uppercase">
                            TOTAL VOLUME
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-[#0B291E]">
                                {summary.total_boxes}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Kotak Hadiah
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-rose-700 uppercase">
                            PERLU ATENSI / URGENT
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-rose-700">
                                {summary.urgent_count}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Mendekati Deadline
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-emerald-800 uppercase">
                            SIAP KIRIM (SELESAI QC)
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-emerald-800">
                                {summary.ready_count}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Menunggu Kurir
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Filter Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[#0B291E]/10 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-3">
                        <div className="relative min-w-[260px] flex-1">
                            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#0B291E]/40" />
                            <input
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleFilterApply()
                                }
                                placeholder="Cari kode pesanan, nama klien, paket..."
                                className="w-full rounded-lg border border-[#0B291E]/15 bg-[#F7F5F0] py-1.5 pr-3 pl-8 text-xs text-[#0B291E] placeholder-[#0B291E]/40 focus:outline-hidden"
                            />
                        </div>

                        <select
                            value={selectedPriority}
                            onChange={(e) =>
                                setSelectedPriority(e.target.value)
                            }
                            className="rounded-lg border border-[#0B291E]/15 bg-white py-1.5 pr-7 pl-3 text-xs text-[#0B291E] focus:outline-hidden"
                        >
                            <option value="">Semua Prioritas</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">Prioritas Tinggi</option>
                            <option value="normal">Normal</option>
                        </select>

                        <button
                            type="button"
                            onClick={handleFilterApply}
                            className="rounded-lg bg-[#0B291E]/10 px-3.5 py-1.5 text-xs font-semibold text-[#0B291E] hover:bg-[#0B291E] hover:text-white"
                        >
                            Terapkan
                        </button>
                    </div>
                </div>

                {/* 3. 4-Stage Studio Assembly Kanban Columns */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {stageOrder.map((stageKey, colIdx) => {
                        const col = stages[stageKey];
                        const orders = col.orders;

                        return (
                            <div
                                key={stageKey}
                                className="flex flex-col rounded-2xl border border-[#0B291E]/10 bg-[#FAF8F5] p-3.5 shadow-2xs"
                            >
                                {/* Column Header */}
                                <div className="border-b border-[#0B291E]/10 px-1 pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-5 items-center justify-center rounded-full bg-[#0B291E] font-mono text-[10px] font-bold text-white">
                                                {colIdx + 1}
                                            </span>
                                            <h3 className="text-xs font-bold text-[#0B291E]">
                                                {col.title}
                                            </h3>
                                        </div>
                                        <span className="rounded-full border border-[#0B291E]/10 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-[#B89352]">
                                            {orders.length}
                                        </span>
                                    </div>
                                    <p className="mt-1 line-clamp-1 text-[10.5px] text-[#0B291E]/50">
                                        {col.description}
                                    </p>
                                </div>

                                {/* Order Cards List */}
                                <div className="mt-3 max-h-[70vh] flex-1 scrollbar-none space-y-3 overflow-y-auto pr-0.5">
                                    {orders.length === 0 ? (
                                        <div className="rounded-xl border-2 border-dashed border-[#0B291E]/10 py-12 text-center text-xs text-[#0B291E]/40">
                                            Tidak ada antrean
                                        </div>
                                    ) : (
                                        orders.map((order) => {
                                            const pBadge = getPriorityBadge(
                                                order.priority,
                                            );
                                            const isFirstStage = colIdx === 0;
                                            const isLastStage =
                                                colIdx ===
                                                stageOrder.length - 1;

                                            return (
                                                <div
                                                    key={order.id}
                                                    className="group relative rounded-xl border border-[#0B291E]/10 bg-white p-4 shadow-2xs transition-all hover:border-[#B89352]/40 hover:shadow-xs"
                                                >
                                                    {/* Top Card Row */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono text-[10.5px] font-bold text-[#B89352]">
                                                            {order.order_code}
                                                        </span>
                                                        <span
                                                            className={`rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-semibold ${pBadge.bg}`}
                                                        >
                                                            {pBadge.label}
                                                        </span>
                                                    </div>

                                                    {/* Client & Company */}
                                                    <div className="mt-2">
                                                        <h4 className="text-sm font-semibold text-[#0B291E]">
                                                            {order.client_name}
                                                        </h4>
                                                        {order.company_name && (
                                                            <p className="truncate text-[11px] text-[#0B291E]/60">
                                                                {
                                                                    order.company_name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Package & Quantity */}
                                                    <div className="mt-2.5 rounded-lg border border-[#0B291E]/5 bg-[#FAF8F5] p-2 text-[11px]">
                                                        <div className="font-medium text-[#0B291E]">
                                                            {order.package_name}
                                                        </div>
                                                        <div className="mt-0.5 flex items-center justify-between font-mono text-[10.5px] text-[#B89352]">
                                                            <span>Volume:</span>
                                                            <span className="font-bold">
                                                                {order.quantity}{' '}
                                                                Box
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Target Delivery Date */}
                                                    <div className="mt-2.5 flex items-center justify-between text-[10.5px] text-[#0B291E]/60">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="size-3 text-[#B89352]" />
                                                            <span>
                                                                Kirim:{' '}
                                                                {
                                                                    order.target_delivery_date
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Stage Movement Controls */}
                                                    <div className="mt-3 flex items-center justify-between border-t border-[#0B291E]/10 pt-2.5">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isFirstStage
                                                            }
                                                            onClick={() =>
                                                                moveStage(
                                                                    order,
                                                                    'prev',
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 rounded p-1 text-[10.5px] text-[#0B291E]/50 hover:bg-[#FAF8F5] hover:text-[#0B291E] disabled:opacity-20"
                                                            title="Kembali ke tahap sebelumnya"
                                                        >
                                                            <ArrowLeft className="size-3" />
                                                            <span>Mundur</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isLastStage
                                                            }
                                                            onClick={() =>
                                                                moveStage(
                                                                    order,
                                                                    'next',
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 rounded bg-[#0B291E] px-2.5 py-1 text-[10.5px] font-semibold text-white shadow-2xs hover:bg-[#143E2E] disabled:opacity-20"
                                                            title="Lanjut ke tahap berikutnya"
                                                        >
                                                            <span>Maju</span>
                                                            <ArrowRight className="size-3 text-[#B89352]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Add Production Order */}
            <AnimatePresence>
                {modalOpen && (
                    <div
                        className="backdrop-blur-2xs fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#0B291E]/10 pb-3">
                                <h3 className="text-base font-semibold text-[#0B291E]">
                                    Buat Pesanan Produksi Studio
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="p-1 text-[#0B291E]/60 hover:text-[#0B291E]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form
                                onSubmit={submitOrder}
                                className="mt-4 space-y-3 text-xs"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            Nama Klien
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.data.client_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'client_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama pemesan"
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            Perusahaan (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.company_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'company_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="PT / Instansi"
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            Nama Paket Hampers
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.data.package_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'package_name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            Jumlah Box
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={form.data.quantity}
                                            onChange={(e) =>
                                                form.setData(
                                                    'quantity',
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 font-mono text-xs focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            Target Tanggal Kirim
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={
                                                form.data.target_delivery_date
                                            }
                                            onChange={(e) =>
                                                form.setData(
                                                    'target_delivery_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 font-mono text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            Tingkat Prioritas
                                        </label>
                                        <select
                                            value={form.data.priority}
                                            onChange={(e) =>
                                                form.setData(
                                                    'priority',
                                                    e.target.value as
                                                        | 'normal'
                                                        | 'high'
                                                        | 'urgent',
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        >
                                            <option value="normal">
                                                Normal
                                            </option>
                                            <option value="high">
                                                Prioritas Tinggi
                                            </option>
                                            <option value="urgent">
                                                Mendesak / Urgent
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Teks Kartu Ucapan
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.data.greeting_card_text}
                                        onChange={(e) =>
                                            form.setData(
                                                'greeting_card_text',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Pesan kaligrafi pada kartu..."
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#0B291E]/10 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="rounded-lg border px-3 py-1.5 text-xs text-[#0B291E]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-lg bg-[#0B291E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#143E2E]"
                                    >
                                        Buat Antrean
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
