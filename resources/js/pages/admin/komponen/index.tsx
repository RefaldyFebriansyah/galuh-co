import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    AlertCircle,
    Boxes,
    CheckCircle2,
    Edit3,
    Filter,
    Plus,
    Search,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface ComponentItem {
    id: number;
    name: string;
    sku?: string | null;
    category: 'kudapan' | 'minuman' | 'merchandise' | 'kemasan' | 'aksesoris';
    unit_cost: number;
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
    description?: string | null;
    is_active: boolean;
}

interface KomponenProps {
    components: ComponentItem[];
    categoryStats: {
        kudapan: number;
        minuman: number;
        merchandise: number;
        kemasan: number;
        aksesoris: number;
    };
    stockStats: {
        in_stock: number;
        low_stock: number;
        out_of_stock: number;
    };
    filters: {
        search?: string;
        category?: string;
        stock_status?: string;
    };
}

export default function AdminKomponenIndex({
    components,
    categoryStats,
    stockStats,
    filters,
}: KomponenProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ComponentItem | null>(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || '',
    );
    const [selectedStock, setSelectedStock] = useState(
        filters.stock_status || '',
    );

    const form = useForm({
        name: '',
        category: 'kudapan' as
            | 'kudapan'
            | 'minuman'
            | 'merchandise'
            | 'kemasan'
            | 'aksesoris',
        sku: '',
        unit_cost: 45000,
        stock_status: 'in_stock' as 'in_stock' | 'low_stock' | 'out_of_stock',
        description: '',
        is_active: true,
    });

    const openAddDrawer = () => {
        setEditingItem(null);
        form.setData({
            name: '',
            category: 'kudapan',
            sku: 'KOMP-',
            unit_cost: 50000,
            stock_status: 'in_stock',
            description: '',
            is_active: true,
        });
        setDrawerOpen(true);
    };

    const openEditDrawer = (item: ComponentItem) => {
        setEditingItem(item);
        form.setData({
            name: item.name,
            category: item.category,
            sku: item.sku || '',
            unit_cost: item.unit_cost,
            stock_status: item.stock_status,
            description: item.description || '',
            is_active: item.is_active,
        });
        setDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            form.post(`/admin/komponen/${editingItem.id}`, {
                onSuccess: () => setDrawerOpen(false),
            });
        } else {
            form.post('/admin/komponen', {
                onSuccess: () => setDrawerOpen(false),
            });
        }
    };

    const handleQuickStockChange = (
        item: ComponentItem,
        status: 'in_stock' | 'low_stock' | 'out_of_stock',
    ) => {
        router.post(
            `/admin/komponen/${item.id}/update-stock`,
            { stock_status: status },
            { preserveScroll: true },
        );
    };

    const handleDelete = (item: ComponentItem) => {
        if (confirm(`Hapus komponen "${item.name}" dari katalog isian?`)) {
            router.delete(`/admin/komponen/${item.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleFilterApply = () => {
        router.get(
            '/admin/komponen',
            {
                search: searchVal || undefined,
                category: selectedCategory || undefined,
                stock_status: selectedStock || undefined,
            },
            { preserveState: true },
        );
    };

    const formatIdr = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    const categoryLabels: Record<string, string> = {
        kudapan: 'Kudapan & Kue Kering',
        minuman: 'Kopi & Teh Artisan',
        merchandise: 'Tumbler & Merchandise',
        kemasan: 'Box & Anyaman Bambu',
        aksesoris: 'Pita, Kartu & Wax Seal',
    };

    return (
        <AdminLayout
            title="Katalog Isian & Kemasan"
            subtitle="Inventori Komponen Mix & Match untuk Konsultasi WhatsApp Cepat"
            headerAction={
                <button
                    type="button"
                    onClick={openAddDrawer}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#143E2E]"
                >
                    <Plus className="size-3.5 text-[#B89352]" />
                    <span>Tambah Komponen</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Quick Stock Status Strip */}
                <div className="grid grid-cols-1 divide-y divide-[#0B291E]/10 overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-emerald-800 uppercase">
                            TERSEDIA (READY)
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-emerald-800">
                                {stockStats.in_stock}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Komponen Siap Racik
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-amber-700 uppercase">
                            MENIPIS (LOW STOCK)
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-amber-700">
                                {stockStats.low_stock}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Perlu Restock Studio
                            </span>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5">
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-rose-800 uppercase">
                            HABIS (OUT OF STOCK)
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-rose-800">
                                {stockStats.out_of_stock}
                            </span>
                            <span className="text-xs text-[#0B291E]/50">
                                Jangan Rekomendasikan di WA
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Filter & Search Controls */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[#0B291E]/10 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                        <div className="relative min-w-[200px] flex-1">
                            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#0B291E]/40" />
                            <input
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleFilterApply()
                                }
                                placeholder="Cari nama komponen, SKU..."
                                className="w-full rounded-lg border border-[#0B291E]/15 bg-[#F7F5F0] py-1.5 pr-3 pl-8 text-xs text-[#0B291E] placeholder-[#0B291E]/40 focus:border-[#0B291E] focus:outline-hidden"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="rounded-lg border border-[#0B291E]/15 bg-white py-1.5 pr-7 pl-3 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="kudapan">
                                Kudapan ({categoryStats.kudapan})
                            </option>
                            <option value="minuman">
                                Minuman ({categoryStats.minuman})
                            </option>
                            <option value="merchandise">
                                Merchandise ({categoryStats.merchandise})
                            </option>
                            <option value="kemasan">
                                Kemasan ({categoryStats.kemasan})
                            </option>
                            <option value="aksesoris">
                                Aksesoris ({categoryStats.aksesoris})
                            </option>
                        </select>

                        <select
                            value={selectedStock}
                            onChange={(e) => setSelectedStock(e.target.value)}
                            className="rounded-lg border border-[#0B291E]/15 bg-white py-1.5 pr-7 pl-3 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                        >
                            <option value="">Semua Status Stok</option>
                            <option value="in_stock">Tersedia</option>
                            <option value="low_stock">Menipis</option>
                            <option value="out_of_stock">Habis</option>
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

                {/* 3. Components Table */}
                <div className="overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-[#0B291E]/10 bg-[#FAF8F5] font-mono text-[9.5px] font-bold tracking-wider text-[#B89352] uppercase">
                                <th className="px-4 py-3">
                                    Nama Komponen &amp; SKU
                                </th>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3">
                                    Estimasi Biaya Satuan
                                </th>
                                <th className="px-4 py-3">Ketersediaan Stok</th>
                                <th className="px-4 py-3">
                                    Deskripsi / Catatan Studio
                                </th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0B291E]/5 text-[#0B291E]">
                            {components.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-xs text-[#0B291E]/50"
                                    >
                                        Tidak ada komponen yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                components.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-[#F7F5F0]/50"
                                    >
                                        {/* Name & SKU */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[#0B291E]/10 bg-[#FAF8F5] text-[#0B291E]">
                                                    <Boxes className="size-3.5 text-[#B89352]" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[#0B291E]">
                                                        {item.name}
                                                    </h4>
                                                    {item.sku && (
                                                        <span className="font-mono text-[10px] text-[#0B291E]/50">
                                                            {item.sku}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-3.5">
                                            <span className="inline-block rounded-md border border-[#0B291E]/10 bg-[#F7F5F0] px-2 py-0.5 text-[10.5px] text-[#0B291E]">
                                                {categoryLabels[
                                                    item.category
                                                ] || item.category}
                                            </span>
                                        </td>

                                        {/* Unit Cost */}
                                        <td className="px-4 py-3.5 font-mono font-medium text-[#0B291E]">
                                            {formatIdr(item.unit_cost)}
                                        </td>

                                        {/* Stock Status Dropdown */}
                                        <td className="px-4 py-3.5">
                                            <select
                                                value={item.stock_status}
                                                onChange={(e) =>
                                                    handleQuickStockChange(
                                                        item,
                                                        e.target.value as
                                                            | 'in_stock'
                                                            | 'low_stock'
                                                            | 'out_of_stock',
                                                    )
                                                }
                                                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium focus:outline-hidden ${
                                                    item.stock_status ===
                                                    'in_stock'
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                                        : item.stock_status ===
                                                            'low_stock'
                                                          ? 'border-amber-200 bg-amber-50 text-amber-800'
                                                          : 'border-rose-200 bg-rose-50 text-rose-800'
                                                }`}
                                            >
                                                <option value="in_stock">
                                                    Tersedia (Ready)
                                                </option>
                                                <option value="low_stock">
                                                    Menipis (Low)
                                                </option>
                                                <option value="out_of_stock">
                                                    Habis (Kosong)
                                                </option>
                                            </select>
                                        </td>

                                        {/* Notes */}
                                        <td className="max-w-xs truncate px-4 py-3.5 text-[#0B291E]/60">
                                            {item.description || '-'}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditDrawer(item)
                                                    }
                                                    className="rounded-md border border-[#0B291E]/15 bg-white p-1 text-[#0B291E] shadow-2xs hover:border-[#B89352] hover:text-[#B89352]"
                                                    title="Edit Komponen"
                                                >
                                                    <Edit3 className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(item)
                                                    }
                                                    className="rounded-md p-1 text-rose-600 hover:bg-rose-50"
                                                    title="Hapus Komponen"
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

            {/* 4. Slide-Over Drawer for Component Create / Edit */}
            <AnimatePresence>
                {drawerOpen && (
                    <div
                        className="backdrop-blur-2xs fixed inset-0 z-50 flex justify-end bg-black/50"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 26,
                                stiffness: 220,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-full w-full max-w-md flex-col justify-between bg-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#0B291E]/10 bg-[#FAF8F5] px-6 py-4">
                                <div>
                                    <h3 className="text-base font-semibold text-[#0B291E]">
                                        {editingItem
                                            ? 'Edit Komponen Isian'
                                            : 'Tambah Komponen Baru'}
                                    </h3>
                                    <p className="text-xs text-[#0B291E]/60">
                                        Data isian hampers &amp; kemasan mix and
                                        match
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

                            <form
                                id="compForm"
                                onSubmit={handleSave}
                                className="flex-1 scrollbar-none space-y-4 overflow-y-auto p-6 text-xs"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#0B291E]">
                                        Nama Komponen
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        placeholder="Contoh: Nastar Wijsman Bulat 350g"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            Kategori
                                        </label>
                                        <select
                                            value={form.data.category}
                                            onChange={(e) =>
                                                form.setData(
                                                    'category',
                                                    e.target.value as
                                                        | 'kudapan'
                                                        | 'minuman'
                                                        | 'merchandise'
                                                        | 'kemasan'
                                                        | 'aksesoris',
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        >
                                            <option value="kudapan">
                                                Kudapan &amp; Kue Kering
                                            </option>
                                            <option value="minuman">
                                                Kopi &amp; Teh Artisan
                                            </option>
                                            <option value="merchandise">
                                                Tumbler &amp; Merchandise
                                            </option>
                                            <option value="kemasan">
                                                Kemasan &amp; Hardbox
                                            </option>
                                            <option value="aksesoris">
                                                Pita &amp; Wax Seal
                                            </option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            SKU / Kode
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.sku}
                                            onChange={(e) =>
                                                form.setData(
                                                    'sku',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="KOMP-NST-01"
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 font-mono text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            Biaya Satuan (IDR)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={form.data.unit_cost}
                                            onChange={(e) =>
                                                form.setData(
                                                    'unit_cost',
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 font-mono text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-[#0B291E]">
                                            Status Stok
                                        </label>
                                        <select
                                            value={form.data.stock_status}
                                            onChange={(e) =>
                                                form.setData(
                                                    'stock_status',
                                                    e.target.value as
                                                        | 'in_stock'
                                                        | 'low_stock'
                                                        | 'out_of_stock',
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                        >
                                            <option value="in_stock">
                                                Tersedia (In Stock)
                                            </option>
                                            <option value="low_stock">
                                                Menipis (Low Stock)
                                            </option>
                                            <option value="out_of_stock">
                                                Habis (Out of Stock)
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-[#0B291E]">
                                        Catatan Studio / Spesifikasi
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={form.data.description}
                                        onChange={(e) =>
                                            form.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Kemasan toples kaca bersegel emas, tahan 3 bulan pada suhu ruang..."
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs text-[#0B291E] focus:border-[#0B291E] focus:outline-hidden"
                                    />
                                </div>
                            </form>

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
                                    form="compForm"
                                    disabled={form.processing}
                                    className="rounded-lg bg-[#0B291E] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E] disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Komponen'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
