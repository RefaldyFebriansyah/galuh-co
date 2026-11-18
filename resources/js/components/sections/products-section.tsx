import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { buttonTap } from '@/lib/motion';
import type { Product, ProductCategory } from '@/types';

interface ProductsSectionProps {
    products: Product[];
    whatsappNumber: string;
}

const CATEGORIES: { label: string; value: 'all' | ProductCategory }[] = [
    { label: 'SEMUA KOLEKSI', value: 'all' },
    { label: 'PAKET LEBARAN', value: 'Paket Lebaran' },
    { label: 'PAKET KANTOR', value: 'Paket Kantor' },
    { label: 'NATAL & TAHUN BARU', value: 'Natal & Tahun Baru' },
    { label: 'WEDDING', value: 'Wedding' },
    { label: 'CUSTOM', value: 'Custom' },
];

export function ProductsSection({
    products,
    whatsappNumber,
}: ProductsSectionProps) {
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
                sel.includes('kantor') &&
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

    const createOrderUrl = (productName: string) => {
        const text = `Halo GALUH & CO., saya tertarik dengan hampers ${productName}. Boleh minta info ketersediaan dan detailnya?`;
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    };

    const getBadgeLabel = (product: Product, idx: number) => {
        // Tag produk unggulan berdasarkan slug / nama
        if (product.slug === 'seri-kencana-lebaran') {
            return '✦ BEST SELLER ✦';
        }
        if (product.slug === 'seri-rayyan-mubarak') {
            return '✦ EDISI SPESIAL ✦';
        }
        if (product.slug === 'seri-safiya-mubarak') {
            return 'FAVORIT';
        }
        if (product.slug === 'seri-eksekutif-kantor') {
            return '✦ VIP EXECUTIVE ✦';
        }
        if (product.slug === 'seri-sinergi-korporat') {
            return '✦ TECH & COFFEE ✦';
        }
        if (product.slug === 'seri-apresiasi-bisnis') {
            return '✦ B2B FAVORIT ✦';
        }
        if (product.slug === 'seri-harmoni-bisnis') {
            return '✦ WELLNESS DESK ✦';
        }
        if (product.slug === 'seri-mahligai-seserahan') {
            return 'SESERAHAN MEWAH';
        }
        if (product.slug === 'seri-noel-luminary') {
            return '✦ FESTIVE BESTSELLER ✦';
        }
        if (product.slug === 'seri-starlight-prestige') {
            return '✦ EDISI TAHUN BARU ✦';
        }
        if (product.slug === 'seri-winter-harmony') {
            return 'FAVORIT';
        }
        if (product.slug === 'seri-bespoke-royal-heritage') {
            return 'BESPOKE DESIGN';
        }

        // Tag kategori konsisten
        const norm = (product.category || '').toLowerCase();
        if (
            norm.includes('lebaran') ||
            norm.includes('ramadan') ||
            norm.includes('eid')
        ) {
            return idx === 0 ? '✦ EDISI TERBATAS ✦' : 'EDISI LEBARAN';
        }
        if (
            norm.includes('kantor') ||
            norm.includes('corporate') ||
            norm.includes('office')
        ) {
            return 'PAKET KANTOR';
        }
        if (norm.includes('natal') || norm.includes('christmas')) {
            return 'EDISI NATAL';
        }
        if (norm.includes('wedding') || norm.includes('seserahan')) {
            return 'WEDDING';
        }
        if (norm.includes('custom') || norm.includes('bespoke')) {
            return 'CUSTOM ORDER';
        }

        return 'EKSKLUSIF';
    };

    return (
        <section id="koleksi" className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                        ✦ KATALOG EKSKLUSIF ✦
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#1A1815] md:text-4xl lg:text-5xl">
                        Pilihan Hampers Istimewa
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                        Temukan rangkaian bingkisan pilihan dengan kemasan mewah
                        dan sentuhan personal untuk melengkapi setiap momen
                        spesial maupun kebutuhan perusahaan.
                    </p>
                </div>

                {/* Filter Category Tabs */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.value;
                        return (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`rounded-full px-5 py-2 text-[10px] font-bold tracking-[0.16em] uppercase transition-all duration-300 ${
                                    isActive
                                        ? 'bg-[#0E2A1E] text-white shadow-xs'
                                        : 'border border-[#EAE5DC] bg-white text-[#6E6962] hover:border-[#0E2A1E] hover:text-[#0E2A1E]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Products Grid (4 Columns) */}
                {filteredProducts.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-[#EAE5DC] p-12 text-center">
                        <p className="font-serif text-sm text-[#8C877E]">
                            Belum ada produk untuk kategori ini.
                        </p>
                    </div>
                ) : (
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.28,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5"
                    >
                        {filteredProducts.map((product, idx) => {
                            const badgeText = getBadgeLabel(product, idx);
                            const isHighlightedBadge = badgeText.includes('✦');

                            return (
                                <motion.div
                                    key={product.id}
                                    whileHover={{
                                        y: -5,
                                        transition: {
                                            duration: 0.25,
                                            ease: [0.16, 1, 0.3, 1],
                                        },
                                    }}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white shadow-2xs transition-shadow duration-300 hover:shadow-lg"
                                >
                                    {/* Product Image Area */}
                                    <div className="relative flex aspect-[4/3.8] w-full items-center justify-center overflow-hidden bg-[#F2EDE4]">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex size-full flex-col items-center justify-center bg-gradient-to-b from-[#F7F2EB] to-[#EFE8DC] p-4 text-center transition-transform duration-500 ease-out group-hover:scale-105 sm:p-6">
                                                <div className="relative flex size-11 items-center justify-center rounded-full border border-[#D5CEC2]/70 bg-white/80 shadow-2xs sm:size-14">
                                                    <span className="font-serif text-xl font-normal text-[#C5A880] sm:text-2xl">
                                                        G
                                                    </span>
                                                </div>
                                                <span className="mt-2 font-serif text-[10px] font-bold tracking-[0.18em] text-[#8C877E] uppercase sm:mt-2.5 sm:text-[11px] sm:tracking-[0.2em]">
                                                    GALUH &amp; CO.
                                                </span>
                                                <span className="mt-0.5 text-[7.5px] tracking-wider text-[#A69E91] sm:text-[8px]">
                                                    Foto Koleksi Segera Hadir
                                                </span>
                                            </div>
                                        )}

                                        {/* Badge on Top Right */}
                                        <div className="absolute top-2.5 right-2.5 flex items-center">
                                            <span
                                                className={`rounded-full px-3 py-0.5 text-[8px] font-bold tracking-wider uppercase backdrop-blur-xs ${
                                                    isHighlightedBadge
                                                        ? 'border border-[#C5A880]/50 bg-[#0E2A1E] text-[#F3E8D2] shadow-xs'
                                                        : 'border border-[#EAE5DC] bg-white/95 text-[#1A1815] shadow-xs'
                                                }`}
                                            >
                                                {badgeText}
                                            </span>
                                        </div>

                                        {/* Category pill on bottom left */}
                                        <div className="absolute bottom-2.5 left-2.5">
                                            <span className="rounded-full bg-white/90 px-2.5 py-0.5 font-serif text-[9px] text-[#8B6B38] italic backdrop-blur-xs shadow-2xs">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="flex flex-1 flex-col p-4">
                                        <span className="text-[8px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                                            KOLEKSI{' '}
                                            {product.category.toUpperCase()}
                                        </span>

                                        <h3 className="mt-1 font-serif text-sm font-bold text-[#1A1815] md:text-base">
                                            {product.name}
                                        </h3>

                                        <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-[#8C877E]">
                                            {product.short_description}
                                        </p>

                                        {/* Price & Cart Icon Button */}
                                        <div className="mt-4 flex items-end justify-between border-t border-[#EAE5DC] pt-3">
                                            <div>
                                                <span className="block text-[8px] font-bold tracking-[0.18em] text-[#8C877E] uppercase">
                                                    MULAI DARI
                                                </span>
                                                <span className="font-serif text-sm font-bold text-[#1A1815] md:text-base">
                                                    {product.formatted_price}
                                                </span>
                                            </div>

                                            <motion.a
                                                whileTap={buttonTap.tap}
                                                href={createOrderUrl(
                                                    product.name,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Pesan ${product.name} via WhatsApp`}
                                                className="flex size-8 items-center justify-center rounded-full bg-[#0E2A1E] text-white shadow-xs transition-colors hover:bg-[#C5A880]"
                                            >
                                                <ShoppingCart className="size-3.5" />
                                            </motion.a>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export { ProductsSection as Catalog, ProductsSection as CatalogSection };
