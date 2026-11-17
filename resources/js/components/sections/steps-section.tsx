import { motion } from 'motion/react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

export function StepsSection() {
    const steps = [
        {
            number: '01',
            icon: '🎁',
            title: 'Pilih Paket Hampers',
            description:
                'Jelajahi katalog koleksi kami atau tentukan konsep custom sesuai tema acara dan anggaran Anda.',
        },
        {
            number: '02',
            icon: '💬',
            title: 'Konsultasi & Personalisasi',
            description:
                'Hubungi tim kami via WhatsApp untuk mendiskusikan isi paket, kartu ucapan, atau penambahan logo perusahaan.',
        },
        {
            number: '03',
            icon: '💳',
            title: 'Konfirmasi & Pembayaran',
            description:
                'Periksa kembali rincian pesanan dan desain kartu ucapan Anda, lalu selesaikan pembayaran dengan aman dan mudah.',
        },
        {
            number: '04',
            icon: '📦',
            title: 'Pengiriman Rapi & Aman',
            description:
                'Pesanan dirangkai dengan teliti, dikemas secara eksklusif, dan dikirimkan tepat waktu ke alamat tujuan.',
        },
    ];

    return (
        <section
            id="cara-pesan"
            className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                        ✦ PANDUAN PEMESANAN ✦
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#1A1815] md:text-4xl lg:text-5xl">
                        Langkah Pemesanan yang Mudah <br />
                        &amp; Personal
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                        Setiap tahap kami rancang praktis dan jelas untuk
                        memudahkan pemesanan Anda, mulai dari memilih paket
                        hingga hadiah tiba di tujuan.
                    </p>
                </div>

                {/* 4 Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            variants={staggerItem}
                            className="flex flex-col justify-between rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-2xs"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="font-serif text-2xl font-normal text-[#1A1815] md:text-3xl">
                                        {step.number}
                                    </span>
                                    <span className="text-lg opacity-80">
                                        {step.icon}
                                    </span>
                                </div>

                                <h3 className="mt-4 font-serif text-sm font-bold text-[#1A1815] md:text-base">
                                    {step.title}
                                </h3>

                                <p className="mt-2 text-[11px] leading-relaxed text-[#8C877E]">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
