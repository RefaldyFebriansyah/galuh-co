import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    CheckCircle2,
    ClipboardList,
    ExternalLink,
    FileText,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    MessageSquare,
    Package,
    Palette,
    Search,
    Settings,
    ShieldCheck,
    Truck,
    UserCheck,
    X,
} from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';

interface AdminLayoutProps extends PropsWithChildren {
    title?: string;
    subtitle?: string;
    headerAction?: ReactNode;
}

interface NavItem {
    label: string;
    shortLabel?: string;
    href: string;
    icon: typeof LayoutDashboard;
    description: string;
    badge?: string;
}

interface NavGroup {
    domain: string;
    items: NavItem[];
}

export function AdminLayout({
    title = 'Dashboard',
    subtitle,
    headerAction,
    children,
}: AdminLayoutProps) {
    const { url } = usePage();
    const pageProps = usePage().props as {
        auth?: {
            user?: {
                id: number;
                name: string;
                email: string;
                role?: string;
                phone_number?: string;
            };
        };
        flash?: { success?: string; error?: string };
    };

    const user = pageProps.auth?.user;
    const flash = pageProps.flash;

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const logoutForm = useForm({});

    const handleLogout = () => {
        logoutForm.post('/admin/logout');
    };

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            const timer = setTimeout(() => setToastMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Global Cmd+K / Ctrl+K keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setSearchModalOpen((prev) => !prev);
            } else if (e.key === 'Escape') {
                setSearchModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Clean, standard Admin Navigation Groups
    const navGroups: NavGroup[] = useMemo(
        () => [
            {
                domain: 'OPERASIONAL',
                items: [
                    {
                        label: 'Dashboard Admin',
                        shortLabel: 'Dashboard',
                        href: '/admin/dashboard',
                        icon: LayoutDashboard,
                        description:
                            'Grafik penjualan barang & ringkasan operasional studio',
                    },
                    {
                        label: 'Inquiries & Pesanan',
                        shortLabel: 'Pesanan',
                        href: '/admin/orders',
                        icon: ClipboardList,
                        description:
                            'Pesanan masuk personal & corporate yang harus di-accept admin',
                    },
                    {
                        label: 'Tracking Pesanan',
                        shortLabel: 'Tracking',
                        href: '/admin/tracking',
                        icon: Truck,
                        description:
                            'Update status 4 tahap pengiriman & nomor resi kurir',
                    },
                    {
                        label: 'Data WhatsApp Leads',
                        shortLabel: 'WA Leads',
                        href: '/admin/wa-leads',
                        icon: MessageSquare,
                        description:
                            'Log interaksi & tracking klik konsultasi WhatsApp resmi',
                    },
                ],
            },
            {
                domain: 'PRODUK & KATALOG',
                items: [
                    {
                        label: 'Katalog Hampers',
                        shortLabel: 'Produk',
                        href: '/admin/products',
                        icon: Package,
                        description:
                            'Kelola daftar hampers, harga, foto, & status tayang',
                    },
                    {
                        label: 'Katalog Corporate B2B',
                        shortLabel: 'Corporate B2B',
                        href: '/admin/corporate-b2b',
                        icon: ClipboardList,
                        description:
                            'Katalog hampers corporate & custom packaging perusahaan',
                    },
                ],
            },
            {
                domain: 'KONTEN & WEBSITE',
                items: [
                    {
                        label: 'Editor CMS Halaman',
                        shortLabel: 'CMS Halaman',
                        href: '/admin/cms-halaman',
                        icon: FileText,
                        description:
                            'Pusat navigasi sunting teks & visual landing page',
                    },
                    {
                        label: 'Hero & Galeri Depan',
                        shortLabel: 'Hero Section',
                        href: '/admin/cms/hero',
                        icon: Palette,
                        description:
                            'Headline atelier, subjudul, & customizer preview',
                    },
                    {
                        label: 'Cerita Filosofi Atelier',
                        shortLabel: 'Atelier',
                        href: '/admin/cms/atelier',
                        icon: MapPin,
                        description:
                            'Narasi heritage, craftsmanship, & nilai Galuh & Co.',
                    },
                    {
                        label: 'FAQ & Bantuan Konsumen',
                        shortLabel: 'FAQ',
                        href: '/admin/cms/faq',
                        icon: HelpCircle,
                        description:
                            'Tanya jawab pemesanan, pengiriman, & custom hampers',
                    },
                ],
            },
            {
                domain: 'PENGATURAN',
                items: [
                    {
                        label: 'Profil & Kontak WA',
                        shortLabel: 'Profil',
                        href: '/admin/settings/profil',
                        icon: UserCheck,
                        description:
                            'Nomor WhatsApp concierge, nama studio, & kontak resmi',
                    },
                    {
                        label: 'Keamanan & Akun',
                        shortLabel: 'Keamanan',
                        href: '/admin/settings/keamanan',
                        icon: ShieldCheck,
                        description:
                            'Ganti password admin & proteksi autentikasi',
                    },
                    {
                        label: 'Pengaturan Sistem',
                        shortLabel: 'Sistem',
                        href: '/admin/settings',
                        icon: Settings,
                        description:
                            'Konfigurasi environment aplikasi & data toko',
                    },
                ],
            },
        ],
        [],
    );

    // Flattened items for Cmd+K search
    const allNavItems = useMemo(
        () => navGroups.flatMap((g) => g.items),
        [navGroups],
    );

    const filteredQuickSearch = useMemo(() => {
        if (!searchQuery.trim()) return allNavItems;
        const q = searchQuery.toLowerCase();
        return allNavItems.filter(
            (item) =>
                item.label.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.href.toLowerCase().includes(q),
        );
    }, [allNavItems, searchQuery]);

    const isCurrentActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return url === '/admin' || url === '/admin/dashboard';
        }
        return url.startsWith(href);
    };

    return (
        <>
            <Head title={`${title} — Galuh & Co. Admin Panel`} />

            <div
                className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-[#16233B] selection:text-white"
                style={{
                    fontFamily:
                        "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
            >
                {/* 1. Desktop Fixed Admin Sidebar (Biru Navy Elegan & Muted Gold) */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 hidden flex-col justify-between border-r border-[#1E2E4A] bg-[#16233B] text-white transition-all duration-200 lg:flex ${
                        sidebarCollapsed ? 'w-20' : 'w-72'
                    }`}
                >
                    <div className="flex flex-1 scrollbar-none flex-col overflow-y-auto">
                        {/* Admin Brand Header */}
                        <div className="flex h-16 items-center border-b border-[#1E2E4A] px-5">
                            <Link
                                href="/admin/dashboard"
                                className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
                            >
                                <GaluhLogo
                                    variant="white"
                                    className="h-8 w-auto shrink-0"
                                    showText={false}
                                />
                                {!sidebarCollapsed && (
                                    <div className="flex min-w-0 flex-col">
                                        <span className="text-sm font-extrabold tracking-wider whitespace-nowrap text-white">
                                            GALUH &amp; CO.
                                        </span>
                                        <div className="flex items-center gap-1.5 pt-0.5">
                                            <span className="size-1.5 rounded-full bg-[#D4AF37]" />
                                            <span className="text-[10px] font-semibold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                                                Panel Admin
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </div>

                        {/* Search Trigger Button */}
                        <div className="px-4 pt-3.5 pb-2">
                            <button
                                type="button"
                                onClick={() => setSearchModalOpen(true)}
                                className={`flex w-full items-center justify-between rounded-xl border border-slate-700/60 bg-[#1E2E4A]/50 px-3.5 py-2 text-xs text-slate-300 transition-colors hover:border-slate-500 hover:bg-[#1E2E4A] hover:text-white ${
                                    sidebarCollapsed
                                        ? 'justify-center px-0'
                                        : ''
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Search className="size-4 shrink-0 text-slate-400" />
                                    {!sidebarCollapsed && (
                                        <span className="text-xs">
                                            Cari modul admin...
                                        </span>
                                    )}
                                </div>
                                {!sidebarCollapsed && (
                                    <kbd className="rounded border border-slate-700 bg-[#16233B] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                                        ⌘K
                                    </kbd>
                                )}
                            </button>
                        </div>

                        {/* Navigation Groups */}
                        <nav className="space-y-5 px-3 py-2">
                            {navGroups.map((group, groupIdx) => (
                                <div key={groupIdx} className="space-y-1">
                                    {!sidebarCollapsed ? (
                                        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                            {group.domain}
                                        </p>
                                    ) : (
                                        <div className="my-2 border-t border-[#1E2E4A]" />
                                    )}

                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isCurrentActive(
                                            item.href,
                                        );

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                title={
                                                    sidebarCollapsed
                                                        ? item.label
                                                        : undefined
                                                }
                                                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all ${
                                                    active
                                                        ? 'border-l-3 border-[#D4AF37] bg-[#1E2E4A] font-bold text-white shadow-xs'
                                                        : 'font-medium text-slate-300 hover:bg-[#1E2E4A]/60 hover:text-white'
                                                } ${sidebarCollapsed ? 'justify-center px-0 py-2.5' : ''}`}
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <Icon
                                                        className={`size-4.5 shrink-0 transition-colors ${
                                                            active
                                                                ? 'text-[#D4AF37]'
                                                                : 'text-slate-400 group-hover:text-slate-200'
                                                        }`}
                                                    />
                                                    {!sidebarCollapsed && (
                                                        <span className="truncate text-xs">
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </div>

                                                {!sidebarCollapsed &&
                                                    active && (
                                                        <span className="size-1.5 rounded-full bg-[#D4AF37]" />
                                                    )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom User Bar */}
                    <div className="space-y-2 border-t border-[#1E2E4A] p-3.5">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between rounded-xl border border-slate-700/50 bg-[#1E2E4A]/40 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:bg-[#1E2E4A] hover:text-white ${
                                sidebarCollapsed ? 'justify-center px-0' : ''
                            }`}
                            title="Buka Website Publik"
                        >
                            <span className="flex items-center gap-2">
                                <ExternalLink className="size-3.5 text-slate-400" />
                                {!sidebarCollapsed && (
                                    <span>Lihat Website</span>
                                )}
                            </span>
                            {!sidebarCollapsed && (
                                <span className="text-[10px] text-slate-400">
                                    ↗
                                </span>
                            )}
                        </a>

                        <div
                            className={`flex items-center justify-between rounded-xl border border-slate-700/60 bg-[#1E2E4A]/60 p-2.5 transition-colors ${
                                sidebarCollapsed ? 'justify-center' : ''
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-600/50 bg-[#2A3B5C] text-xs font-extrabold text-[#D4AF37]">
                                    {user?.name
                                        ? user.name.charAt(0).toUpperCase()
                                        : 'A'}
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-bold text-white">
                                            {user?.name ?? 'Admin Galuh & Co.'}
                                        </p>
                                        <p className="truncate text-[9.5px] font-semibold tracking-wider text-slate-400 uppercase">
                                            Administrator
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!sidebarCollapsed && (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Keluar"
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#16233B] hover:text-rose-400"
                                >
                                    <LogOut className="size-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* 2. Main Viewport Area (Putih Bersih & Biru Navy) */}
                <div
                    className={`flex min-h-screen flex-1 flex-col transition-all duration-200 ${
                        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                    }`}
                >
                    {/* Top Header Navbar */}
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-xs sm:px-8">
                        <div className="flex items-center gap-4">
                            {/* Desktop Sidebar Toggle */}
                            <button
                                type="button"
                                onClick={() =>
                                    setSidebarCollapsed(!sidebarCollapsed)
                                }
                                title={
                                    sidebarCollapsed
                                        ? 'Perbesar Sidebar'
                                        : 'Ciutkan Sidebar'
                                }
                                className="hidden rounded-xl border border-slate-200 bg-slate-50 p-2 text-[#16233B] transition-colors hover:border-[#16233B] hover:bg-white lg:inline-flex"
                            >
                                <Menu className="size-4.5" />
                            </button>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(true)}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-[#16233B] hover:bg-white lg:hidden"
                            >
                                <Menu className="size-5" />
                            </button>

                            {/* Page Header Titles */}
                            <div>
                                <h1 className="text-base font-extrabold tracking-tight text-[#16233B] sm:text-lg">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="hidden text-xs text-slate-500 sm:block">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Topbar Right Actions */}
                        <div className="flex items-center gap-3">
                            {headerAction}

                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#16233B] shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
                            >
                                <ExternalLink className="size-3.5 text-slate-500" />
                                <span>Lihat Website</span>
                            </a>
                        </div>
                    </header>

                    {/* Toast Notification Banner */}
                    <AnimatePresence>
                        {toastMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="sticky top-16 z-20 px-4 pt-3 sm:px-6"
                            >
                                <div
                                    className={`flex items-center justify-between rounded-lg border p-3 text-xs shadow-xs ${
                                        toastType === 'success'
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                            : 'border-rose-200 bg-rose-50 text-rose-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                        <span className="font-semibold">
                                            {toastMessage}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setToastMessage(null)}
                                        className="text-slate-400 hover:text-slate-700"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Page Content Canvas (Putih & Slate Bersih) */}
                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 220,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-full w-72 flex-col justify-between bg-[#16233B] p-4 text-white shadow-2xl"
                        >
                            <div>
                                <div className="flex items-center justify-between border-b border-[#1E2E4A] pb-3.5">
                                    <div className="flex items-center gap-3">
                                        <GaluhLogo
                                            variant="white"
                                            className="h-8 w-auto shrink-0"
                                            showText={false}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-extrabold tracking-wider text-white">
                                                GALUH &amp; CO.
                                            </span>
                                            <div className="flex items-center gap-1.5 pt-0.5">
                                                <span className="size-1.5 rounded-full bg-[#D4AF37]" />
                                                <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                                                    Panel Admin
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileSidebarOpen(false)
                                        }
                                        className="rounded-lg p-1.5 text-slate-300 hover:bg-[#1E2E4A] hover:text-white"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>

                                <nav className="mt-4 space-y-4">
                                    {navGroups.map((group, gIdx) => (
                                        <div key={gIdx} className="space-y-1">
                                            <p className="px-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                {group.domain}
                                            </p>
                                            {group.items.map((item) => {
                                                const Icon = item.icon;
                                                const active = isCurrentActive(
                                                    item.href,
                                                );

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() =>
                                                            setMobileSidebarOpen(
                                                                false,
                                                            )
                                                        }
                                                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                                            active
                                                                ? 'border-l-3 border-[#D4AF37] bg-[#1E2E4A] font-bold text-white shadow-xs'
                                                                : 'text-slate-300 hover:bg-[#1E2E4A] hover:text-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <Icon
                                                                className={`size-4 ${
                                                                    active
                                                                        ? 'text-[#D4AF37]'
                                                                        : 'text-slate-400'
                                                                }`}
                                                            />
                                                            <span>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                        {active && (
                                                            <span className="size-1.5 rounded-full bg-[#D4AF37]" />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            <div className="border-t border-[#1E2E4A] pt-3">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                                >
                                    <LogOut className="size-3.5" />
                                    <span>Keluar dari Admin</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quick Cmd+K Search Modal */}
            <AnimatePresence>
                {searchModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-xs"
                        onClick={() => setSearchModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
                        >
                            <div className="flex items-center border-b border-slate-200 px-4 py-3">
                                <Search className="mr-2.5 size-4 shrink-0 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Ketik untuk mencari menu atau modul admin..."
                                    autoFocus
                                    className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                                />
                                <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                                    ESC
                                </kbd>
                            </div>

                            <div className="max-h-80 overflow-y-auto p-2 text-xs">
                                {filteredQuickSearch.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400">
                                        Tidak ditemukan hasil untuk "
                                        {searchQuery}".
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredQuickSearch.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() =>
                                                        setSearchModalOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center justify-between rounded-lg p-2.5 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-7 items-center justify-center rounded-md bg-[#16233B] text-slate-200">
                                                            <Icon className="size-4 text-slate-300" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900">
                                                                {item.label}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-mono text-[10px] text-slate-400">
                                                        {item.href}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

export default AdminLayout;
