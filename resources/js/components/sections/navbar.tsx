import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import {
    AnimatePresence,
    motion,
    useScroll,
    useMotionValueEvent,
} from 'motion/react';
import { GaluhLogo } from '@/components/galuh-logo';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap } from '@/lib/motion';

export interface NavbarProps {
    whatsappNumber: string;
    logoSrc?: string;
}

export function Navbar({ whatsappNumber, logoSrc }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Prevent body scroll when full-screen mobile menu drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Track scroll using Framer Motion's useScroll and useMotionValueEvent
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 24);
    });

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik melakukan konsultasi dan pemesanan hampers eksklusif.',
    )}`;

    const navLinks = [
        {
            num: '01',
            desktopLabel: 'TENTANG',
            mobileLabel: 'Tentang Atelier',
            href: '#tentang',
        },
        {
            num: '02',
            desktopLabel: 'KOLEKSI',
            mobileLabel: 'Koleksi Hampers',
            href: '#koleksi',
        },
        {
            num: '03',
            desktopLabel: 'CARA PESAN',
            mobileLabel: 'Cara Pemesanan',
            href: '#cara-pesan',
        },
        {
            num: '04',
            desktopLabel: 'CORPORATE B2B',
            mobileLabel: 'Corporate B2B Gifting',
            href: '#corporate',
        },
        {
            num: '05',
            desktopLabel: 'FAQ',
            mobileLabel: 'Pertanyaan Umum (FAQ)',
            href: '#faq',
        },
    ];

    const handleNavClick = (href: string) => {
        setMobileMenuOpen(false);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'border-b border-[#EAE3D6] bg-[#FAF7F2]/95 shadow-[0_4px_24px_-4px_rgba(20,54,40,0.06)] backdrop-blur-md'
                    : 'border-b border-[#EAE3D6]/50 bg-[#FAF7F2]/85 backdrop-blur-xs'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-8 lg:px-12">
                {/* Brand Logo */}
                <a
                    href="#"
                    aria-label="GALUH & CO. Beranda"
                    className="flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.02]"
                >
                    <GaluhLogo src={logoSrc} />
                </a>

                {/* Desktop Nav Links */}
                <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="py-1 text-xs font-semibold tracking-[0.14em] whitespace-nowrap text-[#5C564C] transition-colors duration-200 hover:text-[#0E2A1E]"
                        >
                            {link.desktopLabel}
                        </a>
                    ))}
                </nav>

                {/* Right CTA Button (Desktop) */}
                <div className="hidden shrink-0 items-center sm:flex">
                    <motion.a
                        whileTap={buttonTap.tap}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0E2A1E] px-5 py-2.5 text-xs font-bold tracking-[0.12em] whitespace-nowrap text-white shadow-2xs transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md"
                    >
                        <WhatsAppIcon className="size-3.5 text-[#25D366]" />
                        <span>KONSULTASI HAMPERS</span>
                    </motion.a>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#D5CEC2] bg-white/80 text-[#0E2A1E] shadow-2xs transition-colors hover:bg-white lg:hidden"
                    aria-label={
                        mobileMenuOpen
                            ? 'Tutup menu navigasi'
                            : 'Buka menu navigasi'
                    }
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation — Refined Deep Emerald Full-Screen Editorial Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{
                            duration: 0.35,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col justify-between overflow-y-auto bg-[#0B291E] px-6 pt-5 pb-8 text-[#FAF7F2] lg:hidden"
                    >
                        {/* Drawer Top Bar */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <GaluhLogo variant="white" src={logoSrc} />
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-transform active:scale-90"
                                aria-label="Tutup menu navigasi"
                            >
                                <X className="size-5 text-[#FAF7F2]" />
                            </button>
                        </div>

                        {/* Staggered Serif Section Links */}
                        <div className="my-auto flex flex-col space-y-4 py-6">
                            <span className="text-[9.5px] font-bold tracking-[0.25em] text-[#C5A880] uppercase">
                                NAVIGASI ATELIER
                            </span>
                            {navLinks.map((link, idx) => (
                                <motion.button
                                    key={link.href}
                                    type="button"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: 0.08 * idx,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    onClick={() => handleNavClick(link.href)}
                                    className="group flex items-center justify-between border-b border-white/10 py-3 text-left transition-colors hover:text-[#C5A880]"
                                >
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-mono text-xs text-[#C5A880]/70">
                                            {link.num}.
                                        </span>
                                        <span className="font-serif text-2xl font-normal tracking-wide text-white group-hover:text-[#C5A880]">
                                            {link.mobileLabel ||
                                                link.desktopLabel}
                                        </span>
                                    </div>
                                    <ArrowRight className="size-4 text-[#C5A880] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                                </motion.button>
                            ))}
                        </div>

                        {/* Drawer Bottom Contact & Action */}
                        <div className="space-y-4 border-t border-white/10 pt-5">
                            <div className="text-[11px] text-white/60">
                                <p>Jl. Sukajadi No. 128, Bandung, Jawa Barat</p>
                                <p className="mt-0.5">
                                    Senin - Sabtu: 08.00 - 20.00 WIB
                                </p>
                            </div>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#FAF0D7] py-3.5 text-xs font-bold tracking-[0.14em] text-[#0B291E] shadow-lg transition-transform active:scale-95"
                            >
                                <WhatsAppIcon className="size-4 text-[#25D366]" />
                                <span>KONSULTASI VIA WHATSAPP</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;
