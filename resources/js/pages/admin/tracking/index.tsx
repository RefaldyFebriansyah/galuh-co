import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Truck,
    PackageCheck,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    Edit3,
    X,
    Building2,
    ShieldCheck,
    ArrowRight,
    MapPin,
    AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import { buttonTap } from '@/lib/motion';
import type { Order } from '@/types/models';

interface AdminTrackingIndexProps {
    orders: {
        data: Order[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: {
        total_active_tracking: number;
        studio_processing: number;
        quality_check: number;
        in_delivery: number;
        delivered: number;
    };
    filters: {
        status: string;
        search: string;
    };
}

const TRACKING_STAGES = [
    {
        key: 'studio_processing',
        num: '01',
        label: 'Kurasi Studio',
        fullTitle: 'Kurasi & Perakitan Studio',
        desc: 'Bahan pangan dirangkai teliti ke dalam wadah kriya.',
    },
    {
        key: 'quality_check',
        num: '02',
        label: 'QC & Lilin Wax',
        fullTitle: 'Penyegelan Lilin Wax & QC',
        desc: 'Pengecekan akhir, kartu ucapan, dan stempel wax segel.',
    },
    {
        key: 'in_delivery',
        num: '03',
        label: 'Dalam Kurir',
        fullTitle: 'Diserahkan ke Kurir & Resi Diterbitkan',
        desc: 'Paket dalam perjalanan kurir menuju alamat penerima.',
    },
    {
        key: 'delivered',
        num: '04',
        label: 'Telah Diterima',
        fullTitle: 'Pesanan Diterima Konsumen',
        desc: 'Hampers telah tiba sempurna di tangan penerima.',
    },
];

export default function AdminTrackingIndex({
    orders,
    stats,
    filters,
}: AdminTrackingIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    // Quick Update Modal state
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [modalStage, setModalStage] = useState('studio_processing');
    const [modalCourier, setModalCourier] = useState('Kurir Khusus Galuh Atelier');
    const [modalTrackingNumber, setModalTrackingNumber] = useState('');
    const [modalNote, setModalNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFilter = (status = selectedStatus, search = searchTerm) => {
        router.get('/admin/tracking', { status, search }, { preserveState: true });
    };

    const handleOpenModal = (order: Order, defaultStage?: string) => {
        setActiveOrder(order);
        setModalStage(defaultStage || order.shipping_status || 'studio_processing');
        setModalCourier(order.shipping_courier || 'Kurir Khusus Galuh Atelier');
        setModalTrackingNumber(order.tracking_number || '');
        setModalNote('');
    };

    const handleSaveTracking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeOrder) return;

        setIsSubmitting(true);
        router.post(
            `/admin/tracking/${activeOrder.id}`,
            {
                shipping_status: modalStage,
                shipping_courier: modalCourier,
                tracking_number: modalTrackingNumber,
                log_note: modalNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setActiveOrder(null);
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const getStageIndex = (stageKey?: string) => {
        const idx = TRACKING_STAGES.findIndex((s) => s.key === stageKey);
        return idx >= 0 ? idx : 0;
    };

    return (
        <AdminLayout
            title="Tracking Pesanan"
            subtitle="Pantau alur pengerjaan studio, penyerahan kurir, hingga bingkisan diterima konsumen."
        >
            <Head title="Tracking Pesanan — Admin Panel Galuh & Co." />

            <div className="space-y-6">
                {/* 1. Header & Stage Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                    {TRACKING_STAGES.map((stage, idx) => {
                        const count =
                            stage.key === 'studio_processing'
                                ? stats.studio_processing
                                : stage.key === 'quality_check'
                                  ? stats.quality_check
                                  : stage.key === 'in_delivery'
                                    ? stats.in_delivery
                                    : stats.delivered;

                        const isFiltered = selectedStatus === stage.key;

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    const nextStatus = isFiltered ? 'all' : stage.key;
                                    setSelectedStatus(nextStatus);
                                    handleFilter(nextStatus, searchTerm);
                                }}
                                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                                    isFiltered
                                        ? 'border-[#A88B54] bg-[#16233B] text-[#F2EBDC] shadow-md'
                                        : 'border-[#A88B54]/25 bg-white text-[#16233B] hover:border-[#A88B54]/60'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`font-mono text-xs font-bold ${isFiltered ? 'text-[#A88B54]' : 'text-[#6E675D]'}`}>
                                        TAHAP {stage.num}
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isFiltered ? 'bg-[#A88B54] text-[#16233B]' : 'bg-[#F2EBDC] text-[#16233B]'}`}>
                                        {count} Pesanan
                                    </span>
                                </div>
                                <h3 className={`mt-2 font-serif text-sm font-bold ${isFiltered ? 'text-[#F2EBDC]' : 'text-[#16233B]'}`}>
                                    {stage.label}
                                </h3>
                                <p className={`mt-0.5 line-clamp-1 text-[11px] ${isFiltered ? 'text-[#F2EBDC]/70' : 'text-[#6E675D]'}`}>
                                    {stage.desc}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* 2. Search & Filter Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[#A88B54]/25 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleFilter(selectedStatus, searchTerm);
                        }}
                        className="flex flex-1 items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#A88B54]" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nomor pesanan, nomor resi, nama penerima, atau perusahaan..."
                                className="w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/25 py-2 pr-4 pl-10 text-xs text-[#16233B] placeholder:text-[#6E675D]/60 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#16233B] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                handleFilter(e.target.value, searchTerm);
                            }}
                            className="rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3 py-2 text-xs font-semibold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                        >
                            <option value="all">Semua Tahap Tracking</option>
                            <option value="studio_processing">1. Kurasi Studio</option>
                            <option value="quality_check">2. QC & Segel Lilin</option>
                            <option value="in_delivery">3. Dalam Kurir</option>
                            <option value="delivered">4. Telah Diterima</option>
                        </select>
                    </div>
                </div>

                {/* 3. Orders Tracking Cards Grid */}
                {orders.data.length === 0 ? (
                    <div className="rounded-2xl border border-[#A88B54]/25 bg-white p-12 text-center text-[#6E675D]">
                        <Truck className="mx-auto size-12 text-[#A88B54]/50" />
                        <h3 className="mt-3 font-serif text-lg font-bold text-[#16233B]">
                            Tidak Ada Pesanan di Tahap Ini
                        </h3>
                        <p className="mt-1 text-xs">
                            Seluruh pesanan yang telah di-accept akan muncul di sini untuk diperbarui tahapannya.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => {
                            const currentIdx = getStageIndex(order.shipping_status);

                            return (
                                <div
                                    key={order.id}
                                    className="overflow-hidden rounded-2xl border border-[#A88B54]/25 bg-white shadow-xs transition-all hover:border-[#A88B54]/60 hover:shadow-md"
                                >
                                    {/* Order Top Summary Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2EBDC] bg-[#FAF8F5] px-5 py-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded bg-[#16233B] px-2 py-0.5 font-mono text-[9.5px] font-bold text-white">
                                                {order.order_type === 'corporate' ? 'CORPORATE B2B' : 'PERSONAL'}
                                            </span>
                                            <span className="font-mono font-bold text-[#16233B]">
                                                #{order.order_number}
                                            </span>
                                            <span className="hidden text-[#6E675D] sm:inline">•</span>
                                            <span className="hidden font-mono font-bold text-[#A88B54] sm:inline">
                                                Resi: {order.tracking_number}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="font-serif font-bold text-[#16233B]">
                                                {order.total_quantity} Paket ({Number(order.total_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModal(order)}
                                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#A88B54]/40 bg-white px-3 py-1 text-xs font-bold text-[#16233B] transition-all hover:bg-[#16233B] hover:text-white"
                                            >
                                                <Edit3 className="size-3" />
                                                <span>Kelola Resi</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Details & Stepper */}
                                    <div className="p-5">
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                                            {/* Left: Recipient & Hampers Summary */}
                                            <div className="space-y-2 lg:col-span-4">
                                                <div>
                                                    <p className="font-bold text-[#16233B]">
                                                        {order.recipient_name}
                                                    </p>
                                                    <p className="text-[11px] text-[#6E675D]">
                                                        {order.recipient_phone}
                                                    </p>
                                                    {order.company_name && (
                                                        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-[#F2EBDC] px-2 py-0.5 text-[10.5px] font-semibold text-[#16233B]">
                                                            <Building2 className="size-3 text-[#A88B54]" />
                                                            <span>{order.company_name}</span>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="pt-2 text-xs text-[#6E675D]">
                                                    <p className="line-clamp-2">
                                                        <span className="font-semibold text-[#16233B]">Tujuan: </span>
                                                        {order.shipping_address}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className="font-semibold text-[#16233B]">Kurir: </span>
                                                        {order.shipping_courier || 'Kurir Khusus Galuh Atelier'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: 4-Stage Visual Progress Stepper */}
                                            <div className="flex flex-col justify-center lg:col-span-8">
                                                <div className="relative">
                                                    {/* Track Background */}
                                                    <div className="absolute top-1/2 right-6 left-6 h-1 -translate-y-1/2 bg-[#F2EBDC]" />
                                                    {/* Active Fill */}
                                                    <div
                                                        className="absolute top-1/2 left-6 h-1 -translate-y-1/2 bg-[#A88B54] transition-all duration-300"
                                                        style={{
                                                            width: `${(currentIdx / (TRACKING_STAGES.length - 1)) * 88}%`,
                                                        }}
                                                    />

                                                    {/* Step Circles */}
                                                    <div className="relative grid grid-cols-4 gap-2">
                                                        {TRACKING_STAGES.map((stg, sIdx) => {
                                                            const isDone = sIdx <= currentIdx;
                                                            const isCurrent = sIdx === currentIdx;

                                                            return (
                                                                <button
                                                                    key={sIdx}
                                                                    type="button"
                                                                    onClick={() => handleOpenModal(order, stg.key)}
                                                                    className="group flex flex-col items-center text-center cursor-pointer"
                                                                    title={`Klik untuk ubah status ke ${stg.fullTitle}`}
                                                                >
                                                                    <span
                                                                        className={`flex size-8 items-center justify-center rounded-full font-serif text-xs font-bold transition-all ${
                                                                            isDone
                                                                                ? 'bg-[#16233B] text-[#A88B54] shadow-xs'
                                                                                : 'border border-[#A88B54]/30 bg-white text-[#6E675D]'
                                                                        } ${isCurrent ? 'ring-2 ring-[#A88B54] ring-offset-2 scale-110' : ''}`}
                                                                    >
                                                                        {stg.num}
                                                                    </span>
                                                                    <span
                                                                        className={`mt-2 font-serif text-[11px] font-bold ${
                                                                            isDone ? 'text-[#16233B]' : 'text-[#6E675D]'
                                                                        }`}
                                                                    >
                                                                        {stg.label}
                                                                    </span>
                                                                    <span className="text-[9.5px] text-[#A88B54] opacity-0 transition-opacity group-hover:opacity-100">
                                                                        Set Tahap
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Resi & Stage Update Modal */}
            <AnimatePresence>
                {activeOrder && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
                        onClick={() => setActiveOrder(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#A88B54]/30 bg-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#F2EBDC] bg-[#16233B] px-6 py-4 text-[#F2EBDC]">
                                <div>
                                    <span className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                        UPDATE STATUS & RESI PENGIRIMAN
                                    </span>
                                    <h3 className="font-serif text-lg font-bold text-white">
                                        Pesanan #{activeOrder.order_number}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveOrder(null)}
                                    className="rounded-lg p-1 text-[#F2EBDC]/60 hover:bg-white/10 hover:text-white"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveTracking} className="p-6 space-y-4 text-xs">
                                <div>
                                    <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                        Tahapan Pengerjaan / Pengiriman:
                                    </label>
                                    <select
                                        value={modalStage}
                                        onChange={(e) => setModalStage(e.target.value)}
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3 py-2.5 text-xs font-semibold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    >
                                        <option value="studio_processing">Tahap 1: Diproses di Studio Atelier</option>
                                        <option value="quality_check">Tahap 2: Quality Check & Segel Lilin Wax</option>
                                        <option value="in_delivery">Tahap 3: Diserahkan ke Kurir & Resi Diterbitkan</option>
                                        <option value="delivered">Tahap 4: Pesanan Diterima Konsumen</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                            Nomor Resi Pelacakan:
                                        </label>
                                        <input
                                            type="text"
                                            value={modalTrackingNumber}
                                            onChange={(e) => setModalTrackingNumber(e.target.value)}
                                            placeholder="GLH-2026-XXXX"
                                            className="mt-1 w-full font-mono rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                            Kurir Pengiriman:
                                        </label>
                                        <input
                                            type="text"
                                            value={modalCourier}
                                            onChange={(e) => setModalCourier(e.target.value)}
                                            placeholder="Kurir Khusus Galuh Atelier"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                        Catatan Log Pelacakan (Ditampilkan ke Konsumen):
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={modalNote}
                                        onChange={(e) => setModalNote(e.target.value)}
                                        placeholder="Contoh: Paket telah selesai dikurasi, disegel wax stempel emas, dan diserahkan ke armada pengantaran."
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-[#F2EBDC] pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveOrder(null)}
                                        className="rounded-xl border border-[#A88B54]/30 px-4 py-2 font-bold text-[#6E675D] hover:bg-[#FAF8F5]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="rounded-xl bg-[#16233B] px-5 py-2 font-bold text-white hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan Pembaruan Tracking'}
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
