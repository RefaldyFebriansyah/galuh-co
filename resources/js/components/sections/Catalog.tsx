import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    ArrowRight,
    Tag,
    ChevronLeft,
    ChevronRight,
    X,
    MapPin,
    Loader2,
    CheckCircle2,
    Package,
    ShieldCheck,
    Building2,
    User as UserIcon,
    LogIn,
    UserPlus,
} from 'lucide-react';
import { fadeInUp, viewportOnce, buttonTap } from '@/lib/motion';
import { detectCurrentAddress } from '@/lib/geolocation';
import type { Product, ProductCategory } from '@/types';
import type { PageProps } from '@/types';

export interface CatalogProps {
    products: Product[];
    whatsappNumber?: string;
    activeEdition?: string;
    catalogBadge?: string;
    catalogTitle?: string;
    catalogSubtitle?: string;
    activeEvent?: string;
    eventBannerTitle?: string;
    eventBannerSubtitle?: string;
    eventBannerImage?: string;
    eventBannerActive?: boolean;
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

interface PromoSlide {
    id: string;
    badge: string;
    seasonLabel: string;
    title: string;
    subtitle: string;
    image: string;
    category: 'all' | ProductCategory;
    eventTag?: string;
}

function getEditorialTag(
    product: Product,
    idx: number,
    activeEvent?: string,
): string {
    if (activeEvent && product.event_tag === activeEvent) return 'Event';
    if (product.event_tag === 'ramadhan') return 'Edisi Ramadhan';
    if (product.event_tag === 'natal') return 'Edisi Natal';
    if (product.event_tag === 'pernikahan') return 'Edisi Seserahan';
    if (product.event_tag === 'imlek') return 'Edisi Imlek';
    if (product.event_tag === 'corporate') return 'Edisi Korporat';
    if (product.slug === 'seri-kencana-lebaran') return 'Best Seller';
    if (product.slug === 'seri-rayyan-mubarak') return 'Edisi Spesial';
    if (product.slug === 'seri-eksekutif-kantor') return 'VIP Executive';
    if (product.slug === 'seri-sinergi-korporat') return 'Tech & Brew';
    if (product.slug === 'seri-apresiasi-bisnis') return 'Pilihan B2B';
    if (product.slug === 'seri-mahligai-seserahan') return 'Seserahan';
    if (idx === 0) return 'Kurasi Pilihan';
    return 'Signature';
}

interface ProductCardProps {
    product: Product;
    idx: number;
    activeEvent?: string;
    onViewDetail: (product: Product) => void;
    onOrder: (product: Product) => void;
    className?: string;
}

function ProductCard({
    product,
    idx,
    activeEvent,
    onViewDetail,
    onOrder,
    className = '',
}: ProductCardProps) {
    const [imgSrc, setImgSrc] = useState(
        product.image || '/images/product_bamboo_box.jpg',
    );
    const tagText = getEditorialTag(product, idx, activeEvent);

    return (
        <motion.article
            layout
            whileHover={{
                y: -4,
                transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
            }}
            className={`group flex flex-col overflow-hidden rounded-xl border border-[#A88B54]/20 bg-white shadow-[0_3px_14px_-6px_rgba(22,35,59,0.06)] transition-all duration-300 hover:border-[#A88B54]/60 hover:shadow-[0_8px_24px_-8px_rgba(22,35,59,0.12)] ${className}`}
        >
            {/* Photo Frame */}
            <div
                onClick={() => onViewDetail(product)}
                className="relative aspect-[4/3.2] w-full cursor-pointer overflow-hidden bg-[#F2EBDC]"
            >
                <img
                    src={imgSrc}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={320}
                    onError={() => setImgSrc('/images/product_bamboo_box.jpg')}
                    className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Top Badge: Editorial Pill */}
                <div className="absolute top-2.5 left-2.5 flex items-center">
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-[8.5px] font-bold tracking-[0.12em] uppercase shadow-2xs backdrop-blur-md ${
                            activeEvent && product.event_tag === activeEvent
                                ? 'border border-[#A88B54] bg-[#16233B] text-[#A88B54]'
                                : 'border border-[#16233B]/10 bg-white/95 text-[#16233B]'
                        }`}
                    >
                        {tagText}
                    </span>
                </div>

                {/* Category Overlay Bottom Left */}
                <div className="absolute bottom-2.5 left-2.5">
                    <span className="rounded-full bg-[#16233B]/75 px-2 py-0.5 font-serif text-[9px] text-[#F2EBDC] italic shadow-2xs backdrop-blur-md">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* Editorial Content */}
            <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                <div>
                    <div className="flex items-center justify-between text-[8px] font-bold tracking-[0.16em] text-[#A88B54] uppercase sm:text-[9px] sm:tracking-[0.18em]">
                        <span>{product.category}</span>
                        <span className="hidden sm:inline">
                            GALUH &amp; CO.
                        </span>
                    </div>

                    <h3
                        onClick={() => onViewDetail(product)}
                        className="mt-1 line-clamp-1 cursor-pointer font-serif text-[13px] font-normal text-[#16233B] transition-colors duration-200 group-hover:text-[#A88B54] sm:text-[15px]"
                    >
                        {product.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 hidden text-[11px] leading-relaxed text-[#6E675D] sm:block">
                        {product.short_description ||
                            'Hampers premium dengan kurasi kriya berkualitas tinggi dan sentuhan pita eksklusif.'}
                    </p>
                </div>

                {/* Card Footer: Price & Direct Actions */}
                <div className="mt-2.5 flex items-center justify-between border-t border-[#F2EBDC] pt-2 sm:mt-3.5 sm:pt-2.5">
                    <div>
                        <span className="block text-[7.5px] font-semibold tracking-wider text-[#6E675D] uppercase sm:text-[8.5px]">
                            Mulai Dari
                        </span>
                        <span className="font-serif text-xs font-bold tracking-tight text-[#16233B] sm:text-sm">
                            {product.formatted_price}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => onViewDetail(product)}
                            className="cursor-pointer rounded-full border border-[#A88B54]/40 bg-[#F2EBDC]/50 px-2.5 py-1 text-[10px] font-semibold text-[#16233B] transition-all hover:bg-[#F2EBDC]"
                        >
                            Detail Isi
                        </button>
                        <motion.button
                            whileTap={buttonTap.tap}
                            type="button"
                            onClick={() => onOrder(product)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#16233B] px-3 py-1 text-[10.5px] font-semibold text-white transition-all duration-200 hover:bg-[#A88B54] hover:text-[#16233B]"
                        >
                            <span>Pesan</span>
                            <ArrowUpRight className="size-2.5" />
                        </motion.button>
                    </div>
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
    activeEdition,
    catalogBadge,
    catalogTitle,
    catalogSubtitle,
    activeEvent,
    eventBannerTitle,
    eventBannerSubtitle,
    eventBannerImage,
    eventBannerActive,
}: CatalogProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;

    // Automatically set default category tab to match active event theme if active
    const initialCategory = useMemo(() => {
        if (!activeEvent) return 'all';
        if (activeEvent === 'ramadhan') return 'Paket Lebaran';
        if (activeEvent === 'natal') return 'Natal & Tahun Baru';
        if (activeEvent === 'corporate') return 'Paket Kantor';
        if (activeEvent === 'pernikahan') return 'Wedding';
        if (activeEvent === 'custom') return 'Custom';
        return 'all';
    }, [activeEvent]);

    const [selectedCategory, setSelectedCategory] =
        useState<string>(initialCategory);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);

    // Detail Modal State
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);

    // In-Website Order Modal State
    const [orderProduct, setOrderProduct] = useState<Product | null>(null);
    const [authPromptOpen, setAuthPromptOpen] = useState(false);

    // Order form state
    const [orderType, setOrderType] = useState<'personal' | 'corporate'>(
        'personal',
    );
    const [quantity, setQuantity] = useState<number>(1);
    const [companyName, setCompanyName] = useState('');
    const [recipientName, setRecipientName] = useState(currentUser?.name || '');
    const [recipientPhone, setRecipientPhone] = useState(
        currentUser?.phone_number
            ? currentUser.phone_number.replace(/^\+62|^62|^0/, '')
            : '',
    );
    const [shippingAddress, setShippingAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [neededAt, setNeededAt] = useState('');
    const [greetingCardText, setGreetingCardText] = useState('');
    const [engravingName, setEngravingName] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');

    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Defensive normalization
    const safeProducts = useMemo<Product[]>(() => {
        if (Array.isArray(products)) return products;
        if (products && typeof products === 'object')
            return Object.values(products);
        return [];
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') return safeProducts;

        const normalize = (val: string) =>
            val.toLowerCase().replace(/[^a-z0-9]/g, '');
        const sel = normalize(selectedCategory);

        return safeProducts.filter((p) => {
            const cat = normalize(p.category || '');
            if (cat === sel) return true;
            if (
                sel.includes('lebaran') &&
                (cat.includes('lebaran') ||
                    cat.includes('ramadan') ||
                    cat.includes('eid'))
            )
                return true;
            if (
                (sel.includes('kantor') || sel.includes('corporate')) &&
                (cat.includes('kantor') ||
                    cat.includes('corporate') ||
                    cat.includes('office'))
            )
                return true;
            if (
                (sel.includes('natal') || sel.includes('tahunbaru')) &&
                (cat.includes('natal') || cat.includes('christmas'))
            )
                return true;
            if (
                sel.includes('wedding') &&
                (cat.includes('wedding') || cat.includes('seserahan'))
            )
                return true;
            if (
                sel.includes('custom') &&
                (cat.includes('custom') || cat.includes('bespoke'))
            )
                return true;
            return false;
        });
    }, [safeProducts, selectedCategory]);

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
        setDirection(1);
        setCurrentPage(0);
    };

    // Primary active slide configured by Admin
    const adminActiveSlide: PromoSlide = useMemo(() => {
        let badge = 'Promosi Spesial';
        let seasonLabel = 'EDISI PILIHAN';
        let defaultImg = '/images/product_emerald_box.jpg';
        let cat: 'all' | ProductCategory = 'all';

        if (activeEvent === 'ramadhan') {
            badge = 'Edisi Lebaran';
            seasonLabel = 'IDUL FITRI 1447 H';
            defaultImg = '/images/product_emerald_box.jpg';
            cat = 'Paket Lebaran';
        } else if (activeEvent === 'natal') {
            badge = 'Festive Season';
            seasonLabel = 'NATAL & TAHUN BARU';
            defaultImg = '/images/product_bamboo_box.jpg';
            cat = 'Natal & Tahun Baru';
        } else if (activeEvent === 'corporate') {
            badge = 'Corporate Concierge';
            seasonLabel = 'APRESIASI KORPORAT B2B';
            defaultImg = '/images/product_leather_box.jpg';
            cat = 'Paket Kantor';
        } else if (activeEvent === 'pernikahan') {
            badge = 'Wedding Atelier';
            seasonLabel = 'SESERAHAN SAKRAL';
            defaultImg = '/images/product_rattan_box.jpg';
            cat = 'Wedding';
        }

        // Automatically look for matching product image in catalog as priority fallback
        const matchingProduct = safeProducts.find(
            (p) => p.event_tag === activeEvent && p.image,
        );

        return {
            id: activeEvent || 'active_admin_event',
            badge,
            seasonLabel,
            title: eventBannerTitle || 'Kurasi Hantaran Istimewa Edisi Spesial',
            subtitle:
                eventBannerSubtitle ||
                'Kurasi bingkisan mewah berbalut hardbox zamrud dan anyaman bambu artisanal untuk representasi prestisius keluarga dan relasi korporat.',
            image: eventBannerImage || matchingProduct?.image || defaultImg,
            category: cat,
            eventTag: activeEvent,
        };
    }, [
        activeEvent,
        eventBannerTitle,
        eventBannerSubtitle,
        eventBannerImage,
        safeProducts,
    ]);

    const handlePromoCtaClick = () => {
        handleCategoryChange(adminActiveSlide.category);
        const tabsEl = document.getElementById('koleksi-tabs');
        if (tabsEl) {
            tabsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const displayedProducts = useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const paginate = (newPage: number) => {
        setDirection(newPage > currentPage ? 1 : -1);
        setCurrentPage(newPage);
    };

    const handleOpenOrder = (
        prod: Product,
        preferredType: 'personal' | 'corporate' = 'personal',
    ) => {
        if (!currentUser) {
            setOrderProduct(prod);
            setAuthPromptOpen(true);
            return;
        }

        setOrderProduct(prod);
        setOrderType(preferredType);
        setQuantity(preferredType === 'corporate' ? 25 : 1);
        setRecipientName(currentUser.name || '');
        setRecipientPhone(
            currentUser.phone_number
                ? currentUser.phone_number.replace(/^\+62|^62|^0/, '')
                : '',
        );
        setFormErrors({});
    };

    const handleDetectLocation = async () => {
        setIsDetectingLocation(true);
        try {
            const detected = await detectCurrentAddress();
            setShippingAddress(detected);
        } catch (err: unknown) {
            alert(
                err instanceof Error ? err.message : 'Gagal mendeteksi lokasi',
            );
        } finally {
            setIsDetectingLocation(false);
        }
    };

    // Calculate live pricing
    const currentUnitPrice = useMemo(() => {
        if (!orderProduct) return 0;
        if (orderType === 'corporate') {
            return (
                orderProduct.corporate_price ||
                Math.round(orderProduct.price_from * 0.85)
            );
        }
        return orderProduct.price_from;
    }, [orderProduct, orderType]);

    const currentSubtotal = useMemo(() => {
        return currentUnitPrice * quantity;
    }, [currentUnitPrice, quantity]);

    const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderProduct) return;

        const errors: { [key: string]: string } = {};

        if (orderType === 'corporate' && quantity < 25) {
            errors.quantity =
                'Minimal pemesanan paket corporate adalah 25 paket ke atas.';
        } else if (quantity < 1) {
            errors.quantity = 'Jumlah pesanan minimal 1 paket.';
        }

        if (orderType === 'corporate' && !companyName.trim()) {
            errors.company_name =
                'Nama perusahaan / instansi wajib diisi untuk pesanan corporate.';
        }

        if (!recipientName.trim()) {
            errors.recipient_name = 'Nama penerima / pemesan wajib diisi.';
        }

        const rawPhone = recipientPhone.replace(/\D/g, '');
        if (!rawPhone || rawPhone.length < 9) {
            errors.recipient_phone = 'Nomor telepon penerima minimal 9 digit.';
        }

        if (!shippingAddress.trim()) {
            errors.shipping_address = 'Alamat pengiriman lengkap wajib diisi.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});
        setIsSubmitting(true);

        const cleanPhoneDigits = rawPhone.replace(/^62/, '').replace(/^0+/, '');
        const formattedPhone = `+62${cleanPhoneDigits}`;

        router.post(
            '/orders',
            {
                order_type: orderType,
                product_id: orderProduct.id,
                quantity,
                company_name: orderType === 'corporate' ? companyName : null,
                recipient_name: recipientName,
                recipient_phone: formattedPhone,
                shipping_address: shippingAddress,
                city,
                postal_code: postalCode,
                needed_at: neededAt || null,
                greeting_card_text: greetingCardText || null,
                engraving_name: engravingName || null,
                customer_notes: customerNotes || null,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    setOrderProduct(null);
                },
            },
        );
    };

    return (
        <section
            id="koleksi"
            className="relative bg-[#F2EBDC] py-14 sm:py-20 lg:py-24"
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
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <span>{catalogBadge || 'KOLEKSI HAMPERS'}</span>
                        {activeEdition && activeEdition.trim() && (
                            <>
                                <span className="size-1 rounded-full bg-[#A88B54]" />
                                <span className="font-mono text-[10px] text-[#6E675D]">
                                    {activeEdition.trim()}
                                </span>
                            </>
                        )}
                    </div>

                    <h2 className="mt-2.5 font-serif text-3xl font-normal tracking-tight text-[#16233B] sm:text-4xl lg:text-5xl">
                        {catalogTitle || 'Koleksi Bingkisan Istimewa'}
                    </h2>

                    <p className="mt-2.5 text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                        {catalogSubtitle ||
                            'Setiap hampers dirancang khusus dengan bahan berkualitas, presentasi elegan, dan kartu ucapan berstempel wax untuk momen perayaan serta apresiasi korporat bernilai tinggi.'}
                    </p>
                </motion.div>

                {/* Event Musiman & Demo Banner — 1 Foto Full Background dengan Teks Elegan */}
                {eventBannerActive && (
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="group/banner relative mt-8 overflow-hidden rounded-3xl border border-[#A88B54]/40 bg-[#16233B] text-[#F2EBDC] shadow-2xl transition-all"
                    >
                        {/* 1 Foto Full Background */}
                        <div className="absolute inset-0">
                            <img
                                src={adminActiveSlide.image}
                                alt={adminActiveSlide.title}
                                className="size-full object-cover object-center transition-transform duration-700 group-hover/banner:scale-105"
                            />
                            {/* Luxury Navy Gradient Overlay: Solid on left for crisp readability, fading softly to showcase hampers photo */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#16233B] via-[#16233B]/90 to-[#16233B]/60 sm:bg-gradient-to-r sm:from-[#16233B] sm:via-[#16233B]/90 sm:to-[#16233B]/25" />
                        </div>

                        {/* Content Overlaid */}
                        <div className="relative z-10 flex min-h-[320px] flex-col justify-center p-6 sm:min-h-[360px] sm:p-10 lg:max-w-2xl lg:p-12">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#A88B54]/40 bg-[#16233B]/80 px-3.5 py-1 text-[10.5px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase shadow-md backdrop-blur-md">
                                <Tag className="size-3" />
                                <span>{adminActiveSlide.badge}</span>
                                <span className="size-1 rounded-full bg-[#A88B54]" />
                                <span>{adminActiveSlide.seasonLabel}</span>
                            </div>

                            <h3 className="mt-3.5 font-serif text-2xl font-bold tracking-tight text-[#F2EBDC] drop-shadow-xs sm:text-3xl lg:text-4xl">
                                {adminActiveSlide.title}
                            </h3>

                            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-[#F2EBDC]/90 drop-shadow-xs sm:text-sm">
                                {adminActiveSlide.subtitle}
                            </p>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handlePromoCtaClick}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#A88B54] px-5 py-2.5 text-xs font-bold text-[#16233B] shadow-md transition-all hover:bg-white active:scale-95"
                                >
                                    <span>Lihat Paket Hampers Edisi Ini</span>
                                    <ArrowRight className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 2. Interactive Category Tabs */}
                <div
                    id="koleksi-tabs"
                    className="mt-6 flex items-center justify-center sm:mt-8"
                >
                    <div className="no-scrollbar flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-[#A88B54]/25 bg-white/70 p-1.5 px-2 backdrop-blur-xs sm:px-1.5">
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
                                            ? 'text-[#16233B]'
                                            : 'text-[#6E675D] hover:text-[#16233B]'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeCatalogCategory"
                                            className="absolute inset-0 rounded-full border border-[#A88B54]/40 bg-[#F2EBDC] shadow-2xs"
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

                {/* 3. Catalog Display Area */}
                <div className="mt-8 overflow-hidden">
                    {totalPages > 1 && (
                        <div className="mb-4 flex items-center justify-between">
                            <span className="font-mono text-[10px] text-[#6E675D] uppercase">
                                {filteredProducts.length} Koleksi Pilihan
                            </span>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#A88B54]/30 bg-white/90 px-2.5 py-1 shadow-2xs backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={() =>
                                        paginate(Math.max(0, currentPage - 1))
                                    }
                                    disabled={currentPage === 0}
                                    aria-label="Koleksi halaman sebelumnya"
                                    className="flex size-7 cursor-pointer items-center justify-center rounded-full text-[#16233B] transition-all hover:bg-[#F2EBDC] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft className="size-3.5" />
                                </button>
                                <span className="px-2 font-serif text-[11px] font-semibold text-[#16233B]">
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
                                    className="flex size-7 cursor-pointer items-center justify-center rounded-full text-[#16233B] transition-all hover:bg-[#F2EBDC] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
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
                                className="rounded-2xl border border-dashed border-[#A88B54]/30 bg-white/40 p-10 text-center"
                            >
                                <p className="font-serif text-sm text-[#6E675D]">
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
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                                    {displayedProducts.map((product, idx) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            idx={
                                                currentPage * ITEMS_PER_PAGE +
                                                idx
                                            }
                                            activeEvent={activeEvent}
                                            onViewDetail={(prod) =>
                                                setDetailProduct(prod)
                                            }
                                            onOrder={(prod) =>
                                                handleOpenOrder(
                                                    prod,
                                                    'personal',
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    paginate(Math.max(0, currentPage - 1));
                                    const el =
                                        document.getElementById('koleksi');
                                    if (el)
                                        el.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                }}
                                disabled={currentPage === 0}
                                className="flex cursor-pointer items-center gap-1 rounded-full border border-[#A88B54]/30 bg-white px-4 py-2 text-xs font-semibold text-[#16233B] shadow-2xs transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="size-3.5" />
                                <span>Sebelumnya</span>
                            </button>
                            <span className="font-serif text-xs font-semibold text-[#A88B54]">
                                Halaman {currentPage + 1} dari {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    paginate(
                                        Math.min(
                                            totalPages - 1,
                                            currentPage + 1,
                                        ),
                                    );
                                    const el =
                                        document.getElementById('koleksi');
                                    if (el)
                                        el.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                }}
                                disabled={currentPage === totalPages - 1}
                                className="flex cursor-pointer items-center gap-1 rounded-full border border-[#A88B54]/30 bg-white px-4 py-2 text-xs font-semibold text-[#16233B] shadow-2xs transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <span>Selanjutnya</span>
                                <ChevronRight className="size-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL PRODUK MODAL (Rincian Daftar Isi Lengkap) */}
            <AnimatePresence>
                {detailProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDetailProduct(null)}
                            className="fixed inset-0 bg-[#16233B]/60 backdrop-blur-xs transition-opacity"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="relative z-10 my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-2xl sm:p-8"
                        >
                            <button
                                type="button"
                                onClick={() => setDetailProduct(null)}
                                className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#A88B54]/30 bg-[#F2EBDC] text-[#16233B] transition-colors hover:bg-white"
                            >
                                <X className="size-4" />
                            </button>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
                                <div className="sm:col-span-5">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#A88B54]/25 bg-[#F2EBDC]">
                                        <img
                                            src={
                                                detailProduct.image ||
                                                '/images/product_bamboo_box.jpg'
                                            }
                                            alt={detailProduct.name}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-3.5 space-y-1.5 rounded-xl border border-[#A88B54]/20 bg-[#F2EBDC]/40 p-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#6E675D]">
                                                Harga Personal:
                                            </span>
                                            <span className="font-serif font-bold text-[#16233B]">
                                                {detailProduct.formatted_price}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#6E675D]">
                                                Harga Grosir Corporate:
                                            </span>
                                            <span className="font-serif font-bold text-[#A88B54]">
                                                {detailProduct.formatted_corporate_price ||
                                                    `Rp ${(detailProduct.corporate_price || Math.round(detailProduct.price_from * 0.85)).toLocaleString('id-ID')}`}
                                            </span>
                                        </div>
                                        <span className="block text-[8.5px] text-[#6E675D] italic">
                                            *Harga corporate berlaku otomatis
                                            untuk min. 25 paket.
                                        </span>
                                    </div>
                                </div>

                                <div className="sm:col-span-7">
                                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#A88B54] uppercase">
                                        RINCIAN KURASI ATELIER
                                    </span>
                                    <h3 className="mt-1 font-serif text-2xl font-normal text-[#16233B]">
                                        {detailProduct.name}
                                    </h3>
                                    <p className="mt-2 text-xs leading-relaxed text-[#6E675D]">
                                        {detailProduct.short_description ||
                                            'Dirangkai khusus dengan perpaduan ornamen tradisional dan estetika modern untuk representasi prestisius.'}
                                    </p>

                                    {/* Kemasan Info */}
                                    {detailProduct.packaging && (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#F2EBDC]/60 px-3 py-2 text-xs text-[#16233B]">
                                            <Package className="size-4 text-[#A88B54]" />
                                            <span>
                                                Kemasan:{' '}
                                                <strong>
                                                    {detailProduct.packaging}
                                                </strong>
                                            </span>
                                        </div>
                                    )}

                                    {/* Rincian Daftar Isi Lengkap */}
                                    <div className="mt-4">
                                        <span className="block text-[10px] font-bold tracking-wider text-[#16233B] uppercase">
                                            Daftar Isi Paket Hampers:
                                        </span>
                                        <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto pr-2">
                                            {(
                                                detailProduct.contents || [
                                                    'Hardbox Premium Zamrud dengan Foil Brass Emboss',
                                                    'Kue Kering Artisan Resep Klasik (Wijsman Butter)',
                                                    'Kartu Ucapan Personalisasi dengan Wax Seal Stamp',
                                                    'Pita Satin Eksklusif & Monogram Tag',
                                                ]
                                            ).map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2 text-xs text-[#16233B]"
                                                >
                                                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#A88B54]" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const p = detailProduct;
                                                setDetailProduct(null);
                                                handleOpenOrder(p, 'personal');
                                            }}
                                            className="flex-1 cursor-pointer rounded-full bg-[#16233B] py-2.5 text-center text-xs font-bold text-white transition-all hover:bg-[#16233B]/90"
                                        >
                                            Pesan Personal (&gt;1 Paket)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const p = detailProduct;
                                                setDetailProduct(null);
                                                handleOpenOrder(p, 'corporate');
                                            }}
                                            className="flex-1 cursor-pointer rounded-full border border-[#A88B54] bg-[#F2EBDC] py-2.5 text-center text-xs font-bold text-[#16233B] transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                                        >
                                            Pesan Corporate (Min. 25)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* AUTH REQUIRED DIALOG */}
            <AnimatePresence>
                {authPromptOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setAuthPromptOpen(false)}
                            className="fixed inset-0 bg-[#16233B]/60 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-10 w-full max-w-md rounded-2xl border border-[#A88B54]/30 bg-white p-6 text-center shadow-2xl"
                        >
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F2EBDC] text-[#A88B54]">
                                <ShieldCheck className="size-6" />
                            </div>
                            <h3 className="mt-3 font-serif text-xl font-normal text-[#16233B]">
                                Masuk atau Daftar Terlebih Dahulu
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[#6E675D]">
                                Seluruh transaksi dan pemesanan hampers di Galuh
                                &amp; Co. kini diproses langsung di website
                                secara aman dan terhubung dengan nomor resi
                                pelacakan.
                            </p>

                            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/login')}
                                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#16233B] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                                >
                                    <LogIn className="size-3.5" />
                                    <span>Masuk / Login</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.visit('/register')}
                                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#A88B54] bg-[#F2EBDC] py-2.5 text-xs font-bold text-[#16233B] transition-all hover:bg-[#A88B54]"
                                >
                                    <UserPlus className="size-3.5" />
                                    <span>Daftar Akun</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* IN-WEBSITE ORDER MODAL (Personal & Corporate) */}
            <AnimatePresence>
                {orderProduct && currentUser && !authPromptOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() =>
                                !isSubmitting && setOrderProduct(null)
                            }
                            className="fixed inset-0 bg-[#16233B]/60 backdrop-blur-xs transition-opacity"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="relative z-10 my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-2xl sm:p-8"
                        >
                            <button
                                type="button"
                                onClick={() => setOrderProduct(null)}
                                disabled={isSubmitting}
                                className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#A88B54]/30 bg-[#F2EBDC] text-[#16233B] transition-colors hover:bg-white"
                            >
                                <X className="size-4" />
                            </button>

                            {/* Product Header */}
                            <div className="flex items-center gap-3.5 border-b border-[#F2EBDC] pr-8 pb-4">
                                <img
                                    src={
                                        orderProduct.image ||
                                        '/images/product_bamboo_box.jpg'
                                    }
                                    alt={orderProduct.name}
                                    className="size-14 rounded-xl border border-[#A88B54]/20 object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <span className="text-[9px] font-bold tracking-[0.18em] text-[#A88B54] uppercase">
                                        Pemesanan Langsung di Website
                                    </span>
                                    <h3 className="truncate font-serif text-base font-bold text-[#16233B]">
                                        {orderProduct.name}
                                    </h3>
                                    <p className="font-serif text-xs font-semibold text-[#A88B54]">
                                        Harga Satuan:{' '}
                                        {orderType === 'corporate'
                                            ? `Rp ${(orderProduct.corporate_price || Math.round(orderProduct.price_from * 0.85)).toLocaleString('id-ID')} (Grosir B2B)`
                                            : orderProduct.formatted_price}
                                    </p>
                                </div>
                            </div>

                            {/* Order Type Tabs: Personal vs Corporate */}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOrderType('personal');
                                        if (quantity < 1) setQuantity(1);
                                    }}
                                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                                        orderType === 'personal'
                                            ? 'border-[#16233B] bg-[#16233B] text-white shadow-xs'
                                            : 'border-[#A88B54]/30 bg-[#F2EBDC]/40 text-[#16233B] hover:bg-[#F2EBDC]'
                                    }`}
                                >
                                    <UserIcon className="size-3.5" />
                                    <span>Paket Personal</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOrderType('corporate');
                                        if (quantity < 25) setQuantity(25);
                                    }}
                                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                                        orderType === 'corporate'
                                            ? 'border-[#16233B] bg-[#16233B] text-white shadow-xs'
                                            : 'border-[#A88B54]/30 bg-[#F2EBDC]/40 text-[#16233B] hover:bg-[#F2EBDC]'
                                    }`}
                                >
                                    <Building2 className="size-3.5" />
                                    <span>Corporate (Min. 25)</span>
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleOrderSubmit}
                                className="mt-4 space-y-3.5"
                            >
                                {/* Quantity selector */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="order-qty"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Jumlah Paket{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            {orderType === 'corporate' && (
                                                <span className="ml-2 font-normal text-[#A88B54] lowercase">
                                                    (wajib minimal 25 paket)
                                                </span>
                                            )}
                                        </label>
                                        {orderType === 'corporate' && (
                                            <div className="flex gap-1">
                                                {[25, 50, 100, 250].map(
                                                    (preset) => (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            onClick={() =>
                                                                setQuantity(
                                                                    preset,
                                                                )
                                                            }
                                                            className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                                                                quantity ===
                                                                preset
                                                                    ? 'bg-[#16233B] text-white'
                                                                    : 'bg-[#F2EBDC] text-[#16233B]'
                                                            }`}
                                                        >
                                                            {preset}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-1 flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((prev) =>
                                                    orderType === 'corporate'
                                                        ? Math.max(25, prev - 1)
                                                        : Math.max(1, prev - 1),
                                                )
                                            }
                                            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC] text-sm font-bold text-[#16233B]"
                                        >
                                            -
                                        </button>
                                        <input
                                            id="order-qty"
                                            type="number"
                                            min={
                                                orderType === 'corporate'
                                                    ? 25
                                                    : 1
                                            }
                                            value={quantity}
                                            onChange={(e) =>
                                                setQuantity(
                                                    parseInt(
                                                        e.target.value,
                                                        10,
                                                    ) || 0,
                                                )
                                            }
                                            className="w-24 rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3 py-2 text-center text-sm font-bold text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((prev) => prev + 1)
                                            }
                                            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC] text-sm font-bold text-[#16233B]"
                                        >
                                            +
                                        </button>
                                        <div className="ml-auto text-right">
                                            <span className="block text-[8px] text-[#6E675D] uppercase">
                                                Subtotal
                                            </span>
                                            <span className="font-serif text-sm font-bold text-[#16233B]">
                                                Rp{' '}
                                                {currentSubtotal.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {formErrors.quantity && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {formErrors.quantity}
                                        </p>
                                    )}
                                </div>

                                {/* If Corporate: Company Name */}
                                {orderType === 'corporate' && (
                                    <div>
                                        <label
                                            htmlFor="company_name"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Nama Perusahaan / Instansi{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="company_name"
                                            type="text"
                                            required
                                            value={companyName}
                                            onChange={(e) =>
                                                setCompanyName(e.target.value)
                                            }
                                            placeholder="Contoh: PT. Adhi Kencana Nusantara"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                        {formErrors.company_name && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {formErrors.company_name}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="recipient_name"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Nama Penerima / PIC{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="recipient_name"
                                            type="text"
                                            required
                                            value={recipientName}
                                            onChange={(e) =>
                                                setRecipientName(e.target.value)
                                            }
                                            placeholder="Nama lengkap penerima"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                        {formErrors.recipient_name && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {formErrors.recipient_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="recipient_phone"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            No. Telepon / WhatsApp{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1 flex items-center overflow-hidden rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 transition-all focus-within:border-[#A88B54] focus-within:bg-white">
                                            <span className="inline-flex shrink-0 items-center border-r border-[#A88B54]/30 bg-[#F2EBDC] px-3 py-2 text-xs font-bold text-[#16233B] select-none">
                                                ID +62
                                            </span>
                                            <input
                                                id="recipient_phone"
                                                type="tel"
                                                inputMode="numeric"
                                                required
                                                value={recipientPhone}
                                                onChange={(e) => {
                                                    let val =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            '',
                                                        );
                                                    if (val.startsWith('62'))
                                                        val = val.slice(2);
                                                    if (val.startsWith('0'))
                                                        val = val.slice(1);
                                                    val = val.slice(0, 13);
                                                    setRecipientPhone(val);
                                                }}
                                                placeholder="812-3456-7890"
                                                maxLength={13}
                                                className="w-full bg-transparent px-3 py-2 text-xs text-[#16233B] focus:outline-hidden"
                                            />
                                        </div>
                                        {formErrors.recipient_phone && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {formErrors.recipient_phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Address with Auto-Detection */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="shipping_address"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Alamat Lengkap Pengiriman{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            disabled={isDetectingLocation}
                                            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-[#A88B54] hover:underline disabled:opacity-50"
                                        >
                                            {isDetectingLocation ? (
                                                <>
                                                    <Loader2 className="size-3 animate-spin" />
                                                    <span>
                                                        Mendeteksi Lokasi...
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="size-3" />
                                                    <span>
                                                        Deteksi Alamat Otomatis
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <textarea
                                        id="shipping_address"
                                        rows={2}
                                        required
                                        value={shippingAddress}
                                        onChange={(e) =>
                                            setShippingAddress(e.target.value)
                                        }
                                        placeholder="Nama jalan, nomor rumah/kantor, RT/RW, kecamatan, kota"
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                    />
                                    {formErrors.shipping_address && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {formErrors.shipping_address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="needed_at"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Target Tanggal Pengiriman
                                        </label>
                                        <input
                                            id="needed_at"
                                            type="date"
                                            value={neededAt}
                                            onChange={(e) =>
                                                setNeededAt(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="engraving_name"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Nama Grafir Laser / Monogram
                                        </label>
                                        <input
                                            id="engraving_name"
                                            type="text"
                                            value={engravingName}
                                            onChange={(e) =>
                                                setEngravingName(e.target.value)
                                            }
                                            placeholder="Contoh: Keluarga Budi / PT XYZ"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                {/* Greeting Card Text */}
                                <div>
                                    <label
                                        htmlFor="greeting_card_text"
                                        className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                    >
                                        Pesan Kartu Ucapan (Stempel Wax Seal)
                                    </label>
                                    <textarea
                                        id="greeting_card_text"
                                        rows={2}
                                        value={greetingCardText}
                                        onChange={(e) =>
                                            setGreetingCardText(e.target.value)
                                        }
                                        placeholder="Tuliskan ucapan selamat atau pesan personal yang ingin disertakan di dalam kotak hampers..."
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileTap={buttonTap.tap}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#16233B] py-3 text-xs font-bold tracking-[0.12em] text-white shadow-sm transition-all duration-300 hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>MEMPROSES PESANAN...</span>
                                        </>
                                    ) : (
                                        <span>
                                            KONFIRMASI &amp; BUAT PESANAN (RP{' '}
                                            {currentSubtotal.toLocaleString(
                                                'id-ID',
                                            )}
                                            )
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

export const ProductsSection = Catalog;
export default Catalog;
