import { useEffect, useState } from 'react';
import {
    ArrowRight,
    Compass,
    LogIn,
    LogOut,
    Menu,
    Package,
    PackageSearch,
    Shield,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import {
    AnimatePresence,
    motion,
    useScroll,
    useMotionValueEvent,
} from 'motion/react';
import { Link, router, usePage } from '@inertiajs/react';
import { GaluhLogo } from '@/components/galuh-logo';
import { buttonTap } from '@/lib/motion';
import type { User as UserType } from '@/types';

export interface NavbarProps {
    logoSrc?: string;
}

export function Navbar({ logoSrc }: NavbarProps) {
    const page = usePage();
    const authUser = (page.props.auth as { user?: UserType })?.user;

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

    // Track scroll using Framer Motion's useScroll
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 24);
    });

    const navLinks = [
        {
            num: '01',
            desktopLabel: 'TENTANG',
            mobileLabel: 'Tentang Galuh & Co.',
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
            desktopLabel: 'CORPORATE B2B',
            mobileLabel: 'Corporate B2B Gifting',
            href: '#corporate',
        },
        {
            num: '04',
            desktopLabel: 'LOKASI STUDIO',
            mobileLabel: 'Studio & Peta Produksi',
            href: '#lokasi-studio',
        },
    ];

    const handleNavClick = (href: string) => {
        setMobileMenuOpen(false);
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'border-b border-[#DFD7C5] bg-[#F2EBDC]/95 shadow-[0_4px_24px_-4px_rgba(22,35,59,0.06)] backdrop-blur-md'
                    : 'border-b border-[#DFD7C5]/50 bg-[#F2EBDC]/85 backdrop-blur-xs'
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
                <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(link.href);
                            }}
                            className="py-1 text-xs font-semibold tracking-[0.14em] whitespace-nowrap text-[#6E675D] transition-colors duration-200 hover:text-[#16233B]"
                        >
                            {link.desktopLabel}
                        </a>
                    ))}
                    <Link
                        href={authUser ? '/my-orders' : '/login?redirect=/my-orders'}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#A88B54]/40 bg-[#FAF6EE] px-3.5 py-1 text-xs font-bold tracking-[0.12em] text-[#16233B] transition-all hover:border-[#16233B] hover:bg-white"
                    >
                        <ShoppingBag className="size-3.5 text-[#A88B54]" />
                        <span>PESANAN SAYA</span>
                    </Link>
                </nav>

                {/* Right Action Buttons (Desktop) */}
                <div className="hidden shrink-0 items-center gap-3 sm:flex">
                    {authUser ? (
                        <div className="flex items-center gap-2.5">
                            {authUser.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#16233B] px-3.5 py-1.5 text-xs font-bold tracking-wider text-white shadow-2xs transition-all hover:bg-[#223354]"
                                >
                                    <Shield className="size-3.5 text-[#A88B54]" />
                                    <span>PANEL ADMIN</span>
                                </Link>
                            )}

                            {/* User Identity Pill */}
                            <div className="flex items-center gap-2 rounded-full border border-[#DFD7C5] bg-white/90 px-3 py-1.5 text-xs shadow-2xs backdrop-blur-xs">
                                <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-[#16233B] text-[10px] font-bold text-[#F2EBDC]">
                                    {authUser.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="font-semibold text-[#16233B]">
                                    {authUser.name.split(' ')[0]}
                                </span>
                            </div>

                            {/* Logout Button */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                aria-label="Keluar akun"
                                title="Keluar Akun"
                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#DFD7C5] bg-[#FAF6EE] text-[#6E675D] transition-colors hover:border-red-300 hover:text-red-600"
                            >
                                <LogOut className="size-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold tracking-wider text-[#16233B] transition-colors hover:text-[#A88B54]"
                            >
                                <LogIn className="size-3.5 text-[#A88B54]" />
                                <span>MASUK</span>
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex items-center rounded-full bg-[#16233B] px-4.5 py-2 text-xs font-bold tracking-wider text-white shadow-2xs transition-all hover:bg-[#223354]"
                            >
                                <span>DAFTAR</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#DFD7C5] bg-white/80 text-[#16233B] shadow-2xs transition-colors hover:bg-white lg:hidden"
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

            {/* Mobile Navigation — Deep Navy Full-Screen Editorial Menu Drawer */}
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
                        className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col justify-between overflow-y-auto bg-[#16233B] px-6 pt-5 pb-8 text-[#F2EBDC] lg:hidden"
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
                                <X className="size-5 text-[#F2EBDC]" />
                            </button>
                        </div>

                        {/* Staggered Serif Section Links */}
                        <div className="my-auto flex flex-col space-y-3 py-4">
                            <span className="text-[9.5px] font-bold tracking-[0.25em] text-[#A88B54] uppercase">
                                NAVIGASI UTAMA
                            </span>
                            {navLinks.map((link, idx) => (
                                <motion.button
                                    key={link.href}
                                    type="button"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        delay: 0.05 * idx,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    onClick={() => handleNavClick(link.href)}
                                    className="group flex items-center justify-between border-b border-white/10 py-2.5 text-left transition-colors hover:text-[#A88B54]"
                                >
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-mono text-xs text-[#A88B54]/70">
                                            {link.num}.
                                        </span>
                                        <span className="font-serif text-xl font-normal tracking-wide text-white group-hover:text-[#A88B54]">
                                            {link.mobileLabel ||
                                                link.desktopLabel}
                                        </span>
                                    </div>
                                    <ArrowRight className="size-4 text-[#A88B54] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                                </motion.button>
                            ))}

                            <Link
                                href={authUser ? '/my-orders' : '/login?redirect=/my-orders'}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between rounded-xl border border-[#A88B54]/40 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
                            >
                                <div className="flex items-center gap-2.5">
                                    <ShoppingBag className="size-4 text-[#A88B54]" />
                                    <span className="text-xs font-bold tracking-wider text-white uppercase">
                                        Pesanan Saya
                                    </span>
                                </div>
                                <ArrowRight className="size-4 text-[#A88B54]" />
                            </Link>
                        </div>

                        {/* Drawer Bottom Auth Action */}
                        <div className="space-y-3 border-t border-white/10 pt-4">
                            {authUser ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs">
                                        <span className="text-white/70">
                                            Masuk sebagai:
                                        </span>
                                        <span className="font-bold text-[#A88B54]">
                                            {authUser.name}
                                        </span>
                                    </div>
                                    {authUser.role === 'admin' ? (
                                        <Link
                                            href="/admin"
                                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#A88B54] py-3 text-xs font-bold tracking-wider text-[#16233B] uppercase"
                                        >
                                            <Shield className="size-4" />
                                            <span>Buka Panel Admin</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/my-orders"
                                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FAF6EE] py-3 text-xs font-bold tracking-wider text-[#16233B] uppercase"
                                        >
                                            <ShoppingBag className="size-4 text-[#A88B54]" />
                                            <span>Pesanan Saya</span>
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-2.5 text-xs font-semibold text-white/80"
                                    >
                                        <LogOut className="size-3.5" />
                                        <span>Keluar Akun</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center rounded-full border border-[#DFD7C5]/40 bg-white/10 py-3 text-xs font-bold tracking-wider text-white uppercase"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center rounded-full bg-[#A88B54] py-3 text-xs font-bold tracking-wider text-[#16233B] uppercase"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;
