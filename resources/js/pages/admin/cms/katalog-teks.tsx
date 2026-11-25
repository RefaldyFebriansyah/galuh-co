import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Type, Save, Package, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface CatalogTextSettings {
    catalog_badge: string;
    catalog_title: string;
    catalog_subtitle: string;
}

interface AdminCmsKatalogTeksProps {
    catalogTextSettings: CatalogTextSettings;
}

export default function AdminCmsKatalogTeks({
    catalogTextSettings,
}: AdminCmsKatalogTeksProps) {
    const [badge, setBadge] = useState(
        catalogTextSettings.catalog_badge ||
            'KOLEKSI HAMPERS • IDUL FITRI & RAMADHAN 1447H',
    );
    const [title, setTitle] = useState(
        catalogTextSettings.catalog_title || 'Koleksi Bingkisan Istimewa',
    );
    const [subtitle, setSubtitle] = useState(
        catalogTextSettings.catalog_subtitle ||
            'Pilihan kurasi hampers eksklusif dengan wadah anyaman bambu kriya dan hardbox linen berstempel wax personal untuk melengkapi kebersamaan Anda.',
    );

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            '/admin/cms/katalog-teks',
            {
                catalog_badge: badge,
                catalog_title: title,
                catalog_subtitle: subtitle,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AdminLayout
            title="Katalog Teks CMS"
            subtitle="Ubah teks badge musiman, judul Koleksi Bingkisan Istimewa, dan teks deskripsi katalog di landing page."
        >
            <Head title="Katalog Teks — CMS Admin Galuh & Co." />

            <form onSubmit={handleSave} className="space-y-6">
                <div className="rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                        <Type className="size-4" />
                        <span>HEADER KOLEKSI HAMPERS LANDING PAGE</span>
                    </div>
                    <h2 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                        Teks Judul & Narasi Katalog
                    </h2>
                    <p className="mt-1 text-xs text-[#6E675D]">
                        Admin dapat mengganti teks badge (misal: "Koleksi Hampers • Idul Fitri & Ramadhan 1447H"), teks judul utama, dan teks deskripsi di bawahnya.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left: Input Form */}
                        <div className="space-y-4 lg:col-span-7 text-xs">
                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Teks Badge Atas (Tema / Edisi):
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value)}
                                    placeholder="Contoh: KOLEKSI HAMPERS • IDUL FITRI & RAMADHAN 1447H"
                                    className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Teks Judul Utama:
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Contoh: Koleksi Bingkisan Istimewa"
                                    className="mt-1 w-full font-serif font-bold text-sm rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Teks Deskripsi / Subjudul di Bawah Judul:
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    placeholder="Deskripsi kurasi koleksi hampers..."
                                    className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                />
                            </div>
                        </div>

                        {/* Right: Live Preview on Warm Ivory Canvas */}
                        <div className="flex flex-col justify-center rounded-2xl border border-[#A88B54]/30 bg-[#F2EBDC] p-6 text-center lg:col-span-5 shadow-xs">
                            <span className="text-[9.5px] font-bold tracking-widest text-[#A88B54] uppercase">
                                PREVIEW HEADER KATALOG DI WEBSITE:
                            </span>

                            <div className="mt-4">
                                <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                                    <span>{badge}</span>
                                </div>

                                <h3 className="mt-2 font-serif text-2xl font-normal text-[#16233B]">
                                    {title}
                                </h3>

                                <p className="mt-2 text-xs leading-relaxed text-[#6E675D]">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
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
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Teks Katalog'}</span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
