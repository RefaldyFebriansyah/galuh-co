import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { Product } from '@/types';

interface WelcomeProps {
    products?: Product[];
    whatsappNumber?: string;
}

export default function Welcome({
    products = [],
    whatsappNumber = '',
}: WelcomeProps) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="GALUH & CO. — Hampers Premium" />

            <div className="min-h-screen bg-background font-sans text-foreground">
                <header className="mx-auto flex max-w-6xl items-center justify-between p-6">
                    <div>
                        <span className="font-serif text-2xl font-bold tracking-wider text-brand-primary dark:text-brand-accent">
                            GALUH & CO.
                        </span>
                        <p className="text-xs text-muted-foreground">
                            Hampers Premium & Corporate Gifting
                        </p>
                    </div>

                    <nav className="flex items-center gap-4 text-sm">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-md border border-border px-4 py-1.5 transition-colors hover:border-brand-gold"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-md border border-border px-4 py-1.5 transition-colors hover:border-brand-gold"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-10">
                    {/* Status & Environment Props Display */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    Inertia Props Ready
                                </span>
                                <h1 className="mt-2 font-serif text-2xl font-semibold">
                                    Katalog Produk Aktif & Integrasi WhatsApp
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Data terkirim dari controller Laravel via
                                    props Inertia.
                                </p>
                            </div>
                            <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-xs">
                                <span className="block text-muted-foreground">
                                    Nomor WhatsApp (.env):
                                </span>
                                <span className="font-mono font-bold text-foreground">
                                    +{whatsappNumber}
                                </span>
                            </div>
                        </div>

                        {/* Product Cards Grid */}
                        <div className="mt-6 border-t border-border pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-serif text-lg font-medium">
                                    Daftar Produk Aktif ({products.length}{' '}
                                    produk)
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex flex-col overflow-hidden rounded-lg border border-border bg-background p-4 transition-all hover:border-brand-gold hover:shadow-xs"
                                    >
                                        <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                        <div className="mt-3 flex-1">
                                            <span className="inline-block rounded bg-cream px-2 py-0.5 text-[10px] font-semibold text-brand-espresso dark:bg-card dark:text-brand-accent">
                                                {product.category}
                                            </span>
                                            <h3 className="mt-1 font-serif text-base font-semibold">
                                                {product.name}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                {product.short_description}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                                            <span className="font-serif font-bold text-brand-primary dark:text-brand-accent">
                                                {product.formatted_price}
                                            </span>
                                            <a
                                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo GALUH & CO., saya tertarik dengan hampers ${product.name}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="dark:text-brand-dark rounded-full bg-brand-primary px-3 py-1 font-medium text-brand-ivory transition-colors hover:bg-brand-primary-dark dark:bg-brand-accent"
                                            >
                                                Pesan WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
