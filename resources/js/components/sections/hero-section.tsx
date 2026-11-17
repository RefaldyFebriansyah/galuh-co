import type { Variants } from 'motion/react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import {
    buttonTap,
    floatingVisual,
    fadeInUp,
    viewportOnce,
} from '@/lib/motion';

interface HeroSectionProps {
    whatsappNumber: string;
}

const headlineWords = [
    { text: 'Hampers', className: 'text-[#1A1815]' },
    { text: 'Eksklusif', className: 'text-[#1A1815]', lineBreak: true },
    { text: 'untuk', className: 'text-[#C5A880] italic' },
    { text: 'Personal', className: 'text-[#C5A880] italic' },
    { text: '&', className: 'text-[#C5A880] italic', lineBreak: true },
    { text: 'Perusahaan', className: 'text-[#1A1815]' },
];

const headlineContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const wordAnimation: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export function HeroSection({ whatsappNumber }: HeroSectionProps) {
    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 600], [0, 45]);

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik memesan hampers eksklusif.',
    )}`;

    return (
        <section className="relative overflow-hidden pt-4 pb-8 md:pt-6 md:pb-12 lg:pt-8 lg:pb-14">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left Content */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="lg:col-span-6"
                    >
                        {/* Heading with Word-by-Word Text Animation */}
                        <motion.h1
                            variants={headlineContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            className="font-serif text-4xl leading-[1.1] font-normal tracking-tight sm:text-5xl md:text-5xl lg:text-6xl"
                        >
                            {headlineWords.map((item, idx) => (
                                <span key={idx} className="inline-block">
                                    <motion.span
                                        variants={wordAnimation}
                                        className={`mr-2.5 inline-block ${item.className}`}
                                    >
                                        {item.text}
                                    </motion.span>
                                    {item.lineBreak && (
                                        <br className="hidden sm:inline" />
                                    )}
                                </span>
                            ))}
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

                        {/* Stats Box (5,000+ & 4.9/5.0) */}
                        <div className="mt-8 inline-flex items-center rounded-2xl border border-[#EAE5DC] bg-white p-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                            <div className="pr-5">
                                <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1815] md:text-3xl">
                                    5,000+
                                </span>
                                <span className="mt-1 block text-[8px] font-bold tracking-[0.2em] text-[#8C877E] uppercase">
                                    HAMPERS TERKIRIM
                                </span>
                            </div>

                            <div className="h-8 w-px bg-[#EAE5DC]" />

                            <div className="pl-5">
                                <div className="flex items-baseline gap-1">
                                    <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1815] md:text-3xl">
                                        4.9
                                    </span>
                                    <span className="text-xs text-[#8C877E]">
                                        /5.0
                                    </span>
                                    <span className="ml-1 text-sm text-[#D4AF37]">
                                        ★
                                    </span>
                                </div>
                                <span className="mt-1 block text-[8px] font-bold tracking-[0.2em] text-[#8C877E] uppercase">
                                    RATING KEPUASAN
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Hampers Visual with Floating Badge & Parallax */}
                    <div className="lg:col-span-6">
                        <motion.div
                            style={{ y: parallaxY }}
                            variants={floatingVisual}
                            animate="animate"
                            className="relative mx-auto max-w-md lg:max-w-lg"
                        >
                            <div className="relative aspect-[4/4.8] overflow-hidden rounded-[26px] border border-[#EAE5DC] bg-white p-2 shadow-xl">
                                <img
                                    src="/images/hero_hamper.jpg"
                                    alt="Koleksi Hampers Mewah Galuh & Co"
                                    className="size-full rounded-[20px] object-cover"
                                    loading="eager"
                                />

                                {/* Floating Badge at Bottom Left of Image */}
                                <div className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-2xl border border-[#EAE5DC] bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-[#FAF0D7] text-xs text-[#C5A880]">
                                        ★
                                    </span>
                                    <span className="font-serif text-[11px] font-semibold text-[#1A1815]">
                                        Kurasi Hadiah Eksklusif &amp; Kemasan
                                        Berkelas
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
