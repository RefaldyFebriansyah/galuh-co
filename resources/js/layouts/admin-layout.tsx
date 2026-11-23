import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowRight,
    Award,
    Bookmark,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Command,
    ExternalLink,
    FileText,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    Palette,
    Plus,
    Search,
    Settings,
    Shield,
    Sparkles,
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
                domain: 'MENU UTAMA',
                items: [
                    {
                        label: 'Dashboard',
                        shortLabel: 'Dashboard',
                        href: '/admin/dashboard',
                        icon: LayoutDashboard,
                        description: 'Ringkasan operasional dan katalog website',
                    },
                ],
            },
            {
                domain: 'KATALOG & WEBSITE',
                items: [
                    {
                        label: 'Katalog Hampers',
                        shortLabel: 'Katalog',
                        href: '/admin/katalog',
                        icon: Package,
                        description: 'Kelola paket hampers, varian kemasan, dan foto produk',
                    },
                    {
                        label: 'Konten Website',
                        shortLabel: 'Konten Web',
                        href: '/admin/cms-halaman',
                        icon: Palette,
                        description: 'Edit banner hero musim aktif, filosofi, testimoni, dan FAQ',
                    },
                ],
            },
            {
                domain: 'PESAN & INQUIRIES',
                items: [
                    {
                        label: 'Inquiries Website',
                        shortLabel: 'Inquiries',
                        href: '/admin/inquiries',
                        icon: FileText,
                        description: 'Permintaan proposal penawaran corporate dari formulir web',
                    },
                ],
            },
            {
                domain: 'PENGATURAN',
                items: [
                    {
                        label: 'Pengaturan Sistem',
                        shortLabel: 'Pengaturan',
                        href: '/admin/pengaturan',
                        icon: Settings,
                        description: 'Nomor WhatsApp resmi, jam operasional, dan akun staf',
                    },
                ],
            },
        ],
        []
    );

    // Flattened items for Cmd+K search
    const allNavItems = useMemo(
        () => navGroups.flatMap((g) => g.items),
        [navGroups]
    );

    const filteredQuickSearch = useMemo(() => {
        if (!searchQuery.trim()) return allNavItems;
        const q = searchQuery.toLowerCase();
        return allNavItems.filter(
            (item) =>
                item.label.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.href.toLowerCase().includes(q)
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
                className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-500/20 selection:text-emerald-900"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                }}
            >
                {/* 1. Desktop Fixed Admin Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 hidden flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-200 transition-all duration-200 lg:flex ${
                        sidebarCollapsed ? 'w-20' : 'w-64'
                    }`}
                >
                    <div className="flex flex-1 flex-col overflow-y-auto scrollbar-none">
                        {/* Admin Brand Header */}
                        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
                            >
                                <GaluhLogo
                                    variant="white"
                                    className="h-7 w-auto shrink-0"
                                    showText={false}
                                />
                                {!sidebarCollapsed && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm tracking-wide text-white">
                                            GALUH &amp; CO.
                                        </span>
                                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                            Admin
                                        </span>
                                    </div>
                                )}
                            </Link>

                            <button
                                type="button"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                title={sidebarCollapsed ? 'Perbesar Sidebar' : 'Ciutkan Sidebar'}
                                className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:inline-flex"
                            >
                                <Menu className="size-4" />
                            </button>
                        </div>

                        {/* Search Trigger Button */}
                        <div className="px-3 pt-3 pb-2">
                            <button
                                type="button"
                                onClick={() => setSearchModalOpen(true)}
                                className={`flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200 ${
                                    sidebarCollapsed ? 'justify-center px-0' : ''
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Search className="size-3.5 text-slate-400" />
                                    {!sidebarCollapsed && (
                                        <span className="text-xs">Cari menu...</span>
                                    )}
                                </div>
                                {!sidebarCollapsed && (
                                    <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
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
                                        <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            {group.domain}
                                        </p>
                                    ) : (
                                        <div className="my-2 border-t border-slate-800" />
                                    )}

                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isCurrentActive(item.href);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                title={sidebarCollapsed ? item.label : undefined}
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                                    active
                                                        ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                } ${sidebarCollapsed ? 'justify-center px-0 py-2.5' : ''}`}
                                            >
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <Icon
                                                        className={`size-4 shrink-0 ${
                                                            active ? 'text-white' : 'text-slate-400'
                                                        }`}
                                                    />
                                                    {!sidebarCollapsed && (
                                                        <span className="truncate">
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </div>

                                                {!sidebarCollapsed && active && (
                                                    <span className="size-1.5 rounded-full bg-white" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom User Bar */}
                    <div className="space-y-2 border-t border-slate-800 p-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${
                                sidebarCollapsed ? 'justify-center px-0' : ''
                            }`}
                            title="Buka Website Publik"
                        >
                            <span className="flex items-center gap-2">
                                <ExternalLink className="size-3.5 text-emerald-400" />
                                {!sidebarCollapsed && <span>Lihat Website</span>}
                            </span>
                            {!sidebarCollapsed && (
                                <span className="text-[10px] text-slate-400">↗</span>
                            )}
                        </a>

                        <div
                            className={`flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/80 p-2 ${
                                sidebarCollapsed ? 'justify-center' : ''
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold text-white">
                                            {user?.name ?? 'Administrator'}
                                        </p>
                                        <p className="truncate text-[10px] text-emerald-400 font-medium">
                                            Admin (Full Access)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!sidebarCollapsed && (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Keluar"
                                    className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-colors"
                                >
                                    <LogOut className="size-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* 2. Main Viewport Area */}
                <div
                    className={`flex min-h-screen flex-1 flex-col transition-all duration-200 ${
                        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
                    }`}
                >
                    {/* Top Header Navbar */}
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            {/* Mobile Hamburger Toggle */}
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(true)}
                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
                            >
                                <Menu className="size-5" />
                            </button>

                            {/* Page Header Titles */}
                            <div>
                                <h1 className="text-base font-bold text-slate-900 sm:text-lg">
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
                                className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 sm:inline-flex"
                            >
                                <ExternalLink className="size-3.5 text-slate-400" />
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
                                        <CheckCircle2 className="size-4 shrink-0" />
                                        <span className="font-medium">{toastMessage}</span>
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

                    {/* Page Content Canvas */}
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
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-full w-72 flex-col justify-between bg-slate-900 p-4 text-slate-200 shadow-2xl"
                        >
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-white">
                                            GALUH &amp; CO.
                                        </span>
                                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                            Admin
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMobileSidebarOpen(false)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>

                                <nav className="mt-4 space-y-4">
                                    {navGroups.map((group, gIdx) => (
                                        <div key={gIdx} className="space-y-1">
                                            <p className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                {group.domain}
                                            </p>
                                            {group.items.map((item) => {
                                                const Icon = item.icon;
                                                const active = isCurrentActive(item.href);

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setMobileSidebarOpen(false)}
                                                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                                                            active
                                                                ? 'bg-emerald-600 text-white font-semibold'
                                                                : 'text-slate-300 hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <Icon className="size-4 text-slate-400" />
                                                            <span>{item.label}</span>
                                                        </div>
                                                        {active && (
                                                            <span className="size-1.5 rounded-full bg-white" />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            <div className="border-t border-slate-800 pt-3">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-medium text-rose-300"
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
                                <Search className="size-4 text-slate-400 mr-2.5 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ketik untuk mencari menu atau modul admin..."
                                    autoFocus
                                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                                />
                                <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                                    ESC
                                </kbd>
                            </div>

                            <div className="max-h-80 overflow-y-auto p-2 text-xs">
                                {filteredQuickSearch.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400">
                                        Tidak ditemukan hasil untuk "{searchQuery}".
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredQuickSearch.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setSearchModalOpen(false)}
                                                    className="flex items-center justify-between rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                                                            <Icon className="size-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-xs">
                                                                {item.label}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500">
                                                                {item.description}
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
