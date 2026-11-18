import { Head, Link, router } from '@inertiajs/react';
import {
    Edit3,
    ExternalLink,
    Filter,
    MoreHorizontal,
    MoreVertical,
    Package,
    Plus,
    Search,
    Trash2,
    X,
    CheckCircle2,
    EyeOff,
    Eye,
    Layers,
    ArrowUpDown,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import type { Product, ProductCategory } from '@/types';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface ProductsIndexProps {
    products: PaginatedProducts;
    filters: {
        search: string;
        category: string;
        status: string;
    };
    categories: ProductCategory[];
}

export default function ProductsIndex({
    products,
    filters,
    categories,
}: ProductsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || 'all',
    );
    const [selectedStatus, setSelectedStatus] = useState(
        filters.status || 'all',
    );
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const [deleteProductName, setDeleteProductName] = useState('');

    // Close any open 3-dots dropdown when clicking outside or pressing Escape
    useEffect(() => {
        const handleOutsideClick = () => {
            setOpenDropdownId(null);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpenDropdownId(null);
                setDeleteModalId(null);
            }
        };

        window.addEventListener('click', handleOutsideClick);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleFilterChange = (
        newSearch: string,
        newCat: string,
        newStat: string,
    ) => {
        router.get(
            '/admin/products',
            {
                search: newSearch || undefined,
                category: newCat !== 'all' ? newCat : undefined,
                status: newStat !== 'all' ? newStat : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange(searchTerm, selectedCategory, selectedStatus);
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        handleFilterChange(searchTerm, cat, selectedStatus);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        handleFilterChange(searchTerm, selectedCategory, status);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedStatus('all');
        handleFilterChange('', 'all', 'all');
    };

    const toggleProductActive = (product: Product) => {
        setOpenDropdownId(null);
        router.post(
            `/admin/products/${product.id}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const confirmDelete = (product: Product) => {
        setOpenDropdownId(null);
        setDeleteModalId(product.id);
        setDeleteProductName(product.name);
    };

    const executeDelete = () => {
        if (!deleteModalId) return;
        router.delete(`/admin/products/${deleteModalId}`, {
            onFinish: () => {
                setDeleteModalId(null);
                setDeleteProductName('');
            },
        });
    };

    const isFiltered =
        Boolean(searchTerm) ||
        selectedCategory !== 'all' ||
        selectedStatus !== 'all';

    const activeCount = products.data.filter((p) => p.is_active).length;
    const draftCount = products.data.filter((p) => !p.is_active).length;

    // Category badge styler
    const getCategoryBadgeClass = (category: string) => {
        switch (category) {
            case 'Paket Lebaran':
            case 'Ramadan & Eid':
                return 'bg-[#EBF3ED] text-[#1E5631] border-[#C8DFCF]';
            case 'Paket Kantor':
                return 'bg-[#F0F3F6] text-[#2C4A6F] border-[#D1DBE5]';
            case 'Natal & Tahun Baru':
                return 'bg-[#FAF3E6] text-[#8C6010] border-[#EADAB8]';
            case 'Wedding':
                return 'bg-[#F9F1F0] text-[#7E3D35] border-[#E8CECB]';
            default:
                return 'bg-[#F4F2EE] text-[#555048] border-[#DFDBD3]';
        }
    };

    return (
        <AdminLayout
            title="Katalog Hampers & Gift"
            subtitle="Kelola seluruh produk hampers, foto kemasan, harga mulai, dan status ketersediaan di landing page."
        >
            <Head title="Katalog Hampers — Admin Galuh & Co." />

            <div className="space-y-6 max-w-6xl pb-20">
                {/* 1. TOP HEADER & PRIMARY ACTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE5DC] pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-widest text-[#9E7E45] uppercase">
                                INVENTARIS PRODUK
                            </span>
                            <span className="text-[11px] text-[#8C877E]">• Total {products.total} Koleksi</span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-[#1A1815] mt-1">
                            Katalog Hampers Galuh &amp; Co.
                        </h2>
                        <p className="text-xs text-[#6E6962] mt-0.5">
                            Produk dengan status Aktif akan otomatis muncul di bagian Koleksi pada landing page pengunjung.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center gap-2 rounded-full bg-[#0E2A1E] px-6 py-2.5 text-xs font-bold tracking-wider text-white shadow-md transition-all hover:bg-[#163d2c] hover:shadow-lg cursor-pointer"
                        >
                            <Plus className="size-4 text-[#C5A880]" />
                            <span>Tambah Hampers Baru</span>
                        </Link>
                    </div>
                </div>

                {/* 2. ADMIN QUICK STATS BAR */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-[#E0D8CB] bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider block">
                            Total Koleksi
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-serif text-2xl font-bold text-[#1A1815]">
                                {products.total}
                            </span>
                            <span className="text-[11px] text-[#6E6962]">Hampers</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E0D8CB] bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-600" />
                            Tayang di Website
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-serif text-2xl font-bold text-emerald-800">
                                {activeCount}
                            </span>
                            <span className="text-[11px] text-[#6E6962]">Aktif</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E0D8CB] bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider block flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-stone-400" />
                            Draft / Disimpan
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-serif text-2xl font-bold text-[#5C564C]">
                                {draftCount}
                            </span>
                            <span className="text-[11px] text-[#6E6962]">Draft</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E0D8CB] bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider block">
                            Kategori Tersedia
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-serif text-2xl font-bold text-[#1A1815]">
                                {categories.length}
                            </span>
                            <span className="text-[11px] text-[#6E6962]">Kategori</span>
                        </div>
                    </div>
                </div>

                {/* 3. TOOLBAR: SEARCH & SELECT FILTER CONTROLS */}
                <div className="rounded-2xl border border-[#E0D8CB] bg-white p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search Field */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8C877E]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari nama hampers, isian, atau harga..."
                            className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2 pl-10 pr-9 text-xs text-[#1A1815] placeholder:text-[#8C877E] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    handleFilterChange('', selectedCategory, selectedStatus);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C877E] hover:text-[#1A1815]"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </form>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="appearance-none rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2 pl-3.5 pr-8 text-xs font-semibold text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden cursor-pointer"
                            >
                                <option value="all">Semua Kategori ({categories.length})</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <Filter className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-[#8C877E]" />
                        </div>

                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="appearance-none rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2 pl-3.5 pr-8 text-xs font-semibold text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden cursor-pointer"
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Hanya Aktif</option>
                                <option value="inactive">Hanya Draft</option>
                            </select>
                            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-[#8C877E]" />
                        </div>

                        {isFiltered && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E0D8CB] bg-white px-3 py-2 text-xs font-bold text-[#8C877E] hover:text-[#1A1815] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                                title="Reset Filter"
                            >
                                <RotateCcw className="size-3" />
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. PROFESSIONAL DATA TABLE */}
                <div className="rounded-3xl border border-[#E0D8CB] bg-white shadow-2xs overflow-hidden">
                    {products.data.length === 0 ? (
                        <div className="py-16 px-4 text-center space-y-3">
                            <div className="size-12 rounded-full bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-center mx-auto text-[#8C877E]">
                                <Package className="size-6 text-[#C5A880]" />
                            </div>
                            <h3 className="font-serif text-base font-bold text-[#1A1815]">
                                Tidak Ada Hampers Ditemukan
                            </h3>
                            <p className="text-xs text-[#6E6962] max-w-sm mx-auto">
                                {isFiltered
                                    ? 'Coba ubah kata kunci pencarian atau bersihkan filter kategori untuk melihat koleksi lainnya.'
                                    : 'Belum ada produk hampers yang ditambahkan ke katalog.'}
                            </p>
                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D5CEC2] px-4 py-2 text-xs font-bold text-[#0E2A1E] hover:bg-[#FAF8F5]"
                                >
                                    <RotateCcw className="size-3.5" />
                                    <span>Bersihkan Filter</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead className="bg-[#FAF8F5] border-b border-[#EAE5DC] text-[11px] font-bold uppercase tracking-wider text-[#6E6962]">
                                        <tr>
                                            <th className="py-3.5 px-5 w-16">Foto</th>
                                            <th className="py-3.5 px-5">Produk &amp; Isian</th>
                                            <th className="py-3.5 px-5">Kategori</th>
                                            <th className="py-3.5 px-5">Harga Mulai</th>
                                            <th className="py-3.5 px-4 text-center">Urutan</th>
                                            <th className="py-3.5 px-5 text-center">Status</th>
                                            <th className="py-3.5 px-5 text-right w-20">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EAE5DC]">
                                        {products.data.map((product) => {
                                            const isMenuOpen = openDropdownId === product.id;

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="hover:bg-[#FAF8F5]/80 transition-colors group"
                                                >
                                                    {/* Thumbnail */}
                                                    <td className="py-3 px-5 align-middle">
                                                        <div className="size-12 rounded-xl border border-[#E0D8CB] bg-[#FAF8F5] overflow-hidden shrink-0 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                                                            {product.image ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="size-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <Package className="size-5 text-[#C5A880]" />
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Product Name & Details */}
                                                    <td className="py-3 px-5 align-middle">
                                                        <div className="space-y-0.5 max-w-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    href={`/admin/products/${product.id}/edit`}
                                                                    className="font-bold text-sm text-[#1A1815] hover:text-[#0E2A1E] hover:underline"
                                                                >
                                                                    {product.name}
                                                                </Link>
                                                            </div>
                                                            <p className="text-[11px] text-[#6E6962] line-clamp-1">
                                                                {product.short_description || 'Kemasan hardbox eksklusif Galuh & Co.'}
                                                            </p>
                                                            {Array.isArray(product.contents) && product.contents.length > 0 && (
                                                                <span className="inline-block text-[10px] text-[#8C877E] font-medium">
                                                                    ✦ {product.contents.length} item isian hampers
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Category */}
                                                    <td className="py-3 px-5 align-middle">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getCategoryBadgeClass(
                                                                product.category,
                                                            )}`}
                                                        >
                                                            {product.category}
                                                        </span>
                                                    </td>

                                                    {/* Price */}
                                                    <td className="py-3 px-5 align-middle">
                                                        <span className="font-mono font-bold text-xs text-[#0E2A1E]">
                                                            {product.formatted_price}
                                                        </span>
                                                    </td>

                                                    {/* Sort Order */}
                                                    <td className="py-3 px-4 text-center align-middle">
                                                        <span className="font-mono text-[11px] font-semibold text-[#8C877E] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EAE5DC]">
                                                            #{product.sort_order}
                                                        </span>
                                                    </td>

                                                    {/* Status Badge & Toggle */}
                                                    <td className="py-3 px-5 text-center align-middle">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleProductActive(product)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${product.is_active
                                                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                                                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                                                                }`}
                                                            title="Klik untuk mengubah status"
                                                        >
                                                            <span
                                                                className={`size-1.5 rounded-full ${product.is_active
                                                                    ? 'bg-emerald-600 animate-pulse'
                                                                    : 'bg-stone-400'
                                                                    }`}
                                                            />
                                                            <span>{product.is_active ? 'Aktif' : 'Draft'}</span>
                                                        </button>
                                                    </td>

                                                    {/* 3-DOTS ACTION MENU (TITIK 3) */}
                                                    <td className="py-3 px-5 text-right align-middle relative">
                                                        <div className="relative inline-block text-left">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenDropdownId(
                                                                        isMenuOpen ? null : product.id,
                                                                    );
                                                                }}
                                                                className={`p-2 rounded-xl text-[#6E6962] hover:text-[#0E2A1E] hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer ${isMenuOpen ? 'bg-[#EAE5DC] text-[#0E2A1E]' : ''
                                                                    }`}
                                                                title="Menu Tindakan"
                                                                aria-expanded={isMenuOpen}
                                                            >
                                                                <MoreVertical className="size-4" />
                                                            </button>

                                                            {/* Dropdown Popover */}
                                                            {isMenuOpen && (
                                                                <div
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="absolute right-0 mt-1 w-44 rounded-2xl border border-[#D5CEC2] bg-white p-1.5 shadow-lg z-30 animate-in fade-in zoom-in-95 duration-100"
                                                                >
                                                                    <Link
                                                                        href={`/admin/products/${product.id}/edit`}
                                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1815] hover:bg-[#FAF8F5] hover:text-[#0E2A1E] transition-colors"
                                                                        onClick={() => setOpenDropdownId(null)}
                                                                    >
                                                                        <Edit3 className="size-3.5 text-[#C5A880]" />
                                                                        <span>Edit Hampers</span>
                                                                    </Link>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleProductActive(product)}
                                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1815] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                                                                    >
                                                                        {product.is_active ? (
                                                                            <>
                                                                                <EyeOff className="size-3.5 text-stone-500" />
                                                                                <span>Jadikan Draft</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Eye className="size-3.5 text-emerald-600" />
                                                                                <span>Aktifkan Produk</span>
                                                                            </>
                                                                        )}
                                                                    </button>

                                                                    <a
                                                                        href="/#koleksi"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1815] hover:bg-[#FAF8F5] transition-colors"
                                                                        onClick={() => setOpenDropdownId(null)}
                                                                    >
                                                                        <ExternalLink className="size-3.5 text-[#8C877E]" />
                                                                        <span>Lihat di Website</span>
                                                                    </a>

                                                                    <div className="my-1 border-t border-[#EAE5DC]" />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => confirmDelete(product)}
                                                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                                    >
                                                                        <Trash2 className="size-3.5" />
                                                                        <span>Hapus Hampers</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Responsive List View */}
                            <div className="block md:hidden divide-y divide-[#EAE5DC]">
                                {products.data.map((product) => {
                                    const isMenuOpen = openDropdownId === product.id;

                                    return (
                                        <div
                                            key={product.id}
                                            className="p-4 flex items-center justify-between gap-3 text-xs relative"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="size-12 rounded-xl border border-[#E0D8CB] bg-[#FAF8F5] overflow-hidden shrink-0 flex items-center justify-center">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="size-5 text-[#C5A880]" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 space-y-0.5">
                                                    <p className="font-bold text-[#1A1815] truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="font-mono font-bold text-[#0E2A1E] text-[11px]">
                                                        {product.formatted_price}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-0.5">
                                                        <span
                                                            className={`inline-block px-2 py-0.2 rounded-full text-[9px] font-bold border ${getCategoryBadgeClass(
                                                                product.category,
                                                            )}`}
                                                        >
                                                            {product.category}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-[9px] font-bold ${product.is_active
                                                                ? 'text-emerald-700'
                                                                : 'text-stone-500'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`size-1 rounded-full ${product.is_active
                                                                    ? 'bg-emerald-600'
                                                                    : 'bg-stone-400'
                                                                    }`}
                                                            />
                                                            {product.is_active ? 'Aktif' : 'Draft'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile 3-Dots Action Button */}
                                            <div className="relative shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(
                                                            isMenuOpen ? null : product.id,
                                                        );
                                                    }}
                                                    className="p-2 rounded-xl text-[#6E6962] hover:bg-[#EAE5DC]/60 cursor-pointer"
                                                >
                                                    <MoreVertical className="size-4" />
                                                </button>

                                                {/* Mobile Dropdown Popover */}
                                                {isMenuOpen && (
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="absolute right-0 bottom-full mb-1 w-44 rounded-2xl border border-[#D5CEC2] bg-white p-1.5 shadow-xl z-30"
                                                    >
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1815] hover:bg-[#FAF8F5]"
                                                            onClick={() => setOpenDropdownId(null)}
                                                        >
                                                            <Edit3 className="size-3.5 text-[#C5A880]" />
                                                            <span>Edit Hampers</span>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => toggleProductActive(product)}
                                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1815] hover:bg-[#FAF8F5] cursor-pointer"
                                                        >
                                                            {product.is_active ? (
                                                                <>
                                                                    <EyeOff className="size-3.5 text-stone-500" />
                                                                    <span>Jadikan Draft</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Eye className="size-3.5 text-emerald-600" />
                                                                    <span>Aktifkan Produk</span>
                                                                </>
                                                            )}
                                                        </button>

                                                        <div className="my-1 border-t border-[#EAE5DC]" />

                                                        <button
                                                            type="button"
                                                            onClick={() => confirmDelete(product)}
                                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            <span>Hapus Hampers</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Pagination Bar */}
                    {products.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#EAE5DC] px-5 py-4 text-xs text-[#6E6962] gap-3">
                            <span>
                                Menampilkan halaman <strong>{products.current_page}</strong> dari total{' '}
                                <strong>{products.last_page}</strong> ({products.total} hampers)
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {products.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        disabled={!link.url}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${link.active
                                            ? 'bg-[#0E2A1E] text-white shadow-2xs'
                                            : link.url
                                                ? 'border border-[#E0D8CB] text-[#1A1815] hover:bg-[#FAF8F5]'
                                                : 'text-[#D5CEC2] pointer-events-none'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL CONFIRM DELETE HAMPER */}
                {deleteModalId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                        <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-[#D5CEC2] space-y-4">
                            <div className="size-11 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                                <Trash2 className="size-5" />
                            </div>

                            <div>
                                <h3 className="font-serif text-lg font-bold text-[#1A1815]">
                                    Hapus Produk Hampers?
                                </h3>
                                <p className="mt-1.5 text-xs text-[#6E6962] leading-relaxed">
                                    Apakah Anda yakin ingin menghapus hampers{' '}
                                    <strong className="text-[#1A1815]">&quot;{deleteProductName}&quot;</strong>?
                                    Data hampers dan fotonya akan dihapus dari katalog landing page dan tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalId(null)}
                                    className="rounded-full border border-[#D5CEC2] px-5 py-2.5 text-xs font-bold text-[#6E6962] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                                >
                                    Batalkan
                                </button>
                                <button
                                    type="button"
                                    onClick={executeDelete}
                                    className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    Hapus Permanen
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
