import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronRight,
    ExternalLink,
    Gift,
    Inbox,
    LayoutDashboard,
    LogOut,
    Menu,
    Sliders,
    X,
    AlertCircle,
} from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';

interface AdminLayoutProps extends PropsWithChildren {
    title?: string;
    subtitle?: string;
    headerAction?: ReactNode;
}

export function AdminLayout({
    title = 'Admin Panel',
    subtitle: _subtitle,
    headerAction,
    children,
}: AdminLayoutProps) {
    const { url } = usePage();
    const pageProps = usePage().props as {
        auth?: { user?: { name: string; email: string } };
        flash?: { success?: string; error?: string };
    };

    const user = pageProps.auth?.user;
    const flash = pageProps.flash;

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
            const timer = setTimeout(() => setToastMessage(null), 4500);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            const timer = setTimeout(() => setToastMessage(null), 5500);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const navItems = [
        {
            label: 'Dashboard',
            href: '/admin',
            active: url === '/admin' || url === '/admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            label: 'Katalog Hampers',
            href: '/admin/products',
            active: url.startsWith('/admin/products'),
            icon: Gift,
        },
        {
            label: 'Inquiry & Leads',
            href: '/admin/inquiries',
            active: url.startsWith('/admin/inquiries'),
            icon: Inbox,
        },
        {
            label: 'Pengaturan Situs',
            href: '/admin/settings',
            active: url.startsWith('/admin/settings'),
            icon: Sliders,
        },
    ];

    return (
        <>
            <Head title={`${title} — Galuh & Co. CMS Studio`} />

            <div className="flex min-h-screen bg-[#F8F7F4] text-[#1C1A18] antialiased">
                {/* 1. Desktop Fixed Sidebar */}
                <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-[#1B3628] bg-[#0A1F16] text-[#E8ECE9] lg:flex">
                    <div className="flex flex-col">
                        {/* Brand Logo & Studio Tag */}
                        <div className="flex h-16 items-center border-b border-white/[0.08] px-5">
                            <Link
                                href="/admin"
                                className="flex items-center gap-2.5"
                            >
                                <GaluhLogo
                                    variant="white"
                                    className="h-8 w-auto"
                                    showText={false}
                                />
                                <div className="flex flex-col">
                                    <span className="font-serif text-sm font-semibold tracking-wider text-white">
                                        GALUH &amp; CO.
                                    </span>
                                    <span className="text-[9px] font-semibold tracking-[0.2em] text-[#C5A880] uppercase">
                                        STUDIO CMS
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation Section */}
                        <div className="px-3 py-5">
                            <p className="px-3 text-[10px] font-semibold tracking-[0.16em] text-[#A69986] uppercase">
                                Navigasi Studio
                            </p>
                            <nav className="mt-2 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = item.active;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`group relative flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-white/[0.12] font-semibold text-white'
                                                    : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon
                                                    className={`size-4 shrink-0 transition-colors ${
                                                        isActive
                                                            ? 'text-[#D4AF37]'
                                                            : 'text-white/50 group-hover:text-white/80'
                                                    }`}
                                                />
                                                <span>{item.label}</span>
                                            </div>

                                            {isActive && (
                                                <span className="h-4 w-1 rounded-full bg-[#D4AF37]" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Sidebar: View Public Website & User Account */}
                    <div className="space-y-2 border-t border-white/[0.08] p-3">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                        >
                            <span className="flex items-center gap-2">
                                <ExternalLink className="size-3.5 text-[#C5A880]" />
                                <span>Lihat Halaman Toko</span>
                            </span>
                            <span className="text-[10px] text-white/40">↗</span>
                        </a>

                        <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#071610] p-2.5">
                            <div className="flex min-w-0 items-center gap-2.5 pr-1">
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[#C5A880]/40 bg-[#C5A880]/15 text-[11px] font-bold text-[#E6CFA8]">
                                    {user?.name
                                        ? user.name.charAt(0).toUpperCase()
                                        : 'A'}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-medium text-white">
                                        {user?.name ?? 'Admin'}
                                    </p>
                                    <p className="truncate text-[10px] text-white/50">
                                        {user?.email ?? 'admin@galuh.co'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Keluar dari Admin"
                                aria-label="Logout"
                                className="flex size-7 shrink-0 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-300"
                            >
                                <LogOut className="size-3.5" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* 2. Mobile Off-Canvas Drawer */}
                {mobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <div
                            className="flex h-full w-72 flex-col justify-between bg-[#0A1F16] p-4 text-white shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div>
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-2">
                                        <GaluhLogo
                                            variant="white"
                                            className="h-7 w-auto"
                                            showText={false}
                                        />
                                        <span className="font-serif text-sm font-bold text-white">
                                            GALUH &amp; CO.
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileSidebarOpen(false)
                                        }
                                        className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>

                                <nav className="mt-4 space-y-1">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() =>
                                                    setMobileSidebarOpen(false)
                                                }
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                                                    item.active
                                                        ? 'bg-white/15 font-semibold text-white'
                                                        : 'text-white/75 hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Icon className="size-4 text-[#C5A880]" />
                                                    <span>{item.label}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            <div className="border-t border-white/10 pt-3">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-xs font-medium text-red-300"
                                >
                                    <LogOut className="size-3.5" />
                                    <span>Keluar dari Admin</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Main Body Container (Offset by sidebar width on desktop) */}
                <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
                    {/* Top Navigation Bar */}
                    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E7E2D8] bg-[#F8F7F4]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
                        {/* Mobile Toggle + Breadcrumbs */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(true)}
                                className="flex size-8 items-center justify-center rounded-lg border border-[#DCD5C9] bg-white text-[#2B2723] hover:bg-[#F2EDE4] lg:hidden"
                                aria-label="Buka menu navigasi"
                            >
                                <Menu className="size-4" />
                            </button>

                            <div className="flex items-center gap-1.5 text-xs text-[#7A746B]">
                                <span className="hidden font-medium sm:inline">
                                    Admin Studio
                                </span>
                                <ChevronRight className="hidden size-3 text-[#AFA89D] sm:inline" />
                                <span className="font-semibold text-[#1C1A18]">
                                    {title}
                                </span>
                            </div>
                        </div>

                        {/* Topbar Actions */}
                        <div className="flex items-center gap-2.5">
                            {headerAction}

                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden items-center gap-1.5 rounded-lg border border-[#D5CEC2] bg-white px-3 py-1.5 text-xs font-medium text-[#2C2925] shadow-2xs transition-colors hover:border-[#0E2A1E] hover:text-[#0E2A1E] sm:inline-flex"
                            >
                                <ExternalLink className="size-3 text-[#9E7E45]" />
                                <span>Preview Web</span>
                            </a>
                        </div>
                    </header>

                    {/* Toast Notification Alert */}
                    {toastMessage && (
                        <div className="px-4 pt-4 sm:px-6 lg:px-8">
                            <div
                                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs font-medium shadow-2xs ${
                                    toastType === 'success'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                        : 'border-red-200 bg-red-50 text-red-900'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {toastType === 'success' ? (
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="size-4 shrink-0 text-red-600" />
                                    )}
                                    <span>{toastMessage}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setToastMessage(null)}
                                    className="ml-3 text-stone-400 hover:text-stone-700"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Page Content Canvas */}
                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}

export default AdminLayout;
