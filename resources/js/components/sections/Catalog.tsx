import { useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeInUp, viewportOnce, buttonTap } from '@/lib/motion';
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

const ITEMS_PER_PAGE = 8;

function getEditorialTag(product: Product, idx: number): string {
    if (product.slug === 'seri-kencana-lebaran') return 'Best Seller';
    if (product.slug === 'seri-rayyan-mubarak') return 'Edisi Spesial';
    if (product.slug === 'seri-eksekutif-kantor') return 'VIP Executive';
    if (product.slug === 'seri-sinergi-korporat') return 'Tech & Brew';
    if (product.slug === 'seri-apresiasi-bisnis') return 'Pilihan B2B';
    if (product.slug === 'seri-mahligai-seserahan') return 'Seserahan';
    if (product.slug === 'seri-noel-luminary') return 'Festive Choice';
    if (product.slug === 'seri-bespoke-royal-heritage') return 'Bespoke Custom';

    if (idx === 0) return 'Kurasi Pilihan';
    return 'Signature';
}

function createOrderUrl(
    productName: string,
    whatsappNumber: string,
    price?: string,
): string {
    const text = `Halo GALUH & CO., saya tertarik memesan hampers "${productName}"${price ? ` (${price})` : ''}. Mohon informasi detail isi paket dan ketersediaannya.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

interface ProductCardProps {
    product: Product;
    idx: number;
    whatsappNumber: string;
    className?: string;
}

/**
 * Compact Boutique Card Design:
 * Scaled down proportionally to fit comfortable viewing heights without excessive page scrolling.
 */
function ProductCard({
    product,
    idx,
    whatsappNumber,
    className = '',
}: ProductCardProps) {
    const tagText = getEditorialTag(product, idx);
    const whatsappOrderUrl = createOrderUrl(
        product.name,
        whatsappNumber,
        product.formatted_price,
    );

    return (
        <motion.article
            layout
            whileHover={{
                y: -4,
                transition: {
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                },
            }}
            className={`group flex flex-col overflow-hidden rounded-xl border border-[#EAE5DC] bg-white shadow-[0_3px_14px_-6px_rgba(20,54,40,0.06)] transition-all duration-300 hover:border-[#C5A880]/70 hover:shadow-[0_8px_24px_-8px_rgba(20,54,40,0.12)] ${className}`}
        >
            {/* Photo Frame (Compact 4:3.2 Aspect Ratio) */}
            <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-[#F2EDE4]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full flex-col items-center justify-center bg-gradient-to-b from-[#F7F2EB] to-[#EFE8DC] p-4 text-center">
                        <div className="flex size-10 items-center justify-center rounded-full border border-[#D5CEC2]/70 bg-white/80 shadow-2xs">
                            <span className="font-serif text-lg font-normal text-[#C5A880]">
                                G
                            </span>
                        </div>
                        <span className="mt-1.5 font-serif text-[10px] font-bold tracking-[0.2em] text-[#8C877E] uppercase">
                            GALUH &amp; CO.
                        </span>
                    </div>
                )}

                {/* Top Badge: Editorial Pill */}
                <div className="absolute top-2.5 left-2.5 flex items-center">
                    <span className="rounded-full border border-black/10 bg-white/92 px-2.5 py-0.5 text-[8.5px] font-bold tracking-[0.12em] text-[#0E2A1E] uppercase shadow-2xs backdrop-blur-md">
                        {tagText}
                    </span>
                </div>

                {/* Category Overlay Bottom Left */}
                <div className="absolute bottom-2.5 left-2.5">
                    <span className="rounded-full bg-black/45 px-2 py-0.5 font-serif text-[9px] text-[#F5EFEB] italic shadow-2xs backdrop-blur-md">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* Editorial Content (Compact Padding & Typography) */}
            <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                <div className="flex items-center justify-between text-[9px] font-bold tracking-[0.18em] text-[#9E7E45] uppercase">
                    <span>{product.category}</span>
                    <span>GALUH &amp; CO.</span>
                </div>

                <h3 className="mt-1 line-clamp-1 font-serif text-[15px] font-normal text-[#1A1815] transition-colors duration-200 group-hover:text-[#0E2A1E]">
                    {product.name}
                </h3>

                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#6E6962]">
                    {product.short_description ||
                        'Hampers premium dengan kemasan eksklusif dan kurasi isi berkualitas tinggi.'}
                </p>

                {/* Card Footer: Price & WhatsApp Order Button */}
                <div className="mt-3.5 flex items-center justify-between border-t border-[#F0EBE1] pt-2.5">
                    <div>
                        <span className="block text-[8.5px] font-semibold tracking-wider text-[#8C877E] uppercase">
                            Mulai Dari
                        </span>
                        <span className="font-serif text-sm font-bold tracking-tight text-[#0E2A1E]">
                            {product.formatted_price}
                        </span>
                    </div>

                    <motion.a
                        whileTap={buttonTap.tap}
                        href={whatsappOrderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D5CEC2] bg-[#FAF8F5] px-3 py-1 text-[11px] font-semibold text-[#0E2A1E] transition-all duration-300 hover:border-[#0E2A1E] hover:bg-[#0E2A1E] hover:text-white"
                    >
                        <WhatsAppIcon className="size-3 text-[#25D366] transition-colors group-hover/btn:text-white" />
                        <span>Pesan</span>
                        <ArrowUpRight className="size-2.5 text-[#9E7E45] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-hover/btn:text-white" />
                    </motion.a>
                </div>
            </div>
        </motion.article>
    );
}

const horizontalSlideVariants: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.42,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -100 : 100,
        opacity: 0,
        transition: {
            duration: 0.28,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
};

export function Catalog({ products, whatsappNumber }: CatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);

    const paginate = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1);
        setCurrentPage(newPage);
    };

    // Defensive normalization: guarantee an Array
    const safeProducts = useMemo<Product[]>(() => {
        if (Array.isArray(products)) {
            return products;
        }
        if (products && typeof products === 'object') {
            return Object.values(products);
        }
        return [];
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return safeProducts;
        }

        const normalize = (val: string) =>
            val.toLowerCase().replace(/[^a-z0-9]/g, '');
        const sel = normalize(selectedCategory);

        return safeProducts.filter((p) => {
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
    }, [safeProducts, selectedCategory]);

    // Reset page to 0 when category tab changes
    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
        setDirection(1);
        setCurrentPage(0);
    };

    // Pagination calculations (Uniform for "Semua Koleksi" and every category)
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const displayedProducts = useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    return (
        <section
            id="koleksi"
            className="relative bg-[#FAF8F5] py-12 sm:py-16 lg:py-20"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* 1. Editorial Section Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center text-[11px] font-semibold tracking-[0.2em] text-[#9E7E45] uppercase">
                        <span>KOLEKSI HAMPERS</span>
                    </div>

                    <h2 className="mt-2.5 font-serif text-3xl font-normal tracking-tight text-[#1A1815] sm:text-4xl lg:text-5xl">
                        Koleksi Bingkisan{' '}
                        <span className="text-[#9E7E45] italic">Istimewa</span>
                    </h2>

                    <p className="mt-2.5 text-xs leading-relaxed text-[#5C564C] sm:text-sm">
                        Setiap hampers dirancang khusus dengan bahan
                        berkualitas, presentasi elegan, dan kartu ucapan
                        berstempel wax untuk momen perayaan serta apresiasi
                        korporat bernilai tinggi.
                    </p>
                </motion.div>

                {/* 2. Interactive Category Tabs */}
                <div className="mt-8 flex items-center justify-center">
                    <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#E8E2D8] bg-[#F2EDE4]/70 p-1.5 backdrop-blur-xs">
                        {CATEGORIES.map((cat) => {
                            const isActive = selectedCategory === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() =>
                                        handleCategoryChange(cat.value)
                                    }
                                    className={`relative cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-colors duration-300 sm:px-4.5 sm:py-2 sm:text-xs ${
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

                {/* 3. Catalog Display Area: Compact Grid + Multi-Position Zero Effort Navigation */}
                <div className="mt-8 overflow-hidden">
                    {/* Top Bar Quick Navigation (Immediately Visible Without Scrolling) */}
                    {totalPages > 1 && (
                        <div className="mb-4 flex items-center justify-end">
                            {/* Top Quick Arrows */}
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D5CEC2] bg-white/90 px-2.5 py-1 shadow-2xs backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={() =>
                                        paginate(Math.max(0, currentPage - 1))
                                    }
                                    disabled={currentPage === 0}
                                    aria-label="Koleksi Sebelumnya"
                                    className="flex size-7 cursor-pointer items-center justify-center rounded-full text-[#0E2A1E] transition-all hover:bg-[#FAF7F2] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft className="size-3.5" />
                                </button>
                                <span className="px-2 font-serif text-[11px] font-semibold text-[#0E2A1E]">
                                    {currentPage + 1} / {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        paginate(
                                            Math.min(
                                                totalPages - 1,
                                                currentPage + 1,
                                            ),
                                        )
                                    }
                                    disabled={currentPage === totalPages - 1}
                                    aria-label="Koleksi Selanjutnya"
                                    className="flex size-7 cursor-pointer items-center justify-center rounded-full text-[#0E2A1E] transition-all hover:bg-[#FAF7F2] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronRight className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="wait" custom={direction}>
                        {safeProducts.length === 0 ||
                        filteredProducts.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="rounded-2xl border border-dashed border-[#EAE5DC] bg-white/40 p-10 text-center"
                            >
                                <p className="font-serif text-sm text-[#8C877E]">
                                    Belum ada koleksi yang ditampilkan untuk
                                    kategori ini.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${selectedCategory}-page-${currentPage}`}
                                custom={direction}
                                variants={horizontalSlideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="relative flex flex-col"
                            >
                                {/* Floating Side Arrow: Left (Visible on desktop XL screens right next to grid) */}
                                {totalPages > 1 && currentPage > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            paginate(
                                                Math.max(0, currentPage - 1),
                                            )
                                        }
                                        className="absolute top-1/2 -left-5 z-20 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#D5CEC2] bg-white/95 p-2.5 text-[#0E2A1E] shadow-lg backdrop-blur-md transition-all hover:scale-108 hover:border-[#0E2A1E] hover:bg-[#0E2A1E] hover:text-white active:scale-95 xl:flex"
                                        aria-label="Geser ke Koleksi Sebelumnya"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                )}

                                {/* Compact Grid: 4 Kolom x 2 Baris */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {displayedProducts.map((product, idx) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            idx={
                                                currentPage * ITEMS_PER_PAGE +
                                                idx
                                            }
                                            whatsappNumber={whatsappNumber}
                                        />
                                    ))}
                                </div>

                                {/* Floating Side Arrow: Right (Visible on desktop XL screens right next to grid) */}
                                {totalPages > 1 &&
                                    currentPage < totalPages - 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                paginate(
                                                    Math.min(
                                                        totalPages - 1,
                                                        currentPage + 1,
                                                    ),
                                                )
                                            }
                                            className="absolute top-1/2 -right-5 z-20 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#D5CEC2] bg-white/95 p-2.5 text-[#0E2A1E] shadow-lg backdrop-blur-md transition-all hover:scale-108 hover:border-[#0E2A1E] hover:bg-[#0E2A1E] hover:text-white active:scale-95 xl:flex"
                                            aria-label="Geser ke Koleksi Selanjutnya"
                                        >
                                            <ChevronRight className="size-5" />
                                        </button>
                                    )}
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
