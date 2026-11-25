import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Calendar,
    Package,
    CheckCircle2,
    Upload,
    Eye,
    Save,
    Tag,
    Layers,
    Image as ImageIcon,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import { buttonTap } from '@/lib/motion';

interface ProductItem {
    id: number;
    name: string;
    category: string;
    event_tag?: string | null;
    price_from: number;
    corporate_price: number;
    image: string;
    is_active: boolean;
}

interface AvailableEvent {
    id: string;
    name: string;
    badge: string;
}

interface AdminEventsProps {
    activeEvent: string;
    eventBannerTitle: string;
    eventBannerSubtitle: string;
    eventBannerImage: string;
    eventBannerActive: boolean;
    products: ProductItem[];
    availableEvents: AvailableEvent[];
    customEventName?: string;
    customEventBadge?: string;
}

const PRESET_EVENT_TEMPLATES: Record<
    string,
    {
        name: string;
        badge: string;
        bannerTitle: string;
        bannerSubtitle: string;
        image: string;
        keywords: string[];
    }
> = {
    ramadhan: {
        name: 'Idul Fitri & Ramadhan 1447 H',
        badge: 'Edisi Lebaran',
        bannerTitle: 'Kurasi Hantaran Istimewa Hari Raya',
        bannerSubtitle:
            'Sambut momen suci dengan bingkisan mewah berbalut hardbox zamrud dan anyaman bambu artisanal.',
        image: '/images/product_emerald_box.jpg',
        keywords: [
            'lebaran',
            'ramadhan',
            'ramadan',
            'eid',
            'kencana',
            'rayyan',
        ],
    },
    natal: {
        name: 'Natal & Tahun Baru',
        badge: 'Festive Season',
        bannerTitle: 'Kehangatan Natal & Semarak Tahun Baru',
        bannerSubtitle:
            'Bagikan kasih dan sukacita akhir tahun dengan paket hampers festive premium Galuh & Co.',
        image: '/images/product_bamboo_box.jpg',
        keywords: ['natal', 'christmas', 'tahunbaru', 'festive', 'noel'],
    },
    corporate: {
        name: 'Apresiasi Korporat & Kemitraan B2B',
        badge: 'Corporate Annual',
        bannerTitle: 'Apresiasi Korporat & Kemitraan Bergengsi',
        bannerSubtitle:
            'Perkuat relasi bisnis dengan bingkisan eksklusif kustom berukir logo perusahaan Anda.',
        image: '/images/product_leather_box.jpg',
        keywords: [
            'kantor',
            'corporate',
            'b2b',
            'eksekutif',
            'sinergi',
            'apresiasi',
            'office',
        ],
    },
    imlek: {
        name: 'Tahun Baru Imlek & Musim Semi',
        badge: 'Spring Blossom',
        bannerTitle: 'Kemakmuran & Harapan Baru Musim Semi',
        bannerSubtitle:
            'Rayakan Tahun Baru Imlek dengan bingkisan hantaran mewah penuh doa keberkahan.',
        image: '/images/product_emerald_box.jpg',
        keywords: ['imlek', 'spring', 'chinese', 'lunar'],
    },
    pernikahan: {
        name: 'Seserahan & Hantaran Pernikahan',
        badge: 'Wedding Atelier',
        bannerTitle: 'Seserahan & Hantaran Pernikahan Sakral',
        bannerSubtitle:
            'Wadah anyaman kriya dan hardbox linen elegan penyempurna ikrar suci pernikahan Anda.',
        image: '/images/product_bamboo_box.jpg',
        keywords: ['wedding', 'seserahan', 'mahligai', 'hantaran', 'nikah'],
    },
    custom: {
        name: 'Koleksi Kustom & Tematik Sendiri',
        badge: 'Custom Edition',
        bannerTitle: 'Koleksi Bingkisan Edisi Spesial',
        bannerSubtitle:
            'Kurasi bingkisan kustom tematik eksklusif untuk momen istimewa Anda.',
        image: '/images/product_rattan_box.jpg',
        keywords: ['custom', 'bespoke', 'kustom'],
    },
};

export default function AdminEventsIndex({
    activeEvent: initialActiveEvent,
    eventBannerTitle: initialBannerTitle,
    eventBannerSubtitle: initialBannerSubtitle,
    eventBannerImage: initialBannerImage,
    eventBannerActive: initialBannerActive,
    products,
    availableEvents,
    customEventName: initialCustomName = 'Koleksi Kustom & Tematik Sendiri',
    customEventBadge: initialCustomBadge = 'Custom Edition',
}: AdminEventsProps) {
    const [activeEvent, setActiveEvent] = useState(initialActiveEvent);
    const [customName, setCustomName] = useState(initialCustomName);
    const [customBadge, setCustomBadge] = useState(initialCustomBadge);
    const [bannerTitle, setBannerTitle] = useState(initialBannerTitle);
    const [bannerSubtitle, setBannerSubtitle] = useState(initialBannerSubtitle);
    const [bannerImage, setBannerImage] = useState(initialBannerImage);
    const [bannerActive, setBannerActive] = useState(initialBannerActive);

    // Auto-matcher helper to find products matching an event
    const getAutoMatchingProductIds = (eventId: string) => {
        const template = PRESET_EVENT_TEMPLATES[eventId];
        if (!template) return [];

        const normalize = (s: string) =>
            s.toLowerCase().replace(/[^a-z0-9]/g, '');
        return products
            .filter((p) => {
                if (p.event_tag === eventId) return true;
                const cat = normalize(p.category || '');
                const name = normalize(p.name || '');
                return template.keywords.some(
                    (kw) => cat.includes(kw) || name.includes(kw),
                );
            })
            .map((p) => p.id);
    };

    // Track which product IDs belong to the event
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>(
        () => {
            const tagged = products
                .filter((p) => p.event_tag === initialActiveEvent)
                .map((p) => p.id);
            if (tagged.length > 0) return tagged;
            return getAutoMatchingProductIds(initialActiveEvent);
        },
    );

    const [isSaving, setIsSaving] = useState(false);
    const [autoSelectFeedback, setAutoSelectFeedback] = useState<string | null>(
        null,
    );

    // Hampers products currently selected that have an image
    const selectedCatalogProductsWithImage = products.filter(
        (p) => selectedProductIds.includes(p.id) && p.image,
    );

    // When an event is selected, automatically update matching hampers and banner copy
    const handleSelectEvent = (eventId: string) => {
        setActiveEvent(eventId);

        const template = PRESET_EVENT_TEMPLATES[eventId];
        if (template) {
            setBannerTitle(template.bannerTitle);
            setBannerSubtitle(template.bannerSubtitle);

            const matchingIds = getAutoMatchingProductIds(eventId);
            if (matchingIds.length > 0) {
                setSelectedProductIds(matchingIds);
                // Automatically take the photo from the first matching hamper in the catalog!
                const firstMatchingProd = products.find(
                    (p) => matchingIds.includes(p.id) && p.image,
                );
                if (firstMatchingProd?.image) {
                    setBannerImage(firstMatchingProd.image);
                } else if (template.image) {
                    setBannerImage(template.image);
                }

                setAutoSelectFeedback(
                    `Otomatis memilih ${matchingIds.length} hampers dan mengambil foto "${firstMatchingProd ? firstMatchingProd.name : template.name}" dari katalog!`,
                );
                setTimeout(() => setAutoSelectFeedback(null), 4000);
            } else if (template.image) {
                setBannerImage(template.image);
            }
        }
    };

    const handleBannerUpload = (file: File) => {
        const validTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/svg+xml',
            'image/webp',
        ];
        if (
            !validTypes.includes(file.type) &&
            !file.name.match(/\.(jpg|jpeg|png|svg|webp)$/i)
        ) {
            alert(
                'Format file tidak didukung. Harap upload SVG, JPG, PNG, atau WebP.',
            );
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
                setBannerImage(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleApplyAutoMatch = () => {
        const matchingIds = getAutoMatchingProductIds(activeEvent);
        if (matchingIds.length > 0) {
            setSelectedProductIds(matchingIds);
            setAutoSelectFeedback(
                `Berhasil memilih ${matchingIds.length} hampers bertema.`,
            );
            setTimeout(() => setAutoSelectFeedback(null), 3000);
        } else {
            setAutoSelectFeedback(
                'Tidak ada hampers bawaan yang cocok otomatis, Anda dapat memilih bebas secara kustom.',
            );
            setTimeout(() => setAutoSelectFeedback(null), 4000);
        }
    };

    const handleToggleProduct = (id: number) => {
        setSelectedProductIds((prev) =>
            prev.includes(id)
                ? prev.filter((pId) => pId !== id)
                : [...prev, id],
        );
    };

    const handleSelectAll = () => {
        if (selectedProductIds.length === products.length) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(products.map((p) => p.id));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            '/admin/events',
            {
                active_event: activeEvent,
                event_banner_title: bannerTitle,
                event_banner_subtitle: bannerSubtitle,
                event_banner_image: bannerImage,
                event_banner_active: bannerActive,
                custom_event_name: customName,
                custom_event_badge: customBadge,
                product_ids: selectedProductIds,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const currentTemplate =
        PRESET_EVENT_TEMPLATES[activeEvent] || PRESET_EVENT_TEMPLATES.custom;
    const activeEventInfo = availableEvents.find(
        (e) => e.id === activeEvent,
    ) || {
        id: 'custom',
        name: customName || 'Event Kustom',
        badge: customBadge || 'Custom Edition',
    };

    return (
        <AdminLayout
            title="Event Musiman & Demo Banner"
            subtitle="Atur event aktif (Lebaran, Natal, dll.). Paket hampers bertema otomatis dipromosikan di urutan teratas katalog."
        >
            <Head title="Event Musiman — Admin Galuh & Co." />

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Active Event Selector */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                        <Calendar className="size-4 text-[#D4AF37]" />
                        <span>PILIH TEMA EVENT AKTIF</span>
                    </div>
                    <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                        Musim Perayaan & Tema yang Sedang Berjalan
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Ketika suatu event diaktifkan, produk yang ditandai
                        dengan event tersebut akan otomatis bergeser ke posisi
                        paling atas di katalog landing page.
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {availableEvents.map((evt) => {
                            const isSelected = activeEvent === evt.id;
                            return (
                                <button
                                    key={evt.id}
                                    type="button"
                                    onClick={() => handleSelectEvent(evt.id)}
                                    className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                                        isSelected
                                            ? 'border-[#16233B] bg-[#16233B] text-white shadow-md ring-2 ring-slate-300'
                                            : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                isSelected
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {evt.id === 'custom'
                                                ? customBadge ||
                                                  'Custom Edition'
                                                : evt.badge}
                                        </span>
                                        {isSelected && (
                                            <CheckCircle2 className="size-4 text-[#D4AF37]" />
                                        )}
                                    </div>
                                    <h3
                                        className={`mt-3 font-sans text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}
                                    >
                                        {evt.id === 'custom'
                                            ? customName ||
                                              'Koleksi Kustom & Tematik Sendiri'
                                            : evt.name}
                                    </h3>
                                    <span className="mt-1 text-[10px] opacity-75">
                                        {evt.id === 'custom'
                                            ? 'Klik untuk atur tema sendiri & pilih hampers bebas'
                                            : 'Klik untuk otomatis pilih hampers bertema ini'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Custom Event Name & Badge Inputs (Active when Custom is selected) */}
                    {activeEvent === 'custom' && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <span className="text-[10.5px] font-bold tracking-wider text-slate-600 uppercase">
                                PENGATURAN TEMA KUSTOM SENDIRI:
                            </span>
                            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Nama Event Kustom:
                                    </label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) =>
                                            setCustomName(e.target.value)
                                        }
                                        placeholder="Contoh: Spesial Hari Ibu / Anniversary Perusahaan"
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#16233B] focus:border-[#16233B] focus:outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Label / Badge Event:
                                    </label>
                                    <input
                                        type="text"
                                        value={customBadge}
                                        onChange={(e) =>
                                            setCustomBadge(e.target.value)
                                        }
                                        placeholder="Contoh: Edisi Spesial Hari Ibu"
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#16233B] focus:border-[#16233B] focus:outline-hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Demo Card Banner Promotion Settings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                <Tag className="size-4 text-[#D4AF37]" />
                                <span>
                                    KARTU DEMO & PROMOSI EVENT DI LAYER TERATAS
                                </span>
                            </div>
                            <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                                Iklan / Card Foto Demo Musim Aktif
                            </h2>
                        </div>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={bannerActive}
                                onChange={(e) =>
                                    setBannerActive(e.target.checked)
                                }
                                className="size-4 accent-[#16233B]"
                            />
                            <span className="text-xs font-bold text-[#16233B]">
                                Tampilkan Banner Demo di Web
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left: Input Form */}
                        <div className="space-y-4 text-xs lg:col-span-7">
                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Judul Card Promo Event:
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={bannerTitle}
                                    onChange={(e) =>
                                        setBannerTitle(e.target.value)
                                    }
                                    placeholder="Contoh: Koleksi Hantaran Istimewa Hari Raya 1447 H"
                                    className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Deskripsi / Pesan Tema:
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={bannerSubtitle}
                                    onChange={(e) =>
                                        setBannerSubtitle(e.target.value)
                                    }
                                    placeholder="Contoh: Hadirkan kehangatan tradisi dengan kurasi hampers anyaman bambu dan hardbox linen berstempel wax personal..."
                                    className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                        Foto Card Promo Event:
                                    </label>
                                    <span className="font-mono text-[9.5px] text-[#A88B54]">
                                        Otomatis dari Katalog / Upload
                                    </span>
                                </div>

                                {/* Quick Selector: Hampers from Catalog */}
                                {selectedCatalogProductsWithImage.length >
                                    0 && (
                                    <div className="mt-2 rounded-xl border border-[#A88B54]/25 bg-[#FAF8F5] p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10.5px] font-bold text-[#16233B]">
                                                Ambil Otomatis Foto dari Hampers
                                                Katalog:
                                            </span>
                                            <span className="text-[10px] text-[#6E675D]">
                                                (Klik untuk pasang ke banner)
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedCatalogProductsWithImage.map(
                                                (prod) => {
                                                    const isCurrent =
                                                        bannerImage ===
                                                        prod.image;
                                                    return (
                                                        <button
                                                            key={prod.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setBannerImage(
                                                                    prod.image,
                                                                )
                                                            }
                                                            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-1.5 pr-2.5 text-left transition-all ${
                                                                isCurrent
                                                                    ? 'border-[#A88B54] bg-[#A88B54]/15 ring-2 ring-[#A88B54]/40'
                                                                    : 'border-[#A88B54]/25 bg-white hover:border-[#A88B54]/60'
                                                            }`}
                                                        >
                                                            <img
                                                                src={prod.image}
                                                                alt={prod.name}
                                                                className="size-8 rounded-lg object-cover"
                                                            />
                                                            <div className="max-w-[140px] truncate">
                                                                <p className="truncate font-sans text-[11px] font-bold text-[#16233B]">
                                                                    {prod.name}
                                                                </p>
                                                                <span className="text-[9.5px] font-semibold text-[#A88B54]">
                                                                    {isCurrent
                                                                        ? '✓ Foto Banner Aktif'
                                                                        : 'Gunakan Foto Ini'}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Upload & Reset Action Buttons */}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-[#16233B] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#223354] active:scale-95">
                                        <Upload className="size-3.5" />
                                        <span>
                                            Upload Foto Kustom (SVG / JPG)
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/svg+xml,image/webp"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file)
                                                    handleBannerUpload(file);
                                            }}
                                        />
                                    </label>

                                    {selectedCatalogProductsWithImage[0] && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setBannerImage(
                                                    selectedCatalogProductsWithImage[0]
                                                        .image,
                                                )
                                            }
                                            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Reset ke Foto Hampers #1
                                        </button>
                                    )}
                                </div>

                                <div className="mt-2">
                                    <input
                                        type="text"
                                        required
                                        value={bannerImage}
                                        onChange={(e) =>
                                            setBannerImage(e.target.value)
                                        }
                                        placeholder="/images/product_emerald_box.jpg atau data:image/..."
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[#16233B] focus:border-[#16233B] focus:outline-hidden"
                                    />
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Foto banner otomatis diambil dari
                                        hampers katalog di atas, atau Anda bisa
                                        upload gambar sendiri.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Real-time Live Preview Card */}
                        <div className="flex flex-col justify-center rounded-2xl border border-slate-700 bg-[#16233B] p-6 text-white shadow-lg lg:col-span-5">
                            <span className="text-[9.5px] font-bold tracking-widest text-[#D4AF37] uppercase">
                                PREVIEW CARD PROMO DI WEBSITE:
                            </span>

                            <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-700">
                                <img
                                    src={
                                        bannerImage ||
                                        '/images/product_emerald_box.jpg'
                                    }
                                    alt="Demo Event Card"
                                    className="h-44 w-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            '/images/product_emerald_box.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#16233B] via-transparent to-transparent" />
                                <span className="absolute top-3 left-3 rounded-full border border-slate-600 bg-[#16233B]/80 px-2.5 py-0.5 text-[10px] font-bold text-[#D4AF37]">
                                    {activeEventInfo.badge}
                                </span>
                            </div>

                            <h4 className="mt-3 font-sans text-base font-bold text-white">
                                {bannerTitle}
                            </h4>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-300">
                                {bannerSubtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Hampers Event Selection (Automated Top-Priority) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                <Package className="size-4 text-[#D4AF37]" />
                                <span>
                                    PILIH HAMPERS UNTUK EVENT{' '}
                                    {activeEventInfo.name.toUpperCase()}
                                </span>
                            </div>
                            <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                                Hampers yang Dipromosikan Paling Atas (
                                {selectedProductIds.length} Terpilih)
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Hampers yang sesuai tema otomatis tercentang.
                                Anda juga dapat bebas mencentang atau menambah
                                hampers kustom lainnya.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleApplyAutoMatch}
                                className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#16233B] hover:bg-slate-100"
                                title="Otomatis mencocokkan hampers berdasarkan kata kunci tema yang dipilih"
                            >
                                Cocokkan Otomatis Tema Ini
                            </button>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#16233B] hover:bg-[#16233B] hover:text-white"
                            >
                                {selectedProductIds.length === products.length
                                    ? 'Batal Semua'
                                    : 'Pilih Semua'}
                            </button>
                        </div>
                    </div>

                    {autoSelectFeedback && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-[#16233B]">
                            <CheckCircle2 className="size-4 text-emerald-600" />
                            <span>{autoSelectFeedback}</span>
                        </div>
                    )}

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                            const isIncluded = selectedProductIds.includes(
                                product.id,
                            );
                            const isThemeMatch = currentTemplate.keywords.some(
                                (kw) =>
                                    (product.category || '')
                                        .toLowerCase()
                                        .includes(kw) ||
                                    (product.name || '')
                                        .toLowerCase()
                                        .includes(kw) ||
                                    product.event_tag === activeEvent,
                            );

                            return (
                                <div
                                    key={product.id}
                                    onClick={() =>
                                        handleToggleProduct(product.id)
                                    }
                                    className={`group flex cursor-pointer items-center gap-3.5 rounded-xl border p-3.5 transition-all ${
                                        isIncluded
                                            ? 'border-[#16233B] bg-slate-50 shadow-xs'
                                            : 'border-slate-200 bg-white opacity-75 hover:border-slate-400 hover:opacity-100'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isIncluded}
                                        onChange={() => {}} // handled by div click
                                        className="size-4 shrink-0 accent-[#16233B]"
                                    />

                                    <img
                                        src={
                                            product.image ||
                                            '/images/product_bamboo_box.jpg'
                                        }
                                        alt={product.name}
                                        className="size-14 shrink-0 rounded-lg border border-slate-200 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/images/product_bamboo_box.jpg';
                                        }}
                                    />

                                    <div className="min-w-0 flex-1 text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <p className="truncate font-sans font-bold text-[#16233B]">
                                                {product.name}
                                            </p>
                                            {isThemeMatch && (
                                                <span className="py-0.2 shrink-0 rounded bg-slate-200 px-1.5 text-[8px] font-bold text-slate-700">
                                                    Cocok
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] font-semibold text-[#A88B54]">
                                            Personal: Rp{' '}
                                            {Number(
                                                product.price_from,
                                            ).toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-[10px] text-[#6E675D]">
                                            B2B: Rp{' '}
                                            {Number(
                                                product.corporate_price,
                                            ).toLocaleString('id-ID')}
                                            /paket
                                        </p>
                                    </div>

                                    {isIncluded && (
                                        <span className="shrink-0 rounded bg-[#16233B] px-1.5 py-0.5 text-[9.5px] font-bold text-[#A88B54]">
                                            Prioritas 1
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Save Sticky Footer */}
                <div className="flex items-center justify-end gap-3 rounded-2xl border border-[#A88B54]/30 bg-white p-4 shadow-sm">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#16233B] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-50"
                    >
                        <Save className="size-4" />
                        <span>
                            {isSaving
                                ? 'Menyimpan...'
                                : 'Simpan & Aktifkan Event'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
