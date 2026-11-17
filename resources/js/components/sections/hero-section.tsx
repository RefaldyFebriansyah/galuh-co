import { Gift, Sparkles, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, floatingVisual, fadeInUp } from '@/lib/motion';

interface HeroSectionProps {
    whatsappNumber: string;
}

interface TypedPhrase {
    gold: string;
    dark: string;
}

const typedPhrases: TypedPhrase[] = [
    { gold: 'Personal & ', dark: 'Perusahaan' },
    { gold: 'Mitra ', dark: 'Perusahaan' },
    { gold: 'Momen ', dark: 'Istimewa' },
];

export function HeroSection({ whatsappNumber }: HeroSectionProps) {
    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 500], [0, 20]);

    // Typewriter state machine for hero headline
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentPhrase = typedPhrases[phraseIndex];
        const fullLength =
            currentPhrase.gold.length + currentPhrase.dark.length;

        if (isPaused) {
            const timeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, 3200);
            return () => clearTimeout(timeout);
        }

        if (isDeleting) {
            if (charCount > 0) {
                const timeout = setTimeout(() => {
                    setCharCount((prev) => prev - 1);
                }, 35);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % typedPhrases.length);
                }, 350);
                return () => clearTimeout(timeout);
            }
        } else {
            if (charCount < fullLength) {
                const timeout = setTimeout(() => {
                    setCharCount((prev) => prev + 1);
                }, 70);
                return () => clearTimeout(timeout);
            } else {
                setIsPaused(true);
            }
        }
    }, [charCount, isDeleting, isPaused, phraseIndex]);

    const activePhrase = typedPhrases[phraseIndex];
    const displayedGold = activePhrase.gold.slice(
        0,
        Math.min(charCount, activePhrase.gold.length),
    );
    const displayedDark = activePhrase.dark.slice(
        0,
        Math.max(0, charCount - activePhrase.gold.length),
    );

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik memesan hampers eksklusif.',
    )}`;

    return (
        <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-center overflow-hidden py-4 sm:py-6 lg:min-h-[calc(100vh-5rem)] lg:py-4">
            {/* 1. Subtle Radial Glow (#9E7B3C at 6%-7% Opacity) */}
            <div
                className="pointer-events-none absolute -top-32 -left-32 size-[480px] rounded-full bg-[#9E7B3C]/[0.06] blur-[120px] sm:size-[560px] sm:blur-[140px]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute top-1/2 -right-24 size-[520px] -translate-y-1/2 rounded-full bg-[#9E7B3C]/[0.07] blur-[130px] sm:size-[620px] sm:blur-[150px]"
                aria-hidden="true"
            />

            {/* 2. Editorial Architectural Hairline Grid Guidelines */}
            <div
                className="pointer-events-none absolute inset-0 mx-auto max-w-7xl px-6 lg:px-12"
                aria-hidden="true"
            >
                <div className="relative size-full">
                    {/* Left hairline guide */}
                    <div className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-[#E5DFD3]/0 via-[#E5DFD3]/45 to-[#E5DFD3]/0 lg:left-12" />
                    {/* Right hairline guide */}
                    <div className="absolute top-0 right-6 bottom-0 w-px bg-gradient-to-b from-[#E5DFD3]/0 via-[#E5DFD3]/45 to-[#E5DFD3]/0 lg:right-12" />
                    {/* Center hairline guide (desktop only) */}
                    <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[#E5DFD3]/0 via-[#E5DFD3]/20 to-[#E5DFD3]/0 lg:block" />
                </div>
            </div>

            <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
                    {/* Left Content */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            duration: 0.65,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="lg:col-span-6"
                    >
                        {/* Heading with Typewriter Animation & Blinking Gold Cursor */}
                        <motion.h1
                            aria-label="Hampers Eksklusif untuk Personal & Perusahaan"
                            className="font-serif text-4xl leading-[1.12] font-normal tracking-tight sm:text-5xl md:text-5xl lg:text-6xl"
                        >
                            <span className="block text-[#1A1815]">
                                Hampers Eksklusif{' '}
                                <span className="text-[#C5A880] italic">
                                    untuk
                                </span>
                            </span>
                            <span className="mt-1 block min-h-[1.15em] sm:mt-2">
                                <span className="text-[#C5A880] italic">
                                    {displayedGold}
                                </span>
                                <span className="text-[#1A1815]">
                                    {displayedDark}
                                </span>
                                <motion.span
                                    aria-hidden="true"
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{
                                        duration: 0.75,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className="ml-1 inline-block font-light text-[#C5A880] select-none"
                                >
                                    |
                                </motion.span>
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#6E6962] md:text-base">
                            Pilihan hampers premium dan hadiah perusahaan dengan
                            kemasan eksklusif. Siap melengkapi setiap momen
                            istimewa Anda dengan mudah dan berkelas.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-6 flex flex-wrap items-center gap-3.5">
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={buttonTap.tap}
                                href="#koleksi"
                                className="inline-flex items-center justify-center rounded-full bg-[#0E2A1E] px-7 py-3 text-xs font-bold tracking-[0.14em] text-white shadow-xs transition-all hover:bg-[#163d2c]"
                            >
                                LIHAT KOLEKSI
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={buttonTap.tap}
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D5CEC2] bg-white px-6 py-3 text-xs font-bold tracking-[0.12em] text-[#0E2A1E] shadow-xs transition-all hover:border-[#0E2A1E]"
                            >
                                <WhatsAppIcon className="size-4 text-[#25D366]" />
                                <span>PESAN VIA WHATSAPP</span>
                            </motion.a>
                        </div>

                        {/* Luxury Trust & Stats Card */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            className="mt-5 inline-flex items-center gap-4 rounded-2xl border border-[#E7DFD3] bg-gradient-to-r from-white via-[#FCFAF7] to-white p-3 shadow-[0_4px_20px_rgba(197,168,128,0.12)] backdrop-blur-sm sm:gap-6 sm:p-3.5 lg:mt-6"
                        >
                            {/* Left: Hampers Terkirim */}
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-gradient-to-br from-[#FAF0D7] to-[#F3E3C3] text-[#8B6B38] shadow-2xs">
                                    <Gift className="size-5" />
                                </span>
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-serif text-xl font-bold tracking-tight text-[#1A1815] sm:text-2xl md:text-3xl">
                                            5,000+
                                        </span>
                                    </div>
                                    <span className="mt-0.5 block text-[8px] font-bold tracking-[0.18em] text-[#8C877E] uppercase sm:text-[8.5px]">
                                        HAMPERS TERKIRIM
                                    </span>
                                </div>
                            </div>

                            {/* Luxury Gold Divider */}
                            <div className="h-9 w-px bg-gradient-to-b from-transparent via-[#C5A880]/50 to-transparent" />

                            {/* Right: Rating & Stars */}
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="font-serif text-xl font-bold tracking-tight text-[#1A1815] sm:text-2xl md:text-3xl">
                                            4.9
                                        </span>
                                        <span className="text-xs font-semibold text-[#8C877E]">
                                            /5.0
                                        </span>
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-1.5">
                                        <div className="flex items-center gap-0.5 text-[#D4AF37]">
                                            <Star className="size-3 fill-[#D4AF37]" />
                                            <Star className="size-3 fill-[#D4AF37]" />
                                            <Star className="size-3 fill-[#D4AF37]" />
                                            <Star className="size-3 fill-[#D4AF37]" />
                                            <Star className="size-3 fill-[#D4AF37]" />
                                        </div>
                                        <span className="text-[8px] font-bold tracking-[0.16em] text-[#8C877E] uppercase sm:text-[8.5px]">
                                            KEPUASAN
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Hampers Visual with Floating Badge, Entrance & Parallax */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            duration: 0.7,
                            delay: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative flex justify-center lg:col-span-6 lg:justify-end"
                    >
                        {/* Architectural Arch Lines Framing the Visual Card */}
                        <div
                            className="pointer-events-none absolute -top-5 hidden h-[500px] w-[380px] rounded-t-full border border-b-0 border-[#E5DFD3]/60 lg:block xl:-top-6 xl:h-[520px] xl:w-[410px]"
                            aria-hidden="true"
                        />
                        <div
                            className="pointer-events-none absolute -top-8 hidden h-[520px] w-[400px] rounded-t-full border border-b-0 border-[#E5DFD3]/30 lg:block xl:-top-9 xl:h-[540px] xl:w-[430px]"
                            aria-hidden="true"
                        />

                        <motion.div
                            style={{ y: parallaxY }}
                            className="relative w-full max-w-sm sm:max-w-md lg:max-w-[420px] xl:max-w-[440px]"
                        >
                            <motion.div
                                variants={floatingVisual}
                                animate="animate"
                                className="relative aspect-[4/4.5] rounded-[26px] border border-[#E0D5C3] bg-gradient-to-b from-white via-[#FCFAF7] to-[#F5EFE6] p-3 shadow-xl sm:p-3.5"
                            >
                                <div className="relative flex size-full flex-col justify-between overflow-hidden rounded-[20px] border border-[#EAE3D6] bg-gradient-to-b from-[#FBF8F3] via-[#F5EFE5] to-[#EBE0CF] p-5 text-center sm:p-6">
                                    {/* Subtle Ambient Decorative Ring */}
                                    <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full border border-[#C5A880]/15" />
                                    <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full border border-[#C5A880]/10" />

                                    {/* Top Prestige Bar */}
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A880]/30 bg-white/80 px-2.5 py-0.5 text-[8px] font-bold tracking-[0.2em] text-[#8B6B38] uppercase backdrop-blur-xs sm:px-3 sm:py-1 sm:text-[8.5px]">
                                            <Sparkles className="size-2.5 text-[#C5A880]" />
                                            <span>SIGNATURE ATELIER</span>
                                        </span>
                                        <span className="font-serif text-[9px] font-bold tracking-[0.2em] text-[#8C877E] uppercase sm:text-[10px]">
                                            EST. 2026
                                        </span>
                                    </div>

                                    {/* Center Monogram & Typography */}
                                    <div className="my-auto py-2">
                                        <div className="relative mx-auto flex size-20 items-center justify-center rounded-full border-2 border-[#C5A880]/40 bg-gradient-to-b from-white to-[#FAF6EE] p-1 shadow-md sm:size-24">
                                            <div className="flex size-full items-center justify-center rounded-full border border-[#C5A880]/25 bg-gradient-to-b from-[#FAF5EB] to-[#EFE5D3]">
                                                <span className="font-serif text-4xl font-normal text-[#8B6B38] sm:text-5xl">
                                                    G
                                                </span>
                                            </div>
                                        </div>

                                        <span className="mt-3.5 block font-serif text-lg font-bold tracking-[0.24em] text-[#1A1815] uppercase sm:mt-4 sm:text-xl">
                                            GALUH &amp; CO.
                                        </span>

                                        <div className="mt-1 flex items-center justify-center gap-2">
                                            <span className="h-px w-5 bg-[#C5A880]/60 sm:w-6" />
                                            <span className="text-[9px] font-bold tracking-[0.22em] text-[#8C877E] uppercase sm:text-[10px]">
                                                HAMPERS &amp; GIFT
                                            </span>
                                            <span className="h-px w-5 bg-[#C5A880]/60 sm:w-6" />
                                        </div>

                                        <p className="mx-auto mt-2.5 max-w-xs text-xs leading-relaxed text-[#6E6962] sm:mt-3 sm:text-[12.5px]">
                                            Koleksi hampers personal dan
                                            korporat eksklusif dengan kurasi
                                            berkelas serta kemasan mewah.
                                        </p>

                                        {/* 3 Luxury Micro-Tags */}
                                        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                                            <span className="rounded-full border border-[#D5CEC2] bg-white/80 px-2.5 py-0.5 text-[8px] font-bold tracking-wider text-[#7A746B] uppercase sm:text-[8.5px]">
                                                Kurasi Pilihan
                                            </span>
                                            <span className="rounded-full border border-[#D5CEC2] bg-white/80 px-2.5 py-0.5 text-[8px] font-bold tracking-wider text-[#7A746B] uppercase sm:text-[8.5px]">
                                                Pita Satin Mewah
                                            </span>
                                            <span className="rounded-full border border-[#D5CEC2] bg-white/80 px-2.5 py-0.5 text-[8px] font-bold tracking-wider text-[#7A746B] uppercase sm:text-[8.5px]">
                                                Kartu Personal
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom Decorative Baseline */}
                                    <div className="pt-2">
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent" />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
