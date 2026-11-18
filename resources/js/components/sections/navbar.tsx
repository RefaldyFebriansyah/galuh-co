import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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

    // Track scroll using Framer Motion's useScroll and useMotionValueEvent
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 24);
    });

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik melakukan konsultasi dan pemesanan hampers eksklusif.',
    )}`;

    const navLinks = [
        { label: 'TENTANG', href: '#tentang' },
        { label: 'KOLEKSI', href: '#koleksi' },
        { label: 'CARA PESAN', href: '#cara-pesan' },
        { label: 'CORPORATE', href: '#corporate' },
        { label: 'FAQ', href: '#faq' },
    ];

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'border-b border-[#EAE3D6] bg-[#FAF7F2]/90 shadow-[0_4px_24px_-4px_rgba(20,54,40,0.06)] backdrop-blur-md'
                    : 'border-b border-transparent bg-transparent'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-8 lg:px-12">
                {/* Brand Logo */}
                <a
                    href="#"
                    className="flex items-center transition-transform duration-200 hover:scale-[1.02]"
                >
                    <GaluhLogo src={logoSrc} />
                </a>

                {/* Desktop Nav Links */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-[11px] font-bold tracking-[0.2em] text-[#5C564C] transition-colors duration-200 hover:text-[#0E2A1E]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Right CTA Button */}
                <div className="hidden items-center sm:flex">
                    <motion.a
                        whileTap={buttonTap.tap}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#0E2A1E] px-6 py-2.5 text-[11px] font-bold tracking-[0.14em] text-white shadow-2xs transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md"
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
                    aria-label="Toggle navigation"
                >
                    {mobileMenuOpen ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="border-b border-[#EAE3D6] bg-[#FAF7F2]/98 px-6 pt-2 pb-6 shadow-xl backdrop-blur-lg lg:hidden"
                    >
                        <div className="flex flex-col space-y-3.5 pt-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="border-b border-[#EAE3D6]/50 py-2 text-xs font-bold tracking-[0.2em] text-[#1A1815] transition-colors hover:text-[#C5A880]"
                                >
                                    {link.label}
                                </a>
                            ))}

                            <div className="pt-2">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#0E2A1E] py-3 text-xs font-bold tracking-[0.14em] text-white shadow-sm"
                                >
                                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                                    <span>KONSULTASI VIA WHATSAPP</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;
