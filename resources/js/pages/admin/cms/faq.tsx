import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    HelpCircle,
    Plus,
    Edit3,
    Trash2,
    X,
    Save,
    CheckCircle2,
    RotateCcw,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
    is_active: boolean;
}

interface AdminCmsFaqProps {
    faqs: FaqItem[];
}

export default function AdminCmsFaq({ faqs }: AdminCmsFaqProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('pemesanan');
    const [isActive, setIsActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleOpenCreate = () => {
        setEditingFaq(null);
        setQuestion('');
        setAnswer('');
        setCategory('pemesanan');
        setIsActive(true);
        setModalOpen(true);
    };

    const handleOpenEdit = (faq: FaqItem) => {
        setEditingFaq(faq);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setCategory(faq.category);
        setIsActive(faq.is_active);
        setModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        if (editingFaq) {
            router.post(
                `/admin/cms/faq/${editingFaq.id}`,
                {
                    question,
                    answer,
                    category,
                    is_active: isActive,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setModalOpen(false);
                        setIsSaving(false);
                    },
                    onError: () => setIsSaving(false),
                },
            );
        } else {
            router.post(
                '/admin/cms/faq',
                {
                    question,
                    answer,
                    category,
                    is_active: isActive,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setModalOpen(false);
                        setIsSaving(false);
                    },
                    onError: () => setIsSaving(false),
                },
            );
        }
    };

    const handleDelete = (faq: FaqItem) => {
        if (confirm(`Yakin ingin menghapus pertanyaan: "${faq.question}"?`)) {
            router.delete(`/admin/cms/faq/${faq.id}`, { preserveScroll: true });
        }
    };

    const handleRestoreDefaults = () => {
        if (
            confirm(
                'Apakah Anda yakin ingin memulihkan 6 pertanyaan FAQ bawaan landing page? Semua pertanyaan FAQ standar Galuh & Co. akan dimuat ke database.',
            )
        ) {
            router.post(
                '/admin/cms/faq/restore-defaults',
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <AdminLayout
            title="FAQ (Tanya Jawab)"
            subtitle="Kelola seluruh daftar pertanyaan dan jawaban seputar pemesanan hampers di landing page."
        >
            <Head title="FAQ — CMS Admin Galuh & Co." />

            <div className="space-y-6">
                <div className="flex flex-col gap-3 rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                            <HelpCircle className="size-4" />
                            <span>MANAJEMEN PERTANYAAN UMUM</span>
                        </div>
                        <h2 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                            Daftar FAQ ({faqs.length} Pertanyaan)
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleRestoreDefaults}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#A88B54]/40 bg-[#FAF8F5] px-3.5 py-2 text-xs font-semibold text-[#16233B] shadow-2xs transition-all hover:bg-[#A88B54] hover:text-[#16233B] active:scale-95"
                            title="Muat atau pulihkan daftar pertanyaan & jawaban bawaan dari landing page"
                        >
                            <RotateCcw className="size-3.5 text-[#A88B54]" />
                            <span>Muat FAQ Bawaan Landing Page</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#16233B] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                        >
                            <Plus className="size-4" />
                            <span>Tambah Pertanyaan Baru</span>
                        </button>
                    </div>
                </div>

                {/* FAQ List Cards */}
                {faqs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#A88B54]/40 bg-white p-12 text-center shadow-xs">
                        <HelpCircle className="size-10 text-[#A88B54]" />
                        <h3 className="mt-3 font-serif text-base font-bold text-[#16233B]">
                            Belum Ada Pertanyaan FAQ Tersimpan di Database
                        </h3>
                        <p className="mt-1 max-w-md text-xs text-[#6E675D]">
                            Landing page saat ini menampilkan pertanyaan
                            cadangan. Klik tombol di bawah untuk memuat 6
                            pertanyaan bawaan ke database agar bisa diedit dan
                            dikelola langsung.
                        </p>
                        <button
                            type="button"
                            onClick={handleRestoreDefaults}
                            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#16233B] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Muat 6 Pertanyaan Bawaan Landing Page</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="flex flex-col justify-between gap-4 rounded-2xl border border-[#A88B54]/25 bg-white p-5 shadow-xs transition-all sm:flex-row sm:items-start"
                            >
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-[#F2EBDC] px-2.5 py-0.5 text-[9.5px] font-bold text-[#16233B] uppercase">
                                            {faq.category}
                                        </span>
                                        {!faq.is_active && (
                                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9.5px] font-bold text-rose-700">
                                                Nonaktif
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-serif text-sm font-bold text-[#16233B]">
                                        {faq.question}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#6E675D]">
                                        {faq.answer}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 pt-2 sm:pt-0">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(faq)}
                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#A88B54]/30 bg-[#FAF8F5] px-3 py-1.5 text-xs font-bold text-[#16233B] hover:bg-[#16233B] hover:text-white"
                                    >
                                        <Edit3 className="size-3.5" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(faq)}
                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white"
                                    >
                                        <Trash2 className="size-3.5" />
                                        <span>Hapus</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#A88B54]/30 bg-white shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-[#F2EBDC] bg-[#16233B] px-6 py-4 text-[#F2EBDC]">
                            <h3 className="font-serif text-base font-bold text-white">
                                {editingFaq
                                    ? 'Edit Pertanyaan FAQ'
                                    : 'Tambah Pertanyaan FAQ Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg p-1 text-[#F2EBDC]/60 hover:text-white"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSave}
                            className="space-y-4 p-6 text-xs"
                        >
                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Kategori:
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3 py-2 text-xs font-semibold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                >
                                    <option value="pemesanan">Pemesanan</option>
                                    <option value="custom_branding">
                                        Kustom Branding & Grafir
                                    </option>
                                    <option value="pengiriman">
                                        Pengiriman & Logistik
                                    </option>
                                    <option value="pembayaran">
                                        Pembayaran & Invoice
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Pertanyaan:
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                    placeholder="Contoh: Berapa minimal pemesanan untuk paket corporate?"
                                    className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Jawaban:
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Tuliskan jawaban lengkap dan jelas..."
                                    className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(e.target.checked)
                                    }
                                    className="size-4 accent-[#A88B54]"
                                />
                                <span className="text-xs font-bold text-[#16233B]">
                                    Publikasikan di Halaman Website
                                </span>
                            </label>

                            <div className="flex items-center justify-end gap-2 border-t border-[#F2EBDC] pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border border-[#A88B54]/30 px-4 py-2 font-bold text-[#6E675D]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-xl bg-[#16233B] px-5 py-2 font-bold text-white hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-50"
                                >
                                    {isSaving ? 'Menyimpan...' : 'Simpan FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
