import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Save, Layers, ListOrdered } from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface StepItem {
    number: string;
    title: string;
    description: string;
    [key: string]: any;
}

interface CaraPesanSettings {
    order_guide_badge: string;
    order_guide_title: string;
    order_guide_subtitle: string;
    order_guide_steps: StepItem[];
}

interface AdminCmsCaraPesanProps {
    caraPesanSettings: CaraPesanSettings;
}

export default function AdminCmsCaraPesan({
    caraPesanSettings,
}: AdminCmsCaraPesanProps) {
    const [badge, setBadge] = useState(
        caraPesanSettings.order_guide_badge ||
            'PANDUAN PEMESANAN • SISTEM WEBSITE RESMI',
    );
    const [title, setTitle] = useState(
        caraPesanSettings.order_guide_title ||
            'Alur Pemesanan Mudah & Transparan',
    );
    const [subtitle, setSubtitle] = useState(
        caraPesanSettings.order_guide_subtitle ||
            'Seluruh transaksi diproses langsung di dalam website setelah Anda mendaftar atau masuk ke akun Anda, lengkap dengan konfirmasi instan dan pelacakan resi.',
    );

    const [steps, setSteps] = useState<StepItem[]>(() => {
        if (
            caraPesanSettings.order_guide_steps &&
            caraPesanSettings.order_guide_steps.length === 4
        ) {
            return caraPesanSettings.order_guide_steps;
        }
        return [
            {
                number: '01',
                title: 'Pilih Koleksi & Detail Isi',
                description:
                    'Jelajahi kurasi katalog musiman kami dan periksa rincian daftar isi setiap paket hampers melalui modal detail produk.',
            },
            {
                number: '02',
                title: 'Personal atau Corporate (Min. 25)',
                description:
                    'Pesan langsung di website untuk paket personal (>1 paket) atau paket corporate dengan harga grosir resmi minimal 25 paket.',
            },
            {
                number: '03',
                title: 'Lengkapi Alamat & Ucapan',
                description:
                    'Isi data penerima, gunakan fitur deteksi alamat otomatis, dan tuliskan pesan kartu ucapan berstempel wax personal.',
            },
            {
                number: '04',
                title: 'Lacak Pesanan via Nomor Resi',
                description:
                    'Pantau status pengerjaan di studio hingga perjalanan kurir secara real-time langsung di menu Lacak Pesanan website.',
            },
        ];
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleStepChange = (
        index: number,
        field: keyof StepItem,
        value: string,
    ) => {
        const next = [...steps];
        next[index] = { ...next[index], [field]: value };
        setSteps(next);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            '/admin/cms/cara-pesan',
            {
                order_guide_badge: badge,
                order_guide_title: title,
                order_guide_subtitle: subtitle,
                order_guide_steps: steps,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AdminLayout
            title="Panduan Pesanan CMS"
            subtitle="Ubah teks panduan pemesanan dan seluruh tahapan langkah 1 sampai 4."
        >
            <Head title="Panduan Pesanan — CMS Admin Galuh & Co." />

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Header Panduan Section */}
                <div className="space-y-4 rounded-2xl border border-[#A88B54]/30 bg-white p-6 text-xs shadow-sm">
                    <div className="border-b border-[#F2EBDC] pb-3">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                            <ListOrdered className="size-4" />
                            <span>HEADER PANDUAN PEMESANAN</span>
                        </div>
                        <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                            Headline & Subtitle Cara Pesan
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
                                Judul Panduan:
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 font-sans text-xs font-bold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                            Subtitle Panduan:
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

                {/* 2. 4 Steps Editor */}
                <div className="rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                        <CheckCircle2 className="size-4" />
                        <span>4 TAHAPAN LANGKAH PEMESANAN (01 SAMPAI 04)</span>
                    </div>
                    <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                        Ubah Judul & Deskripsi Langkah 1 - 4
                    </h2>
                    <p className="mt-1 text-xs text-[#6E675D]">
                        Admin dapat merubah judul dan instruksi masing-masing
                        langkah pesanan.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="space-y-3 rounded-2xl border border-[#A88B54]/30 bg-[#FAF8F5] p-4 text-xs"
                            >
                                <div className="flex items-center justify-between border-b border-[#A88B54]/20 pb-2">
                                    <span className="font-sans text-sm font-bold text-[#16233B]">
                                        TAHAP {step.number}
                                    </span>
                                    <span className="rounded-full bg-[#16233B] px-2 py-0.5 font-mono text-[9.5px] font-bold text-[#A88B54]">
                                        Langkah {idx + 1}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Nomor:
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={step.number}
                                        onChange={(e) =>
                                            handleStepChange(
                                                idx,
                                                'number',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 font-mono text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Judul Langkah:
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={step.title}
                                        onChange={(e) =>
                                            handleStepChange(
                                                idx,
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-lg border border-[#A88B54]/30 bg-white px-3 py-1.5 font-sans text-xs font-bold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-[#16233B] uppercase">
                                        Instruksi / Deskripsi:
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={step.description}
                                        onChange={(e) =>
                                            handleStepChange(
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
                                : 'Simpan Panduan Pesanan'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
