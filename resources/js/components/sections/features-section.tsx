import { Gem, ShieldCheck, Palette, Truck, PackageSearch } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
    fadeInUp,
    staggerContainer,
    staggerItem,
    viewportOnce,
} from '@/lib/motion';

function AnimatedCounter({
    target,
    decimals = 0,
    suffix = '',
}: {
    target: number;
    decimals?: number;
    suffix?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isInView) return;

        let startTimestamp: number | null = null;
        const duration = 1600;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
                (timestamp - startTimestamp) / duration,
                1,
            );
            const easeOut =
                progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(easeOut * target);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        const frameId = window.requestAnimationFrame(step);
        return () => window.cancelAnimationFrame(frameId);
    }, [isInView, target]);

    const formatted =
        decimals > 0
            ? count.toFixed(decimals)
            : Math.floor(count).toLocaleString('id-ID');

    return (
        <span ref={ref}>
            {formatted}
            {suffix}
        </span>
    );
}

interface FeaturesSectionProps {
    dynamicStats?: {
        total_hampers_sold?: number;
        total_corporate_clients?: number;
        average_rating?: number;
        total_reviews?: number;
    };
    atelierBadge?: string;
    atelierTitle?: string;
    atelierSubtitle?: string;
    atelierCards?: Array<{
        title: string;
        shortDescription: string;
        description: string;
    }>;
}

export function FeaturesSection({
    dynamicStats,
    atelierBadge = 'STANDAR KRIYA • INTEGRITAS ATELIER',
    atelierTitle = 'Komitmen Kualitas & Kepercayaan Klien',
    atelierSubtitle = 'Setiap bingkisan kami rangkai dengan dedikasi tinggi untuk menjaga kehangatan relasi keluarga maupun citra positif instansi korporat Anda.',
    atelierCards,
}: FeaturesSectionProps) {
    const cardIcons = [Gem, Palette, Truck, PackageSearch];
    const cardBgs = [
        'bg-[#F2EBDC] text-[#16233B] border border-[#A88B54]/30',
        'bg-[#16233B]/10 text-[#16233B] border border-[#16233B]/20',
        'bg-[#F2EBDC] text-[#16233B] border border-[#A88B54]/30',
        'bg-[#16233B]/10 text-[#16233B] border border-[#16233B]/20',
    ];

    const defaultFeatures = [
        {
            title: 'Kurasi Bahan Pilihan',
            shortDescription:
                'Bahan pangan bermutu tinggi & higienis untuk kesan istimewa.',
            description:
                'Setiap isi hampers dipilih secara teliti dari produk bermutu terbaik dan higienis untuk menghadirkan pengalaman membuka hadiah yang berkesan.',
            iconBg: 'bg-[#F2EBDC] text-[#16233B] border border-[#A88B54]/30',
            icon: Gem,
        },
        {
            title: 'Kustom Grafir & Stempel Wax',
            shortDescription:
                'Kustomisasi logo korporat, pita satin, & kartu ucapan wax seal.',
            description:
                'Bebas menambahkan logo perusahaan via grafir laser, pita warna korporat, serta kartu ucapan khusus berstempel lilin wax mewah.',
            iconBg: 'bg-[#16233B]/10 text-[#16233B] border border-[#16233B]/20',
            icon: Palette,
        },
        {
            title: 'Pengiriman Aman Terproteksi',
            shortDescription:
                'Kemasan hardbox berlapis aman dengan perlindungan kurir.',
            description:
                'Dikemas rapi dengan perlindungan berlapis dan kurir atelier terlatih untuk memastikan kotak hadiah tiba dalam kondisi utuh.',
            iconBg: 'bg-[#F2EBDC] text-[#16233B] border border-[#A88B54]/30',
            icon: Truck,
        },
        {
            title: 'Sistem Lacak Resi Website',
            shortDescription:
                'Pemesanan langsung di website dengan nomor resi pelacakan.',
            description:
                'Pemesanan aman langsung di website dan kemudahan memantau setiap tahapan produksi hingga paket diterima melalui menu Lacak Pesanan.',
            iconBg: 'bg-[#16233B]/10 text-[#16233B] border border-[#16233B]/20',
            icon: PackageSearch,
        },
    ];

    const features =
        atelierCards && atelierCards.length === 4
            ? atelierCards.map((c, idx) => ({
                  title: c.title,
                  shortDescription: c.shortDescription,
                  description: c.description,
                  iconBg: cardBgs[idx % cardBgs.length],
                  icon: cardIcons[idx % cardIcons.length],
              }))
            : defaultFeatures;

    // Real-Life Dynamic Statistics from database starting strictly from 0
    const stats = [
        {
            target: dynamicStats?.total_hampers_sold ?? 0,
            decimals: 0,
            suffix: '+',
            label: 'HAMPERS TERKIRIM',
        },
        {
            target: dynamicStats?.total_corporate_clients ?? 0,
            decimals: 0,
            suffix: '+',
            label: 'KLIEN KORPORAT',
        },
        {
            target: dynamicStats?.average_rating ?? 0.0,
            decimals: 1,
            suffix: ' / 5.0',
            label: 'RATING KEPUASAN REAL-TIME',
        },
    ];

    return (
        <section
            id="keunggulan"
            className="bg-[#F2EBDC] py-12 sm:py-16 lg:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <span>{atelierBadge}</span>
                    </div>
                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#16233B] md:text-4xl lg:text-5xl">
                        {atelierTitle}
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                        {atelierSubtitle}
                    </p>
                </div>

                {/* 4 Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-4"
                >
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
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
                                className="group flex h-full flex-col justify-between rounded-2xl border border-[#A88B54]/25 bg-white p-4 shadow-2xs transition-shadow duration-300 hover:border-[#A88B54] hover:shadow-md sm:p-5"
                            >
                                <div>
                                    <span
                                        className={`flex size-8 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:size-10 ${feature.iconBg}`}
                                    >
                                        <Icon className="size-4 sm:size-5" />
                                    </span>

                                    <h3 className="mt-3 font-serif text-xs leading-snug font-bold text-[#16233B] sm:text-base">
                                        {feature.title}
                                    </h3>
                                </div>

                                <p className="mt-2 text-[10px] leading-relaxed text-[#6E675D] sm:text-[11px]">
                                    <span className="block sm:hidden">
                                        {feature.shortDescription}
                                    </span>
                                    <span className="hidden sm:block">
                                        {feature.description}
                                    </span>
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Deep Navy Stats Banner with Real-Life Dynamic Statistics */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-8 overflow-hidden rounded-2xl border border-[#A88B54]/30 bg-[#16233B] px-4 py-5 text-white shadow-xl sm:mt-10 sm:px-6 sm:py-7"
                >
                    <div className="grid grid-cols-3 gap-2 divide-x divide-white/10 text-center sm:gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="px-1 sm:px-4">
                                <span className="font-serif text-lg font-normal tracking-tight text-[#F2EBDC] sm:text-3xl md:text-4xl">
                                    <AnimatedCounter
                                        target={stat.target}
                                        decimals={stat.decimals}
                                        suffix={stat.suffix}
                                    />
                                </span>
                                <span className="mt-1 block text-[8px] font-bold tracking-[0.14em] text-[#A88B54] uppercase sm:text-[9px] sm:tracking-[0.2em]">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export { FeaturesSection as WhyUs, FeaturesSection as WhyUsSection };
export default FeaturesSection;
