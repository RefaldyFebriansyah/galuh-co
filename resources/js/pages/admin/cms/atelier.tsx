import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Save, Award, Layers } from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface AtelierCardItem {
    title: string;
    shortDescription: string;
    description: string;
    [key: string]: any;
}

interface AtelierSettings {
    atelier_badge: string;
    atelier_title: string;
    atelier_subtitle: string;
    atelier_cards: AtelierCardItem[];
}

interface AdminCmsAtelierProps {
    atelierSettings: AtelierSettings;
}

export default function AdminCmsAtelier({
    atelierSettings,
}: AdminCmsAtelierProps) {
    const [badge, setBadge] = useState(
        atelierSettings.atelier_badge || 'STANDAR MUTU ATELIER',
    );
    const [title, setTitle] = useState(
        atelierSettings.atelier_title || 'Integritas Atelier Galuh & Co.',
    );
    const [subtitle, setSubtitle] = useState(
        atelierSettings.atelier_subtitle ||
            'Dedikasi tanpa kompromi dalam setiap detail kurasi, pengemasan, dan penghantaran bingkisan Anda.',
    );

    const [cards, setCards] = useState<AtelierCardItem[]>(() => {
        if (
            atelierSettings.atelier_cards &&
            atelierSettings.atelier_cards.length === 4
        ) {
            return atelierSettings.atelier_cards;
        }
        return [
            {
                title: 'Kurasi Bahan Pilihan',
                shortDescription:
                    'Bahan pangan bermutu tinggi & higienis untuk kesan istimewa.',
                description:
                    'Setiap isi hampers dipilih secara teliti dari produk bermutu terbaik dan higienis untuk menghadirkan pengalaman membuka hadiah yang berkesan.',
            },
            {
                title: 'Kustom Grafir & Stempel Wax',
                shortDescription:
                    'Kustomisasi logo korporat, pita satin, & kartu ucapan wax seal.',
                description:
                    'Bebas menambahkan logo perusahaan via grafir laser, pita warna korporat, serta kartu ucapan khusus berstempel lilin wax mewah.',
            },
            {
                title: 'Pengiriman Aman Terproteksi',
                shortDescription:
                    'Kemasan hardbox berlapis aman dengan perlindungan kurir.',
                description:
                    'Dikemas rapi dengan perlindungan berlapis dan kurir atelier terlatih untuk memastikan kotak hadiah tiba dalam kondisi utuh.',
            },
            {
                title: 'Pelacakan Resi Real-Time',
                shortDescription:
                    'Sistem monitoring pengerjaan hingga tiba di tangan penerima.',
                description:
                    'Pantau setiap proses kurasi studio hingga pengantaran kurir melalui nomor resi resmi langsung di website.',
            },
        ];
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleCardChange = (
        index: number,
        field: keyof AtelierCardItem,
        value: string,
    ) => {
        const next = [...cards];
        next[index] = { ...next[index], [field]: value };
        setCards(next);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            '/admin/cms/atelier',
            {
                atelier_badge: badge,
                atelier_title: title,
                atelier_subtitle: subtitle,
                atelier_cards: cards,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AdminLayout
            title="Integritas Atelier CMS"
            subtitle="Ubah teks halaman integritas atelier dan seluruh teks pada 4 card keunggulan standar kriya."
        >
            <Head title="Integritas Atelier — CMS Admin Galuh & Co." />

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Header Teks Utama Section */}
                <div className="space-y-4 rounded-2xl border border-[#A88B54]/30 bg-white p-6 text-xs shadow-sm">
                    <div className="border-b border-[#F2EBDC] pb-3">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                            <ShieldCheck className="size-4" />
                            <span>HEADER INTEGRITAS ATELIER</span>
                        </div>
                        <h2 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                            Headline & Narasi Standar Kriya Atelier
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                Badge:
                            </label>
                            <input
                                type="text"
                                required
                                value={badge}
                                onChange={(e) => setBadge(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                Judul Utama:
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 font-serif text-xs font-bold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                            Subjudul / Narasi Komitmen:
                        </label>
                        <textarea
                            rows={2}
                            required
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                        />
                    </div>
                </div>

                {/* 2. 4 Cards Editor */}
                <div className="rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                        <Layers className="size-4" />
                        <span>4 CARD KEUNGGULAN STANDAR KRIYA</span>
                    </div>
                    <h2 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                        Ubah Seluruh Teks pada 4 Card
                    </h2>
                    <p className="mt-1 text-xs text-[#6E675D]">
                        Admin dapat merubah judul, deskripsi ringkas, dan
                        deskripsi detail untuk masing-masing card.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {cards.map((card, idx) => (
                            <div
                                key={idx}
                                className="space-y-3 rounded-2xl border border-[#A88B54]/30 bg-[#FAF8F5] p-5 text-xs"
                            >
                                <div className="flex items-center justify-between border-b border-[#A88B54]/20 pb-2">
                                    <span className="font-serif text-sm font-bold text-[#16233B]">
                                        CARD 0{idx + 1}
                                    </span>
                                    <span className="rounded bg-[#16233B] px-2 py-0.5 font-mono text-[9.5px] font-bold text-[#A88B54]">
                                        Standar Atelier
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Judul Card:
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={card.title}
                                        onChange={(e) =>
                                            handleCardChange(
                                                idx,
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 font-serif text-xs font-bold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Deskripsi Ringkas:
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={card.shortDescription}
                                        onChange={(e) =>
                                            handleCardChange(
                                                idx,
                                                'shortDescription',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Deskripsi Detail:
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={card.description}
                                        onChange={(e) =>
                                            handleCardChange(
                                                idx,
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
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
                                : 'Simpan Integritas Atelier'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
