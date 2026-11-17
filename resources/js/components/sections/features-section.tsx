import { Gem, MessageCircle, Palette, Truck } from 'lucide-react';
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

export function FeaturesSection() {
    const features = [
        {
            title: 'Kurasi Produk Pilihan',
            description:
                'Setiap isi hampers dipilih secara cermat dari produk berkualitas terbaik dan higienis untuk menghadirkan pengalaman membuka hadiah yang berkesan.',
            iconBg: 'bg-[#FAF0D7] text-[#8B6B38] border border-[#C5A880]/30',
            icon: Gem,
        },
        {
            title: 'Kustom Identitas & Kartu',
            description:
                'Bebas menambahkan logo perusahaan, pita serasi, serta kartu ucapan khusus yang dipersonalisasi sesuai kebutuhan acara Anda.',
            iconBg: 'bg-[#E2EBE5] text-[#0E2A1E] border border-[#0E2A1E]/15',
            icon: Palette,
        },
        {
            title: 'Pengiriman Aman & Tepat',
            description:
                'Dikemas rapi dengan perlindungan berlapis untuk memastikan setiap kotak hadiah tiba dalam kondisi sempurna dan tepat waktu di lokasi tujuan.',
            iconBg: 'bg-[#F5EEDD] text-[#8B6B38] border border-[#C5A880]/30',
            icon: Truck,
        },
        {
            title: 'Konsultasi Mudah Via WhatsApp',
            description:
                'Tim kami siap membantu merekomendasikan pilihan paket terbaik yang sesuai dengan tema acara maupun anggaran Anda secara langsung.',
            iconBg: 'bg-[#EAF3ED] text-[#0E2A1E] border border-[#0E2A1E]/15',
            icon: MessageCircle,
        },
    ];

    const stats = [
        {
            target: 98.8,
            decimals: 1,
            suffix: '%',
            label: 'PENGIRIMAN TEPAT WAKTU',
        },
        { target: 250, decimals: 0, suffix: '+', label: 'MITRA PERUSAHAAN' },
        {
            target: 12000,
            decimals: 0,
            suffix: '+',
            label: 'SENYUMAN PENERIMA HADIAH',
        },
    ];

    return (
        <section
            id="keunggulan"
            className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                        ✦ KEUNGGULAN KAMI ✦
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#1A1815] md:text-4xl lg:text-5xl">
                        Komitmen Kualitas &amp; Kepercayaan
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                        Setiap bingkisan kami rangkai dengan standar terbaik
                        untuk menjaga kesan hangat bagi orang terdekat maupun
                        citra positif perusahaan Anda.
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
                                className="group flex flex-col rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-2xs transition-shadow duration-300 hover:shadow-md"
                            >
                                <span
                                    className={`flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${feature.iconBg}`}
                                >
                                    <Icon className="size-5" />
                                </span>

                                <h3 className="mt-4 font-serif text-sm font-bold text-[#1A1815] md:text-base">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-[11px] leading-relaxed text-[#8C877E]">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Deep Emerald Stats Banner with Animated Count-Up */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-10 overflow-hidden rounded-2xl bg-[#0E2A1E] px-6 py-7 text-white shadow-xl"
                >
                    <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:divide-x sm:divide-white/10">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="px-4">
                                <span className="font-serif text-3xl font-normal tracking-tight text-white md:text-4xl">
                                    <AnimatedCounter
                                        target={stat.target}
                                        decimals={stat.decimals}
                                        suffix={stat.suffix}
                                    />
                                </span>
                                <span className="mt-1 block text-[9px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
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
