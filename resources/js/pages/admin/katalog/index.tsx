import { Head, Link, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Award,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    Filter,
    Gift,
    Image as ImageIcon,
    MoreVertical,
    Package,
    Plus,
    Search,
    ShieldAlert,
    Sparkles,
    Star,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface HamperItem {
    id: number;
    name: string;
    slug: string;
    category: string;
    packaging?: string | null;
    price_from: number;
    short_description: string;
    contents: string[];
    image?: string | null;
    is_halal: boolean;
    is_featured_hero: boolean;
    visibility: 'published' | 'draft' | 'sold_out';
    is_active: boolean;
    sort_order: number;
}

interface KatalogProps {
    hampers: HamperItem[];
    categories: string[];
    packagingTypes: Record<string, string>;
    stats: {
        total: number;
        published: number;
        featured_hero: number;
        sold_out: number;
    };
    filters: {
        search?: string;
        category?: string;
        packaging?: string;
        visibility?: string;
    };
}

export default function AdminKatalogIndex({
    hampers,
    categories,
    packagingTypes,
    stats,
    filters,
}: KatalogProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingHamper, setEditingHamper] = useState<HamperItem | null>(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedPackaging, setSelectedPackaging] = useState(filters.packaging || '');
    const [selectedVisibility, setSelectedVisibility] = useState(filters.visibility || '');

    // Form for Slide-Over Drawer
    const form = useForm({
        name: '',
        category: categories[0] || 'Paket Lebaran',
        packaging: 'hardbox_emerald',
        price_from: 350000,
        short_description: '',
        contents: ['Nastar Wisman Bulat 350g', 'Kastengel Keju Edam 300g'],
        image: '/images/product_emerald_box.jpg',
        is_halal: true,
        is_featured_hero: false,
        visibility: 'published' as 'published' | 'draft' | 'sold_out',
    });

    const [newBullet, setNewBullet] = useState('');

    const openAddDrawer = () => {
        setEditingHamper(null);
        form.setData({
            name: '',
            category: categories[0] || 'Paket Lebaran',
            packaging: 'hardbox_emerald',
            price_from: 350000,
            short_description: '',
            contents: ['Nastar Wisman 350g', 'Kastengel Keju Edam 300g'],
            image: '/images/product_emerald_box.jpg',
            is_halal: true,
            is_featured_hero: false,
            visibility: 'published',
        });
        setDrawerOpen(true);
    };

    const openEditDrawer = (item: HamperItem) => {
        setEditingHamper(item);
        form.setData({
            name: item.name,
            category: item.category,
            packaging: item.packaging || 'hardbox_emerald',
            price_from: item.price_from,
            short_description: item.short_description,
            contents: Array.isArray(item.contents) ? item.contents : [],
            image: item.image || '/images/product_emerald_box.jpg',
            is_halal: item.is_halal,
            is_featured_hero: item.is_featured_hero,
            visibility: item.visibility,
        });
        setDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingHamper) {
            form.post(`/admin/katalog/${editingHamper.id}`, {
                onSuccess: () => setDrawerOpen(false),
            });
        } else {
            form.post('/admin/katalog', {
                onSuccess: () => setDrawerOpen(false),
            });
        }
    };

    const handleToggleHero = (hamper: HamperItem) => {
        router.post(`/admin/katalog/${hamper.id}/toggle-hero`, {}, { preserveScroll: true });
    };

    const handleToggleVisibility = (hamper: HamperItem, nextStatus: 'published' | 'draft' | 'sold_out') => {
        router.post(
            `/admin/katalog/${hamper.id}/toggle-visibility`,
            { visibility: nextStatus },
            { preserveScroll: true }
        );
    };

    const handleDelete = (hamper: HamperItem) => {
        if (confirm(`Yakin ingin menghapus paket "${hamper.name}" dari katalog?`)) {
            router.delete(`/admin/katalog/${hamper.id}`, { preserveScroll: true });
        }
    };

    const handleFilterApply = () => {
        router.get(
            '/admin/katalog',
            {
                search: searchVal || undefined,
                category: selectedCategory || undefined,
                packaging: selectedPackaging || undefined,
                visibility: selectedVisibility || undefined,
            },
            { preserveState: true }
        );
    };

    const addBullet = () => {
        if (newBullet.trim()) {
            form.setData('contents', [...form.data.contents, newBullet.trim()]);
            setNewBullet('');
        }
    };

    const removeBullet = (index: number) => {
        const next = [...form.data.contents];
        next.splice(index, 1);
        form.setData('contents', next);
    };

    const formatIdr = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    return (
        <AdminLayout
            title="Master Katalog Hampers"
            subtitle="Kurasi Paket Hampers, Kemasan Eksklusif & Highlight Website"
            headerAction={
                <button
                    type="button"
                    onClick={openAddDrawer}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#143E2E]"
                >
                    <Plus className="size-3.5 text-[#B89352]" />
                    <span>Tambah Paket Baru</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Stats KPI Strip */}
                <div className="grid grid-cols-2 divide-y divide-[#0B291E]/10 overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#B89352] uppercase">
                            TOTAL KATALOG
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-[#0B291E]">
                                {stats.total}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">Paket</span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#B89352] uppercase">
                            TAYANG DI WEB
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-emerald-800">
                                {stats.published}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">Aktif</span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#B89352] uppercase">
                            FEATURED ON HERO
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-[#B89352]">
                                {stats.featured_hero}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">Sorotan</span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#B89352] uppercase">
                            SOLD OUT
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-rose-800">
                                {stats.sold_out}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">Habis</span>
                        </div>
                    </div>
                </div>

                {/* 2. Filter Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[#0B291E]/10 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                        <div className="relative min-w-[200px] flex-1">
                            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#0B291E]/40" />
                            <input
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilterApply()}
                                placeholder="Cari paket hampers..."
                                className="w-full rounded-lg border border-[#0B291E]/15 bg-[#F7F5F0] py-1.5 pr-3 pl-8 text-xs text-[#0B291E] placeholder-[#0B291E]/40 focus:border-[#0B291E] focus:outline-hidden"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                            }}
                            className="rounded-lg border border-[#0B291E]/15 bg-white py-1.5 pr-7 pl-3 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        {/* Packaging Filter */}
                        <select
                            value={selectedPackaging}
                            onChange={(e) => setSelectedPackaging(e.target.value)}
                            className="rounded-lg border border-[#0B291E]/15 bg-white py-1.5 pr-7 pl-3 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                        >
                            <option value="">Semua Kemasan</option>
                            {Object.entries(packagingTypes).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        {/* Visibility Filter */}
                        <select
                            value={selectedVisibility}
                            onChange={(e) => setSelectedVisibility(e.target.value)}
                            className="rounded-lg border border-[#0B291E]/15 bg-white py-1.5 pr-7 pl-3 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Tayang di Web</option>
                            <option value="draft">Draft</option>
                            <option value="sold_out">Sold Out</option>
                        </select>

                        <button
                            type="button"
                            onClick={handleFilterApply}
                            className="rounded-lg bg-[#0B291E]/10 px-3 py-1.5 text-xs font-semibold text-[#0B291E] transition-colors hover:bg-[#0B291E] hover:text-white"
                        >
                            Terapkan
                        </button>
                    </div>
                </div>

                {/* 3. Hampers Master Table */}
                <div className="overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-[#0B291E]/10 bg-[#FAF8F5] font-mono text-[9.5px] font-bold tracking-wider text-[#B89352] uppercase">
                                <th className="py-3 px-4">Paket Hampers</th>
                                <th className="py-3 px-4">Kategori &amp; Kemasan</th>
                                <th className="py-3 px-4">Mulai Harga</th>
                                <th className="py-3 px-4 text-center">Hero Highlight</th>
                                <th className="py-3 px-4">Status Tayang</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0B291E]/5 text-[#0B291E]">
                            {hampers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-xs text-[#0B291E]/50">
                                        Tidak ada paket hampers yang sesuai dengan filter.
                                    </td>
                                </tr>
                            ) : (
                                hampers.map((h) => (
                                    <tr key={h.id} className="transition-colors hover:bg-[#F7F5F0]/50">
                                        {/* Product Photo & Name */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-[#0B291E]/10 bg-[#FAF8F5]">
                                                    <img
                                                        src={h.image || '/images/product_emerald_box.jpg'}
                                                        alt={h.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-semibold text-[#0B291E]">
                                                        {h.name}
                                                    </h4>
                                                    <p className="text-[11px] text-[#0B291E]/60 line-clamp-1">
                                                        {h.short_description}
                                                    </p>
                                                    {h.is_halal && (
                                                        <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-emerald-800">
                                                            <CheckCircle2 className="size-2.5" /> Halal Certified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category & Packaging */}
                                        <td className="py-3 px-4">
                                            <div className="space-y-1">
                                                <span className="inline-block rounded-md border border-[#0B291E]/10 bg-[#F7F5F0] px-2 py-0.5 text-[10.5px] font-medium text-[#0B291E]">
                                                    {h.category}
                                                </span>
                                                <p className="text-[11px] text-[#0B291E]/60">
                                                    {packagingTypes[h.packaging || ''] || h.packaging || 'Hardbox Emerald'}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="py-3 px-4">
                                            <span className="font-mono text-xs font-semibold text-[#0B291E]">
                                                {formatIdr(h.price_from)}
                                            </span>
                                            <span className="block text-[10px] text-[#0B291E]/50">Mulai dari</span>
                                        </td>

                                        {/* Toggle Hero Highlight */}
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleHero(h)}
                                                title={h.is_featured_hero ? 'Lepas dari Hero' : 'Tampilkan di Hero'}
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                                                    h.is_featured_hero
                                                        ? 'border border-[#B89352]/40 bg-[#B89352]/15 text-[#8C6D32]'
                                                        : 'border border-[#0B291E]/10 bg-white text-[#0B291E]/40 hover:text-[#0B291E]'
                                                }`}
                                            >
                                                <Sparkles className="size-3" />
                                                <span>{h.is_featured_hero ? 'Hero Active' : 'Off'}</span>
                                            </button>
                                        </td>

                                        {/* Visibility Status */}
                                        <td className="py-3 px-4">
                                            <select
                                                value={h.visibility}
                                                onChange={(e) =>
                                                    handleToggleVisibility(
                                                        h,
                                                        e.target.value as 'published' | 'draft' | 'sold_out'
                                                    )
                                                }
                                                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium focus:outline-hidden ${
                                                    h.visibility === 'published'
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                                        : h.visibility === 'sold_out'
                                                        ? 'border-rose-200 bg-rose-50 text-rose-800'
                                                        : 'border-stone-200 bg-stone-100 text-stone-600'
                                                }`}
                                            >
                                                <option value="published">Tayang di Web</option>
                                                <option value="draft">Draft</option>
                                                <option value="sold_out">Sold Out</option>
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditDrawer(h)}
                                                    className="rounded-md border border-[#0B291E]/15 bg-white px-2.5 py-1 text-xs font-medium text-[#0B291E] shadow-2xs hover:border-[#B89352] hover:text-[#B89352]"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(h)}
                                                    className="rounded-md p-1 text-rose-600 hover:bg-rose-50"
                                                    title="Hapus Paket"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Slide-Over Drawer for Create / Edit Package */}
            <AnimatePresence>
                {drawerOpen && (
                    <div
                        className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-full w-full max-w-xl flex-col justify-between bg-white shadow-2xl"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-[#0B291E]/10 bg-[#FAF8F5] px-6 py-4">
                                <div>
                                    <h3 className="text-base font-semibold text-[#0B291E]">
                                        {editingHamper ? 'Edit Paket Hampers' : 'Tambah Paket Hampers Baru'}
                                    </h3>
                                    <p className="text-xs text-[#0B291E]/60">
                                        Informasi detail paket untuk katalog publik &amp; konsultasi WA
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    className="rounded-lg p-1.5 text-[#0B291E]/60 hover:bg-[#0B291E]/5 hover:text-[#0B291E]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            {/* Drawer Body Form */}
                            <form
                                id="hamperForm"
                                onSubmit={handleSave}
                                className="flex-1 space-y-4 overflow-y-auto p-6 text-xs scrollbar-none"
                            >
                                {/* Name */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#0B291E]">
                                        Nama Paket Hampers
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Contoh: Seri Emerald Royal Nusantara"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Category */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            Kategori Edisi
                                        </label>
                                        <select
                                            value={form.data.category}
                                            onChange={(e) => form.setData('category', e.target.value)}
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        >
                                            {categories.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Packaging */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            Kemasan Utama
                                        </label>
                                        <select
                                            value={form.data.packaging}
                                            onChange={(e) => form.setData('packaging', e.target.value)}
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        >
                                            {Object.entries(packagingTypes).map(([k, v]) => (
                                                <option key={k} value={k}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Starting Price */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            Harga Mulai Dari (IDR)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={form.data.price_from}
                                            onChange={(e) => form.setData('price_from', Number(e.target.value))}
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 font-mono text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        />
                                    </div>

                                    {/* Visibility Status */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            Status Tayang
                                        </label>
                                        <select
                                            value={form.data.visibility}
                                            onChange={(e) =>
                                                form.setData(
                                                    'visibility',
                                                    e.target.value as 'published' | 'draft' | 'sold_out'
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        >
                                            <option value="published">Tayang di Web</option>
                                            <option value="draft">Draft (Disembunyikan)</option>
                                            <option value="sold_out">Sold Out (Tampilkan Label Habis)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Short Description */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#0B291E]">
                                        Deskripsi Singkat
                                    </label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={form.data.short_description}
                                        onChange={(e) => form.setData('short_description', e.target.value)}
                                        placeholder="Kombinasi elegan nastar Wijsman dan teh artisan dalam hardbox zamrud..."
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                    />
                                </div>

                                {/* Contents Bullets */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-[#0B291E]">
                                        Daftar Isi Paket (Item Bullets)
                                    </label>
                                    <div className="space-y-1.5">
                                        {form.data.contents.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between rounded-lg border border-[#0B291E]/10 bg-[#FAF8F5] px-3 py-1.5"
                                            >
                                                <span className="text-xs text-[#0B291E]">{item}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeBullet(idx)}
                                                    className="text-rose-500 hover:text-rose-700"
                                                >
                                                    <X className="size-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="text"
                                            value={newBullet}
                                            onChange={(e) => setNewBullet(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addBullet();
                                                }
                                            }}
                                            placeholder="Tambah item isi baru..."
                                            className="flex-1 rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-1.5 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={addBullet}
                                            className="rounded-lg bg-[#0B291E] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#143E2E]"
                                        >
                                            Tambah
                                        </button>
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#0B291E]">
                                        URL Foto Produk
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.image}
                                        onChange={(e) => form.setData('image', e.target.value)}
                                        placeholder="/images/product_emerald_box.jpg"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                    />
                                </div>

                                {/* Toggles */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <label className="flex items-center gap-2.5 rounded-lg border border-[#0B291E]/10 bg-[#FAF8F5] p-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_halal}
                                            onChange={(e) => form.setData('is_halal', e.target.checked)}
                                            className="rounded border-[#0B291E]/30 text-[#0B291E] focus:ring-0"
                                        />
                                        <div>
                                            <span className="text-xs font-semibold text-[#0B291E]">
                                                Sertifikat Halal
                                            </span>
                                            <p className="text-[10px] text-[#0B291E]/50">
                                                Tampilkan badge halal
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-2.5 rounded-lg border border-[#0B291E]/10 bg-[#FAF8F5] p-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_featured_hero}
                                            onChange={(e) => form.setData('is_featured_hero', e.target.checked)}
                                            className="rounded border-[#0B291E]/30 text-[#0B291E] focus:ring-0"
                                        />
                                        <div>
                                            <span className="text-xs font-semibold text-[#0B291E]">
                                                Featured di Hero
                                            </span>
                                            <p className="text-[10px] text-[#0B291E]/50">
                                                Tampil di carousel hero utama
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </form>

                            {/* Drawer Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 border-t border-[#0B291E]/10 bg-[#FAF8F5] px-6 py-4">
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    className="rounded-lg border border-[#0B291E]/15 bg-white px-4 py-2 text-xs font-medium text-[#0B291E] hover:bg-[#F7F5F0]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    form="hamperForm"
                                    disabled={form.processing}
                                    className="rounded-lg bg-[#0B291E] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E] disabled:opacity-50"
                                >
                                    {form.processing ? 'Menyimpan...' : 'Simpan Paket'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
