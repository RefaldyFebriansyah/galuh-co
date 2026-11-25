import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    BookOpen,
    Save,
    Image as ImageIcon,
    Upload,
    Layers,
    Type,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface PillarItem {
    num: string;
    title: string;
    description: string;
    image: string;
    [key: string]: any;
}

interface AboutSettings {
    about_badge: string;
    about_title: string;
    about_description: string;
    about_pillars: PillarItem[];
}

interface AdminCmsAboutProps {
    aboutSettings: AboutSettings;
}

export default function AdminCmsAbout({ aboutSettings }: AdminCmsAboutProps) {
    const [badge, setBadge] = useState(
        aboutSettings.about_badge || 'TENTANG GALUH & CO.',
    );
    const [title, setTitle] = useState(
        aboutSettings.about_title ||
            'Menghadirkan Kehangatan di Setiap Kotak Hadiah',
    );
    const [description, setDescription] = useState(
        aboutSettings.about_description ||
            'GALUH & CO. lahir dari keyakinan bahwa bingkisan terbaik bukan sekadar benda di dalam wadah, melainkan bahasa ketulusan yang merajut ikatan emosional dan apresiasi berkelas. Kami mendedikasikan ketelitian kriya pada setiap lembar pita, lipatan linen, dan segel lilin wax.\n\nMulai dari bahan kudapan butter Wijsman autentik, madu hutan murni, hingga kemasan anyaman bambu eksklusif—setiap pesanan diproses langsung di website dengan sistem pelacakan resi transparan untuk perayaan keluarga maupun representasi resmi korporat.',
    );

    const [pillars, setPillars] = useState<PillarItem[]>(() => {
        if (
            aboutSettings.about_pillars &&
            aboutSettings.about_pillars.length === 3
        ) {
            return aboutSettings.about_pillars;
        }
        return [
            {
                num: '01',
                title: 'Kurasi Pilihan',
                description:
                    'Bahan bermutu tinggi dan higienis—butter Wijsman autentik, madu hutan murni, dan kopi single-origin pilihan.',
                image: '/images/product_bamboo_box.jpg',
            },
            {
                num: '02',
                title: 'Kemasan Eksklusif',
                description:
                    'Anyaman bambu kriya & hardbox linen kokoh dengan pita satin ganda serta stempel segel lilin manual.',
                image: '/images/product_emerald_box.jpg',
            },
            {
                num: '03',
                title: 'Sentuhan Personal',
                description:
                    'Kustomisasi kartu ucapan kaligrafi, grafir nama pada tumbler termal, dan sleeve logo perusahaan.',
                image: '/images/product_rattan_box.jpg',
            },
        ];
    });

    const [isSaving, setIsSaving] = useState(false);

    const handlePillarChange = (
        index: number,
        field: keyof PillarItem,
        value: string,
    ) => {
        const next = [...pillars];
        next[index] = { ...next[index], [field]: value };
        setPillars(next);
    };

    const handleFileUpload = (index: number, file: File) => {
        const validTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/svg+xml',
            'image/webp',
            'image/gif',
        ];
        if (
            !validTypes.includes(file.type) &&
            !file.name.match(/\.(jpg|jpeg|png|svg|webp|gif)$/i)
        ) {
            alert(
                'Format file tidak didukung. Harap upload format SVG, JPG, PNG, atau WebP.',
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
                handlePillarChange(index, 'image', result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            '/admin/cms/about',
            {
                about_badge: badge,
                about_title: title,
                about_description: description,
                about_pillars: pillars,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AdminLayout
            title="Tentang Galuh & 3 Pilar"
            subtitle="Ubah seluruh isi teks tentang Galuh hingga 3 pilar kriya (pilar 1-3) dan foto di dalam masing-masing card."
        >
            <Head title="Tentang Galuh — CMS Admin Galuh & Co." />

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Header Teks Utama Section */}
                <div className="space-y-4 rounded-2xl border border-[#A88B54]/30 bg-white p-6 text-xs shadow-sm">
                    <div className="border-b border-[#F2EBDC] pb-3">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                            <BookOpen className="size-4" />
                            <span>TEKS UTAMA TENTANG GALUH & CO.</span>
                        </div>
                        <h2 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                            Headline & Narasi Filosofi Brand
                        </h2>
                    </div>

                    <div>
                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                            Badge Atas:
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
                            Judul Utama Cerita Galuh:
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                            Narasi Lengkap Filosofi:
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                        />
                    </div>
                </div>

                {/* 2. The 3 Pillars Editor (Pilar 1, 2, 3) */}
                <div className="rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                        <Layers className="size-4" />
                        <span>3 PILAR KRIYA ATELIER (NO. 1 SAMPAI NO. 3)</span>
                    </div>
                    <h2 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                        Teks & Foto di Dalam Setiap Card Pilar
                    </h2>
                    <p className="mt-1 text-xs text-[#6E675D]">
                        Admin dapat mengganti teks pilar no 1, 2, dan 3 serta
                        memilih foto yang tampil di dalam card.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {pillars.map((pillar, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col justify-between rounded-2xl border border-[#A88B54]/30 bg-[#FAF8F5] p-5 text-xs"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-[#A88B54]/20 pb-2">
                                        <span className="font-serif text-lg font-bold text-[#16233B]">
                                            PILAR {pillar.num}
                                        </span>
                                        <span className="rounded bg-[#16233B] px-2 py-0.5 font-mono text-[10px] font-bold text-[#A88B54]">
                                            Card 0{idx + 1}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                            Nomor Display:
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={pillar.num}
                                            onChange={(e) =>
                                                handlePillarChange(
                                                    idx,
                                                    'num',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 font-mono text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                            Judul Pilar:
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={pillar.title}
                                            onChange={(e) =>
                                                handlePillarChange(
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
                                            Deskripsi Card:
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={pillar.description}
                                            onChange={(e) =>
                                                handlePillarChange(
                                                    idx,
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                                Foto Card Pilar:
                                            </label>
                                            <span className="font-mono text-[9px] text-[#A88B54]">
                                                SVG / JPG / WebP
                                            </span>
                                        </div>

                                        <div className="mt-1 space-y-2">
                                            {/* Direct Upload Button (SVG, JPG, PNG, WebP) */}
                                            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#A88B54]/40 bg-[#16233B] px-3 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#A88B54] hover:text-[#16233B] active:scale-95">
                                                <Upload className="size-3.5" />
                                                <span>
                                                    Pilih &amp; Upload Foto (SVG
                                                    / JPG)
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/svg+xml,image/webp,image/gif"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (file)
                                                            handleFileUpload(
                                                                idx,
                                                                file,
                                                            );
                                                    }}
                                                />
                                            </label>

                                            {/* Manual Path / URL Input */}
                                            <input
                                                type="text"
                                                required
                                                value={pillar.image}
                                                onChange={(e) =>
                                                    handlePillarChange(
                                                        idx,
                                                        'image',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="/images/product_bamboo_box.jpg atau data:image/..."
                                                className="w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Thumbnail */}
                                <div className="mt-4 overflow-hidden rounded-xl border border-[#A88B54]/30 bg-white shadow-2xs">
                                    <img
                                        src={
                                            pillar.image ||
                                            '/images/product_bamboo_box.jpg'
                                        }
                                        alt={pillar.title}
                                        className="h-32 w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/images/product_bamboo_box.jpg';
                                        }}
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
                                : 'Simpan Konten Tentang Galuh'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
