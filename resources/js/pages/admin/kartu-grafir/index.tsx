import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    FileText,
    PenTool,
    Printer,
    Sparkles,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface ProductionOrderItem {
    id: number;
    order_code: string;
    client_name: string;
    company_name?: string | null;
    package_name: string;
    quantity: number;
    greeting_card_text?: string | null;
    greeting_card_status?: 'pending' | 'printed' | null;
    engraving_names?: string[] | null;
    engraving_status?: 'pending' | 'engraved' | null;
    target_delivery_date: string;
}

interface KartuGrafirProps {
    orders: ProductionOrderItem[];
    stats: {
        total_pending_cards: number;
        total_printed_cards: number;
        total_pending_engraving: number;
        total_completed_engraving: number;
    };
    filters: {
        filter_type?: string;
    };
}

export default function AdminKartuGrafirIndex({
    orders,
    stats,
    filters,
}: KartuGrafirProps) {
    const [selectedTab, setSelectedTab] = useState<'cards' | 'engraving'>(
        'cards',
    );

    const handleToggleCard = (order: ProductionOrderItem) => {
        router.post(
            `/admin/kartu-grafir/${order.id}/toggle-card`,
            {},
            { preserveScroll: true },
        );
    };

    const handleToggleEngraving = (order: ProductionOrderItem) => {
        router.post(
            `/admin/kartu-grafir/${order.id}/toggle-engraving`,
            {},
            { preserveScroll: true },
        );
    };

    const handlePrintWorksheet = () => {
        window.print();
    };

    const cardOrders = orders.filter((o) => !!o.greeting_card_text);
    const engravingOrders = orders.filter(
        (o) => Array.isArray(o.engraving_names) && o.engraving_names.length > 0,
    );

    return (
        <AdminLayout
            title="Daftar Cetak Kartu & Grafir Laser"
            subtitle="Checklist Studio Perakitan untuk Personalisasi Pesan Kaligrafi & Monogram"
            headerAction={
                <button
                    type="button"
                    onClick={handlePrintWorksheet}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E]"
                >
                    <Printer className="size-3.5 text-[#B89352]" />
                    <span>Cetak Lembar Kerja Studio</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Studio Inspection KPI Strip */}
                <div className="grid grid-cols-2 divide-y divide-[#0B291E]/10 overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs sm:grid-cols-4 sm:divide-x sm:divide-y-0 print:hidden">
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-amber-700 uppercase">
                            KARTU PERLU DICETAK
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-amber-700">
                                {stats.total_pending_cards}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Antrean Cetak
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-emerald-800 uppercase">
                            KARTU SELESAI
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-emerald-800">
                                {stats.total_printed_cards}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Siap Selip Box
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-purple-700 uppercase">
                            GRAFIR PERLU DIKERJAKAN
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-purple-700">
                                {stats.total_pending_engraving}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Antrean Mesin Laser
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-emerald-800 uppercase">
                            GRAFIR SELESAI
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-emerald-800">
                                {stats.total_completed_engraving}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                QC Grafir Lolos
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Switcher Tabs */}
                <div className="flex rounded-2xl border-b border-[#0B291E]/10 bg-white px-4 shadow-2xs sm:px-6 print:hidden">
                    <nav className="flex space-x-6">
                        <button
                            type="button"
                            onClick={() => setSelectedTab('cards')}
                            className={`flex items-center gap-2 py-4 text-xs font-semibold transition-colors ${
                                selectedTab === 'cards'
                                    ? 'border-b-2 border-[#B89352] text-[#0B291E]'
                                    : 'text-[#0B291E]/50 hover:text-[#0B291E]'
                            }`}
                        >
                            <FileText className="size-3.5 text-[#B89352]" />
                            <span>
                                Checklist Kartu Ucapan Kaligrafi (
                                {cardOrders.length})
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab('engraving')}
                            className={`flex items-center gap-2 py-4 text-xs font-semibold transition-colors ${
                                selectedTab === 'engraving'
                                    ? 'border-b-2 border-[#B89352] text-[#0B291E]'
                                    : 'text-[#0B291E]/50 hover:text-[#0B291E]'
                            }`}
                        >
                            <PenTool className="size-3.5 text-[#B89352]" />
                            <span>
                                Checklist Laser Grafir Monogram (
                                {engravingOrders.length})
                            </span>
                        </button>
                    </nav>
                </div>

                {/* 3. Section A: Kartu Ucapan Kaligrafi */}
                {selectedTab === 'cards' && (
                    <div className="overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-[#0B291E]/10 bg-[#FAF8F5] font-mono text-[9.5px] font-bold tracking-wider text-[#B89352] uppercase">
                                    <th className="px-4 py-3">
                                        Kode &amp; Pemesan
                                    </th>
                                    <th className="px-4 py-3">
                                        Paket &amp; Volume
                                    </th>
                                    <th className="px-4 py-3">
                                        Teks Kartu Ucapan yang Dicetak
                                    </th>
                                    <th className="px-4 py-3">
                                        Deadline Kirim
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Status Cetak
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0B291E]/5 text-[#0B291E]">
                                {cardOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center text-xs text-[#0B291E]/50"
                                        >
                                            Tidak ada antrean cetak kartu
                                            ucapan.
                                        </td>
                                    </tr>
                                ) : (
                                    cardOrders.map((order) => {
                                        const isPrinted =
                                            order.greeting_card_status ===
                                            'printed';

                                        return (
                                            <tr
                                                key={order.id}
                                                className="transition-colors hover:bg-[#F7F5F0]/50"
                                            >
                                                <td className="px-4 py-3.5">
                                                    <span className="font-mono text-xs font-bold text-[#B89352]">
                                                        {order.order_code}
                                                    </span>
                                                    <h4 className="text-sm font-semibold text-[#0B291E]">
                                                        {order.client_name}
                                                    </h4>
                                                    {order.company_name && (
                                                        <p className="text-[11px] text-[#0B291E]/50">
                                                            {order.company_name}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <div className="font-medium text-[#0B291E]">
                                                        {order.package_name}
                                                    </div>
                                                    <span className="font-mono text-xs text-[#B89352]">
                                                        {order.quantity} Box
                                                    </span>
                                                </td>

                                                <td className="max-w-md px-4 py-3.5">
                                                    <div className="rounded-lg border border-[#0B291E]/10 bg-[#FAF8F5] p-3 text-xs leading-relaxed text-[#0B291E] italic">
                                                        &ldquo;
                                                        {
                                                            order.greeting_card_text
                                                        }
                                                        &rdquo;
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5 font-mono text-[11px] text-[#0B291E]/70">
                                                    {order.target_delivery_date}
                                                </td>

                                                <td className="px-4 py-3.5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleCard(
                                                                order,
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10.5px] font-semibold transition-colors ${
                                                            isPrinted
                                                                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                                                                : 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                                        }`}
                                                    >
                                                        {isPrinted ? (
                                                            <>
                                                                <CheckCircle2 className="size-3 text-emerald-600" />
                                                                <span>
                                                                    Selesai
                                                                    Dicetak
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="size-3 text-amber-600" />
                                                                <span>
                                                                    Belum
                                                                    Dicetak
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 4. Section B: Laser Grafir Monogram */}
                {selectedTab === 'engraving' && (
                    <div className="overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-[#0B291E]/10 bg-[#FAF8F5] font-mono text-[9.5px] font-bold tracking-wider text-[#B89352] uppercase">
                                    <th className="px-4 py-3">
                                        Kode &amp; Pemesan
                                    </th>
                                    <th className="px-4 py-3">
                                        Paket &amp; Volume
                                    </th>
                                    <th className="px-4 py-3">
                                        Daftar Nama yang Akan Digrafir
                                    </th>
                                    <th className="px-4 py-3">
                                        Deadline Kirim
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Status Mesin Laser
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0B291E]/5 text-[#0B291E]">
                                {engravingOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center text-xs text-[#0B291E]/50"
                                        >
                                            Tidak ada antrean pengerjaan laser
                                            grafir saat ini.
                                        </td>
                                    </tr>
                                ) : (
                                    engravingOrders.map((order) => {
                                        const isEngraved =
                                            order.engraving_status ===
                                            'engraved';

                                        return (
                                            <tr
                                                key={order.id}
                                                className="transition-colors hover:bg-[#F7F5F0]/50"
                                            >
                                                <td className="px-4 py-3.5">
                                                    <span className="font-mono text-xs font-bold text-[#B89352]">
                                                        {order.order_code}
                                                    </span>
                                                    <h4 className="text-sm font-semibold text-[#0B291E]">
                                                        {order.client_name}
                                                    </h4>
                                                    {order.company_name && (
                                                        <p className="text-[11px] text-[#0B291E]/50">
                                                            {order.company_name}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <div className="font-medium text-[#0B291E]">
                                                        {order.package_name}
                                                    </div>
                                                    <span className="font-mono text-xs text-[#B89352]">
                                                        {order.quantity} Box
                                                    </span>
                                                </td>

                                                <td className="max-w-md px-4 py-3.5">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {order.engraving_names?.map(
                                                            (name, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="rounded-md border border-[#0B291E]/15 bg-[#FAF8F5] px-2 py-0.5 font-mono text-[11px] text-[#0B291E]"
                                                                >
                                                                    {name}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5 font-mono text-[11px] text-[#0B291E]/70">
                                                    {order.target_delivery_date}
                                                </td>

                                                <td className="px-4 py-3.5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleEngraving(
                                                                order,
                                                            )
                                                        }
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10.5px] font-semibold transition-colors ${
                                                            isEngraved
                                                                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                                                                : 'border border-purple-300 bg-purple-50 text-purple-800 hover:bg-purple-100'
                                                        }`}
                                                    >
                                                        {isEngraved ? (
                                                            <>
                                                                <CheckCircle2 className="size-3 text-emerald-600" />
                                                                <span>
                                                                    Selesai
                                                                    Digrafir
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="size-3 text-purple-600" />
                                                                <span>
                                                                    Belum
                                                                    Digrafir
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
