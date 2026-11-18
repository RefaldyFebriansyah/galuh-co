import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Image as ImageIcon,
    Plus,
    Save,
    Trash2,
    UploadCloud,
    X,
    AlertCircle,
    Info,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState, useRef } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import type { Product, ProductCategory } from '@/types';

interface ProductFormProps {
    product: Product | null;
    categories: ProductCategory[];
}

export default function ProductForm({
    product,
    categories,
}: ProductFormProps) {
    const isEdit = Boolean(product);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: product?.name || '',
        category: product?.category || 'Paket Lebaran',
        price_from: product?.price_from || '',
        short_description: product?.short_description || '',
        contents: product?.contents || [
            'Nastar Nanas Madu Wijsman 350g',
            'Kastengel Keju Edam Tua 350g',
        ],
        sort_order: product?.sort_order ?? 1,
        is_active: product?.is_active ?? true,
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.image || null,
    );
    const [newItemText, setNewItemText] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleAddItem = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newItemText.trim()) return;
        setData('contents', [...data.contents, newItemText.trim()]);
        setNewItemText('');
    };

    const handleRemoveItem = (index: number) => {
        setData(
            'contents',
            data.contents.filter((_, i) => i !== index),
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit && product) {
            post(`/admin/products/${product.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post('/admin/products', {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            title={isEdit ? `Edit: ${product?.name}` : 'Tambah Hampers Baru'}
            headerAction={
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D5CEC2] bg-white px-3 py-1.5 text-xs font-medium text-[#4D4841] hover:border-[#0E2A1E] hover:text-[#0E2A1E] transition-colors"
                >
                    <ArrowLeft className="size-3.5" />
                    <span>Kembali</span>
                </Link>
            }
        >
            <form onSubmit={submit} className="mx-auto max-w-5xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Product Details (7 Cols) */}
                    <div className="space-y-5 lg:col-span-7">
                        {/* Section 1: Basic Information */}
                        <div className="rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs space-y-4">
                            <div className="border-b border-[#F0EBE1] pb-3">
                                <h3 className="text-xs font-bold text-[#1C1A18] uppercase tracking-wider">
                                    Informasi Dasar Produk
                                </h3>
                                <p className="text-[11px] text-[#7A746B]">
                                    Nama, kategori, dan penetapan harga hampers
                                </p>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-[#2C2925] mb-1">
                                    Nama Hampers <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Seri Eksekutif Kantor"
                                    className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1C1A18] placeholder:text-[#8C8479] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="size-3" />
                                        <span>{errors.name}</span>
                                    </p>
                                )}
                            </div>

                            {/* Category & Price Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-semibold text-[#2C2925] mb-1">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value as ProductCategory)
                                        }
                                        className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#1C1A18] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#2C2925] mb-1">
                                        Harga Mulai Dari (IDR) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#7A746B]">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={data.price_from}
                                            onChange={(e) => setData('price_from', e.target.value)}
                                            placeholder="550000"
                                            className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] py-2 pr-3.5 pl-9 text-xs font-mono font-medium text-[#1C1A18] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                    {errors.price_from && (
                                        <p className="mt-1 text-xs text-red-600">{errors.price_from}</p>
                                    )}
                                </div>
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-xs font-semibold text-[#2C2925] mb-1">
                                    Deskripsi Singkat <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                    rows={2}
                                    placeholder="Contoh: Hardbox beludru emerald dengan tumbler premium, notebook kulit, dan madu murni."
                                    className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] p-3 text-xs text-[#1C1A18] placeholder:text-[#8C8479] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                />
                                {errors.short_description && (
                                    <p className="mt-1 text-xs text-red-600">{errors.short_description}</p>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Items List Builder */}
                        <div className="rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs space-y-4">
                            <div className="border-b border-[#F0EBE1] pb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-bold text-[#1C1A18] uppercase tracking-wider">
                                        Isi Paket Hampers
                                    </h3>
                                    <p className="text-[11px] text-[#7A746B]">
                                        Daftar butir isi yang ditampilkan pada kartu katalog
                                    </p>
                                </div>
                                <span className="text-xs font-mono text-[#8C8479]">
                                    {data.contents.length} Butir
                                </span>
                            </div>

                            {/* Existing Items List */}
                            <div className="space-y-2">
                                {data.contents.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-2 rounded-lg border border-[#EAE5DC] bg-[#FAF8F5] px-3 py-2 text-xs"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#E0D8CB] text-[9px] font-bold text-[#4D4841]">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium text-[#1C1A18] truncate">
                                                {item}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-stone-400 hover:text-red-600 transition-colors"
                                            title="Hapus butir ini"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Item Field */}
                            <div className="flex gap-2 pt-1">
                                <input
                                    type="text"
                                    value={newItemText}
                                    onChange={(e) => setNewItemText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddItem();
                                        }
                                    }}
                                    placeholder="Ketik butir isi lalu tekan Enter atau klik Tambah..."
                                    className="flex-1 rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1A18] placeholder:text-[#8C8479] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddItem()}
                                    className="inline-flex items-center gap-1 rounded-lg border border-[#0E2A1E] bg-[#0E2A1E] px-3 py-2 text-xs font-medium text-white hover:bg-[#153e2d] transition-colors"
                                >
                                    <Plus className="size-3.5" />
                                    <span>Tambah</span>
                                </button>
                            </div>
                            {errors.contents && (
                                <p className="text-xs text-red-600">{errors.contents}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Photo Upload & Publishing Settings (5 Cols) */}
                    <div className="space-y-5 lg:col-span-5">
                        {/* Section 3: Photo Upload Frame */}
                        <div className="rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs space-y-4">
                            <div className="border-b border-[#F0EBE1] pb-3">
                                <h3 className="text-xs font-bold text-[#1C1A18] uppercase tracking-wider">
                                    Foto Katalog Hampers
                                </h3>
                                <p className="text-[11px] text-[#7A746B]">
                                    Format JPG/PNG/WebP resolusi tajam
                                </p>
                            </div>

                            {/* Preview Frame */}
                            <div className="relative aspect-[4/3.2] overflow-hidden rounded-lg border border-[#E0D8CB] bg-[#FAF8F5] flex items-center justify-center">
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview Foto Hampers"
                                            className="size-full object-cover object-center"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1C1A18] shadow-md hover:bg-white"
                                            >
                                                Ganti Foto
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon className="size-8 mx-auto text-[#A8A196] stroke-1" />
                                        <p className="mt-2 text-xs font-medium text-[#4D4841]">
                                            Belum ada foto dipilih
                                        </p>
                                        <p className="text-[10px] text-[#8C8479]">
                                            Disarankan rasio 4:3 atau 1:1
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Hidden File Input & Upload Trigger */}
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#D5CEC2] bg-white py-2 px-3 text-xs font-medium text-[#2C2925] hover:border-[#0E2A1E] hover:bg-stone-50 transition-colors shadow-2xs"
                                >
                                    <UploadCloud className="size-3.5 text-[#0E2A1E]" />
                                    <span>{imagePreview ? 'Pilih Foto Pengganti' : 'Pilih File Foto dari Komputer'}</span>
                                </button>
                                {errors.image && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="size-3" />
                                        <span>{errors.image}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Section 4: Publishing Settings & Order */}
                        <div className="rounded-xl border border-[#E7E2D8] bg-white p-5 shadow-2xs space-y-4">
                            <div className="border-b border-[#F0EBE1] pb-3">
                                <h3 className="text-xs font-bold text-[#1C1A18] uppercase tracking-wider">
                                    Pengaturan Tampilan
                                </h3>
                                <p className="text-[11px] text-[#7A746B]">
                                    Status tayang dan posisi urutan di landing page
                                </p>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-xs font-semibold text-[#2C2925] mb-1">
                                    Urutan Tampil (Sort Order)
                                </label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData('sort_order', parseInt(e.target.value) || 0)
                                    }
                                    className="w-full rounded-lg border border-[#D5CEC2] bg-[#FAF8F5] px-3 py-2 text-xs font-mono font-medium text-[#1C1A18] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                />
                                <p className="mt-1 text-[11px] text-[#8C8479]">
                                    Semakin kecil angkanya, semakin awal tampil di halaman.
                                </p>
                            </div>

                            {/* Active Switch */}
                            <div className="flex items-center justify-between rounded-lg border border-[#EAE5DC] bg-[#FAF8F5] p-3">
                                <div>
                                    <span className="block text-xs font-semibold text-[#1C1A18]">
                                        Status Publikasi
                                    </span>
                                    <span className="text-[11px] text-[#7A746B]">
                                        {data.is_active
                                            ? 'Produk aktif & tayang di web'
                                            : 'Produk disembunyikan (draft)'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${data.is_active ? 'bg-[#0E2A1E]' : 'bg-stone-300'
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${data.is_active ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Save Action Card */}
                        <div className="rounded-xl border border-[#E7E2D8] bg-white p-4 shadow-2xs space-y-2.5">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E2A1E] py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#153e2d] transition-colors disabled:opacity-50"
                            >
                                <Save className="size-3.5" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Produk Hampers'}</span>
                            </button>

                            <Link
                                href="/admin/products"
                                className="w-full inline-flex items-center justify-center rounded-lg border border-[#D5CEC2] py-2 px-4 text-xs font-medium text-[#4D4841] hover:bg-stone-50 transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
