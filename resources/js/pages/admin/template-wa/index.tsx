import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Bookmark,
    Check,
    Copy,
    Edit3,
    Filter,
    MessageSquare,
    Plus,
    Search,
    Trash2,
    Variable,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface WaTemplateItem {
    id: number;
    title: string;
    category:
        | 'sambutan_awal'
        | 'kirim_pricelist'
        | 'desain_kartu'
        | 'info_pengiriman'
        | 'follow_up';
    content: string;
    variables?: string[] | null;
    is_active: boolean;
    sort_order: number;
}

interface TemplateWaProps {
    templates: WaTemplateItem[];
    categories: Record<string, string>;
    filters: {
        category?: string;
        search?: string;
    };
}

export default function AdminTemplateWaIndex({
    templates,
    categories,
    filters,
}: TemplateWaProps) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || '',
    );
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Modal Add / Edit
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] =
        useState<WaTemplateItem | null>(null);
    const form = useForm({
        title: '',
        category: 'sambutan_awal' as WaTemplateItem['category'],
        content: '',
        variables: ['{nama_klien}', '{nama_paket}'],
        is_active: true,
    });

    const handleCopy = (tmpl: WaTemplateItem) => {
        navigator.clipboard.writeText(tmpl.content);
        setCopiedId(tmpl.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const openAddModal = () => {
        setEditingTemplate(null);
        form.setData({
            title: '',
            category: 'sambutan_awal',
            content:
                'Halo Bapak/Ibu {nama_klien},\n\nTerima kasih telah menghubungi Galuh & Co.',
            variables: ['{nama_klien}', '{nama_paket}'],
            is_active: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (tmpl: WaTemplateItem) => {
        setEditingTemplate(tmpl);
        form.setData({
            title: tmpl.title,
            category: tmpl.category,
            content: tmpl.content,
            variables: Array.isArray(tmpl.variables) ? tmpl.variables : [],
            is_active: tmpl.is_active,
        });
        setModalOpen(true);
    };

    const submitTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTemplate) {
            form.post(`/admin/template-wa/${editingTemplate.id}`, {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            form.post('/admin/template-wa', {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (tmpl: WaTemplateItem) => {
        if (confirm(`Hapus template "${tmpl.title}"?`)) {
            router.delete(`/admin/template-wa/${tmpl.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleFilterApply = (catKey?: string) => {
        router.get(
            '/admin/template-wa',
            {
                category:
                    catKey !== undefined
                        ? catKey || undefined
                        : selectedCategory || undefined,
                search: searchVal || undefined,
            },
            { preserveState: true },
        );
    };

    const insertVariable = (variableName: string) => {
        form.setData('content', form.data.content + ` ${variableName}`);
    };

    const availableVariableBadges = [
        '{nama_klien}',
        '{nama_perusahaan}',
        '{nama_paket}',
        '{jumlah_box}',
        '{estimasi_selesai}',
        '{nomor_resi}',
    ];

    return (
        <AdminLayout
            title="Pustaka Template Balasan WhatsApp"
            subtitle="Skrip Balasan Standar Atelier dengan Variabel Dinamis & 1-Klik Salin"
            headerAction={
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2B3B5C]"
                >
                    <Plus className="size-3.5 text-[#A88B54]" />
                    <span>Tambah Template</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Category Filter Tabs */}
                <div className="flex scrollbar-none overflow-x-auto rounded-2xl border-b border-[#16233B]/10 bg-white px-4 shadow-2xs sm:px-6">
                    <nav className="flex min-w-max space-x-6">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCategory('');
                                handleFilterApply('');
                            }}
                            className={`relative py-4 text-xs font-semibold transition-colors ${
                                !filters.category
                                    ? 'text-[#16233B]'
                                    : 'text-[#16233B]/50 hover:text-[#16233B]'
                            }`}
                        >
                            <span>Semua Kategori</span>
                            {!filters.category && (
                                <motion.div
                                    layoutId="template-tab-active"
                                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#A88B54]"
                                />
                            )}
                        </button>

                        {Object.entries(categories).map(([k, label]) => {
                            const isCurrent = (filters.category || '') === k;
                            return (
                                <button
                                    key={k}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(k);
                                        handleFilterApply(k);
                                    }}
                                    className={`relative py-4 text-xs font-semibold transition-colors ${
                                        isCurrent
                                            ? 'text-[#16233B]'
                                            : 'text-[#16233B]/50 hover:text-[#16233B]'
                                    }`}
                                >
                                    <span>{label}</span>
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="template-tab-active"
                                            className="absolute inset-x-0 bottom-0 h-0.5 bg-[#A88B54]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* 2. Search Bar */}
                <div className="flex items-center gap-3 rounded-2xl border border-[#16233B]/10 bg-white p-4 shadow-2xs">
                    <div className="relative min-w-[260px] flex-1">
                        <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#16233B]/40" />
                        <input
                            type="text"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleFilterApply()
                            }
                            placeholder="Cari kata dalam template balasan..."
                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF6EE] py-1.5 pr-3 pl-8 text-xs text-[#16233B] placeholder-[#16233B]/40 focus:outline-hidden"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => handleFilterApply()}
                        className="rounded-lg bg-[#16233B]/10 px-3.5 py-1.5 text-xs font-semibold text-[#16233B] hover:bg-[#16233B] hover:text-white"
                    >
                        Cari
                    </button>
                </div>

                {/* 3. Templates Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {templates.length === 0 ? (
                        <div className="col-span-full rounded-2xl border border-[#16233B]/10 bg-white py-16 text-center text-xs text-[#16233B]/50">
                            Tidak ada template balasan WhatsApp yang sesuai.
                        </div>
                    ) : (
                        templates.map((tmpl) => (
                            <div
                                key={tmpl.id}
                                className="group relative flex flex-col justify-between rounded-2xl border border-[#16233B]/10 bg-white p-5 shadow-2xs transition-all hover:border-[#A88B54]/40"
                            >
                                <div>
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2 border-b border-[#16233B]/10 pb-3">
                                        <div>
                                            <h4 className="text-sm font-semibold text-[#16233B]">
                                                {tmpl.title}
                                            </h4>
                                            <span className="font-mono text-[9px] font-bold text-[#A88B54] uppercase">
                                                {categories[tmpl.category] ||
                                                    tmpl.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(tmpl)
                                                }
                                                className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                                title="Edit"
                                            >
                                                <Edit3 className="size-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(tmpl)
                                                }
                                                className="rounded p-1 text-rose-600 hover:bg-rose-50"
                                                title="Hapus"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Preformatted */}
                                    <pre className="mt-3 line-clamp-6 rounded-xl border border-[#16233B]/5 bg-[#FAF8F5] p-3 font-sans text-xs leading-relaxed whitespace-pre-wrap text-[#16233B]/80">
                                        {tmpl.content}
                                    </pre>
                                </div>

                                {/* Footer & 1-Click Copy */}
                                <div className="mt-4 flex items-center justify-between border-t border-[#16233B]/10 pt-3">
                                    <span className="font-mono text-[9.5px] text-[#16233B]/40">
                                        Variabel otomatis
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(tmpl)}
                                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            copiedId === tmpl.id
                                                ? 'bg-emerald-600 text-white'
                                                : 'border border-[#16233B]/15 bg-white text-[#16233B] shadow-2xs hover:border-[#A88B54] hover:text-[#A88B54]'
                                        }`}
                                    >
                                        {copiedId === tmpl.id ? (
                                            <>
                                                <Check className="size-3" />
                                                <span>Tersalin!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-3 text-[#A88B54]" />
                                                <span>Salin Skrip</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Add / Edit Template */}
            <AnimatePresence>
                {modalOpen && (
                    <div
                        className="backdrop-blur-2xs fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#16233B]/10 pb-3">
                                <h3 className="text-base font-semibold text-[#16233B]">
                                    {editingTemplate
                                        ? 'Edit Template Balasan'
                                        : 'Tambah Template Balasan WhatsApp'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form
                                onSubmit={submitTemplate}
                                className="mt-4 space-y-4 text-xs"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Judul Template
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.data.title}
                                            onChange={(e) =>
                                                form.setData(
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Sambutan Hangat Lead Baru"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Kategori Alur
                                        </label>
                                        <select
                                            value={form.data.category}
                                            onChange={(e) =>
                                                form.setData(
                                                    'category',
                                                    e.target
                                                        .value as WaTemplateItem['category'],
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        >
                                            {Object.entries(categories).map(
                                                ([k, label]) => (
                                                    <option key={k} value={k}>
                                                        {label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {/* Dynamic Variable Chips */}
                                <div className="space-y-1.5">
                                    <label className="font-semibold text-[#16233B]">
                                        Klik untuk Sisipkan Variabel Dinamis:
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {availableVariableBadges.map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() =>
                                                    insertVariable(v)
                                                }
                                                className="rounded-md border border-[#A88B54]/40 bg-[#A88B54]/10 px-2 py-0.5 font-mono text-[10.5px] text-[#8C6D32] hover:bg-[#A88B54] hover:text-white"
                                            >
                                                + {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Teks Isi Pesan WhatsApp
                                    </label>
                                    <textarea
                                        rows={8}
                                        required
                                        value={form.data.content}
                                        onChange={(e) =>
                                            form.setData(
                                                'content',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tuliskan skrip balasan WhatsApp..."
                                        className="w-full rounded-xl border border-[#16233B]/15 bg-[#FAF8F5] p-3 text-xs leading-relaxed focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#16233B]/10 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="rounded-lg border px-3 py-1.5 text-xs text-[#16233B]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-lg bg-[#16233B] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2B3B5C]"
                                    >
                                        Simpan Template
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
