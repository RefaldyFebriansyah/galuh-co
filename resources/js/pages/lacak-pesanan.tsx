import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    PackageSearch,
    Search,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    Truck,
    Gift,
    Building2,
    ShieldCheck,
    ArrowLeft,
    Check,
} from 'lucide-react';
import { Navbar } from '@/components/sections/navbar';
import { FooterSection } from '@/components/sections/footer-section';
import { buttonTap, fadeInUp } from '@/lib/motion';
import type { Order, TrackingLog } from '@/types/models';

interface LacakPesananProps {
    resiQuery?: string;
    order?: Order | null;
}

const STAGES = [
    {
        key: 'studio_processing',
        step: 1,
        title: 'Diproses di Studio Atelier',
        desc: 'Kurasi bahan, perakitan hampers, dan penataan kudapan artisanal',
        icon: Gift,
    },
    {
        key: 'quality_check',
        step: 2,
        title: 'Quality Check & Packing',
        desc: 'Inspeksi kerapian pita, stempel wax seal, grafir laser & proteksi berlapis',
        icon: ShieldCheck,
    },
    {
        key: 'in_delivery',
        step: 3,
        title: 'Dalam Pengiriman Kurir',
        desc: 'Paket dalam perjalanan aman kurir khusus menuju alamat tujuan',
        icon: Truck,
    },
    {
        key: 'delivered',
        step: 4,
        title: 'Diterima Konsumen',
        desc: 'Bingkisan telah sampai sempurna di tangan penerima',
        icon: CheckCircle2,
    },
];

function getStageIndex(status?: string): number {
    switch (status) {
        case 'studio_processing':
            return 0;
        case 'quality_check':
            return 1;
        case 'in_delivery':
            return 2;
        case 'delivered':
            return 3;
        default:
            return 0;
    }
}

export default function LacakPesanan({
    resiQuery = '',
    order,
}: LacakPesananProps) {
    const [searchInput, setSearchInput] = useState(resiQuery);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchInput.trim()) return;

        setIsSearching(true);
        router.get(
            '/lacak-pesanan',
            { resi: searchInput.trim() },
            {
                preserveState: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const currentStageIdx = getStageIndex(order?.shipping_status);

    return (
        <div className="min-h-screen bg-[#F2EBDC] font-sans text-[#16233B] selection:bg-[#A88B54] selection:text-white">
            <Head title="Lacak Pesanan — GALUH & CO." />

            {/* Navbar */}
            <Navbar />

            <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
                {/* Back to Home Button */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => router.visit('/')}
                        className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#A88B54] transition-colors hover:text-[#16233B]"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Kembali ke Beranda</span>
                    </button>
                </div>

                {/* Hero Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <PackageSearch className="size-3.5" />
                        <span>SISTEM PELACAKAN RESI RESMI</span>
                        <span className="size-1 rounded-full bg-[#A88B54]" />
                        <span>GALUH &amp; CO. ATELIER</span>
                    </div>

                    <h1 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#16233B] sm:text-4xl md:text-5xl">
                        Lacak Status &amp; Pengiriman{' '}
                        <span className="text-[#A88B54] italic">
                            Hampers Anda
                        </span>
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                        Masukkan Nomor Resi Pengiriman (contoh: GLH-EXP-...)
                        atau Nomor Pesanan Anda untuk memantau tahapan
                        pengerjaan studio hingga kurir tiba.
                    </p>
                </div>

                {/* Search Bar Input */}
                <form
                    onSubmit={handleSearch}
                    className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-[#A88B54]/30 bg-white p-2 shadow-lg backdrop-blur-md"
                >
                    <div className="flex flex-1 items-center gap-3 pl-4">
                        <Search className="size-4 text-[#A88B54]" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Ketik Nomor Resi (GLH-EXP-...) atau No. Pesanan..."
                            className="w-full bg-transparent text-xs font-semibold text-[#16233B] placeholder-[#6E675D]/60 focus:outline-hidden sm:text-sm"
                        />
                    </div>
                    <motion.button
                        whileTap={buttonTap.tap}
                        type="submit"
                        disabled={isSearching}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#16233B] px-6 py-3 text-xs font-bold tracking-wider text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                    >
                        <span>{isSearching ? 'MELACAK...' : 'LACAK RESI'}</span>
                    </motion.button>
                </form>

                {/* Tracking Results Area */}
                <div className="mt-12">
                    {order ? (
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            {/* Summary Card Banner */}
                            <div className="overflow-hidden rounded-3xl border border-[#A88B54]/30 bg-white p-6 shadow-xl sm:p-8">
                                <div className="flex flex-col justify-between gap-4 border-b border-[#F2EBDC] pb-6 sm:flex-row sm:items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-[#16233B] px-3 py-1 font-mono text-[10px] font-bold text-white uppercase">
                                                {order.order_type ===
                                                'corporate'
                                                    ? 'Paket Corporate B2B'
                                                    : 'Paket Personal'}
                                            </span>
                                            <span className="font-mono text-xs text-[#6E675D]">
                                                {order.order_number}
                                            </span>
                                        </div>
                                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#16233B]">
                                            Resi: {order.tracking_number}
                                        </h2>
                                        <p className="mt-1 text-xs text-[#6E675D]">
                                            Kurir Pengiriman:{' '}
                                            <strong className="text-[#16233B]">
                                                {order.shipping_courier ||
                                                    'Kurir Khusus Galuh Atelier'}
                                            </strong>
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span className="block text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                            STATUS SAAT INI
                                        </span>
                                        <span className="font-serif text-lg font-bold text-[#16233B]">
                                            {STAGES[currentStageIdx]?.title}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-[#6E675D]">
                                            Total: {order.total_quantity} Paket
                                            • Rp{' '}
                                            {Number(
                                                order.total_amount,
                                            ).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                {/* 4 Stages Visual Timeline */}
                                <div className="mt-8">
                                    <div className="relative">
                                        {/* Background connecting bar */}
                                        <div className="absolute top-6 right-8 left-8 hidden h-1 -translate-y-1/2 bg-[#F2EBDC] md:block" />
                                        {/* Active filled connecting bar */}
                                        <div
                                            className="absolute top-6 left-8 hidden h-1 -translate-y-1/2 bg-[#A88B54] transition-all duration-700 md:block"
                                            style={{
                                                width: `${(currentStageIdx / (STAGES.length - 1)) * 90}%`,
                                            }}
                                        />

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                                            {STAGES.map((st, idx) => {
                                                const Icon = st.icon;
                                                const isCompleted =
                                                    idx < currentStageIdx;
                                                const isCurrent =
                                                    idx === currentStageIdx;

                                                return (
                                                    <div
                                                        key={st.key}
                                                        className="relative flex flex-col items-start md:items-center md:text-center"
                                                    >
                                                        {/* Circle Badge */}
                                                        <div
                                                            className={`relative z-10 flex size-12 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                                                                isCompleted
                                                                    ? 'border-[#A88B54] bg-[#A88B54] text-white shadow-md'
                                                                    : isCurrent
                                                                      ? 'scale-110 border-[#16233B] bg-[#16233B] text-white shadow-lg'
                                                                      : 'border-[#A88B54]/20 bg-[#F2EBDC] text-[#6E675D]'
                                                            }`}
                                                        >
                                                            {isCompleted ? (
                                                                <Check className="size-5" />
                                                            ) : (
                                                                <Icon className="size-5" />
                                                            )}
                                                        </div>

                                                        <span
                                                            className={`mt-3 block text-[10px] font-bold tracking-wider uppercase ${
                                                                isCurrent
                                                                    ? 'text-[#A88B54]'
                                                                    : 'text-[#6E675D]'
                                                            }`}
                                                        >
                                                            Tahap 0{st.step}
                                                        </span>
                                                        <h3
                                                            className={`mt-0.5 font-serif text-sm font-bold ${
                                                                isCurrent
                                                                    ? 'text-[#16233B]'
                                                                    : 'text-[#16233B]/80'
                                                            }`}
                                                        >
                                                            {st.title}
                                                        </h3>
                                                        <p className="mt-1 text-[11px] leading-relaxed text-[#6E675D]">
                                                            {st.desc}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid: Shipping Logs & Order Items */}
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                                {/* Left: Chronological Activity Log */}
                                <div className="rounded-3xl border border-[#A88B54]/30 bg-white p-6 shadow-md md:col-span-7">
                                    <div className="flex items-center gap-2 border-b border-[#F2EBDC] pb-3">
                                        <Clock className="size-4 text-[#A88B54]" />
                                        <h3 className="font-serif text-base font-bold text-[#16233B]">
                                            Catatan Riwayat &amp; Log Perjalanan
                                        </h3>
                                    </div>

                                    <div className="mt-5 space-y-6">
                                        {(order.tracking_logs &&
                                        order.tracking_logs.length > 0
                                            ? order.tracking_logs
                                            : [
                                                  {
                                                      id: 1,
                                                      order_id: order.id,
                                                      stage: 'studio_processing',
                                                      title: 'Pesanan Berhasil Masuk ke Studio Atelier',
                                                      description:
                                                          'Pesanan Anda telah dikonfirmasi dan mulai dirangkai oleh tim kriya Galuh & Co.',
                                                      location:
                                                          'Studio Atelier Galuh & Co., Ciamis',
                                                      logged_at: 'Hari ini',
                                                  },
                                              ]
                                        ).map((log, idx: number) => (
                                            <div
                                                key={log.id || idx}
                                                className="flex items-start gap-3.5"
                                            >
                                                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F2EBDC] text-[#A88B54]">
                                                    <span className="size-2 rounded-full bg-[#A88B54]" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-serif text-xs font-bold text-[#16233B]">
                                                            {log.title}
                                                        </h4>
                                                        <span className="font-mono text-[9px] text-[#6E675D]">
                                                            {log.logged_at}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 text-xs text-[#6E675D]">
                                                        {log.description}
                                                    </p>
                                                    {log.location && (
                                                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#A88B54]">
                                                            <MapPin className="size-3" />
                                                            <span>
                                                                {log.location}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Destination & Items Summary */}
                                <div className="space-y-6 md:col-span-5">
                                    {/* Destination Card */}
                                    <div className="rounded-3xl border border-[#A88B54]/30 bg-white p-6 shadow-md">
                                        <div className="flex items-center gap-2 border-b border-[#F2EBDC] pb-3">
                                            <MapPin className="size-4 text-[#A88B54]" />
                                            <h3 className="font-serif text-base font-bold text-[#16233B]">
                                                Informasi Penerima
                                            </h3>
                                        </div>
                                        <div className="mt-4 space-y-2.5 text-xs">
                                            {order.company_name && (
                                                <div className="flex items-center gap-2 font-bold text-[#16233B]">
                                                    <Building2 className="size-3.5 text-[#A88B54]" />
                                                    <span>
                                                        {order.company_name}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-[#6E675D]">
                                                    Penerima:
                                                </span>
                                                <p className="font-semibold text-[#16233B]">
                                                    {order.recipient_name} (
                                                    {order.recipient_phone})
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[#6E675D]">
                                                    Alamat Pengiriman:
                                                </span>
                                                <p className="leading-relaxed text-[#16233B]">
                                                    {order.shipping_address}
                                                </p>
                                            </div>
                                            {order.needed_at && (
                                                <div className="flex items-center gap-1.5 pt-1 text-[#A88B54]">
                                                    <Calendar className="size-3.5" />
                                                    <span>
                                                        Target Tanggal:{' '}
                                                        {order.needed_at}
                                                    </span>
                                                </div>
                                            )}
                                            {order.greeting_card_text && (
                                                <div className="mt-3 rounded-xl border border-[#A88B54]/20 bg-[#F2EBDC]/40 p-3 text-[#16233B] italic">
                                                    "{order.greeting_card_text}"
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="rounded-3xl border border-[#A88B54]/30 bg-white p-6 shadow-md">
                                        <div className="flex items-center gap-2 border-b border-[#F2EBDC] pb-3">
                                            <Gift className="size-4 text-[#A88B54]" />
                                            <h3 className="font-serif text-base font-bold text-[#16233B]">
                                                Paket yang Dipesan
                                            </h3>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {(order.items || []).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between text-xs"
                                                >
                                                    <div>
                                                        <h4 className="font-serif font-bold text-[#16233B]">
                                                            {item.product_name}
                                                        </h4>
                                                        <span className="text-[#6E675D]">
                                                            {item.quantity}{' '}
                                                            Paket x Rp{' '}
                                                            {Number(
                                                                item.unit_price,
                                                            ).toLocaleString(
                                                                'id-ID',
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="font-serif font-bold text-[#16233B]">
                                                        Rp{' '}
                                                        {Number(
                                                            item.subtotal,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : resiQuery ? (
                        <div className="rounded-3xl border border-dashed border-[#A88B54]/40 bg-white/60 p-12 text-center shadow-sm">
                            <PackageSearch className="mx-auto size-12 text-[#A88B54]" />
                            <h3 className="mt-4 font-serif text-xl font-bold text-[#16233B]">
                                Nomor Resi "{resiQuery}" Tidak Ditemukan
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#6E675D]">
                                Mohon periksa kembali nomor resi yang Anda
                                masukkan. Pastikan sesuai dengan nomor resi yang
                                tertera pada konfirmasi pesanan Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-[#A88B54]/25 bg-white/60 p-12 text-center shadow-sm">
                            <PackageSearch className="mx-auto size-12 text-[#A88B54]" />
                            <h3 className="mt-4 font-serif text-xl font-bold text-[#16233B]">
                                Siap Melacak Paket Hampers Anda
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#6E675D]">
                                Masukkan nomor resi pada kolom pencarian di atas
                                untuk melihat status pengerjaan dan pelacakan
                                pengiriman kurir.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
