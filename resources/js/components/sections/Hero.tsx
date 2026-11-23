import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
    motion,
    AnimatePresence,
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
    activeEdition?: string;
    heroEyebrow?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroTagline?: string;
}

const ROTATING_TARGETS = [
    'Personal & Perusahaan',
    'Mitra Perusahaan',
    'Momen Istimewa',
    'Momen yang Tak Diulang',
];

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

/**
 * Left Floating Hamper (Signature Artisanal Woven Rattan Hamper)
 * Pure product cut-out without frame or card.
 * High-craft levitation physics: smooth sine float, reactive mouse tilt, and breathing contact shadow.
 */
function FloatingHamperLeft({
    onScrollToCatalog,
    mouseSpringX,
    mouseSpringY,
}: {
    onScrollToCatalog: () => void;
    mouseSpringX: any;
    mouseSpringY: any;
}) {
    // Parallax mouse depth tracking
    const tiltX = useTransform(mouseSpringX, [-600, 600], [-16, 12]);
    const tiltY = useTransform(mouseSpringY, [-450, 450], [-12, 12]);
    const tiltRotate = useTransform(mouseSpringX, [-600, 600], [-5, 2]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -70, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ x: tiltX, y: tiltY, rotate: tiltRotate }}
            className="pointer-events-none absolute top-[38%] -left-6 z-10 block w-18 -translate-y-1/2 opacity-60 transition-all sm:-left-3 sm:w-32 sm:opacity-95 md:w-44 lg:left-3 lg:w-56 xl:left-8 xl:w-72 2xl:left-14 2xl:w-84"
        >
            <div
                onClick={onScrollToCatalog}
                role="button"
                tabIndex={0}
                aria-label="Lihat Koleksi Artisan Rattan di Katalog"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onScrollToCatalog();
                    }
                }}
                className="animate-float-left group pointer-events-auto relative cursor-pointer transition-transform duration-300 select-none hover:scale-105"
                title="Lihat Koleksi Artisan Rattan"
            >
                {/* Pure Product Cut-out without card or frame (High-efficiency WebP) */}
                <img
                    src="/images/floating-hamper-rattan.webp"
                    alt="Signature Heritage Rattan Hamper GALUH & CO."
                    className="h-auto w-full object-contain drop-shadow-[0_8px_14px_rgba(26,24,21,0.10)] drop-shadow-[0_24px_32px_rgba(26,24,21,0.18)] filter transition-all duration-500 group-hover:drop-shadow-[0_32px_42px_rgba(26,24,21,0.25)]"
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={480}
                    draggable={false}
                />

                {/* Breathing 3D Ground Contact Shadow (Compositor GPU animation) */}
                <div className="animate-breath-shadow pointer-events-none mx-auto -mt-2 h-4 w-4/5 rounded-[100%] bg-gradient-to-r from-transparent via-[#2A2318]/28 to-transparent blur-md" />
            </div>
        </motion.div>
    );
}

/**
 * Right Floating Hamper (Executive Emerald & Gold Corporate Hamper)
 * Pure product cut-out without frame or card.
 * High-craft levitation physics: smooth sine float, reactive mouse tilt, and breathing contact shadow.
 */
function FloatingHamperRight({
    onScrollToCatalog,
    mouseSpringX,
    mouseSpringY,
}: {
    onScrollToCatalog: () => void;
    mouseSpringX: any;
    mouseSpringY: any;
}) {
    // Parallax mouse depth tracking (counter-movement creates immersive 3D depth)
    const tiltX = useTransform(mouseSpringX, [-600, 600], [12, -16]);
    const tiltY = useTransform(mouseSpringY, [-450, 450], [12, -12]);
    const tiltRotate = useTransform(mouseSpringX, [-600, 600], [2, -5]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 70, scale: 0.88 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ x: tiltX, y: tiltY, rotate: tiltRotate }}
            className="pointer-events-none absolute top-[50%] -right-6 z-10 block w-20 -translate-y-1/2 opacity-60 transition-all sm:-right-3 sm:w-36 sm:opacity-95 md:w-48 lg:right-3 lg:w-60 xl:right-8 xl:w-76 2xl:right-14 2xl:w-88"
        >
            <div
                onClick={onScrollToCatalog}
                role="button"
                tabIndex={0}
                aria-label="Lihat Koleksi Corporate Executive di Katalog"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onScrollToCatalog();
                    }
                }}
                className="animate-float-right group pointer-events-auto relative cursor-pointer transition-transform duration-300 select-none hover:scale-105"
                title="Lihat Koleksi Corporate Executive"
            >
                {/* Pure Product Cut-out without card or frame (High-efficiency WebP) */}
                <img
                    src="/images/floating-hamper-emerald.webp"
                    alt="Emerald Executive Corporate Gifting GALUH & CO."
                    className="h-auto w-full object-contain drop-shadow-[0_8px_14px_rgba(26,24,21,0.10)] drop-shadow-[0_24px_32px_rgba(26,24,21,0.18)] filter transition-all duration-500 group-hover:drop-shadow-[0_32px_42px_rgba(26,24,21,0.25)]"
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={480}
                    draggable={false}
                />

                {/* Breathing 3D Ground Contact Shadow (Compositor GPU animation) */}
                <div className="animate-breath-shadow pointer-events-none mx-auto -mt-2 h-4 w-4/5 rounded-[100%] bg-gradient-to-r from-transparent via-[#2A2318]/28 to-transparent blur-md" />
            </div>
        </motion.div>
    );
}

export function Hero({
    whatsappNumber = '6281572414233',
    heroBadge = 'Signature Atelier Hampers & Gift',
    heroTitlePrefix = 'Hampers Eksklusif',
    heroDescription = 'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.',
    activeEdition,
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    heroTagline,
}: HeroProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [phraseIndex, setPhraseIndex] = useState(0);

    // Global cursor tracking across the hero section for 3D parallax depth
    const mouseSectionX = useMotionValue(0);
    const mouseSectionY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseSectionX, {
        stiffness: 70,
        damping: 24,
    });
    const smoothMouseY = useSpring(mouseSectionY, {
        stiffness: 70,
        damping: 24,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseSectionX.set(e.clientX - centerX);
        mouseSectionY.set(e.clientY - centerY);
    };

    // Dynamic Editorial Keyword Transition (Continuous luxury cycle without cliché typewriter)
    useEffect(() => {
        const timer = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % ROTATING_TARGETS.length);
        }, 3600);
        return () => clearInterval(timer);
    }, []);

    // Scroll-linked Parallax for atmospheric luxury feel
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const parallaxTextY = useTransform(scrollYProgress, [0, 1], [0, 20]);

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik bertanya mengenai koleksi hampers premium & corporate gifting.',
    )}`;

    const cleanKicker = (heroBadge || 'Signature Atelier Hampers & Gift')
        .replace(/^[✦*✨\s]+|[✦*✨\s]+$/g, '')
        .trim();

    const handleScrollToCatalog = () => {
        const el = document.getElementById('koleksi');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <MotionConfig reducedMotion="user">
            {/* ========================================================
                HERO SECTION — Kinetic Quiet Luxury Lookbook
                Seamless, fluid, organic & prestigious on all screens
            ======================================================== */}
            <section
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden pt-24 pb-4 sm:min-h-[100svh] sm:pt-26 sm:pb-6 md:pt-22 md:pb-3"
            >
                {/* 1. Left Floating Hamper (Artisanal Rattan) - Pure Product, No Card/Frame */}
                <FloatingHamperLeft
                    onScrollToCatalog={handleScrollToCatalog}
                    mouseSpringX={smoothMouseX}
                    mouseSpringY={smoothMouseY}
                />

                {/* 2. Right Floating Hamper (Executive Emerald) - Pure Product, No Card/Frame */}
                <FloatingHamperRight
                    onScrollToCatalog={handleScrollToCatalog}
                    mouseSpringX={smoothMouseX}
                    mouseSpringY={smoothMouseY}
                />

                {/* Center Editorial Hero Area - Perfectly Scaled to Always Fit Viewport */}
                <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 text-center sm:px-6 lg:max-w-4xl lg:px-8">
                    <motion.div
                        style={{ y: parallaxTextY }}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center space-y-3 sm:space-y-4 lg:space-y-4"
                    >
                        {/* Atelier Metadata Tag */}
                        <motion.div
                            variants={staggerItem}
                            className="inline-flex items-center gap-2 rounded-full border border-[#D5CEC2]/75 bg-white/70 px-3.5 py-1 text-[9.5px] font-semibold tracking-[0.2em] text-[#8C877E] uppercase shadow-2xs backdrop-blur-xs sm:px-4 sm:py-1.5 sm:text-[10.5px]"
                        >
                            <span className="font-bold text-[#7A5B24]">
                                {heroEyebrow || 'ATELIER GALUH & CO.'}
                            </span>
                            <span className="size-1 rounded-full bg-[#C5A880]" />
                            <span>{activeEdition || cleanKicker}</span>
                        </motion.div>

                        {/* Headline with High-Craft Serif Typography & Kinetic Target Glide */}
                        <motion.h1
                            variants={staggerItem}
                            className="font-serif text-[1.85rem] leading-[1.2] font-normal tracking-tight text-[#1A1815] sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.35rem]"
                        >
                            <span className="block">
                                {heroTitlePrefix ||
                                    (heroTitle &&
                                    heroTitle.toLowerCase().includes(' untuk')
                                        ? heroTitle.split(/\s+untuk\b/i)[0]
                                        : 'Hampers Eksklusif')}{' '}
                                <span className="font-normal text-[#7A5B24] italic">
                                    untuk
                                </span>
                            </span>
                            <span className="relative mt-1 block min-h-[1.25em] overflow-hidden sm:mt-1.5">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={ROTATING_TARGETS[phraseIndex]}
                                        initial={{
                                            y: 30,
                                            opacity: 0,
                                            filter: 'blur(5px)',
                                        }}
                                        animate={{
                                            y: 0,
                                            opacity: 1,
                                            filter: 'blur(0px)',
                                        }}
                                        exit={{
                                            y: -30,
                                            opacity: 0,
                                            filter: 'blur(5px)',
                                        }}
                                        transition={{
                                            duration: 0.55,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="inline-block bg-gradient-to-r from-[#7A5B24] via-[#8C6D37] to-[#5C4215] bg-clip-text font-normal text-transparent italic"
                                    >
                                        {ROTATING_TARGETS[phraseIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={staggerItem}
                            className="max-w-xl text-xs leading-relaxed text-[#5C564C] sm:text-sm md:text-base lg:text-[15px]"
                        >
                            {heroSubtitle || heroDescription}
                        </motion.p>

                        {/* Optional Atelier Tagline from CMS */}
                        {heroTagline && (
                            <motion.p
                                variants={staggerItem}
                                className="font-serif text-xs text-[#7A5B24] italic sm:text-[13px]"
                            >
                                “{heroTagline}”
                            </motion.p>
                        )}

                        {/* Action Buttons (Full-width & Structured on Mobile, Inline on Desktop) */}
                        <motion.div
                            variants={staggerItem}
                            className="flex w-full flex-col items-stretch justify-center gap-2.5 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5 sm:pt-2"
                        >
                            <MagneticButton>
                                <a
                                    href="#koleksi"
                                    aria-label="Jelajahi Koleksi Hampers"
                                    className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0E2A1E] px-6 py-3.5 text-[11px] font-bold tracking-[0.14em] text-white shadow-sm transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md sm:w-auto sm:px-7 sm:py-3.5 sm:text-xs"
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
                                    aria-label="Konsultasi Hampers via WhatsApp"
                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#D5CEC2] bg-white px-5 py-3.5 text-[11px] font-bold tracking-[0.12em] text-[#0E2A1E] shadow-2xs transition-all duration-300 hover:border-[#0E2A1E] hover:bg-[#FAF8F5] sm:w-auto sm:px-6.5 sm:py-3.5 sm:text-xs"
                                >
                                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                                    <span>KONSULTASI HAMPERS</span>
                                </a>
                            </MagneticButton>
                        </motion.div>

                        {/* Clean 3-Part Metric Strip (Structured Pill on Mobile) */}
                        <motion.div
                            variants={staggerItem}
                            className="mt-1 grid w-full max-w-xl grid-cols-3 gap-2 rounded-2xl border border-[#EAE5DC] bg-white/70 p-2.5 text-center shadow-2xs backdrop-blur-xs sm:mt-0 sm:gap-6 sm:rounded-none sm:border-x-0 sm:border-t sm:border-b-0 sm:bg-transparent sm:p-0 sm:pt-4 sm:shadow-none sm:backdrop-blur-none"
                        >
                            <div className="flex flex-col justify-center">
                                <span className="font-serif text-lg font-bold tracking-tight text-[#1A1815] sm:text-2xl lg:text-3xl">
                                    5,000+
                                </span>
                                <p className="mt-0.5 text-[8.5px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[10px]">
                                    Hampers Terkirim
                                </p>
                            </div>
                            <div className="flex flex-col justify-center border-l border-[#EAE5DC] pl-2 sm:pl-6">
                                <span className="font-serif text-lg font-bold tracking-tight text-[#0E2A1E] sm:text-2xl lg:text-3xl">
                                    100+
                                </span>
                                <p className="mt-0.5 text-[8.5px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[10px]">
                                    Klien Korporat
                                </p>
                            </div>
                            <div className="flex flex-col justify-center border-l border-[#EAE5DC] pl-2 sm:pl-6">
                                <span className="font-serif text-lg font-bold tracking-tight text-[#9E7E45] sm:text-2xl lg:text-3xl">
                                    4.9 / 5.0
                                </span>
                                <p className="mt-0.5 text-[8.5px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[10px]">
                                    Rating Kepuasan
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Atelier Silk Ribbon Running Marquee - Fits Viewport Naturally Without Cut-Off */}
                <div className="relative z-20 mt-2 overflow-hidden border-y border-[#EAE3D6] bg-white/40 py-2 backdrop-blur-xs sm:mt-3 sm:py-2.5">
                    <div className="relative flex overflow-hidden">
                        {/* Soft Edge Gradient Masks */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF7F2] to-transparent sm:w-24" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF7F2] to-transparent sm:w-24" />

                        {/* Pure CSS Hardware-Accelerated Marquee (Zero JS Main-Thread Overhead) */}
                        <div className="animate-marquee-css flex shrink-0 items-center gap-8 py-0.5 text-[9.5px] font-semibold tracking-[0.24em] whitespace-nowrap text-[#5C564C] uppercase sm:text-[10.5px]">
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
                        </div>
                    </div>
                </div>
            </section>
        </MotionConfig>
    );
}

export const HeroSection = Hero;
export default Hero;
