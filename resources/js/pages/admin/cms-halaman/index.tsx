import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    CheckCircle2,
    Edit3,
    HelpCircle,
    Image as ImageIcon,
    LayoutTemplate,
    MessageCircle,
    Palette,
    Plus,
    Save,
    SlidersHorizontal,
    Star,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface HeroSettings {
    active_edition: string;
    hero_eyebrow: string;
    hero_title: string;
    hero_subtitle: string;
    hero_tagline: string;
}

interface AboutPillar {
    num: string;
    title: string;
    description: string;
    image: string;
}

interface TestimonialItem {
    id: number;
    name: string;
    role: string;
    order_type?: string | null;
    city?: string | null;
    quote: string;
    rating: number;
    is_active: boolean;
    sort_order: number;
}

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: 'pemesanan' | 'custom_branding' | 'pengiriman' | 'pembayaran';
    is_active: boolean;
    sort_order: number;
}

interface CmsProps {
    heroSettings: HeroSettings;
    aboutPillars: AboutPillar[];
    testimonials: TestimonialItem[];
    faqs: FaqItem[];
}

export default function AdminCmsIndex({
    heroSettings,
    aboutPillars,
    testimonials,
    faqs,
}: CmsProps) {
    const [activeTab, setActiveTab] = useState<
        'hero' | 'pillars' | 'testimonials' | 'faqs'
    >('hero');

    // Tab 1: Hero Form
    const heroForm = useForm({
        active_edition: heroSettings.active_edition || '',
        hero_eyebrow: heroSettings.hero_eyebrow || '',
        hero_title: heroSettings.hero_title || '',
        hero_subtitle: heroSettings.hero_subtitle || '',
        hero_tagline: heroSettings.hero_tagline || '',
    });

    const submitHero = (e: React.FormEvent) => {
        e.preventDefault();
        heroForm.post('/admin/cms-halaman/hero');
    };

    // Tab 2: Pillars Form
    const pillarsForm = useForm({
        pillars: aboutPillars || [
            { num: '01', title: '', description: '', image: '' },
            { num: '02', title: '', description: '', image: '' },
            { num: '03', title: '', description: '', image: '' },
        ],
    });

    const updatePillarField = (
        idx: number,
        field: keyof AboutPillar,
        val: string,
    ) => {
        const next = [...pillarsForm.data.pillars];
        next[idx] = { ...next[idx], [field]: val };
        pillarsForm.setData('pillars', next);
    };

    const submitPillars = (e: React.FormEvent) => {
        e.preventDefault();
        pillarsForm.post('/admin/cms-halaman/pillars');
    };

    // Tab 3: Testimonial Modal State
    const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] =
        useState<TestimonialItem | null>(null);
    const testimonialForm = useForm({
        name: '',
        role: '',
        order_type: '',
        city: '',
        quote: '',
        rating: 5,
        is_active: true,
    });

    const openAddTestimonial = () => {
        setEditingTestimonial(null);
        testimonialForm.setData({
            name: '',
            role: '',
            order_type: '',
            city: '',
            quote: '',
            rating: 5,
            is_active: true,
        });
        setTestimonialModalOpen(true);
    };

    const openEditTestimonial = (item: TestimonialItem) => {
        setEditingTestimonial(item);
        testimonialForm.setData({
            name: item.name,
            role: item.role,
            order_type: item.order_type || '',
            city: item.city || '',
            quote: item.quote,
            rating: item.rating,
            is_active: item.is_active,
        });
        setTestimonialModalOpen(true);
    };

    const submitTestimonial = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTestimonial) {
            testimonialForm.post(
                `/admin/cms-halaman/testimonials/${editingTestimonial.id}`,
                {
                    onSuccess: () => setTestimonialModalOpen(false),
                },
            );
        } else {
            testimonialForm.post('/admin/cms-halaman/testimonials', {
                onSuccess: () => setTestimonialModalOpen(false),
            });
        }
    };

    const deleteTestimonial = (item: TestimonialItem) => {
        if (confirm(`Hapus ulasan dari "${item.name}"?`)) {
            router.delete(`/admin/cms-halaman/testimonials/${item.id}`, {
                preserveScroll: true,
            });
        }
    };

    // Tab 4: FAQ Modal State
    const [faqModalOpen, setFaqModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
    const faqForm = useForm({
        question: '',
        answer: '',
        category: 'pemesanan' as
            | 'pemesanan'
            | 'custom_branding'
            | 'pengiriman'
            | 'pembayaran',
        is_active: true,
    });

    const openAddFaq = () => {
        setEditingFaq(null);
        faqForm.setData({
            question: '',
            answer: '',
            category: 'pemesanan',
            is_active: true,
        });
        setFaqModalOpen(true);
    };

    const openEditFaq = (item: FaqItem) => {
        setEditingFaq(item);
        faqForm.setData({
            question: item.question,
            answer: item.answer,
            category: item.category,
            is_active: item.is_active,
        });
        setFaqModalOpen(true);
    };

    const submitFaq = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFaq) {
            faqForm.post(`/admin/cms-halaman/faqs/${editingFaq.id}`, {
                onSuccess: () => setFaqModalOpen(false),
            });
        } else {
            faqForm.post('/admin/cms-halaman/faqs', {
                onSuccess: () => setFaqModalOpen(false),
            });
        }
    };

    const deleteFaq = (item: FaqItem) => {
        if (confirm(`Hapus pertanyaan FAQ "${item.question}"?`)) {
            router.delete(`/admin/cms-halaman/faqs/${item.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            title="Pengaturan Konten Landing Page (CMS)"
            subtitle="Editor Hero Musiman, 3 Pilar Filosofi Kriya, Testimoni Klien & FAQ"
        >
            <div className="space-y-6">
                {/* 1. Atelier Nav Tabs Strip */}
                <div className="flex rounded-2xl border-b border-[#16233B]/10 bg-white px-4 shadow-2xs sm:px-6">
                    <nav className="flex space-x-6">
                        {[
                            {
                                id: 'hero',
                                label: 'Hero & Edisi Musiman',
                                icon: SlidersHorizontal,
                            },
                            {
                                id: 'pillars',
                                label: '3 Pilar Filosofi Kriya',
                                icon: Palette,
                            },
                            {
                                id: 'testimonials',
                                label: 'Testimoni Klien',
                                icon: Star,
                            },
                            {
                                id: 'faqs',
                                label: 'FAQ Accordion',
                                icon: HelpCircle,
                            },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(tab.id as typeof activeTab)
                                    }
                                    className={`relative flex items-center gap-2 py-4 text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'text-[#16233B]'
                                            : 'text-[#16233B]/50 hover:text-[#16233B]'
                                    }`}
                                >
                                    <Icon
                                        className={`size-3.5 ${
                                            isActive
                                                ? 'text-[#A88B54]'
                                                : 'text-[#16233B]/40'
                                        }`}
                                    />
                                    <span>{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="cms-tab-active"
                                            className="absolute inset-x-0 bottom-0 h-0.5 bg-[#A88B54]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* 2. Tab Contents */}
                {/* TAB 1: HERO & EDISI MUSIMAN */}
                {activeTab === 'hero' && (
                    <div className="rounded-2xl border border-[#16233B]/10 bg-white p-6 shadow-2xs">
                        <div className="border-b border-[#16233B]/10 pb-4">
                            <h3 className="text-base font-semibold text-[#16233B]">
                                Banner Hero &amp; Tema Musiman Aktif
                            </h3>
                            <p className="text-xs text-[#16233B]/60">
                                Mengatur tema utama website yang ditampilkan
                                kepada pengunjung saat ini
                            </p>
                        </div>

                        <form
                            onSubmit={submitHero}
                            className="mt-6 max-w-3xl space-y-4 text-xs"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-[#16233B]">
                                        Edisi Musiman Aktif (Seasonal Theme Badge)
                                    </label>
                                    <span className="rounded-full bg-[#A88B54]/10 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#A88B54]">
                                        Opsional
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={heroForm.data.active_edition}
                                    onChange={(e) =>
                                        heroForm.setData(
                                            'active_edition',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: Idul Fitri & Ramadan 1447 H / Natal & Tahun Baru (Boleh dikosongkan)"
                                    className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2.5 text-xs text-[#16233B] placeholder:text-[#16233B]/40 focus:border-[#16233B] focus:outline-hidden"
                                />
                                <p className="text-[10.5px] text-[#16233B]/50">
                                    Ditampilkan pada badge mengkilap di bagian
                                    atas Hero dan kartu katalog (kosongkan jika tidak ada tema aktif)
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#16233B]">
                                    Hero Eyebrow (Teks Kecil Atas)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={heroForm.data.hero_eyebrow}
                                    onChange={(e) =>
                                        heroForm.setData(
                                            'hero_eyebrow',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="GALUH & CO. • ATELIER BINGKISAN"
                                    className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2.5 font-mono text-xs text-[#16233B] focus:border-[#16233B] focus:outline-hidden"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#16233B]">
                                    Headline Utama (H1)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={heroForm.data.hero_title}
                                    onChange={(e) =>
                                        heroForm.setData(
                                            'hero_title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Kriya Bingkisan untuk Momen yang Tak Diulang."
                                    className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2.5 text-sm text-[#16233B] focus:border-[#16233B] focus:outline-hidden"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-[#16233B]">
                                    Subheadline &amp; Narasi Pembuka
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={heroForm.data.hero_subtitle}
                                    onChange={(e) =>
                                        heroForm.setData(
                                            'hero_subtitle',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2.5 text-xs text-[#16233B] focus:border-[#16233B] focus:outline-hidden"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={heroForm.processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2B3B5C] disabled:opacity-50"
                                >
                                    <Save className="size-3.5 text-[#A88B54]" />
                                    <span>
                                        {heroForm.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan Hero'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 2: PILAR FILOSOFI KRIYA */}
                {activeTab === 'pillars' && (
                    <div className="rounded-2xl border border-[#16233B]/10 bg-white p-6 shadow-2xs">
                        <div className="border-b border-[#16233B]/10 pb-4">
                            <h3 className="text-base font-semibold text-[#16233B]">
                                3 Pilar Filosofi Kriya Atelier
                            </h3>
                            <p className="text-xs text-[#16233B]/60">
                                Nilai keunggulan atelier yang ditampilkan pada
                                bagian About di landing page
                            </p>
                        </div>

                        <form
                            onSubmit={submitPillars}
                            className="mt-6 space-y-6 text-xs"
                        >
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {pillarsForm.data.pillars.map((pillar, idx) => (
                                    <div
                                        key={idx}
                                        className="space-y-3 rounded-xl border border-[#16233B]/10 bg-[#FAF8F5] p-4"
                                    >
                                        <div className="flex items-center justify-between border-b border-[#16233B]/10 pb-2">
                                            <span className="font-mono text-xs font-bold text-[#A88B54]">
                                                PILAR{' '}
                                                {pillar.num || `0${idx + 1}`}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-[#16233B]">
                                                Judul Pilar
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={pillar.title}
                                                onChange={(e) =>
                                                    updatePillarField(
                                                        idx,
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-[#16233B]/15 bg-white p-2 text-xs text-[#16233B] focus:outline-hidden"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-[#16233B]">
                                                Deskripsi Pilar
                                            </label>
                                            <textarea
                                                rows={3}
                                                required
                                                value={pillar.description}
                                                onChange={(e) =>
                                                    updatePillarField(
                                                        idx,
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-[#16233B]/15 bg-white p-2 text-xs text-[#16233B] focus:outline-hidden"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-[#16233B]">
                                                URL Foto Ilustrasi
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={pillar.image}
                                                onChange={(e) =>
                                                    updatePillarField(
                                                        idx,
                                                        'image',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-[#16233B]/15 bg-white p-2 text-xs text-[#16233B] focus:outline-hidden"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={pillarsForm.processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2B3B5C] disabled:opacity-50"
                                >
                                    <Save className="size-3.5 text-[#A88B54]" />
                                    <span>
                                        {pillarsForm.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan 3 Pilar Kriya'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 3: TESTIMONI KLIEN */}
                {activeTab === 'testimonials' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-[#16233B]">
                                    Daftar Testimoni Klien
                                </h3>
                                <p className="text-xs text-[#16233B]/60">
                                    Ulasan terverifikasi dari klien individu dan
                                    perusahaan
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openAddTestimonial}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2B3B5C]"
                            >
                                <Plus className="size-3.5 text-[#A88B54]" />
                                <span>Tambah Testimoni</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((t) => (
                                <div
                                    key={t.id}
                                    className="relative flex flex-col justify-between rounded-2xl border border-[#16233B]/10 bg-white p-5 shadow-2xs"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-0.5 text-[#A88B54]">
                                                {Array.from({
                                                    length: t.rating,
                                                }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="size-3 fill-[#A88B54]"
                                                    />
                                                ))}
                                            </div>
                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-700">
                                                TERVERIFIKASI
                                            </span>
                                        </div>

                                        <p className="mt-3 text-xs leading-relaxed text-[#16233B] italic">
                                            &ldquo;{t.quote}&rdquo;
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-[#16233B]/10 pt-3">
                                        <div>
                                            <h4 className="text-xs font-semibold text-[#16233B]">
                                                {t.name}
                                            </h4>
                                            <p className="text-[10.5px] text-[#16233B]/60">
                                                {t.role}{' '}
                                                {t.order_type
                                                    ? `• ${t.order_type}`
                                                    : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditTestimonial(t)
                                                }
                                                className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                            >
                                                <Edit3 className="size-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteTestimonial(t)
                                                }
                                                className="rounded p-1 text-rose-600 hover:bg-rose-50"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: FAQ ACCORDION */}
                {activeTab === 'faqs' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-[#16233B]">
                                    Pertanyaan Sering Diajukan (FAQ)
                                </h3>
                                <p className="text-xs text-[#16233B]/60">
                                    Accordion bantuan informasi pemesanan,
                                    kustomisasi grafir &amp; pengiriman
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openAddFaq}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2B3B5C]"
                            >
                                <Plus className="size-3.5 text-[#A88B54]" />
                                <span>Tambah Pertanyaan FAQ</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((f) => (
                                <div
                                    key={f.id}
                                    className="flex items-start justify-between rounded-xl border border-[#16233B]/10 bg-white p-4 shadow-2xs"
                                >
                                    <div className="space-y-1 pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md border border-[#16233B]/10 bg-[#FAF8F5] px-2 py-0.5 font-mono text-[9px] font-bold text-[#A88B54] uppercase">
                                                {f.category}
                                            </span>
                                            <h4 className="text-sm font-semibold text-[#16233B]">
                                                {f.question}
                                            </h4>
                                        </div>
                                        <p className="text-xs leading-relaxed text-[#16233B]/70">
                                            {f.answer}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => openEditFaq(f)}
                                            className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                        >
                                            <Edit3 className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteFaq(f)}
                                            className="rounded p-1 text-rose-600 hover:bg-rose-50"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Testimonial Modal */}
            <AnimatePresence>
                {testimonialModalOpen && (
                    <div
                        className="backdrop-blur-2xs fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setTestimonialModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#16233B]/10 pb-3">
                                <h3 className="text-base font-semibold text-[#16233B]">
                                    {editingTestimonial
                                        ? 'Edit Testimoni Klien'
                                        : 'Tambah Testimoni Klien'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTestimonialModalOpen(false)
                                    }
                                    className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form
                                onSubmit={submitTestimonial}
                                className="mt-4 space-y-3 text-xs"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Nama Klien / Pengirim
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={testimonialForm.data.name}
                                            onChange={(e) =>
                                                testimonialForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Clara Widjaja"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Role / Jabatan / Tipe
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={testimonialForm.data.role}
                                            onChange={(e) =>
                                                testimonialForm.setData(
                                                    'role',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Corporate VIP Gifting"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Paket yang Dipesan
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                testimonialForm.data.order_type
                                            }
                                            onChange={(e) =>
                                                testimonialForm.setData(
                                                    'order_type',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Emerald Hardbox & Engraved Tumbler"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Rating Bintang (1 - 5)
                                        </label>
                                        <select
                                            value={testimonialForm.data.rating}
                                            onChange={(e) =>
                                                testimonialForm.setData(
                                                    'rating',
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        >
                                            <option value={5}>
                                                5 Bintang (Sempurna)
                                            </option>
                                            <option value={4}>
                                                4 Bintang (Sangat Baik)
                                            </option>
                                            <option value={3}>
                                                3 Bintang (Cukup)
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Isi Testimoni / Kutipan Klien
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={testimonialForm.data.quote}
                                        onChange={(e) =>
                                            testimonialForm.setData(
                                                'quote',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Tuliskan pengalaman klien merangkai hampers..."
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#16233B]/10 pt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTestimonialModalOpen(false)
                                        }
                                        className="rounded-lg border px-3 py-1.5 text-xs text-[#16233B]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={testimonialForm.processing}
                                        className="rounded-lg bg-[#16233B] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2B3B5C]"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FAQ Modal */}
            <AnimatePresence>
                {faqModalOpen && (
                    <div
                        className="backdrop-blur-2xs fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setFaqModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#16233B]/10 pb-3">
                                <h3 className="text-base font-semibold text-[#16233B]">
                                    {editingFaq
                                        ? 'Edit Pertanyaan FAQ'
                                        : 'Tambah Pertanyaan FAQ'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setFaqModalOpen(false)}
                                    className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form
                                onSubmit={submitFaq}
                                className="mt-4 space-y-3 text-xs"
                            >
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Kategori Topik
                                    </label>
                                    <select
                                        value={faqForm.data.category}
                                        onChange={(e) =>
                                            faqForm.setData(
                                                'category',
                                                e.target.value as
                                                    | 'pemesanan'
                                                    | 'custom_branding'
                                                    | 'pengiriman'
                                                    | 'pembayaran',
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    >
                                        <option value="pemesanan">
                                            Pemesanan &amp; Konsultasi WA
                                        </option>
                                        <option value="custom_branding">
                                            Kustomisasi Logo &amp; Grafir
                                        </option>
                                        <option value="pengiriman">
                                            Pengiriman Seluruh Nusantara
                                        </option>
                                        <option value="pembayaran">
                                            Faktur Resmi &amp; Pembayaran B2B
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Pertanyaan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={faqForm.data.question}
                                        onChange={(e) =>
                                            faqForm.setData(
                                                'question',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Berapa batas waktu pemesanan untuk hampers Lebaran?"
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Jawaban Lengkap
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={faqForm.data.answer}
                                        onChange={(e) =>
                                            faqForm.setData(
                                                'answer',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Jelaskan secara ramah dan profesional..."
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#16233B]/10 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setFaqModalOpen(false)}
                                        className="rounded-lg border px-3 py-1.5 text-xs text-[#16233B]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={faqForm.processing}
                                        className="rounded-lg bg-[#16233B] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2B3B5C]"
                                    >
                                        Simpan
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
