import { Gift, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, floatingVisual, fadeInUp } from '@/lib/motion';

interface HeroSectionProps {
    whatsappNumber: string;
    heroBadge?: string;
    heroTitlePrefix?: string;
    heroDescription?: string;
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

export function HeroSection({
    whatsappNumber,
    heroBadge = 'Signature Atelier Hampers & Gift',
    heroTitlePrefix = 'Hampers Eksklusif',
    heroDescription = 'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.',
}: HeroSectionProps) {
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
        <section className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-center py-4 sm:py-6 lg:min-h-[calc(100vh-5.5rem)] lg:py-6">
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
                            aria-label={`${heroTitlePrefix} untuk Personal & Perusahaan`}
                            className="font-serif text-4xl leading-[1.12] font-normal tracking-tight sm:text-5xl md:text-5xl lg:text-6xl"
                        >
                            <span className="block text-[#1A1815]">
                                {heroTitlePrefix}{' '}
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
                            {heroDescription}
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
                                className="group relative aspect-[4/4.8] overflow-hidden rounded-[26px] border border-[#E0D5C3] bg-gradient-to-b from-white via-[#FCFAF7] to-[#F5EFE6] p-2.5 shadow-2xl transition-all duration-500 hover:shadow-[0_25px_60px_rgba(26,24,21,0.18)] sm:aspect-[4/4.6] sm:p-3"
                            >
                                <div className="relative size-full overflow-hidden rounded-[20px] border border-[#EAE3D6] bg-[#FAF8F3]">
                                    {/* Real Product Photo */}
                                    <img
                                        src="/images/product_emerald_box.jpg"
                                        alt="Signature Emerald Hampers Galuh & Co."
                                        className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                    />

                                    {/* Subtle Vignette & Gradient Overlays for Luxury Contrast */}
                                    <div
                                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35"
                                        aria-hidden="true"
                                    />

                                    {/* Top Prestige Label */}
                                    <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-start sm:inset-x-4 sm:top-4">
                                        <span className="inline-flex items-center rounded-full border border-[#D5CEC2] bg-[#FAF8F5]/95 px-3 py-1 text-[8.5px] font-bold tracking-[0.16em] text-[#0E2A1E] uppercase shadow-sm backdrop-blur-xs sm:px-3.5 sm:py-1 sm:text-[9.5px]">
                                            {(heroBadge || 'Signature Atelier')
                                                .replace(
                                                    /^[✦*✨\s]+|[✦*✨\s]+$/g,
                                                    '',
                                                )
                                                .trim()}
                                        </span>
                                    </div>

                                    {/* Bottom Editorial Caption Card */}
                                    <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/20 bg-black/45 p-3.5 text-left text-white shadow-xl backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-serif text-xs font-bold tracking-[0.22em] text-[#EADBBE] uppercase sm:text-sm">
                                                GALUH &amp; CO.
                                            </span>
                                            <span className="rounded-full border border-[#C5A880]/40 bg-[#C5A880]/20 px-2 py-0.5 text-[8px] font-bold tracking-widest text-[#FAF0D7] uppercase">
                                                SIGNATURE BOX
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-[11px] leading-relaxed text-white/90 sm:text-xs">
                                            Hardbox beludru hijau zamrud dengan
                                            aksen foil emas, toples nastar, madu
                                            murni, &amp; tumbler eksklusif.
                                        </p>

                                        {/* Micro Tags */}
                                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                            <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[8px] font-medium tracking-wide text-white/90 sm:text-[8.5px]">
                                                Hardbox Zamrud
                                            </span>
                                            <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[8px] font-medium tracking-wide text-white/90 sm:text-[8.5px]">
                                                Foil Emas
                                            </span>
                                            <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[8px] font-medium tracking-wide text-white/90 sm:text-[8.5px]">
                                                Kartu Wax Seal
                                            </span>
                                        </div>
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
