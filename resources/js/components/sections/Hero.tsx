import { useRef, type ReactNode } from 'react';
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useScroll,
    MotionConfig,
} from 'motion/react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export interface HeroProps {
    whatsappNumber?: string;
    heroBadge?: string;
    heroTitlePrefix?: string;
    heroDescription?: string;
}

/**
 * Magnetic button wrapper for subtle interactive feedback
 */
function MagneticButton({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const smoothX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const smoothY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        x.set(distanceX * 0.18);
        y.set(distanceY * 0.18);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: smoothX, y: smoothY }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
}

export function Hero({
    whatsappNumber = '6281572414233',
    heroBadge = 'Signature Atelier Hampers & Gift',
    heroTitlePrefix = 'Hampers Eksklusif',
    heroDescription = 'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.',
}: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null);

    // Scroll-linked Parallax for atmospheric luxury feel
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const parallaxTextY = useTransform(scrollYProgress, [0, 1], [0, 24]);

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik bertanya mengenai koleksi hampers premium & corporate gifting.',
    )}`;

    const cleanKicker = (heroBadge || 'Signature Atelier Hampers & Gift')
        .replace(/^[✦*✨\s]+|[✦*✨\s]+$/g, '')
        .trim();

    return (
        <MotionConfig reducedMotion="user">
            <section
                ref={sectionRef}
                className="relative flex min-h-[calc(100svh-4.75rem)] flex-col justify-between pt-6 pb-0 sm:pt-10 sm:pb-0 lg:h-[calc(100vh-4.75rem)] lg:max-h-[820px] lg:min-h-[580px] lg:py-6"
            >
                {/* Center Editorial Hero Area */}
                <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 text-center sm:px-8 lg:px-12">
                    <motion.div
                        style={{ y: parallaxTextY }}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center space-y-5 sm:space-y-6"
                    >
                        {/* 1. Atelier Metadata Tag */}
                        <motion.div
                            variants={staggerItem}
                            className="inline-flex items-center gap-2.5 rounded-full border border-[#D5CEC2]/75 bg-white/70 px-4 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#8C877E] uppercase shadow-2xs backdrop-blur-xs sm:text-[11px]"
                        >
                            <span className="font-bold text-[#9E7E45]">
                                ATELIER GALUH &amp; CO.
                            </span>
                            <span className="size-1 rounded-full bg-[#C5A880]" />
                            <span>{cleanKicker}</span>
                        </motion.div>

                        {/* 2. Headline with High-Craft Serif Typography */}
                        <motion.h1
                            variants={staggerItem}
                            className="font-serif text-4xl leading-[1.12] font-normal tracking-tight text-[#1A1815] sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.4rem]"
                        >
                            <span>
                                {heroTitlePrefix || 'Hampers Eksklusif'}
                            </span>{' '}
                            <span className="font-normal text-[#9E7E45] italic">
                                Sentuhan Personal
                            </span>{' '}
                            <br className="hidden sm:inline" />
                            <span>untuk Momen Istimewa.</span>
                        </motion.h1>

                        {/* 3. Description */}
                        <motion.p
                            variants={staggerItem}
                            className="max-w-2xl text-base leading-relaxed text-[#5C564C] sm:text-lg lg:text-[17px]"
                        >
                            {heroDescription}
                        </motion.p>

                        {/* 4. Action Buttons */}
                        <motion.div
                            variants={staggerItem}
                            className="flex flex-wrap items-center justify-center gap-3.5 pt-2 sm:gap-4 sm:pt-3"
                        >
                            <MagneticButton>
                                <a
                                    href="#koleksi"
                                    className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#0E2A1E] px-7 py-3.5 text-xs font-bold tracking-[0.14em] text-white shadow-sm transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md sm:px-8 sm:py-4"
                                >
                                    <span>JELAJAHI KOLEKSI</span>
                                    <ArrowRight className="size-3.5 text-[#C5A880] transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </MagneticButton>

                            <MagneticButton>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-[#D5CEC2] bg-white px-6 py-3.5 text-xs font-bold tracking-[0.12em] text-[#0E2A1E] shadow-2xs transition-all duration-300 hover:border-[#0E2A1E] hover:bg-[#FAF8F5] sm:px-7 sm:py-4"
                                >
                                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                                    <span>KONSULTASI HAMPERS</span>
                                </a>
                            </MagneticButton>
                        </motion.div>

                        {/* 5. Clean 3-Part Metric Strip */}
                        <motion.div
                            variants={staggerItem}
                            className="grid w-full max-w-2xl grid-cols-3 gap-4 border-t border-[#EAE5DC] pt-6 sm:gap-8 sm:pt-8"
                        >
                            <div>
                                <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1815] sm:text-3xl lg:text-4xl">
                                    5,000+
                                </span>
                                <p className="mt-1 text-[10px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[11px]">
                                    Hampers Terkirim
                                </p>
                            </div>
                            <div className="border-l border-[#EAE5DC] pl-4 sm:pl-8">
                                <span className="font-serif text-2xl font-bold tracking-tight text-[#0E2A1E] sm:text-3xl lg:text-4xl">
                                    100+
                                </span>
                                <p className="mt-1 text-[10px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[11px]">
                                    Klien Korporat
                                </p>
                            </div>
                            <div className="border-l border-[#EAE5DC] pl-4 sm:pl-8">
                                <span className="font-serif text-2xl font-bold tracking-tight text-[#9E7E45] sm:text-3xl lg:text-4xl">
                                    4.9 / 5.0
                                </span>
                                <p className="mt-1 text-[10px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[11px]">
                                    Rating Kepuasan
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Atelier Silk Ribbon Running Marquee - Pinned Elegantly at Hero Baseline */}
                <div className="mt-4 overflow-hidden border-y border-[#EAE3D6] bg-white/40 py-2.5 backdrop-blur-xs sm:py-3">
                    <div className="relative flex overflow-hidden">
                        {/* Soft Edge Gradient Masks */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF7F2] to-transparent sm:w-24" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF7F2] to-transparent sm:w-24" />

                        <motion.div
                            animate={{ x: ['0%', '-50%'] }}
                            transition={{
                                repeat: Infinity,
                                ease: 'linear',
                                duration: 32,
                            }}
                            className="flex shrink-0 items-center gap-8 py-0.5 text-[10px] font-semibold tracking-[0.24em] whitespace-nowrap text-[#5C564C] uppercase sm:text-[11px]"
                        >
                            {[
                                'BUTTER WIJSMAN BELANDA',
                                'HARDBOX LINEN ZAMRUD 1200GSM',
                                'PITA VELVET & SATIN SUTRA',
                                'STEMPEL LILIN WAX ASLI',
                                'GRAFIR LASER MONOGRAM PERSONAL',
                                'KUE KERING ARTISAN RESEP KLASIK',
                                'BOROSILIKAT TAHAN PANAS',
                                'PENGIRIMAN AMAN SELURUH NUSANTARA',
                                'BUTTER WIJSMAN BELANDA',
                                'HARDBOX LINEN ZAMRUD 1200GSM',
                                'PITA VELVET & SATIN SUTRA',
                                'STEMPEL LILIN WAX ASLI',
                                'GRAFIR LASER MONOGRAM PERSONAL',
                                'KUE KERING ARTISAN RESEP KLASIK',
                                'BOROSILIKAT TAHAN PANAS',
                                'PENGIRIMAN AMAN SELURUH NUSANTARA',
                            ].map((item, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-8"
                                >
                                    <span>{item}</span>
                                    <span className="size-1 rounded-full bg-[#C5A880]" />
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </MotionConfig>
    );
}

export const HeroSection = Hero;
