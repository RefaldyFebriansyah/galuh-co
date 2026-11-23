import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { router } from '@inertiajs/react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { ArrowUpRight, ChevronLeft, ChevronRight, X, MapPin, Loader2 } from 'lucide-react';
import { fadeInUp, viewportOnce, buttonTap } from '@/lib/motion';
import { trackWaLead } from '@/lib/wa-tracker';
import { detectCurrentAddress } from '@/lib/geolocation';
import type { Product, ProductCategory } from '@/types';

export interface CatalogProps {
    products: Product[];
    whatsappNumber: string;
    activeEdition?: string;
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
    onOrder: (product: Product) => void;
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
    onOrder,
    className = '',
}: ProductCardProps) {
    const [imgSrc, setImgSrc] = useState(
        product.image || '/images/product_bamboo_box.jpg',
    );
    const tagText = getEditorialTag(product, idx);

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
                <img
                    src={imgSrc}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={320}
                    onError={() =>
                        setImgSrc('/images/product_bamboo_box.jpg')
                    }
                    className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />

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
            <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4">
                <div>
                    <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold tracking-[0.16em] sm:tracking-[0.18em] text-[#7A5B24] uppercase">
                        <span>{product.category}</span>
                        <span className="hidden sm:inline">GALUH &amp; CO.</span>
                    </div>

                    <h3 className="mt-1 line-clamp-1 font-serif text-[13px] sm:text-[15px] font-normal text-[#1A1815] transition-colors duration-200 group-hover:text-[#0E2A1E]">
                        {product.name}
                    </h3>

                    <p className="mt-1 hidden sm:block line-clamp-2 text-[11px] leading-relaxed text-[#6E6962]">
                        {product.short_description ||
                            'Hampers premium dengan kemasan eksklusif dan kurasi isi berkualitas tinggi.'}
                    </p>
                </div>

                {/* Card Footer: Price & WhatsApp Order Button */}
                <div className="mt-2.5 sm:mt-3.5 flex items-center justify-between border-t border-[#F0EBE1] pt-2 sm:pt-2.5">
                    <div>
                        <span className="block text-[7.5px] sm:text-[8.5px] font-semibold tracking-wider text-[#8C877E] uppercase">
                            Mulai Dari
                        </span>
                        <span className="font-serif text-xs sm:text-sm font-bold tracking-tight text-[#0E2A1E]">
                            {product.formatted_price}
                        </span>
                    </div>

                    <motion.button
                        whileTap={buttonTap.tap}
                        type="button"
                        onClick={() => onOrder(product)}
                        aria-label={`Pesan hampers ${product.name}`}
                        className="group/btn inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#D5CEC2] bg-[#FAF8F5] px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#0E2A1E] transition-all duration-300 hover:border-[#0E2A1E] hover:bg-[#0E2A1E] hover:text-white"
                    >
                        <WhatsAppIcon className="size-2.5 sm:size-3 text-[#25D366] transition-colors group-hover/btn:text-white" />
                        <span>Pesan</span>
                        <ArrowUpRight className="size-2 sm:size-2.5 text-[#7A5B24] transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-hover/btn:text-white" />
                    </motion.button>
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

export function Catalog({
    products,
    whatsappNumber,
    activeEdition,
}: CatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);
    const [mobileCardIndex, setMobileCardIndex] = useState<number>(0);
    const mobileTrackRef = useRef<HTMLDivElement>(null);

    // Personal Order Modal State
    const [orderProduct, setOrderProduct] = useState<Product | null>(null);
    const [personalForm, setPersonalForm] = useState({
        name: '',
        email: '',
        whatsapp_number: '',
        address: '',
        notes: '',
    });
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [personalErrors, setPersonalErrors] = useState<{ [key: string]: string }>({});

    const handleDetectPersonalLocation = async () => {
        setIsDetectingLocation(true);
        try {
            const detected = await detectCurrentAddress();
            setPersonalForm((prev) => ({ ...prev, address: detected }));
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Gagal mendeteksi lokasi');
        } finally {
            setIsDetectingLocation(false);
        }
    };

    const handlePersonalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderProduct) return;

        const newErrors: { [key: string]: string } = {};
        if (!personalForm.name.trim()) newErrors.name = 'Nama pemesan wajib diisi.';

        // Strict Email validation (must contain @ and valid domain)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!personalForm.email.trim()) {
            newErrors.email = 'Alamat email wajib diisi.';
        } else if (!emailRegex.test(personalForm.email)) {
            newErrors.email = 'Format email tidak valid. Pastikan menyertakan @ dan domain (contoh: nama@gmail.com).';
        }

        // WhatsApp number validation: digits only, no 08, min 9 digits, max 12 digits
        const rawPhone = personalForm.whatsapp_number.replace(/\D/g, '');
        if (!rawPhone) {
            newErrors.whatsapp_number = 'Nomor WhatsApp wajib diisi.';
        } else if (rawPhone.length < 9) {
            newErrors.whatsapp_number = 'Nomor WhatsApp minimal 9 digit setelah +62 (contoh: 81234567890).';
        }

        if (Object.keys(newErrors).length > 0) {
            setPersonalErrors(newErrors);
            return;
        }

        setPersonalErrors({});
        setIsSubmitting(true);

        const fullWaNumber = `+62${rawPhone}`;
        const cleanTargetNumber = (whatsappNumber || '6281572414233').replace(/\D/g, '');
        const greetingLines = [
            'Halo Tim Concierge GALUH & CO., saya ingin memesan hampers personal:',
            '',
            `• Paket Pilihan: ${orderProduct.name}${orderProduct.formatted_price ? ` (${orderProduct.formatted_price})` : ''}`,
            `• Nama Pemesan: ${personalForm.name}`,
            `• No. WhatsApp: ${fullWaNumber}`,
            `• Email: ${personalForm.email}`,
            personalForm.address ? `• Alamat Pengiriman: ${personalForm.address}` : null,
            personalForm.notes ? `• Catatan / Kartu Ucapan: ${personalForm.notes}` : null,
            '',
            'Mohon informasi ketersediaan paket dan estimasi ongkos kirim. Terima kasih!',
        ].filter((line) => line !== null);

        const waUrl = `https://wa.me/${cleanTargetNumber}?text=${encodeURIComponent(greetingLines.join('\n'))}`;

        // 1. Silent lead tracking
        trackWaLead({
            source: 'catalog_personal',
            client_name: personalForm.name,
            wa_number: fullWaNumber,
            package_name: orderProduct.name,
            notes: `Pesanan: ${orderProduct.name} | Alamat: ${personalForm.address || '-'} | Catatan: ${personalForm.notes || '-'}`,
        });

        // 2. Submit form to backend asynchronously (persists to inquiries & wa_leads, sends email to refaldi.febriansyah@gmail.com)
        router.post(
            '/inquiry',
            {
                name: personalForm.name,
                email: personalForm.email,
                whatsapp_number: fullWaNumber,
                address: personalForm.address,
                order_type: 'personal',
                estimated_packages: '1 paket',
                notes: `Pesanan: ${orderProduct.name} | Catatan: ${personalForm.notes || '-'}`,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    setOrderProduct(null);
                    setPersonalForm({
                        name: '',
                        email: '',
                        whatsapp_number: '',
                        address: '',
                        notes: '',
                    });
                },
            },
        );

        // 3. Open WhatsApp
        const opened = window.open(waUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
            window.location.href = waUrl;
        }
    };

    const paginate = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1);
        setCurrentPage(newPage);
    };

    const handleMobileArrow = (dir: 'prev' | 'next') => {
        if (!mobileTrackRef.current) return;
        const container = mobileTrackRef.current;
        const cardWidth = container.offsetWidth * 0.82 + 16;
        const maxIdx = displayedProducts.length - 1;
        const targetIdx =
            dir === 'next'
                ? Math.min(maxIdx, mobileCardIndex + 1)
                : Math.max(0, mobileCardIndex - 1);

        container.scrollTo({
            left: targetIdx * cardWidth,
            behavior: 'smooth',
        });
        setMobileCardIndex(targetIdx);
    };

    const handleMobileScroll = () => {
        if (!mobileTrackRef.current) return;
        const container = mobileTrackRef.current;
        const cardWidth = container.offsetWidth * 0.82 + 16;
        if (cardWidth > 0) {
            const active = Math.round(container.scrollLeft / cardWidth);
            setMobileCardIndex(
                Math.min(Math.max(0, active), displayedProducts.length - 1),
            );
        }
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
        setMobileCardIndex(0);
        if (mobileTrackRef.current) {
            mobileTrackRef.current.scrollTo({ left: 0 });
        }
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
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#7A5B24] uppercase">
                        <span>KOLEKSI HAMPERS</span>
                        {activeEdition && (
                            <>
                                <span className="size-1 rounded-full bg-[#C5A880]" />
                                <span className="font-mono text-[10px] text-[#8C877E]">{activeEdition}</span>
                            </>
                        )}
                    </div>

                    <h2 className="mt-2.5 font-serif text-3xl font-normal tracking-tight text-[#1A1815] sm:text-4xl lg:text-5xl">
                        Koleksi Bingkisan{' '}
                        <span className="text-[#7A5B24] italic">Istimewa</span>
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
                                    aria-pressed={isActive}
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
                    {/* Top Bar Quick Navigation */}
                    {totalPages > 1 && (
                        <div className="mb-4 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-[#8C877E] uppercase">
                                {filteredProducts.length} Koleksi Pilihan
                            </span>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D5CEC2] bg-white/90 px-2.5 py-1 shadow-2xs backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={() =>
                                        paginate(Math.max(0, currentPage - 1))
                                    }
                                    disabled={currentPage === 0}
                                    aria-label="Koleksi halaman sebelumnya"
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
                                    aria-label="Koleksi halaman selanjutnya"
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
                                        aria-label="Koleksi halaman sebelumnya"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                )}

                                {/* Boutique Grid: 2 Columns on Mobile (< 768px), 3-4 Columns on Desktop */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                                    {displayedProducts.map((product, idx) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            idx={
                                                currentPage * ITEMS_PER_PAGE +
                                                idx
                                            }
                                            whatsappNumber={whatsappNumber}
                                            onOrder={(prod) => setOrderProduct(prod)}
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
                                            aria-label="Koleksi halaman selanjutnya"
                                        >
                                            <ChevronRight className="size-5" />
                                        </button>
                                    )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Bottom Pagination for Easy Mobile Navigation */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    paginate(Math.max(0, currentPage - 1));
                                    const el = document.getElementById('koleksi');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === 0}
                                className="flex cursor-pointer items-center gap-1 rounded-full border border-[#D5CEC2] bg-white px-4 py-2 text-xs font-semibold text-[#0E2A1E] shadow-2xs transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="size-3.5" />
                                <span>Sebelumnya</span>
                            </button>
                            <span className="font-serif text-xs font-semibold text-[#7A5B24]">
                                Halaman {currentPage + 1} dari {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    paginate(Math.min(totalPages - 1, currentPage + 1));
                                    const el = document.getElementById('koleksi');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                disabled={currentPage === totalPages - 1}
                                className="flex cursor-pointer items-center gap-1 rounded-full border border-[#D5CEC2] bg-white px-4 py-2 text-xs font-semibold text-[#0E2A1E] shadow-2xs transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <span>Selanjutnya</span>
                                <ChevronRight className="size-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Personal Order Modal */}
            <AnimatePresence>
                {orderProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setOrderProduct(null)}
                            className="fixed inset-0 bg-[#0E2A1E]/60 backdrop-blur-xs transition-opacity"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-2xl z-10 my-auto"
                        >
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setOrderProduct(null)}
                                disabled={isSubmitting}
                                aria-label="Tutup formulir pemesanan personal"
                                className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#EAE5DC] bg-[#FAF8F5] text-[#0E2A1E] transition-colors hover:bg-white hover:text-black"
                            >
                                <X className="size-4" />
                            </button>

                            {/* Product Header */}
                            <div className="flex items-center gap-3.5 border-b border-[#F0EBE1] pb-4 pr-8">
                                <img
                                    src={orderProduct.image || '/images/product_bamboo_box.jpg'}
                                    alt={orderProduct.name}
                                    className="size-14 rounded-xl object-cover border border-[#EAE5DC]"
                                />
                                <div className="min-w-0 flex-1">
                                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#7A5B24] uppercase">
                                        Pemesanan Personal
                                    </span>
                                    <h3 className="truncate font-serif text-base font-bold text-[#0E2A1E]">
                                        {orderProduct.name}
                                    </h3>
                                    <p className="font-serif text-xs font-semibold text-[#7A5B24]">
                                        {orderProduct.formatted_price}
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handlePersonalSubmit} className="mt-4 space-y-3.5">
                                <div>
                                    <label
                                        htmlFor="personal-name"
                                        className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                    >
                                        Nama Pemesan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="personal-name"
                                        type="text"
                                        required
                                        value={personalForm.name}
                                        onChange={(e) =>
                                            setPersonalForm((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        placeholder="Nama lengkap Anda"
                                        className="mt-1 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                    />
                                    {personalErrors.name && (
                                        <p className="mt-1 text-[10px] text-red-600">{personalErrors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="personal-whatsapp"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                        >
                                            No. WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <div
                                            className={`mt-1 flex items-center rounded-xl border bg-[#FAF8F5] overflow-hidden transition-all focus-within:border-[#C5A880] focus-within:bg-white ${
                                                personalErrors.whatsapp_number
                                                    ? 'border-red-400'
                                                    : 'border-[#EAE5DC]'
                                            }`}
                                        >
                                            <span className="inline-flex shrink-0 items-center border-r border-[#EAE5DC] bg-[#F2EDE4]/60 px-2.5 py-2 text-xs font-bold text-[#0E2A1E] select-none">
                                                🇮🇩 +62
                                            </span>
                                            <input
                                                id="personal-whatsapp"
                                                type="tel"
                                                inputMode="numeric"
                                                required
                                                value={personalForm.whatsapp_number}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, '');
                                                    if (val.startsWith('62')) val = val.slice(2);
                                                    if (val.startsWith('0')) val = val.slice(1);
                                                    val = val.slice(0, 12);
                                                    setPersonalForm((prev) => ({
                                                        ...prev,
                                                        whatsapp_number: val,
                                                    }));
                                                }}
                                                placeholder="812-3456-7890"
                                                maxLength={12}
                                                className="w-full bg-transparent px-3 py-2 text-xs text-[#1A1815] focus:outline-hidden"
                                            />
                                        </div>
                                        {personalErrors.whatsapp_number && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {personalErrors.whatsapp_number}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="personal-email"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                        >
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="personal-email"
                                            type="email"
                                            required
                                            value={personalForm.email}
                                            onChange={(e) =>
                                                setPersonalForm((prev) => ({ ...prev, email: e.target.value }))
                                            }
                                            placeholder="email@anda.com"
                                            className="mt-1 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                        {personalErrors.email && (
                                            <p className="mt-1 text-[10px] text-red-600">{personalErrors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Address with Auto-Detection */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="personal-address"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                        >
                                            Alamat Pengiriman
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleDetectPersonalLocation}
                                            disabled={isDetectingLocation}
                                            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-[#7A5B24] transition-colors hover:text-[#0E2A1E] hover:underline disabled:opacity-50"
                                        >
                                            {isDetectingLocation ? (
                                                <>
                                                    <Loader2 className="size-3 animate-spin text-[#7A5B24]" />
                                                    <span>Mendeteksi Lokasi...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="size-3 text-[#7A5B24]" />
                                                    <span>Deteksi Alamat Otomatis</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <textarea
                                        id="personal-address"
                                        rows={2}
                                        value={personalForm.address}
                                        onChange={(e) =>
                                            setPersonalForm((prev) => ({
                                                ...prev,
                                                address: e.target.value,
                                            }))
                                        }
                                        placeholder="Alamat jalan, nomor rumah, kelurahan, kota (atau klik 'Deteksi Alamat Otomatis')"
                                        className="mt-1 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                {/* Notes / Greeting card */}
                                <div>
                                    <label
                                        htmlFor="personal-notes"
                                        className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                    >
                                        Nama Penerima / Pesan Kartu Ucapan
                                    </label>
                                    <textarea
                                        id="personal-notes"
                                        rows={2}
                                        value={personalForm.notes}
                                        onChange={(e) =>
                                            setPersonalForm((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        placeholder="Penerima: Bapak Budi (Tolong sertakan kartu: Selamat Hari Raya Idul Fitri...)"
                                        className="mt-1 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                <motion.button
                                    whileTap={buttonTap.tap}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0E2A1E] py-3 text-xs font-bold tracking-[0.12em] text-white shadow-sm transition-all duration-300 hover:bg-[#163d2c] disabled:opacity-60"
                                >
                                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                                    <span>
                                        {isSubmitting
                                            ? 'MENGHUBUNGKAN...'
                                            : 'LANJUT PESAN VIA WHATSAPP'}
                                    </span>
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

// Re-export for compatibility with ProductsSection naming
export const ProductsSection = Catalog;
export default Catalog;
