import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Package,
    Search,
    Truck,
    ShieldCheck,
    CheckCircle2,
    Clock,
    X,
    Filter,
    ArrowUpRight,
    Building2,
    DollarSign,
    RefreshCw,
    Edit3,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import { buttonTap } from '@/lib/motion';
import type { Order } from '@/types/models';

interface AdminOrdersIndexProps {
    orders: {
        data: Order[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: {
        total_orders: number;
        personal_orders: number;
        corporate_orders: number;
        studio_processing: number;
        in_delivery: number;
        delivered: number;
        total_revenue: number;
    };
    filters: {
        type: string;
        status: string;
        search: string;
    };
}

const SHIPPING_STAGES = [
    { value: 'studio_processing', label: '1. Diproses di Studio Atelier' },
    { value: 'quality_check', label: '2. Quality Check & Packing' },
    { value: 'in_delivery', label: '3. Dalam Pengiriman Kurir' },
    { value: 'delivered', label: '4. Diterima Konsumen' },
];

export default function AdminOrdersIndex({
    orders,
    stats,
    filters,
}: AdminOrdersIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [selectedStatus, setSelectedStatus] = useState(
        filters.status || 'all',
    );

    // Modal state for updating shipping status & receipt number
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [shippingStatus, setShippingStatus] =
        useState<string>('studio_processing');
    const [trackingNumber, setTrackingNumber] = useState<string>('');
    const [shippingCourier, setShippingCourier] = useState<string>('');
    const [logNote, setLogNote] = useState<string>('');
    const [adminNotes, setAdminNotes] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleFilter = (
        type = selectedType,
        status = selectedStatus,
        search = searchTerm,
    ) => {
        router.get(
            '/admin/orders',
            { type, status, search },
            { preserveState: true },
        );
    };

    const handleOpenEditModal = (order: Order) => {
        setSelectedOrder(order);
        setShippingStatus(order.shipping_status || 'studio_processing');
        setTrackingNumber(order.tracking_number || '');
        setShippingCourier(
            order.shipping_courier || 'Kurir Khusus Galuh Atelier',
        );
        setLogNote('');
        setAdminNotes(order.admin_notes || '');
    };

    const handleSaveStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        setIsUpdating(true);
        router.patch(
            `/admin/orders/${selectedOrder.id}/status`,
            {
                shipping_status: shippingStatus,
                tracking_number: trackingNumber,
                shipping_courier: shippingCourier,
                log_note: logNote,
                admin_notes: adminNotes,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsUpdating(false);
                    setSelectedOrder(null);
                },
            },
        );
    };

    return (
        <AdminLayout
            title="Inquiries & Pesanan"
            subtitle="Pesanan masuk personal & corporate yang harus diverifikasi dan di-accept oleh Admin."
        >
            <Head title="Inquiries & Pesanan — Super Admin GALUH & CO." />

            <div className="space-y-6">
                {/* Stats Overview Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                            Total Pesanan
                        </span>
                        <span className="mt-1 font-sans text-2xl font-extrabold text-[#16233B]">
                            {stats.total_orders}
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                            Pesanan Personal
                        </span>
                        <span className="mt-1 font-sans text-2xl font-extrabold text-[#16233B]">
                            {stats.personal_orders}
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[9.5px] font-bold tracking-wider text-slate-500 uppercase">
                            Corporate (B2B)
                        </span>
                        <span className="mt-1 font-sans text-2xl font-extrabold text-[#16233B]">
                            {stats.corporate_orders}
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[9.5px] font-bold tracking-wider text-amber-600 uppercase">
                            Di Studio
                        </span>
                        <span className="mt-1 font-sans text-2xl font-extrabold text-amber-700">
                            {stats.studio_processing}
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[9.5px] font-bold tracking-wider text-blue-600 uppercase">
                            Dalam Kurir
                        </span>
                        <span className="mt-1 font-sans text-2xl font-extrabold text-blue-700">
                            {stats.in_delivery}
                        </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                        <span className="block text-[9.5px] font-bold tracking-wider text-emerald-600 uppercase">
                            Selesai Diterima
                        </span>
                        <span className="mt-1 font-sans text-2xl font-extrabold text-emerald-700">
                            {stats.delivered}
                        </span>
                    </div>

                    <div className="col-span-2 rounded-xl border border-[#16233B] bg-[#16233B] p-4 text-white shadow-xs sm:col-span-4 lg:col-span-1">
                        <span className="block text-[9px] font-bold tracking-wider text-[#F59E0B] uppercase drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]">
                            Total Pendapatan
                        </span>
                        <span className="mt-1 block truncate font-sans text-lg font-extrabold text-white">
                            Rp{' '}
                            {Number(stats.total_revenue).toLocaleString(
                                'id-ID',
                            )}
                        </span>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#A88B54]/30 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                handleFilter(
                                    e.target.value,
                                    selectedStatus,
                                    searchTerm,
                                );
                            }}
                            style={{ colorScheme: 'light' }}
                            className="rounded-xl border border-[#A88B54]/30 bg-white px-3 py-2 text-xs font-semibold text-[#16233B] shadow-xs focus:border-[#A88B54] focus:outline-hidden"
                        >
                            <option
                                value="all"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                Semua Tipe Pesanan
                            </option>
                            <option
                                value="personal"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                Paket Personal
                            </option>
                            <option
                                value="corporate"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                Paket Corporate (B2B)
                            </option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                handleFilter(
                                    selectedType,
                                    e.target.value,
                                    searchTerm,
                                );
                            }}
                            style={{ colorScheme: 'light' }}
                            className="rounded-xl border border-[#A88B54]/30 bg-white px-3 py-2 text-xs font-semibold text-[#16233B] shadow-xs focus:border-[#A88B54] focus:outline-hidden"
                        >
                            <option
                                value="all"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                Semua Status Pengiriman
                            </option>
                            <option
                                value="studio_processing"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                1. Diproses di Studio
                            </option>
                            <option
                                value="quality_check"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                2. Quality Check &amp; Packing
                            </option>
                            <option
                                value="in_delivery"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                3. Dalam Pengiriman
                            </option>
                            <option
                                value="delivered"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#16233b',
                                }}
                                className="bg-white text-[#16233B]"
                            >
                                4. Diterima Konsumen
                            </option>
                        </select>
                    </div>

                    {/* Search Field */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleFilter(
                                selectedType,
                                selectedStatus,
                                searchTerm,
                            );
                        }}
                        className="flex items-center gap-2"
                    >
                        <div className="flex items-center gap-2 rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3 py-1.5 text-xs">
                            <Search className="size-3.5 text-[#A88B54]" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari Resi, No. Pesanan, Nama..."
                                className="w-48 bg-transparent text-xs text-[#16233B] focus:outline-hidden sm:w-64"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#16233B] px-4 py-2 text-xs font-bold text-white hover:bg-[#A88B54] hover:text-[#16233B]"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Orders Table */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-[#A88B54]/30 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-[#F2EBDC] bg-[#16233B] text-[#F2EBDC]">
                                <tr>
                                    <th className="px-4 py-3.5 font-bold tracking-wider uppercase">
                                        No. Pesanan &amp; Resi
                                    </th>
                                    <th className="px-4 py-3.5 font-bold tracking-wider uppercase">
                                        Penerima &amp; Perusahaan
                                    </th>
                                    <th className="px-4 py-3.5 font-bold tracking-wider uppercase">
                                        Paket Hampers
                                    </th>
                                    <th className="px-4 py-3.5 font-bold tracking-wider uppercase">
                                        Jumlah &amp; Total
                                    </th>
                                    <th className="px-4 py-3.5 font-bold tracking-wider uppercase">
                                        Status Pengiriman
                                    </th>
                                    <th className="px-4 py-3.5 text-right font-bold tracking-wider uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F2EBDC]">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-xs text-[#6E675D]"
                                        >
                                            Tidak ada pesanan yang sesuai dengan
                                            filter pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-[#F2EBDC]/30"
                                        >
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="rounded bg-[#16233B] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                                                        {order.order_type ===
                                                        'corporate'
                                                            ? 'B2B'
                                                            : 'PERSONAL'}
                                                    </span>
                                                    <span className="font-mono font-semibold text-[#16233B]">
                                                        {order.order_number}
                                                    </span>
                                                </div>
                                                <span className="mt-1 block font-mono text-xs font-bold text-[#A88B54]">
                                                    Resi:{' '}
                                                    {order.tracking_number}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <p className="font-bold text-[#16233B]">
                                                    {order.recipient_name}
                                                </p>
                                                <p className="text-[11px] text-[#6E675D]">
                                                    {order.recipient_phone}
                                                </p>
                                                {order.company_name && (
                                                    <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#A88B54]">
                                                        <Building2 className="size-3" />
                                                        <span>
                                                            {order.company_name}
                                                        </span>
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {(order.items || []).map(
                                                    (it) => (
                                                        <div
                                                            key={it.id}
                                                            className="text-xs"
                                                        >
                                                            <span className="font-semibold text-[#16233B]">
                                                                {
                                                                    it.product_name
                                                                }
                                                            </span>
                                                            <span className="text-[#6E675D]">
                                                                {' '}
                                                                ({it.quantity}x)
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                                {order.greeting_card_text && (
                                                    <p className="mt-1 line-clamp-1 text-[10px] text-[#6E675D] italic">
                                                        Kartu: "
                                                        {
                                                            order.greeting_card_text
                                                        }
                                                        "
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <span className="font-bold text-[#16233B]">
                                                    {order.total_quantity} Paket
                                                </span>
                                                <span className="block font-sans font-bold text-[#16233B]">
                                                    Rp{' '}
                                                    {Number(
                                                        order.total_amount,
                                                    ).toLocaleString('id-ID')}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                                                        order.shipping_status ===
                                                        'delivered'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : order.shipping_status ===
                                                                'in_delivery'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : order.shipping_status ===
                                                                  'quality_check'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-[#F2EBDC] text-[#16233B]'
                                                    }`}
                                                >
                                                    {order.shipping_status ===
                                                    'delivered'
                                                        ? '4. Diterima'
                                                        : order.shipping_status ===
                                                            'in_delivery'
                                                          ? '3. Dalam Kurir'
                                                          : order.shipping_status ===
                                                              'quality_check'
                                                            ? '2. QC & Packing'
                                                            : '1. Di Studio'}
                                                </span>
                                                <span className="mt-0.5 block text-[10px] text-[#6E675D]">
                                                    {order.shipping_courier}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.status ===
                                                        'pending' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        `Accept pesanan #${order.order_number}? Pesanan akan diteruskan ke Studio Atelier dan pelacakan resi diaktifkan.`,
                                                                    )
                                                                ) {
                                                                    router.post(
                                                                        `/admin/orders/${order.id}/accept`,
                                                                    );
                                                                }
                                                            }}
                                                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-700"
                                                        >
                                                            <CheckCircle2 className="size-3.5" />
                                                            <span>
                                                                Accept Pesanan
                                                            </span>
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenEditModal(
                                                                order,
                                                            )
                                                        }
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#A88B54] bg-[#F2EBDC] px-3 py-1.5 text-xs font-bold text-[#16233B] transition-all hover:bg-[#16233B] hover:text-white"
                                                    >
                                                        <Edit3 className="size-3.5" />
                                                        <span>
                                                            Update Resi &amp;
                                                            Status
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL UPDATE STATUS & RESI */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() =>
                                !isUpdating && setSelectedOrder(null)
                            }
                            className="fixed inset-0 bg-[#16233B]/60 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                disabled={isUpdating}
                                className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#A88B54]/30 bg-[#F2EBDC] text-[#16233B]"
                            >
                                <X className="size-4" />
                            </button>

                            <div className="border-b border-slate-200 pb-3">
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#F59E0B] uppercase drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]">
                                    DISPATCH PESANAN
                                </span>
                                <h3 className="mt-1 font-sans text-xl font-extrabold text-[#16233B]">
                                    Perbarui Status &amp; Nomor Resi
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Pesanan: {selectedOrder.order_number} •
                                    Penerima: {selectedOrder.recipient_name}
                                </p>
                            </div>

                            <form
                                onSubmit={handleSaveStatus}
                                className="mt-4 space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="stage-select"
                                        className="block text-[10px] font-bold tracking-wider text-[#16233B] uppercase"
                                    >
                                        Tahapan Status Pengiriman
                                    </label>
                                    <select
                                        id="stage-select"
                                        value={shippingStatus}
                                        onChange={(e) =>
                                            setShippingStatus(e.target.value)
                                        }
                                        style={{ colorScheme: 'light' }}
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-white px-3.5 py-2 text-xs font-bold text-[#16233B] shadow-xs focus:border-[#A88B54] focus:outline-hidden"
                                    >
                                        {SHIPPING_STAGES.map((st) => (
                                            <option
                                                key={st.value}
                                                value={st.value}
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    color: '#16233b',
                                                }}
                                                className="bg-white text-[#16233B]"
                                            >
                                                {st.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="resi-input"
                                            className="block text-[10px] font-bold tracking-wider text-[#16233B] uppercase"
                                        >
                                            Nomor Resi Pelacakan
                                        </label>
                                        <input
                                            id="resi-input"
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) =>
                                                setTrackingNumber(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: GLH-EXP-20261124-XYZ"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3 py-2 font-mono text-xs font-bold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="courier-input"
                                            className="block text-[10px] font-bold tracking-wider text-[#16233B] uppercase"
                                        >
                                            Nama Ekspedisi / Kurir
                                        </label>
                                        <input
                                            id="courier-input"
                                            type="text"
                                            value={shippingCourier}
                                            onChange={(e) =>
                                                setShippingCourier(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Kurir Khusus Galuh Atelier"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="note-input"
                                        className="block text-[10px] font-bold tracking-wider text-[#16233B] uppercase"
                                    >
                                        Catatan Log Timeline (Tampil ke
                                        Konsumen)
                                    </label>
                                    <input
                                        id="note-input"
                                        type="text"
                                        value={logNote}
                                        onChange={(e) =>
                                            setLogNote(e.target.value)
                                        }
                                        placeholder="Contoh: Pita zamrud & wax seal telah selesai diinspeksi..."
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="admin-note-input"
                                        className="block text-[10px] font-bold tracking-wider text-[#16233B] uppercase"
                                    >
                                        Catatan Internal Super Admin (Privat)
                                    </label>
                                    <textarea
                                        id="admin-note-input"
                                        rows={2}
                                        value={adminNotes}
                                        onChange={(e) =>
                                            setAdminNotes(e.target.value)
                                        }
                                        placeholder="Catatan penanganan pesanan, request invoice khusus..."
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>

                                <motion.button
                                    whileTap={buttonTap.tap}
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#16233B] py-3 text-xs font-bold tracking-wider text-white shadow-md transition-all hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-60"
                                >
                                    <span>
                                        {isUpdating
                                            ? 'MENYIMPAN PERUBAHAN...'
                                            : 'SIMPAN STATUS & RESI'}
                                    </span>
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
