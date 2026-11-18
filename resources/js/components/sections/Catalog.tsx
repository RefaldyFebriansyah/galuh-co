import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { ArrowUpRight } from 'lucide-react';
import {
    fadeInUp,
    viewportOnce,
    transitionFast,
    buttonTap,
} from '@/lib/motion';
import type { Product, ProductCategory } from '@/types';

export interface CatalogProps {
    products: Product[];
    whatsappNumber: string;
}

interface FilterTab {
    label: string;
    value: 'all' | ProductCategory;
}

const CATEGORIES: FilterTab[] = [
    { label: 'Semua Koleksi', value: 'all' },
    { label: 'Lebaran & Idul Fitri', value: 'Paket Lebaran' },
    { label: 'Corporate & Kantor', value: 'Paket Kantor' },
    { label: 'Natal & Tahun Baru', value: 'Natal & Tahun Baru' },
    { label: 'Wedding & Seserahan', value: 'Wedding' },
    { label: 'Bespoke Custom', value: 'Custom' },
];

export function Catalog({ products, whatsappNumber }: CatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return products;
        }

        const normalize = (val: string) =>
            val.toLowerCase().replace(/[^a-z0-9]/g, '');
        const sel = normalize(selectedCategory);

        return products.filter((p) => {
            const cat = normalize(p.category || '');
            if (cat === sel) {
                return true;
            }

            // Lebaran / Ramadan matches
            if (
                sel.includes('lebaran') &&
                (cat.includes('lebaran') ||
                    cat.includes('ramadan') ||
                    cat.includes('eid'))
            ) {
                return true;
            }

            // Kantor / Corporate matches
            if (
                (sel.includes('kantor') || sel.includes('corporate')) &&
                (cat.includes('kantor') ||
                    cat.includes('corporate') ||
                    cat.includes('office') ||
                    cat.includes('bisnis'))
            ) {
                return true;
            }

            // Natal / Tahun Baru matches
            if (
                (sel.includes('natal') || sel.includes('tahunbaru')) &&
                (cat.includes('natal') ||
                    cat.includes('christmas') ||
                    cat.includes('tahunbaru'))
            ) {
                return true;
            }

            // Wedding matches
            if (
                sel.includes('wedding') &&
                (cat.includes('wedding') ||
                    cat.includes('seserahan') ||
                    cat.includes('hantaran') ||
                    cat.includes('nikah'))
            ) {
                return true;
            }

            // Custom matches
            if (
                sel.includes('custom') &&
                (cat.includes('custom') || cat.includes('bespoke'))
            ) {
                return true;
            }

            return false;
        });
    }, [products, selectedCategory]);

    const createOrderUrl = (productName: string, price?: string) => {
        const text = `Halo GALUH & CO., saya tertarik memesan hampers "${productName}"${price ? ` (${price})` : ''}. Mohon informasi detail isi paket dan ketersediaannya.`;
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    };

    const getEditorialTag = (product: Product, idx: number) => {
        if (product.slug === 'seri-kencana-lebaran') return 'Best Seller';
        if (product.slug === 'seri-rayyan-mubarak') return 'Edisi Spesial';
        if (product.slug === 'seri-eksekutif-kantor') return 'VIP Executive';
        if (product.slug === 'seri-sinergi-korporat') return 'Tech & Brew';
        if (product.slug === 'seri-apresiasi-bisnis') return 'Pilihan B2B';
        if (product.slug === 'seri-mahligai-seserahan') return 'Seserahan';
        if (product.slug === 'seri-noel-luminary') return 'Festive Choice';
        if (product.slug === 'seri-bespoke-royal-heritage')
            return 'Bespoke Atelier';

        if (idx === 0) return 'Kurasi Pilihan';
        return 'Signature';
    };

    return (
        <section
            id="koleksi"
            className="relative bg-[#FAF8F5] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* 1. Editorial Section Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#9E7E45] uppercase">
                        <span>KATALOG ATELIER</span>
                        <span className="size-1 rounded-full bg-[#C5A880]" />
                        <span>EDISI 2024 / 2025</span>
                    </div>

                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#1A1815] sm:text-4xl lg:text-5xl">
                        Koleksi Bingkisan{' '}
                        <span className="text-[#9E7E45] italic">Istimewa</span>
                    </h2>

                    <p className="mt-3.5 text-sm leading-relaxed text-[#5C564C] sm:text-base">
                        Setiap hampers dirancang khusus dengan bahan
                        berkualitas, presentasi elegan, dan kartu ucapan
                        berstempel wax untuk momen perayaan serta apresiasi
                        korporat bernilai tinggi.
                    </p>
                </motion.div>

                {/* 2. Interactive Category Tabs with Framer Motion layoutId Active Indicator */}
                <div className="mt-10 flex items-center justify-center">
                    <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#E8E2D8] bg-[#F2EDE4]/70 p-1.5 backdrop-blur-xs">
                        {CATEGORIES.map((cat) => {
                            const isActive = selectedCategory === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() =>
                                        setSelectedCategory(cat.value)
                                    }
                                    className={`relative cursor-pointer rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition-colors duration-300 sm:px-5 sm:text-xs ${
                                        isActive
                                            ? 'text-[#0E2A1E]'
                                            : 'text-[#6E6962] hover:text-[#1A1815]'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCatalogCategory"
                                            className="absolute inset-0 rounded-full border border-[#D5CEC2] bg-white shadow-2xs"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 28,
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10 block whitespace-nowrap">
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Boutique Catalog Grid with Smooth Animated Transitions */}
                <div className="mt-12">
                    <AnimatePresence mode="wait">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="rounded-3xl border border-dashed border-[#EAE5DC] bg-white/40 p-12 text-center"
                            >
                                <p className="font-serif text-sm text-[#8C877E]">
                                    Belum ada koleksi yang ditampilkan untuk
                                    kategori ini.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={selectedCategory}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={transitionFast}
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            >
                                {filteredProducts.map((product, idx) => {
                                    const tagText = getEditorialTag(
                                        product,
                                        idx,
                                    );
                                    const whatsappOrderUrl = createOrderUrl(
                                        product.name,
                                        product.formatted_price,
                                    );

                                    return (
                                        <motion.article
                                            key={product.id}
                                            layout
                                            whileHover={{
                                                y: -6,
                                                transition: {
                                                    duration: 0.3,
                                                    ease: [0.16, 1, 0.3, 1],
                                                },
                                            }}
                                            className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white shadow-[0_4px_20px_-8px_rgba(20,54,40,0.06)] transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-[0_12px_32px_-10px_rgba(20,54,40,0.12)]"
                                        >
                                            {/* Photo Frame (High Aspect Ratio Boutique Catalog Style) */}
                                            <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-[#F2EDE4]">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        loading="lazy"
                                                        className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                                                    />
                                                ) : (
                                                    <div className="flex size-full flex-col items-center justify-center bg-gradient-to-b from-[#F7F2EB] to-[#EFE8DC] p-6 text-center">
                                                        <div className="flex size-14 items-center justify-center rounded-full border border-[#D5CEC2]/70 bg-white/80 shadow-2xs">
                                                            <span className="font-serif text-2xl font-normal text-[#C5A880]">
                                                                G
                                                            </span>
                                                        </div>
                                                        <span className="mt-2.5 font-serif text-[11px] font-bold tracking-[0.2em] text-[#8C877E] uppercase">
                                                            GALUH &amp; CO.
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Top Badge: Editorial Pill */}
                                                <div className="absolute top-3 left-3 flex items-center">
                                                    <span className="rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[9px] font-bold tracking-[0.14em] text-[#0E2A1E] uppercase shadow-2xs backdrop-blur-md">
                                                        {tagText}
                                                    </span>
                                                </div>

                                                {/* Category Overlay Bottom Left */}
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="rounded-full bg-black/45 px-2.5 py-0.5 font-serif text-[10px] text-[#F5EFEB] italic shadow-2xs backdrop-blur-md">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Editorial Content */}
                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.18em] text-[#9E7E45] uppercase">
                                                    <span>
                                                        {product.category}
                                                    </span>
                                                    <span>ATELIER</span>
                                                </div>

                                                <h3 className="mt-1.5 font-serif text-lg font-normal text-[#1A1815] transition-colors duration-200 group-hover:text-[#0E2A1E]">
                                                    {product.name}
                                                </h3>

                                                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6E6962]">
                                                    {product.short_description ||
                                                        'Hampers premium dengan kemasan eksklusif dan kurasi isi berkualitas tinggi.'}
                                                </p>

                                                {/* Card Footer: Price & WhatsApp Order Button */}
                                                <div className="mt-5 flex items-center justify-between border-t border-[#F0EBE1] pt-3.5">
                                                    <div>
                                                        <span className="block text-[9px] font-semibold tracking-wider text-[#8C877E] uppercase">
                                                            Mulai Dari
                                                        </span>
                                                        <span className="font-serif text-base font-bold tracking-tight text-[#0E2A1E]">
                                                            {
                                                                product.formatted_price
                                                            }
                                                        </span>
                                                    </div>

                                                    <motion.a
                                                        whileTap={buttonTap.tap}
                                                        href={whatsappOrderUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/btn inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D5CEC2] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-semibold text-[#0E2A1E] transition-all duration-300 hover:border-[#0E2A1E] hover:bg-[#0E2A1E] hover:text-white"
                                                    >
                                                        <WhatsAppIcon className="size-3.5 text-[#25D366] transition-colors group-hover/btn:text-white" />
                                                        <span>Pesan</span>
                                                        <ArrowUpRight className="size-3 text-[#9E7E45] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-hover/btn:text-white" />
                                                    </motion.a>
                                                </div>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

// Re-export for compatibility with ProductsSection naming
export const ProductsSection = Catalog;
