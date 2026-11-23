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
];

const MOBILE_EDITIONS = [
    {
        id: 'raya',
        label: 'Idul Fitri',
        badge: 'Edisi Ramadan & Raya 1447 H',
        image: '/images/product_bamboo_box.jpg',
        title: 'Kriya Bingkisan Hangat Hari Raya',
    },
    {
        id: 'corporate',
        label: 'Corporate B2B',
        badge: 'Executive Gifting & Monogram',
        image: '/images/product_emerald_box.jpg',
        title: 'Apresiasi Prestisius Kemitraan Bisnis',
    },
    {
        id: 'festive',
        label: 'Natal & Tahun Baru',
        badge: 'Festive Season & Luminary',
        image: '/images/product_rattan_box.jpg',
        title: 'Kemewahan Momen Akhir Tahun',
    },
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
            className="pointer-events-none absolute top-[43%] -left-3 z-10 hidden md:block -translate-y-1/2 opacity-90 transition-opacity md:w-44 lg:left-3 lg:w-56 xl:left-8 xl:w-72 2xl:left-14 2xl:w-84"
        >
            <motion.div
                animate={{
                    y: [-16, 14, -16],
                    rotate: [-3, 2, -3],
                    x: [-4, 6, -4],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.05, y: -8 }}
                onClick={onScrollToCatalog}
                role="button"
                tabIndex={0}
                aria-label="Lihat Koleksi Artisan Rattan di Katalog"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onScrollToCatalog();
                    }
                }}
                className="group pointer-events-auto relative cursor-pointer select-none"
                title="Lihat Koleksi Artisan Rattan"
            >
                {/* Pure Product Cut-out without card or frame */}
                <img
                    src="/images/floating-hamper-rattan.png"
                    alt="Signature Heritage Rattan Hamper GALUH & CO."
                    className="h-auto w-full object-contain drop-shadow-[0_8px_14px_rgba(26,24,21,0.10)] drop-shadow-[0_24px_32px_rgba(26,24,21,0.18)] filter transition-all duration-500 group-hover:drop-shadow-[0_32px_42px_rgba(26,24,21,0.25)]"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    width={480}
                    height={480}
                    draggable={false}
                />

                {/* Breathing 3D Ground Contact Shadow */}
                <motion.div
                    animate={{
                        scaleX: [0.85, 1.08, 0.85],
                        scaleY: [0.72, 1.04, 0.72],
                        opacity: [0.2, 0.38, 0.2],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="pointer-events-none mx-auto -mt-2 h-4 w-4/5 rounded-[100%] bg-gradient-to-r from-transparent via-[#2A2318]/28 to-transparent blur-md"
                />
            </motion.div>
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
            className="pointer-events-none absolute top-[51%] -right-3 z-10 hidden md:block -translate-y-1/2 opacity-90 transition-opacity md:w-48 lg:right-3 lg:w-60 xl:right-8 xl:w-76 2xl:right-14 2xl:w-88"
        >
            <motion.div
                animate={{
                    y: [14, -16, 14],
                    rotate: [2.5, -2.5, 2.5],
                    x: [5, -5, 5],
                }}
                transition={{
                    duration: 7.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.8,
                }}
                whileHover={{ scale: 1.05, y: -8 }}
                onClick={onScrollToCatalog}
                role="button"
                tabIndex={0}
                aria-label="Lihat Koleksi Corporate Executive di Katalog"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onScrollToCatalog();
                    }
                }}
                className="group pointer-events-auto relative cursor-pointer select-none"
                title="Lihat Koleksi Corporate Executive"
            >
                {/* Pure Product Cut-out without card or frame */}
                <img
                    src="/images/floating-hamper-emerald.png"
                    alt="Emerald Executive Corporate Gifting GALUH & CO."
                    className="h-auto w-full object-contain drop-shadow-[0_8px_14px_rgba(26,24,21,0.10)] drop-shadow-[0_24px_32px_rgba(26,24,21,0.18)] filter transition-all duration-500 group-hover:drop-shadow-[0_32px_42px_rgba(26,24,21,0.25)]"
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    width={480}
                    height={480}
                    draggable={false}
                />

                {/* Breathing 3D Ground Contact Shadow */}
                <motion.div
                    animate={{
                        scaleX: [1.08, 0.85, 1.08],
                        scaleY: [1.04, 0.72, 1.04],
                        opacity: [0.38, 0.2, 0.38],
                    }}
                    transition={{
                        duration: 7.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.8,
                    }}
                    className="pointer-events-none mx-auto -mt-2 h-4 w-4/5 rounded-[100%] bg-gradient-to-r from-transparent via-[#2A2318]/28 to-transparent blur-md"
                />
            </motion.div>
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
    const [selectedMobileEdition, setSelectedMobileEdition] = useState(0);

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
                1. MOBILE HERO — Quiet Luxury Editorial Cover (< 768px)
                Spacious, perfectly proportioned, zero clutter
            ======================================================== */}
            <section className="relative flex md:hidden flex-col items-center pt-20 pb-8 px-5 text-center overflow-hidden bg-[#FAF7F2]">
                {/* 1. Atelier Eyebrow Kicker */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D5CEC2] bg-white/90 px-3.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#7A5B24] uppercase shadow-2xs backdrop-blur-md">
                    <span>✦ {activeEdition || 'EDISI RAMADAN & RAYA 1447 H'} ✦</span>
                </div>

                {/* 2. Command Headline & Calm Narrative */}
                <h1 className="mt-4 font-serif text-[1.85rem] leading-[1.18] font-normal tracking-tight text-[#1A1815] max-w-sm">
                    {heroTitle || 'Kriya Bingkisan untuk Momen yang Tak Diulang.'}
                </h1>
                <p className="mt-2.5 text-xs leading-relaxed text-[#5C564C] max-w-xs">
                    {heroSubtitle || heroDescription}
                </p>

                {/* 3. Centerpiece Hamper Visual (Sculptural Luxury Frame) */}
                <div className="relative w-full max-w-[340px] aspect-[4/3.8] overflow-hidden rounded-[2rem] my-5 shadow-[0_16px_36px_-10px_rgba(26,24,21,0.18)] border border-[#EAE5DC] bg-[#0E2A1E]">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={MOBILE_EDITIONS[selectedMobileEdition].image}
                            src={MOBILE_EDITIONS[selectedMobileEdition].image}
                            alt={MOBILE_EDITIONS[selectedMobileEdition].title}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                                duration: 0.45,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="size-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                            decoding="sync"
                            width={480}
                            height={450}
                        />
                    </AnimatePresence>

                    {/* Ambient Dark Gradient Vignette for Text Legibility */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Overlay Badges */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                        <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#FAF0D7] uppercase backdrop-blur-md">
                            ✦ {MOBILE_EDITIONS[selectedMobileEdition].badge}
                        </span>
                        <span className="font-serif text-[11px] text-white/90 italic drop-shadow-sm">
                            Galuh &amp; Co.
                        </span>
                    </div>
                </div>

                {/* 4. Elegant Minimalist Pill Switcher */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
                    {MOBILE_EDITIONS.map((ed, idx) => {
                        const isActive = selectedMobileEdition === idx;
                        return (
                            <button
                                key={ed.id}
                                type="button"
                                onClick={() => setSelectedMobileEdition(idx)}
                                aria-pressed={isActive}
                                className={`rounded-full px-3.5 py-1 text-[10.5px] font-semibold tracking-wider transition-all active:scale-95 ${
                                    isActive
                                        ? 'bg-[#0E2A1E] text-white shadow-xs'
                                        : 'border border-[#D5CEC2] bg-white text-[#5C564C]'
                                }`}
                            >
                                <span>{ed.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* 5. Primary CTA & WhatsApp Link */}
                <div className="mt-5 w-full max-w-xs space-y-2.5">
                    <button
                        type="button"
                        onClick={handleScrollToCatalog}
                        aria-label="Jelajahi Koleksi Hampers"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0E2A1E] py-3.5 text-xs font-bold tracking-[0.14em] text-white shadow-md transition-transform active:scale-98"
                    >
                        <span>JELAJAHI KOLEKSI</span>
                        <ArrowRight className="size-3.5 text-[#C5A880]" />
                    </button>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Konsultasi Hampers via WhatsApp"
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D5CEC2] bg-white py-2.5 text-[11px] font-bold tracking-[0.12em] text-[#0E2A1E] shadow-2xs transition-all active:scale-98"
                    >
                        <WhatsAppIcon className="size-3.5 text-[#25D366]" />
                        <span>KONSULTASI HAMPERS VIA WA</span>
                    </a>
                </div>

                {/* 6. Clean Luxury Trust Strip Bar (Placed naturally below hero, spacious & prestigious) */}
                <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-2 rounded-2xl border border-[#EAE5DC] bg-white/70 py-3.5 px-2 text-center shadow-2xs backdrop-blur-xs">
                    <div>
                        <span className="font-serif text-lg font-bold tracking-tight text-[#1A1815]">
                            5,000+
                        </span>
                        <p className="mt-0.5 text-[8px] font-semibold tracking-wider text-[#8C877E] uppercase">
                            Hampers Terkirim
                        </p>
                    </div>
                    <div className="border-l border-[#EAE5DC] pl-2">
                        <span className="font-serif text-lg font-bold tracking-tight text-[#0E2A1E]">
                            100+
                        </span>
                        <p className="mt-0.5 text-[8px] font-semibold tracking-wider text-[#8C877E] uppercase">
                            Mitra Korporat
                        </p>
                    </div>
                    <div className="border-l border-[#EAE5DC] pl-2">
                        <span className="font-serif text-lg font-bold tracking-tight text-[#7A5B24]">
                            4.9 / 5.0
                        </span>
                        <p className="mt-0.5 text-[8px] font-semibold tracking-wider text-[#8C877E] uppercase">
                            Ulasan Klien
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================
                2. DESKTOP HERO — Unaltered Kinetic Lookbook & 3D Floating Hampers (md: & lg:)
            ======================================================== */}
            <section
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                className="relative hidden md:flex min-h-[100svh] flex-col justify-between overflow-hidden pt-20 pb-2 sm:pt-24 sm:pb-3 lg:pt-22 lg:pb-3"
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
                            className="font-serif text-3xl leading-[1.2] font-normal tracking-tight text-[#1A1815] sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.35rem]"
                        >
                            {heroTitle ? (
                                <span className="block">{heroTitle}</span>
                            ) : (
                                <>
                                    <span className="block">
                                        {heroTitlePrefix || 'Hampers Eksklusif'}{' '}
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
                                </>
                            )}
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

                        {/* Action Buttons */}
                        <motion.div
                            variants={staggerItem}
                            className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:gap-3.5 sm:pt-2"
                        >
                            <MagneticButton>
                                <a
                                    href="#koleksi"
                                    aria-label="Jelajahi Koleksi Hampers"
                                    className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0E2A1E] px-6 py-3 text-[11px] font-bold tracking-[0.14em] text-white shadow-sm transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md sm:px-7 sm:py-3.5 sm:text-xs"
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
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D5CEC2] bg-white px-5 py-3 text-[11px] font-bold tracking-[0.12em] text-[#0E2A1E] shadow-2xs transition-all duration-300 hover:border-[#0E2A1E] hover:bg-[#FAF8F5] sm:px-6.5 sm:py-3.5 sm:text-xs"
                                >
                                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                                    <span>KONSULTASI HAMPERS</span>
                                </a>
                            </MagneticButton>
                        </motion.div>

                        {/* Clean 3-Part Metric Strip */}
                        <motion.div
                            variants={staggerItem}
                            className="grid w-full max-w-xl grid-cols-3 gap-3 border-t border-[#EAE5DC] pt-3 text-center sm:gap-6 sm:pt-4"
                        >
                            <div>
                                <span className="font-serif text-xl font-bold tracking-tight text-[#1A1815] sm:text-2xl lg:text-3xl">
                                    5,000+
                                </span>
                                <p className="mt-0.5 text-[9px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[10px]">
                                    Hampers Terkirim
                                </p>
                            </div>
                            <div className="border-l border-[#EAE5DC] pl-3 sm:pl-6">
                                <span className="font-serif text-xl font-bold tracking-tight text-[#0E2A1E] sm:text-2xl lg:text-3xl">
                                    100+
                                </span>
                                <p className="mt-0.5 text-[9px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[10px]">
                                    Klien Korporat
                                </p>
                            </div>
                            <div className="border-l border-[#EAE5DC] pl-3 sm:pl-6">
                                <span className="font-serif text-xl font-bold tracking-tight text-[#9E7E45] sm:text-2xl lg:text-3xl">
                                    4.9 / 5.0
                                </span>
                                <p className="mt-0.5 text-[9px] font-semibold tracking-wider text-[#8C877E] uppercase sm:text-[10px]">
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

                        <motion.div
                            animate={{ x: ['0%', '-50%'] }}
                            transition={{
                                repeat: Infinity,
                                ease: 'linear',
                                duration: 32,
                            }}
                            className="flex shrink-0 items-center gap-8 py-0.5 text-[9.5px] font-semibold tracking-[0.24em] whitespace-nowrap text-[#5C564C] uppercase sm:text-[10.5px]"
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
export default Hero;
