import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Package,
    ArrowLeft,
    PackageSearch,
    MapPin,
    Calendar,
    ChevronRight,
    Building2,
    CheckCircle2,
    Clock,
    ShoppingBag,
} from 'lucide-react';
import { Navbar } from '@/components/sections/navbar';
import { FooterSection } from '@/components/sections/footer-section';
import { buttonTap } from '@/lib/motion';
import type { Order } from '@/types/models';

interface MyOrdersProps {
    orders?: Order[];
}

function getStatusBadge(status?: string) {
    switch (status) {
        case 'delivered':
            return {
                label: 'Diterima Konsumen',
                color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            };
        case 'in_delivery':
            return {
                label: 'Dalam Pengiriman Kurir',
                color: 'bg-blue-100 text-blue-800 border-blue-300',
            };
        case 'quality_check':
            return {
                label: 'Quality Check & Packing',
                color: 'bg-amber-100 text-amber-800 border-amber-300',
            };
        default:
            return {
                label: 'Diproses di Studio Atelier',
                color: 'bg-[#F2EBDC] text-[#16233B] border-[#A88B54]/30',
            };
    }
}

export default function MyOrders({ orders = [] }: MyOrdersProps) {
    return (
        <div className="min-h-screen bg-[#F2EBDC] font-sans text-[#16233B] selection:bg-[#A88B54] selection:text-white">
            <Head title="Pesanan Saya — GALUH & CO." />

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

                {/* Header */}
                <div className="border-b border-[#A88B54]/20 pb-6">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <ShoppingBag className="size-3.5" />
                        <span>RIWAYAT TRANSAKSI ANDA</span>
                    </div>
                    <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#16233B] sm:text-4xl">
                        Daftar Pesanan &amp;{' '}
                        <span className="text-[#A88B54] italic">
                            Nomor Resi
                        </span>
                    </h1>
                    <p className="mt-2 text-xs leading-relaxed text-[#6E675D]">
                        Seluruh pesanan Anda yang terdaftar di akun resmi Galuh
                        &amp; Co. Pantau status pengiriman langsung dengan
                        mengeklik tombol Lacak Resi.
                    </p>
                </div>

                {/* Orders List */}
                <div className="mt-8 space-y-6">
                    {orders.length === 0 ? (
                        <div className="rounded-3xl border border-[#A88B54]/25 bg-white p-12 text-center shadow-sm">
                            <Package className="mx-auto size-12 text-[#A88B54]" />
                            <h3 className="mt-4 font-serif text-xl font-bold text-[#16233B]">
                                Belum Ada Pesanan yang Dibuat
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#6E675D]">
                                Anda belum memiliki pesanan aktif. Jelajahi
                                katalog hampers eksklusif kami dan lakukan
                                pemesanan personal maupun corporate langsung di
                                website.
                            </p>
                            <button
                                type="button"
                                onClick={() => router.visit('/#koleksi')}
                                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#16233B] px-6 py-3 text-xs font-bold text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                            >
                                <span>JELAJAHI KOLEKSI HAMPERS</span>
                                <ChevronRight className="size-3.5" />
                            </button>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const badge = getStatusBadge(order.shipping_status);
                            return (
                                <div
                                    key={order.id}
                                    className="overflow-hidden rounded-3xl border border-[#A88B54]/30 bg-white p-6 shadow-md transition-all hover:shadow-lg sm:p-8"
                                >
                                    <div className="flex flex-col justify-between gap-4 border-b border-[#F2EBDC] pb-5 sm:flex-row sm:items-center">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-full bg-[#16233B] px-2.5 py-0.5 font-mono text-[9.5px] font-bold text-white uppercase">
                                                    {order.order_type ===
                                                    'corporate'
                                                        ? 'Corporate B2B'
                                                        : 'Personal'}
                                                </span>
                                                <span className="font-mono text-xs font-semibold text-[#16233B]">
                                                    {order.order_number}
                                                </span>
                                                <span className="text-xs text-[#6E675D]">
                                                    •{' '}
                                                    {order.created_at
                                                        ? new Date(
                                                              order.created_at,
                                                          ).toLocaleDateString(
                                                              'id-ID',
                                                              {
                                                                  day: 'numeric',
                                                                  month: 'long',
                                                                  year: 'numeric',
                                                              },
                                                          )
                                                        : 'Hari ini'}
                                                </span>
                                            </div>

                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-xs text-[#6E675D]">
                                                    Nomor Resi:
                                                </span>
                                                <span className="font-mono text-sm font-bold text-[#A88B54]">
                                                    {order.tracking_number}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${badge.color}`}
                                            >
                                                {badge.label}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.visit(
                                                        `/lacak-pesanan?resi=${encodeURIComponent(order.tracking_number || '')}`,
                                                    )
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#16233B] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                                            >
                                                <PackageSearch className="size-3.5" />
                                                <span>Lacak Resi</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-12">
                                        <div className="sm:col-span-7">
                                            <span className="block text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                                RINCIAN PAKET
                                            </span>
                                            <div className="mt-2 space-y-2">
                                                {(order.items || []).map(
                                                    (item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between text-xs"
                                                        >
                                                            <div>
                                                                <h4 className="font-serif font-bold text-[#16233B]">
                                                                    {
                                                                        item.product_name
                                                                    }
                                                                </h4>
                                                                <span className="text-[#6E675D]">
                                                                    {
                                                                        item.quantity
                                                                    }{' '}
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
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-[#F2EBDC] pt-4 sm:col-span-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                                            <span className="block text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                                TUJUAN PENGIRIMAN
                                            </span>
                                            <p className="mt-2 text-xs font-semibold text-[#16233B]">
                                                {order.recipient_name} (
                                                {order.recipient_phone})
                                            </p>
                                            {order.company_name && (
                                                <p className="text-xs text-[#6E675D]">
                                                    {order.company_name}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs leading-relaxed text-[#6E675D]">
                                                {order.shipping_address}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between border-t border-[#F2EBDC] pt-3">
                                                <span className="text-xs font-bold text-[#6E675D]">
                                                    Total Pembayaran:
                                                </span>
                                                <span className="font-serif text-base font-bold text-[#16233B]">
                                                    Rp{' '}
                                                    {Number(
                                                        order.total_amount,
                                                    ).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
