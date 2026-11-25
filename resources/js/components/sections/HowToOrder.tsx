import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import {
    Gift,
    Building2,
    CheckCircle2,
    PackageSearch,
    ArrowRight,
} from 'lucide-react';
import {
    fadeInUp,
    staggerContainer,
    staggerItem,
    viewportOnce,
} from '@/lib/motion';

export interface HowToOrderProps {
    orderGuideBadge?: string;
    orderGuideTitle?: string;
    orderGuideSubtitle?: string;
    orderGuideSteps?: Array<{
        number: string;
        title: string;
        description: string;
    }>;
}

export function HowToOrder({
    orderGuideBadge = 'PANDUAN PEMESANAN • SISTEM WEBSITE RESMI',
    orderGuideTitle = 'Alur Pemesanan Mudah & Transparan',
    orderGuideSubtitle = 'Seluruh transaksi diproses langsung di dalam website setelah Anda mendaftar atau masuk ke akun Anda, lengkap dengan konfirmasi instan dan pelacakan resi.',
    orderGuideSteps,
}: HowToOrderProps = {}) {
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

    const defaultSteps = [
        {
            number: '01',
            icon: Gift,
            title: 'Pilih Koleksi & Detail Isi',
            description:
                'Jelajahi kurasi katalog musiman kami dan periksa rincian daftar isi setiap paket hampers melalui modal detail produk.',
        },
        {
            number: '02',
            icon: Building2,
            title: 'Personal atau Corporate (Min. 25)',
            description:
                'Pesan langsung di website untuk paket personal (>1 paket) atau paket corporate dengan harga grosir resmi minimal 25 paket.',
        },
        {
            number: '03',
            icon: CheckCircle2,
            title: 'Lengkapi Alamat & Ucapan',
            description:
                'Isi data penerima, gunakan fitur deteksi alamat otomatis, dan tuliskan pesan kartu ucapan berstempel wax personal.',
        },
        {
            number: '04',
            icon: PackageSearch,
            title: 'Lacak Pesanan via Nomor Resi',
            description:
                'Pantau status pengerjaan di studio hingga perjalanan kurir secara real-time langsung di menu Lacak Pesanan website.',
        },
    ];

    const stepIcons = [Gift, Building2, CheckCircle2, PackageSearch];

    const steps =
        orderGuideSteps && orderGuideSteps.length === 4
            ? orderGuideSteps.map((s, idx) => ({
                  number: s.number,
                  icon: stepIcons[idx % stepIcons.length],
                  title: s.title,
                  description: s.description,
              }))
            : defaultSteps;

    return (
        <section
            ref={sectionRef}
            id="cara-pesan"
            className="relative bg-[#F2EBDC] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <span>{orderGuideBadge}</span>
                    </div>

                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#16233B] sm:text-4xl lg:text-5xl">
                        {orderGuideTitle}
                    </h2>

                    <p className="mt-3.5 text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                        {orderGuideSubtitle}
                    </p>
                </motion.div>

                {/* 1. Desktop & Tablet Horizontal Dynamic Connecting Line - Clean line with step circles above the cards */}
                <div className="relative mt-12 hidden md:block">
                    {/* Track Background spanning horizontally */}
                    <div className="absolute top-1/2 right-12 left-12 h-[2px] -translate-y-1/2 bg-[#A88B54]/30" />

                    {/* Dynamic ScaleX Fill Line */}
                    <motion.div
                        style={{ scaleX: progress }}
                        className="absolute top-1/2 right-12 left-12 h-[2px] origin-left -translate-y-1/2 bg-gradient-to-r from-[#A88B54] via-[#16233B] to-[#16233B]"
                    />

                    {/* Step Dots on the Track (Elevated and perfectly positioned on the connecting line) */}
                    <div className="relative flex justify-between px-10">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <span className="flex size-9 items-center justify-center rounded-full border-2 border-[#A88B54] bg-[#F2EBDC] font-serif text-xs font-bold text-[#16233B] shadow-sm transition-transform duration-300 hover:scale-110">
                                    {step.number}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Responsive Step Cards Grid (Positioned cleanly below the line with generous top margin so the line is NEVER covered) */}
                <div className="relative mt-10 md:mt-12">
                    {/* Mobile Left Progress Line: Mathematically Centered at 14px (< md:) */}
                    <div className="absolute top-4 bottom-4 left-[13px] w-[2px] bg-[#A88B54]/30 md:hidden">
                        <motion.div
                            style={{ scaleY: progress }}
                            className="size-full origin-top bg-gradient-to-b from-[#A88B54] to-[#16233B]"
                        />
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="space-y-4.5 pl-10 md:grid md:grid-cols-4 md:gap-5 md:space-y-0 md:pl-0"
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
                                    className="group relative flex flex-col justify-between rounded-2xl border border-[#A88B54]/25 bg-white p-4 shadow-[0_4px_20px_-8px_rgba(22,35,59,0.06)] transition-all duration-300 hover:border-[#A88B54] hover:shadow-md sm:p-5"
                                >
                                    {/* Mobile Indicator Dot centered exactly on the vertical line (x=14px) */}
                                    <div className="absolute top-4 -left-10 flex size-7 items-center justify-center rounded-full border-2 border-[#A88B54] bg-[#F2EBDC] font-serif text-[11px] font-bold text-[#16233B] shadow-2xs md:hidden">
                                        {step.number}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="hidden font-serif text-2xl font-bold text-[#16233B] transition-colors group-hover:text-[#A88B54] sm:text-3xl md:block">
                                                {step.number}
                                            </span>
                                            <span className="flex size-8 items-center justify-center rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC] text-[#16233B] shadow-2xs transition-transform duration-300 group-hover:scale-110 sm:size-9">
                                                <Icon className="size-4 sm:size-4.5" />
                                            </span>
                                        </div>

                                        <h3 className="mt-1 font-serif text-sm font-bold text-[#16233B] sm:text-base md:mt-4">
                                            {step.title}
                                        </h3>

                                        <p className="mt-1 text-xs leading-relaxed text-[#6E675D] sm:mt-2">
                                            {step.description}
                                        </p>
                                    </div>

                                    <div className="mt-3 flex items-center gap-1.5 border-t border-[#F2EBDC] pt-2 text-[9.5px] font-bold tracking-wider text-[#A88B54] uppercase sm:mt-5 sm:pt-3 sm:text-[10px]">
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

export default HowToOrder;
export { HowToOrder as StepsSection };
