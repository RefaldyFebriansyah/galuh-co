import { useEffect, useState } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

interface NavbarProps {
    whatsappNumber: string;
}

export function Navbar({ whatsappNumber }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik melakukan inquiry dan pemesanan hampers.',
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
            className={`sticky top-0 z-50 w-full px-4 pb-2 transition-all duration-300 sm:px-6 lg:px-12 ${
                scrolled ? 'pt-2.5' : 'pt-4'
            }`}
        >
            <div
                className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-6 py-2.5 transition-all duration-300 ${
                    scrolled
                        ? 'border-[#E0D8CB] bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md'
                        : 'border-[#EAE5DC] bg-white/85 shadow-[0_2px_15px_rgba(0,0,0,0.02)] backdrop-blur-sm'
                }`}
            >
                {/* Brand Logo */}
                <a href="#" className="flex items-center">
                    <GaluhLogo />
                </a>

                {/* Desktop Nav Links */}
                <nav className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-[11px] font-bold tracking-[0.18em] text-[#5A564F] transition-colors hover:text-[#0E2A1E]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Right CTA Button (INQUIRY & PESAN) */}
                <div className="hidden items-center sm:flex">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#0E2A1E] px-6 py-2.5 text-[11px] font-bold tracking-[0.14em] text-white shadow-xs transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md"
                    >
                        <WhatsAppIcon className="size-3.5 text-[#25D366]" />
                        <span>INQUIRY &amp; PESAN</span>
                    </a>
                </div>

                {/* Mobile Toggle Button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-[#EAE5DC] text-[#0E2A1E] lg:hidden"
                    aria-label="Toggle navigation"
                >
                    <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {mobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {mobileMenuOpen && (
                <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-lg lg:hidden">
                    <nav className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xs font-bold tracking-wider text-[#5A564F] hover:text-[#0E2A1E]"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#0E2A1E] py-2.5 text-xs font-bold tracking-wider text-white"
                        >
                            <WhatsAppIcon className="size-3.5 text-[#25D366]" />
                            <span>INQUIRY &amp; PESAN</span>
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
