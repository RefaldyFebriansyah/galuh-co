import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import {
    Gift,
    MessageCircle,
    PackageCheck,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import {
    fadeInUp,
    staggerContainer,
    staggerItem,
    viewportOnce,
} from '@/lib/motion';

export function HowToOrder() {
    const sectionRef = useRef<HTMLElement>(null);

    // Track scroll progress across the section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 75%', 'end 65%'],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: 110,
        damping: 26,
        restDelta: 0.001,
    });

    const steps = [
        {
            number: '01',
            icon: Gift,
            title: 'Pilih Koleksi Hampers',
            description:
                'Jelajahi kurasi katalog musiman kami atau tentukan konsep kustom sesuai tema acara dan anggaran yang diinginkan.',
        },
        {
            number: '02',
            icon: MessageCircle,
            title: 'Personalisasi & Konsultasi',
            description:
                'Diskusikan detail isi paket, kartu ucapan berstempel wax, atau penambahan logo perusahaan bersama tim kurator kami.',
        },
        {
            number: '03',
            icon: CheckCircle2,
            title: 'Konfirmasi & Pengerjaan',
            description:
                'Periksa kembali rincian desain kartu dan pesanan Anda. Setiap paket dirangkai teliti oleh tim kriya atelier dengan higienis.',
        },
        {
            number: '04',
            icon: PackageCheck,
            title: 'Pengiriman Aman Nusantara',
            description:
                'Bingkisan dikemas rapi dengan perlindungan berlapis dan dikirimkan tepat waktu ke alamat penerima di seluruh Indonesia.',
        },
    ];

    return (
        <section
            ref={sectionRef}
            id="cara-pesan"
            className="relative bg-[#FAF8F5] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#7A5B24] uppercase">
                        <span>PANDUAN PEMESANAN</span>
                        <span className="size-1 rounded-full bg-[#C5A880]" />
                        <span>ATELIER SERVICE</span>
                    </div>

                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#1A1815] sm:text-4xl lg:text-5xl">
                        Langkah Pemesanan Mudah &amp;{' '}
                        <span className="text-[#7A5B24] italic">Personal</span>
                    </h2>

                    <p className="mt-3.5 text-sm leading-relaxed text-[#5C564C] sm:text-base">
                        Setiap tahap kami rancang praktis, transparan, dan
                        terarah untuk memudahkan pemesanan Anda, mulai dari
                        kurasi paket hingga kotak hadiah tiba sempurna di tangan
                        penerima.
                    </p>
                </motion.div>

                {/* 1. Desktop & Tablet Horizontal Dynamic Connecting Line */}
                <div className="relative mt-12 hidden md:block">
                    {/* Track Background */}
                    <div className="absolute top-1/2 right-12 left-12 h-[2px] -translate-y-1/2 bg-[#E2DACD]" />

                    {/* Dynamic ScaleX Fill Line */}
                    <motion.div
                        style={{ scaleX: progress }}
                        className="absolute top-1/2 right-12 left-12 h-[2px] origin-left -translate-y-1/2 bg-gradient-to-r from-[#C5A880] via-[#0E2A1E] to-[#0E2A1E]"
                    />

                    {/* Step Dots on the Track */}
                    <div className="relative flex justify-between px-8">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center"
                            >
                                <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#C5A880] bg-white font-serif text-xs font-bold text-[#0E2A1E] shadow-2xs">
                                    {step.number}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Responsive Step Deck: Clean Vertical Flow on Mobile (< 768px), 4-Col Grid on Desktop (>= 768px) */}
                <div className="relative mt-8 md:mt-10">
                    {/* Mobile Left Progress Line (< md:) */}
                    <div className="absolute top-6 bottom-6 left-6 w-[2px] bg-[#E2DACD] md:hidden">
                        <motion.div
                            style={{ scaleY: progress }}
                            className="size-full origin-top bg-gradient-to-b from-[#C5A880] to-[#0E2A1E]"
                        />
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="space-y-4 pl-12 md:grid md:grid-cols-4 md:gap-5 md:space-y-0 md:pl-0"
                    >
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={staggerItem}
                                    whileHover={{
                                        y: -4,
                                        transition: {
                                            duration: 0.25,
                                            ease: [0.16, 1, 0.3, 1],
                                        },
                                    }}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-[#EAE5DC] bg-white p-4.5 shadow-[0_4px_20px_-8px_rgba(20,54,40,0.06)] transition-all duration-300 hover:border-[#C5A880]/70 hover:shadow-md sm:p-5"
                                >
                                    {/* Mobile Indicator Dot positioned on the line */}
                                    <div className="absolute top-5 -left-[3.25rem] flex size-7 items-center justify-center rounded-full border-2 border-[#C5A880] bg-white font-serif text-[11px] font-bold text-[#0E2A1E] shadow-2xs md:hidden">
                                        {step.number}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="hidden font-serif text-2xl font-bold text-[#1A1815] transition-colors group-hover:text-[#7A5B24] sm:text-3xl md:block">
                                                {step.number}
                                            </span>
                                            <span className="flex size-8 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110 sm:size-9">
                                                <Icon className="size-4 sm:size-4.5" />
                                            </span>
                                        </div>

                                        <h3 className="mt-2 font-serif text-sm font-bold text-[#1A1815] sm:text-base md:mt-4">
                                            {step.title}
                                        </h3>

                                        <p className="mt-1 text-xs leading-relaxed text-[#6E6962] sm:mt-2">
                                            {step.description}
                                        </p>
                                    </div>

                                    <div className="mt-3.5 flex items-center gap-1.5 border-t border-[#F0EBE1] pt-2.5 text-[9.5px] font-bold tracking-wider text-[#7A5B24] uppercase sm:mt-5 sm:pt-3 sm:text-[10px]">
                                        <span>TAHAP {idx + 1}</span>
                                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export const StepsSection = HowToOrder;
export default HowToOrder;
