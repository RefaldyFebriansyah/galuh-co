import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';

interface PillarItem {
    num: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    caption: string;
}

export interface AboutPillarItem {
    num?: string;
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    caption?: string;
}

export interface AboutSectionProps {
    pillars?: AboutPillarItem[];
}

const PILLARS: PillarItem[] = [
    {
        num: '01',
        title: 'Kurasi Pilihan',
        description:
            'Bahan bermutu tinggi dan higienis—butter Wijsman autentik, madu hutan murni, dan kopi single-origin pilihan.',
        image: '/images/product_bamboo_box.jpg',
        imageAlt: 'Kurasi Kudapan Butter Wijsman & Anyaman Bambu Galuh & Co.',
        caption: 'ANYAMAN BAMBU & KUDAPAN WIJSMAN',
    },
    {
        num: '02',
        title: 'Kemasan Eksklusif',
        description:
            'Anyaman bambu kriya & hardbox linen kokoh dengan pita satin ganda serta stempel segel lilin manual.',
        image: '/images/product_emerald_box.jpg',
        imageAlt: 'Hardbox Linen Zamrud & Pita Satin Sutra Galuh & Co.',
        caption: 'HARDBOX LINEN EMERALD 1200 GSM',
    },
    {
        num: '03',
        title: 'Sentuhan Personal',
        description:
            'Kustomisasi kartu ucapan kaligrafi, grafir nama pada tumbler termal, dan sleeve logo perusahaan.',
        image: '/images/product_rattan_box.jpg',
        imageAlt: 'Sentuhan Personal Grafir Monogram & Rotan Mewah',
        caption: 'KUSTOMISASI GRAFIR & KALIGRAFI',
    },
];

const EASE_CUBIC = [0.22, 1, 0.36, 1] as const;

export function AboutSection({ pillars }: AboutSectionProps = {}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    // Subtle scroll-linked motion for calm atmosphere
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const watermarkX = useTransform(scrollYProgress, [0, 1], [15, -15]);

    const activePillars: PillarItem[] =
        pillars && Array.isArray(pillars) && pillars.length >= 3
            ? pillars.map((p, idx) => ({
                  num: p.num || `0${idx + 1}`,
                  title: p.title,
                  description: p.description,
                  image: p.image || PILLARS[idx % PILLARS.length].image,
                  imageAlt: p.imageAlt || `${p.title} - Galuh & Co.`,
                  caption:
                      p.caption ||
                      (p.title
                          ? p.title.toUpperCase()
                          : PILLARS[idx % PILLARS.length].caption),
              }))
            : PILLARS;

    const safeActiveIndex =
        activeIndex < activePillars.length ? activeIndex : 0;
    const activePillar = activePillars[safeActiveIndex];

    return (
        <section
            ref={sectionRef}
            id="tentang"
            className="relative overflow-hidden border-t border-[#0B291E]/10 bg-[#FAF8F5] py-10 sm:py-16 lg:py-28"
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">
                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-14 xl:gap-20">
                    {/* Left Column — Architectural Photo Stage matching right column height */}
                    <div className="relative flex flex-col lg:col-span-5 lg:h-full">
                        <div className="relative flex h-full w-full flex-1 flex-col">
                            {/* Ambient Organic Warm Glow */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-[#B89352]/15 via-transparent to-[#0B291E]/10 blur-2xl"
                            />

                            {/* Sculptural Photo Container — Compact 4/3 aspect on mobile, stretches to match right column height on desktop */}
                            <div className="relative flex aspect-[4/3] w-full flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-[#0E2A1E] shadow-[0_16px_40px_-12px_rgba(11,41,30,0.20)] sm:aspect-[16/10] sm:rounded-[2.5rem] lg:aspect-auto lg:h-full lg:min-h-0">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activePillar.image}
                                        src={activePillar.image}
                                        alt={activePillar.imageAlt}
                                        loading="lazy"
                                        decoding="async"
                                        width={600}
                                        height={700}
                                        initial={{ opacity: 0, scale: 1.04 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{
                                            duration: 0.55,
                                            ease: EASE_CUBIC,
                                        }}
                                        className="absolute inset-0 size-full object-cover object-center"
                                    />
                                </AnimatePresence>

                                {/* Seamless Dark Vignette Gradient for Quote Readability */}
                                <div
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061811] via-[#061811]/75 via-45% to-transparent"
                                    aria-hidden="true"
                                />

                                {/* Poetic Quote — Pure Editorial Typography Inside Photo Frame */}
                                <div className="relative z-10 mt-auto space-y-2 p-4 sm:p-7 lg:p-8">
                                    <p className="font-serif text-sm leading-relaxed text-[#FAF8F5] italic sm:text-lg lg:text-xl">
                                        “Setiap kotak hadiah kami rangkai dengan
                                        teliti dan penuh kehangatan,
                                        menghadirkan senyum tulus saat pertama
                                        kali dibuka.”
                                    </p>
                                    <div className="flex items-center justify-between border-t border-white/20 pt-2 font-mono text-[9px] font-semibold tracking-[0.18em] text-[#D4AF6A] uppercase sm:text-xs">
                                        <span>GALUH &amp; CO.</span>
                                        <span>STANDAR ATELIER BINGKISAN</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Kinetic Typography & Interactive Hover List */}
                    <div className="relative lg:col-span-7">
                        {/* Horizontal Scroll Oversized Watermark */}
                        <motion.div
                            style={{ x: watermarkX }}
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-12 -right-8 z-0 font-serif text-[120px] font-bold tracking-widest text-[#0B291E]/[0.018] select-none sm:text-[140px] lg:text-[170px]"
                        >
                            ATELIER
                        </motion.div>

                        <div className="relative z-10 space-y-6">
                            {/* Masked Line Reveal on Eyebrow & Headline */}
                            <div className="space-y-2">
                                <div className="overflow-hidden">
                                    <motion.div
                                        initial={{ y: '100%' }}
                                        whileInView={{ y: '0%' }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.6,
                                            ease: EASE_CUBIC,
                                        }}
                                        className="inline-flex items-center text-[10.5px] font-semibold tracking-[0.24em] text-[#7A5B24] uppercase"
                                    >
                                        <span>TENTANG GALUH &amp; CO.</span>
                                    </motion.div>
                                </div>

                                <div className="overflow-hidden">
                                    <motion.h2
                                        initial={{ y: '100%' }}
                                        whileInView={{ y: '0%' }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.75,
                                            delay: 0.05,
                                            ease: EASE_CUBIC,
                                        }}
                                        className="font-serif text-3xl leading-[1.12] font-normal tracking-tight text-[#0B291E] sm:text-4xl lg:text-5xl"
                                    >
                                        <span>Menghadirkan Kehangatan</span>{' '}
                                        <span className="block text-[#7A5B24] italic sm:inline">
                                            di Setiap Kotak Hadiah
                                        </span>
                                    </motion.h2>
                                </div>
                            </div>

                            {/* Atelier Narrative Copy */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2,
                                    ease: EASE_CUBIC,
                                }}
                                className="space-y-3.5 text-xs leading-relaxed text-[#0B291E]/75 sm:text-sm sm:text-[15px]"
                            >
                                <p className="block lg:hidden">
                                    GALUH &amp; CO. merangkai hantaran artisanal
                                    berbalut hardbox zamrud dan anyaman bambu
                                    kriya. Dari butter Wijsman autentik hingga
                                    grafir nama personal, setiap bingkisan kami
                                    siapkan dengan standar atelier terbaik untuk
                                    perayaan keluarga dan representasi
                                    prestisius korporat.
                                </p>
                                <div className="hidden space-y-3.5 lg:block">
                                    <p>
                                        GALUH &amp; CO. lahir dari keyakinan
                                        bahwa bingkisan terbaik bukan sekadar
                                        benda di dalam wadah, melainkan bahasa
                                        ketulusan yang merajut ikatan emosional
                                        dan apresiasi berkelas. Kami
                                        mendedikasikan ketelitian kriya pada
                                        setiap lembar pita, lipatan linen, dan
                                        segel lilin wax.
                                    </p>
                                    <p>
                                        Mulai dari bahan kudapan butter Wijsman
                                        autentik, kopi single-origin, hingga
                                        tumbler termal yang digrafir nama
                                        personal—setiap pesanan dikerjakan
                                        dengan standar atelier terbaik untuk
                                        perayaan keluarga maupun representasi
                                        resmi korporat.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Interactive Pillar List (Calm click-based, zero rigid boxiness) */}
                            <div className="pt-2">
                                <div className="divide-y divide-[#0B291E]/15 border-t border-b border-[#0B291E]/15">
                                    {activePillars.map((pillar, idx) => {
                                        const isActive =
                                            safeActiveIndex === idx;

                                        return (
                                            <div
                                                key={pillar.num}
                                                onClick={() =>
                                                    setActiveIndex(idx)
                                                }
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Pilih pilar ${pillar.num}: ${pillar.title}`}
                                                aria-expanded={isActive}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.key === ' '
                                                    ) {
                                                        setActiveIndex(idx);
                                                    }
                                                }}
                                                className="group relative cursor-pointer py-4.5 transition-colors duration-300 focus:outline-none sm:py-5"
                                            >
                                                {/* Soft Sliding Gold Accent Indicator */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="aboutPillarIndicator"
                                                        className="absolute top-0 bottom-0 left-0 w-1 rounded-full bg-[#7A5B24]"
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 400,
                                                            damping: 35,
                                                        }}
                                                    />
                                                )}

                                                <div className="pl-4 sm:pl-5">
                                                    <motion.div
                                                        animate={{
                                                            x: isActive
                                                                ? 10
                                                                : 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.35,
                                                            ease: EASE_CUBIC,
                                                        }}
                                                        className="flex items-start justify-between gap-4"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3.5">
                                                                <span
                                                                    className={`font-mono text-xs font-bold transition-colors duration-300 ${
                                                                        isActive
                                                                            ? 'text-[#7A5B24]'
                                                                            : 'text-[#0B291E]/40 group-hover:text-[#7A5B24]'
                                                                    }`}
                                                                >
                                                                    {pillar.num}
                                                                </span>
                                                                <h3
                                                                    className={`font-serif text-base transition-colors duration-300 sm:text-lg ${
                                                                        isActive
                                                                            ? 'font-bold text-[#0B291E]'
                                                                            : 'text-[#0B291E]/80 group-hover:text-[#0B291E]'
                                                                    }`}
                                                                >
                                                                    {
                                                                        pillar.title
                                                                    }
                                                                </h3>
                                                            </div>

                                                            <motion.div
                                                                initial={false}
                                                                animate={{
                                                                    height: isActive
                                                                        ? 'auto'
                                                                        : 0,
                                                                    opacity:
                                                                        isActive
                                                                            ? 1
                                                                            : 0,
                                                                    marginTop:
                                                                        isActive
                                                                            ? 6
                                                                            : 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.35,
                                                                    ease: EASE_CUBIC,
                                                                }}
                                                                className="overflow-hidden pl-7"
                                                            >
                                                                <p className="text-xs leading-relaxed text-[#0B291E]/70 italic sm:text-sm">
                                                                    {
                                                                        pillar.description
                                                                    }
                                                                </p>
                                                            </motion.div>
                                                        </div>

                                                        <div className="pt-1.5">
                                                            <div
                                                                className={`size-2 rounded-full transition-all duration-300 ${
                                                                    isActive
                                                                        ? 'scale-125 bg-[#7A5B24]'
                                                                        : 'bg-[#0B291E]/20 group-hover:bg-[#7A5B24]/60'
                                                                }`}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
