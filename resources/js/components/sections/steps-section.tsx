import {
    ArrowRight,
    CreditCard,
    Gift,
    MessageCircle,
    PackageCheck,
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

export function StepsSection() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 75%', 'end 70%'],
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const steps = [
        {
            number: '01',
            icon: Gift,
            title: 'Pilih Paket Hampers',
            description:
                'Jelajahi katalog koleksi kami atau tentukan konsep custom sesuai tema acara dan anggaran Anda.',
        },
        {
            number: '02',
            icon: MessageCircle,
            title: 'Konsultasi & Personalisasi',
            description:
                'Hubungi tim kami via WhatsApp untuk mendiskusikan isi paket, kartu ucapan, atau penambahan logo perusahaan.',
        },
        {
            number: '03',
            icon: CreditCard,
            title: 'Konfirmasi & Pembayaran',
            description:
                'Periksa kembali rincian pesanan dan desain kartu ucapan Anda, lalu selesaikan pembayaran dengan aman dan mudah.',
        },
        {
            number: '04',
            icon: PackageCheck,
            title: 'Pengiriman Rapi & Aman',
            description:
                'Pesanan dirangkai dengan teliti, dikemas secara eksklusif, dan dikirimkan tepat waktu ke alamat tujuan.',
        },
    ];

    return (
        <section
            ref={containerRef}
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

                {/* Progress Line Indicator (Following Scroll) */}
                <div className="relative mt-10 hidden lg:block">
                    {/* Background Track Line */}
                    <div className="absolute top-1/2 right-10 left-10 h-0.5 -translate-y-1/2 bg-[#E2DACD]" />

                    {/* Animated Progress Bar Following Scroll */}
                    <motion.div
                        style={{ scaleX }}
                        className="absolute top-1/2 right-10 left-10 h-0.5 origin-left -translate-y-1/2 bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#143628]"
                    />

                    {/* Step Dots on the Track */}
                    <div className="relative flex justify-between px-8">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center"
                            >
                                <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#C5A880] bg-white font-serif text-[11px] font-bold text-[#143628] shadow-xs">
                                    {step.number}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4 Cards Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={staggerItem}
                                whileHover={{
                                    y: -5,
                                    transition: {
                                        duration: 0.25,
                                        ease: [0.16, 1, 0.3, 1],
                                    },
                                }}
                                className="group flex flex-col justify-between rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-2xs transition-all duration-300 hover:border-[#C5A880] hover:shadow-md"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-serif text-2xl font-normal text-[#1A1815] transition-colors group-hover:text-[#C5A880] md:text-3xl">
                                            {step.number}
                                        </span>
                                        <span className="flex size-9 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                                            <Icon className="size-4.5" />
                                        </span>
                                    </div>

                                    <h3 className="mt-4 font-serif text-sm font-bold text-[#1A1815] md:text-base">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 text-[11px] leading-relaxed text-[#8C877E]">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-[#C5A880] uppercase">
                                    <span>TAHAP {idx + 1}</span>
                                    <ArrowRight className="size-3" />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}

export { StepsSection as HowToOrder, StepsSection as HowToOrderSection };
