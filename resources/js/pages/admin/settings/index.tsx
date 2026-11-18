import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Save,
    Image as ImageIcon,
    Phone,
    Sparkles,
    Share2,
    UploadCloud,
    CheckCircle2,
    ExternalLink,
    Eye,
    MessageCircle,
    MapPin,
    Clock,
    Mail,
    Instagram,
    Linkedin,
    Check,
} from 'lucide-react';

interface SettingItem {
    id: number;
    key: string;
    value: string | null;
    type: string;
    label: string | null;
    description: string | null;
}

interface Props {
    settings: Record<string, Record<string, SettingItem>>;
}

export default function AdminSettingsIndex({ settings }: Props) {
    const [activeTab, setActiveTab] = useState<
        'branding' | 'contact' | 'hero' | 'social'
    >('branding');

    // Extract current initial values
    const currentLogoGold =
        settings.branding?.logo_gold?.value || '/images/galuh_logo_gold.png';
    const currentLogoWhite =
        settings.branding?.logo_white?.value || '/images/galuh_logo_white.png';

    const [goldLogoPreview, setGoldLogoPreview] = useState<string | null>(null);
    const [whiteLogoPreview, setWhiteLogoPreview] = useState<string | null>(
        null,
    );

    const goldInputRef = useRef<HTMLInputElement>(null);
    const whiteInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            // Branding files
            logo_gold_file: null as File | null,
            logo_white_file: null as File | null,

            // Contact
            whatsapp_number:
                settings.contact?.whatsapp_number?.value || '6281572414233',
            contact_phone:
                settings.contact?.contact_phone?.value || '+62 815-7241-4233',
            contact_email:
                settings.contact?.contact_email?.value || 'halo@galuh.co',
            company_address:
                settings.contact?.company_address?.value ||
                'Jl. Galuh Mas Raya No. 88, Karawang Barat, Jawa Barat 41361',
            operational_hours:
                settings.contact?.operational_hours?.value ||
                'Senin - Sabtu: 08.00 - 20.00 WIB',

            // Hero
            hero_badge:
                settings.hero?.hero_badge?.value ||
                'Signature Atelier Hampers & Gift',
            hero_title_prefix:
                settings.hero?.hero_title_prefix?.value || 'Hampers Eksklusif',
            hero_description:
                settings.hero?.hero_description?.value ||
                'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.',

            // Social
            instagram_url:
                settings.social?.instagram_url?.value ||
                'https://instagram.com/galuh.co',
            tiktok_url:
                settings.social?.tiktok_url?.value ||
                'https://tiktok.com/@galuh.co',
            linkedin_url: settings.social?.linkedin_url?.value || '',
        });

    const handleGoldFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo_gold_file', file);
            setGoldLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleWhiteFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo_white_file', file);
            setWhiteLogoPreview(URL.createObjectURL(file));
        }
    };

    const resetGoldPreview = () => {
        setData('logo_gold_file', null);
        setGoldLogoPreview(null);
        if (goldInputRef.current) {
            goldInputRef.current.value = '';
        }
    };

    const resetWhitePreview = () => {
        setData('logo_white_file', null);
        setWhiteLogoPreview(null);
        if (whiteInputRef.current) {
            whiteInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const tabs = [
        {
            id: 'branding',
            label: 'Branding & Logo',
            icon: ImageIcon,
            badge: 'Visual Brand',
        },
        {
            id: 'contact',
            label: 'Kontak & WhatsApp',
            icon: Phone,
            badge: 'Pemesanan',
        },
        {
            id: 'hero',
            label: 'Teks Hero Landing Page',
            icon: Sparkles,
            badge: 'Copywriting',
        },
        { id: 'social', label: 'Media Sosial', icon: Share2, badge: 'Tautan' },
    ] as const;

    // Clean international WhatsApp format for testing
    const cleanWaNumber = data.whatsapp_number.replace(/[^0-9]/g, '');

    return (
        <AdminLayout
            title="Pengaturan & Identitas Situs"
            subtitle="Kelola logo brand, jalur pemesanan WhatsApp, dan teks representatif website Galuh & Co."
        >
            <Head title="Pengaturan Situs — Admin Galuh & Co." />

            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-6xl space-y-6 pb-20"
            >
                {/* 1. STUDIO HEADER WITH LIVE ACTIONS */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#EAE5DC] pb-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAE5DC] bg-[#FAF7F2] px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-[#9E7E45] uppercase">
                                <Sparkles className="size-3 text-[#C5A880]" />
                                ATELIER LIVE CONFIGURATOR
                            </span>
                            <span className="hidden text-[11px] text-[#8C877E] md:inline">
                                • Pratinjau langsung diperbarui saat diedit
                            </span>
                        </div>
                        <h2 className="mt-1.5 font-serif text-2xl font-bold text-[#1A1815]">
                            Pengaturan &amp; Identitas Website
                        </h2>
                        <p className="mt-0.5 text-xs text-[#6E6962]">
                            Setiap pembaruan akan langsung aktif di halaman
                            pengunjung seketika setelah disimpan.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Live Website Link */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden items-center gap-1.5 rounded-full border border-[#D5CEC2] bg-white px-4 py-2 text-xs font-semibold text-[#0E2A1E] shadow-2xs transition-colors hover:border-[#0E2A1E] hover:bg-[#FAF8F5] sm:inline-flex"
                        >
                            <span>Lihat Website</span>
                            <ExternalLink className="size-3 text-[#8C877E]" />
                        </a>

                        {recentlySuccessful && (
                            <span className="animate-fade-in inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-2xs">
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                Perubahan Berhasil Disimpan!
                            </span>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0E2A1E] px-6 py-2.5 text-xs font-bold tracking-wider text-white shadow-md transition-all hover:bg-[#163d2c] hover:shadow-lg disabled:opacity-50"
                        >
                            <Save className="size-3.5 text-[#C5A880]" />
                            <span>
                                {processing ? 'Menyimpan...' : 'Simpan Semua'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* 2. REFINED PILL TABS */}
                <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1">
                    {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`group inline-flex cursor-pointer items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-[#0E2A1E] text-white shadow-sm ring-1 ring-[#0E2A1E]'
                                        : 'border border-[#E0D8CB] bg-white text-[#6E6962] hover:border-[#0E2A1E]/40 hover:bg-[#FAF8F5] hover:text-[#0E2A1E]'
                                }`}
                            >
                                <TabIcon
                                    className={`size-4 transition-colors ${
                                        isActive
                                            ? 'text-[#C5A880]'
                                            : 'text-[#8C877E] group-hover:text-[#0E2A1E]'
                                    }`}
                                />
                                <span>{tab.label}</span>
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${
                                        isActive
                                            ? 'bg-white/15 text-[#FAF0D7]'
                                            : 'bg-[#FAF8F5] text-[#8C877E]'
                                    }`}
                                >
                                    {tab.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ========================================================================= */}
                {/* 3. TAB 1: BRANDING & LOGO (VISUAL SHOWCASE WITH LIVE MOCKUPS)              */}
                {/* ========================================================================= */}
                {activeTab === 'branding' && (
                    <div className="space-y-6">
                        {/* ASSET 1: LOGO EMAS (LIGHT THEME / NAVBAR) */}
                        <div className="rounded-3xl border border-[#E0D8CB] bg-white p-6 shadow-xs sm:p-8">
                            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                                {/* Left Controls (5 Cols) */}
                                <div className="space-y-3 lg:col-span-5">
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EAE5DC] bg-[#FAF7F2] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#9E7E45] uppercase">
                                        <span>
                                            ✦ Versi Terang (Navbar &amp; Header)
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-[#1A1815]">
                                        Logo Brand Emas (Gold Edition)
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#6E6962]">
                                        Ditampilkan pada *sticky navbar*
                                        mengambang dan dokumen berlatar terang.
                                        Gunakan file logo dengan rasio
                                        horizontal dan latar transparan.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <input
                                            ref={goldInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                            onChange={handleGoldFileChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goldInputRef.current?.click()
                                            }
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#0E2A1E] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#163d2c]"
                                        >
                                            <UploadCloud className="size-4 text-[#C5A880]" />
                                            <span>
                                                {goldLogoPreview
                                                    ? 'Ganti File Foto'
                                                    : 'Unggah File Logo'}
                                            </span>
                                        </button>

                                        {goldLogoPreview && (
                                            <button
                                                type="button"
                                                onClick={resetGoldPreview}
                                                className="cursor-pointer text-xs font-medium text-[#8C877E] underline hover:text-red-600"
                                            >
                                                Batalkan Pilihan
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 text-[11px] text-[#8C877E]">
                                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                                        <span>
                                            Format PNG transparan / SVG
                                            disarankan (min. 500 × 180 px)
                                        </span>
                                    </div>

                                    {errors.logo_gold_file && (
                                        <p className="text-xs font-semibold text-red-600">
                                            {errors.logo_gold_file}
                                        </p>
                                    )}
                                </div>

                                {/* Right: Live Website Navbar Mockup (7 Cols) */}
                                <div className="lg:col-span-7">
                                    <div className="rounded-2xl border border-[#E0D8CB] bg-[#FAF7F2] p-4 sm:p-5">
                                        <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-bold tracking-wider text-[#8C877E] uppercase">
                                            <span className="flex items-center gap-1.5">
                                                <Eye className="size-3 text-[#C5A880]" />
                                                Simulasi Tampilan Langsung di
                                                Navbar Website
                                            </span>
                                            {goldLogoPreview && (
                                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                                                    Pratinjau File Baru
                                                </span>
                                            )}
                                        </div>

                                        {/* Floating Pill Navbar Mockup (Identical to Landing Page) */}
                                        <div className="flex items-center justify-between gap-4 rounded-full border border-[#E0D8CB] bg-white/95 px-6 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md">
                                            <div className="flex items-center py-0.5">
                                                <img
                                                    src={
                                                        goldLogoPreview ||
                                                        currentLogoGold
                                                    }
                                                    alt="Preview Logo Emas"
                                                    className="h-9 w-auto max-w-40 object-contain transition-all"
                                                />
                                            </div>
                                            <div className="hidden items-center gap-4 text-[10px] font-bold tracking-widest text-[#5C564C] sm:flex">
                                                <span className="hover:text-[#0E2A1E]">
                                                    TENTANG
                                                </span>
                                                <span className="hover:text-[#0E2A1E]">
                                                    KOLEKSI
                                                </span>
                                                <span className="hover:text-[#0E2A1E]">
                                                    CARA PESAN
                                                </span>
                                                <span className="hover:text-[#0E2A1E]">
                                                    FAQ
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 rounded-full bg-[#0E2A1E] px-3.5 py-1.5 text-[9px] font-bold tracking-widest text-white uppercase shadow-2xs">
                                                <MessageCircle className="size-3 text-[#25D366]" />
                                                <span>INQUIRY &amp; PESAN</span>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-center text-[10px] text-[#8C877E]">
                                            Simulasi di atas menggunakan layout
                                            &amp; tipografi yang sama persis
                                            dengan bar navigasi landing page.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ASSET 2: LOGO PUTIH (DARK THEME / FOOTER) */}
                        <div className="rounded-3xl border border-[#143D2B] bg-[#071911] p-6 text-white shadow-xl sm:p-8">
                            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                                {/* Left Controls (5 Cols) */}
                                <div className="space-y-3 lg:col-span-5">
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#C5A880] uppercase">
                                        <span>
                                            ✦ Versi Gelap (Footer Hijau Zamrud)
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-white">
                                        Logo Brand Putih (White Edition)
                                    </h3>
                                    <p className="text-xs leading-relaxed text-white/70">
                                        Ditampilkan khusus pada area latar
                                        belakang gelap seperti Footer Zamrud
                                        Gelap agar teks dan ornamen tetap
                                        kontras, elegan, dan mudah terbaca.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <input
                                            ref={whiteInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                            onChange={handleWhiteFileChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                whiteInputRef.current?.click()
                                            }
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2.5 text-xs font-bold text-[#FAF0D7] shadow-xs transition-colors hover:bg-white/25"
                                        >
                                            <UploadCloud className="size-4 text-[#C5A880]" />
                                            <span>
                                                {whiteLogoPreview
                                                    ? 'Ganti File Foto'
                                                    : 'Unggah File Logo'}
                                            </span>
                                        </button>

                                        {whiteLogoPreview && (
                                            <button
                                                type="button"
                                                onClick={resetWhitePreview}
                                                className="cursor-pointer text-xs font-medium text-white/60 underline hover:text-red-300"
                                            >
                                                Batalkan Pilihan
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 text-[11px] text-white/50">
                                        <CheckCircle2 className="size-3.5 text-[#C5A880]" />
                                        <span>
                                            Format PNG transparan warna putih
                                            murni / SVG disarankan
                                        </span>
                                    </div>

                                    {errors.logo_white_file && (
                                        <p className="text-xs font-semibold text-red-300">
                                            {errors.logo_white_file}
                                        </p>
                                    )}
                                </div>

                                {/* Right: Live Website Footer Mockup (7 Cols) */}
                                <div className="lg:col-span-7">
                                    <div className="rounded-2xl border border-white/15 bg-[#030e09] p-5 shadow-inner">
                                        <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-bold tracking-wider text-white/50 uppercase">
                                            <span className="flex items-center gap-1.5">
                                                <Eye className="size-3 text-[#C5A880]" />
                                                Simulasi Tampilan Langsung di
                                                Footer Zamrud
                                            </span>
                                            {whiteLogoPreview && (
                                                <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-bold text-[#FAF0D7]">
                                                    Pratinjau File Baru
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer Inner Section Mockup */}
                                        <div className="space-y-4 rounded-xl border border-white/10 bg-[#071911] p-5">
                                            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
                                                <div>
                                                    <img
                                                        src={
                                                            whiteLogoPreview ||
                                                            currentLogoWhite
                                                        }
                                                        alt="Preview Logo Putih"
                                                        className="h-10 w-auto max-w-44 object-contain"
                                                    />
                                                </div>
                                                <div className="text-right text-[11px] text-white/70">
                                                    <span className="block text-[10px] font-bold tracking-wider text-[#C5A880] uppercase">
                                                        KONTAK &amp; LAYANAN
                                                    </span>
                                                    <span>
                                                        {data.contact_phone ||
                                                            '+62 815-7241-4233'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-white/50">
                                                <p className="line-clamp-1">
                                                    © {new Date().getFullYear()}{' '}
                                                    GALUH &amp; CO. Atelier
                                                    Hampers &amp; Corporate
                                                    Gift.
                                                </p>
                                                <span className="text-[#C5A880]">
                                                    ✦ Karawang, Indonesia
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 4. TAB 2: KONTAK & WHATSAPP                                               */}
                {/* ========================================================================= */}
                {activeTab === 'contact' && (
                    <div className="space-y-6 rounded-3xl border border-[#E0D8CB] bg-white p-6 shadow-xs sm:p-8">
                        <div className="border-b border-[#EAE5DC] pb-4">
                            <h3 className="font-serif text-lg font-bold text-[#1A1815]">
                                Informasi Kontak &amp; Jalur Pemesanan
                            </h3>
                            <p className="mt-0.5 text-xs text-[#6E6962]">
                                Atur nomor WhatsApp pemesanan dan informasi
                                kontak resmi yang ditampilkan di website.
                            </p>
                        </div>

                        <div className="max-w-2xl space-y-5">
                            {/* WhatsApp Number */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        Nomor WhatsApp Pemesanan *
                                    </label>
                                    <a
                                        href={`https://wa.me/${cleanWaNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                                    >
                                        <ExternalLink className="size-3" />
                                        <span>Uji Tautan WhatsApp</span>
                                    </a>
                                </div>
                                <div className="relative">
                                    <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-mono text-xs font-bold text-[#8C877E]">
                                        +
                                    </span>
                                    <input
                                        type="text"
                                        value={data.whatsapp_number}
                                        onChange={(e) =>
                                            setData(
                                                'whatsapp_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="6281572414233"
                                        className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-8 font-mono text-xs font-bold text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                    />
                                </div>
                                <p className="mt-1.5 text-[11px] text-[#8C877E]">
                                    Format nomor internasional tanpa tanda +
                                    (contoh:{' '}
                                    <code className="rounded border border-[#EAE5DC] bg-[#FAF8F5] px-1 py-0.5 font-mono text-[#0E2A1E]">
                                        6281572414233
                                    </code>
                                    ). Seluruh tombol pemesanan di landing page
                                    akan langsung membuka obrolan ke nomor ini.
                                </p>
                                {errors.whatsapp_number && (
                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                        {errors.whatsapp_number}
                                    </p>
                                )}
                            </div>

                            {/* Display Phone */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                    Nomor Telepon Display (Teks Footer)
                                </label>
                                <div className="relative">
                                    <Phone className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8C877E]" />
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) =>
                                            setData(
                                                'contact_phone',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="+62 815-7241-4233"
                                        className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-10 text-xs font-medium text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                    />
                                </div>
                                <p className="mt-1 text-[11px] text-[#8C877E]">
                                    Format nomor bebas yang tertulis untuk
                                    dibaca pengunjung di bagian footer.
                                </p>
                            </div>

                            {/* Email & Jam Operasional */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        Email Resmi
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8C877E]" />
                                        <input
                                            type="email"
                                            value={data.contact_email}
                                            onChange={(e) =>
                                                setData(
                                                    'contact_email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="halo@galuh.co"
                                            className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-10 text-xs text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                    {errors.contact_email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.contact_email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        Jam Layanan &amp; Operasional
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8C877E]" />
                                        <input
                                            type="text"
                                            value={data.operational_hours}
                                            onChange={(e) =>
                                                setData(
                                                    'operational_hours',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Senin - Sabtu: 08.00 - 20.00 WIB"
                                            className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-10 text-xs text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alamat Galeri & Workshop */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                    Alamat Galeri &amp; Workshop
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute top-3 left-3.5 size-4 text-[#8C877E]" />
                                    <textarea
                                        value={data.company_address}
                                        onChange={(e) =>
                                            setData(
                                                'company_address',
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        placeholder="Jl. Galuh Mas Raya No. 88, Karawang Barat, Jawa Barat 41361"
                                        className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-10 text-xs leading-relaxed text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                    />
                                </div>
                                <p className="mt-1 text-[11px] text-[#8C877E]">
                                    Alamat resmi galeri yang dicantumkan pada
                                    bagian kontak dan footer website.
                                </p>
                                {errors.company_address && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.company_address}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 5. TAB 3: TEKS HERO LANDING PAGE (LIVE TYPOGRAPHY CANVAS)                 */}
                {/* ========================================================================= */}
                {activeTab === 'hero' && (
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                        {/* Form Inputs (6 Cols) */}
                        <div className="space-y-5 rounded-3xl border border-[#E0D8CB] bg-white p-6 shadow-xs sm:p-8 lg:col-span-6">
                            <div>
                                <h3 className="font-serif text-lg font-bold text-[#1A1815]">
                                    Pesan Utama &amp; Teks Headline Depan
                                </h3>
                                <p className="mt-0.5 text-xs text-[#6E6962]">
                                    Teks pembuka pertama yang dibaca pengunjung
                                    saat membuka halaman utama Galuh &amp; Co.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        Pita Atas / Badge Brand
                                    </label>
                                    <input
                                        type="text"
                                        value={data.hero_badge}
                                        onChange={(e) =>
                                            setData(
                                                'hero_badge',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Signature Atelier Hampers & Gift"
                                        className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] px-4 py-2.5 text-xs font-semibold text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                    />
                                    <p className="mt-1 text-[11px] text-[#8C877E]">
                                        Ditampilkan di atas foto produk dalam
                                        bentuk label aksen elegan.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        Awalan Judul Headline
                                    </label>
                                    <input
                                        type="text"
                                        value={data.hero_title_prefix}
                                        onChange={(e) =>
                                            setData(
                                                'hero_title_prefix',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Hampers Eksklusif"
                                        className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] px-4 py-2.5 text-xs font-bold text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                    />
                                    <p className="mt-1 text-[11px] text-[#8C877E]">
                                        Diikuti secara otomatis oleh kata
                                        berganti (&quot;untuk Mom&quot;,
                                        &quot;untuk Mitra Bisnis&quot;, dll).
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        Paragraf Deskripsi Hero
                                    </label>
                                    <textarea
                                        value={data.hero_description}
                                        onChange={(e) =>
                                            setData(
                                                'hero_description',
                                                e.target.value,
                                            )
                                        }
                                        rows={4}
                                        placeholder="Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif..."
                                        className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] p-4 text-xs leading-relaxed text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                    />
                                    <p className="mt-1 text-[11px] text-[#8C877E]">
                                        Jelaskan nilai keunikan layanan Galuh
                                        &amp; Co. dalam 2-3 kalimat ringkas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Live Hero Section Preview (6 Cols) */}
                        <div className="space-y-3 lg:col-span-6">
                            <div className="flex items-center justify-between px-1 text-[10px] font-bold tracking-wider text-[#8C877E] uppercase">
                                <span className="flex items-center gap-1.5">
                                    <Eye className="size-3 text-[#C5A880]" />
                                    Simulasi Tampilan Hero Landing Page
                                </span>
                                <span className="font-bold text-[#C5A880]">
                                    Live Canvas
                                </span>
                            </div>

                            {/* Mini Hero Mockup in Ivory Warm Theme */}
                            <div className="relative space-y-5 overflow-hidden rounded-3xl border border-[#E0D8CB] bg-[#FAF7F2] p-6 shadow-xs sm:p-8">
                                {/* Subtle Gold Glow Accent */}
                                <div className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-[#C5A880]/10 blur-2xl" />

                                {/* Badge */}
                                <div className="inline-flex items-center rounded-full border border-[#D5CEC2] bg-white/95 px-3.5 py-1 text-[10px] font-bold tracking-[0.16em] text-[#0E2A1E] uppercase shadow-2xs">
                                    <span>
                                        {(
                                            data.hero_badge ||
                                            'Signature Atelier Hampers & Gift'
                                        )
                                            .replace(
                                                /^[✦*✨\s]+|[✦*✨\s]+$/g,
                                                '',
                                            )
                                            .trim()}
                                    </span>
                                </div>

                                {/* Headline */}
                                <div>
                                    <h1 className="font-serif text-3xl leading-tight font-bold tracking-tight text-[#1A1815] sm:text-4xl">
                                        {data.hero_title_prefix ||
                                            'Hampers Eksklusif'}{' '}
                                        <span className="block font-normal text-[#C5A880] italic sm:inline">
                                            untuk Momen Istimewa
                                        </span>
                                    </h1>
                                </div>

                                {/* Description */}
                                <p className="max-w-md text-xs leading-relaxed text-[#5C564C]">
                                    {data.hero_description ||
                                        'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.'}
                                </p>

                                {/* Buttons */}
                                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                                    <span className="inline-flex items-center rounded-full bg-[#0E2A1E] px-4 py-2 text-[10px] font-bold tracking-wider text-white shadow-xs">
                                        LIHAT KOLEKSI
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5CEC2] bg-white px-4 py-2 text-[10px] font-bold tracking-wider text-[#0E2A1E] shadow-2xs">
                                        <MessageCircle className="size-3 text-[#25D366]" />
                                        <span>PESAN VIA WHATSAPP</span>
                                    </span>
                                </div>

                                {/* Stats Bar */}
                                <div className="flex items-center gap-4 border-t border-[#EAE5DC] pt-3 text-[10px] text-[#6E6962]">
                                    <span className="font-bold text-[#0E2A1E]">
                                        5,000+ Hampers Terkirim
                                    </span>
                                    <span>•</span>
                                    <span className="font-bold text-[#C5A880]">
                                        ★ 4.9/5.0 Kepuasan
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* 6. TAB 4: MEDIA SOSIAL                                                    */}
                {/* ========================================================================= */}
                {activeTab === 'social' && (
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                        {/* Form Inputs (7 Cols) */}
                        <div className="space-y-5 rounded-3xl border border-[#E0D8CB] bg-white p-6 shadow-xs sm:p-8 lg:col-span-7">
                            <div>
                                <h3 className="font-serif text-lg font-bold text-[#1A1815]">
                                    Tautan Profil Media Sosial Resmi
                                </h3>
                                <p className="mt-0.5 text-xs text-[#6E6962]">
                                    Pengunjung dapat terhubung dengan portofolio
                                    Instagram, TikTok, dan LinkedIn resmi Galuh
                                    &amp; Co.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        URL Akun Instagram
                                    </label>
                                    <div className="relative">
                                        <Instagram className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#E1306C]" />
                                        <input
                                            type="url"
                                            value={data.instagram_url}
                                            onChange={(e) =>
                                                setData(
                                                    'instagram_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://instagram.com/galuh.co"
                                            className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-10 text-xs text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                    {errors.instagram_url && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.instagram_url}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        URL Akun TikTok
                                    </label>
                                    <div className="relative">
                                        <Share2 className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#1A1815]" />
                                        <input
                                            type="url"
                                            value={data.tiktok_url}
                                            onChange={(e) =>
                                                setData(
                                                    'tiktok_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://tiktok.com/@galuh.co"
                                            className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-10 text-xs text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                    {errors.tiktok_url && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.tiktok_url}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#1A1815] uppercase">
                                        URL Akun LinkedIn (Opsional)
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#0077B5]" />
                                        <input
                                            type="text"
                                            value={data.linkedin_url}
                                            onChange={(e) =>
                                                setData(
                                                    'linkedin_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://linkedin.com/company/galuh-co"
                                            className="w-full rounded-xl border border-[#D5CEC2] bg-[#FAF8F5] py-2.5 pr-4 pl-10 text-xs text-[#1A1815] focus:border-[#0E2A1E] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Live Social Icon Strip Preview (5 Cols) */}
                        <div className="space-y-4 lg:col-span-5">
                            <div className="space-y-4 rounded-3xl border border-[#143D2B] bg-[#071911] p-6 text-white">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#C5A880] uppercase">
                                    <Share2 className="size-3.5 text-[#C5A880]" />
                                    Tampilan Ikon di Footer Gelap
                                </span>

                                <p className="text-xs leading-relaxed text-white/70">
                                    Ikon sosial ini muncul di bagian bawah
                                    website dengan animasi rotasi dan aksen emas
                                    saat diarahkan kursor.
                                </p>

                                <div className="flex items-center justify-around rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <a
                                        href={data.instagram_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-[#C5A880]"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
                                            <Instagram className="size-4 text-[#FAF0D7]" />
                                        </div>
                                        <span className="text-[10px] font-medium">
                                            Instagram
                                        </span>
                                    </a>

                                    <a
                                        href={data.tiktok_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-[#C5A880]"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
                                            <Share2 className="size-4 text-[#FAF0D7]" />
                                        </div>
                                        <span className="text-[10px] font-medium">
                                            TikTok
                                        </span>
                                    </a>

                                    <a
                                        href={data.linkedin_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-[#C5A880]"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
                                            <Linkedin className="size-4 text-[#FAF0D7]" />
                                        </div>
                                        <span className="text-[10px] font-medium">
                                            LinkedIn
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. UNIFIED BOTTOM SAVE BAR */}
                <div className="flex flex-col justify-between gap-4 border-t border-[#EAE5DC] pt-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-xs text-[#6E6962]">
                        <Check className="size-4 text-emerald-600" />
                        <span>
                            Perubahan yang disimpan akan langsung tercermin
                            secara instan di sistem landing page.
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0E2A1E] px-8 py-3 text-xs font-bold tracking-wider text-white shadow-md transition-all hover:bg-[#163d2c] hover:shadow-lg disabled:opacity-50"
                    >
                        <Save className="size-3.5 text-[#C5A880]" />
                        <span>
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Semua Pengaturan'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
