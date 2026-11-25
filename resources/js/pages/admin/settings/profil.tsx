import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    FileText,
    Save,
    ExternalLink,
    Store,
    CheckCircle2,
    Navigation,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface ProfileSettings {
    footer_bio: string;
    contact_phone: string;
    whatsapp_number: string;
    contact_email: string;
    operational_hours: string;
    company_address: string;
    studio_gmaps_embed: string;
}

interface AdminSettingsProfilProps {
    profileSettings: ProfileSettings;
}

const buildGmapsEmbed = (rawAddress: string): string => {
    const clean = rawAddress.trim();
    if (!clean) return '';
    return `https://maps.google.com/maps?q=${encodeURIComponent(clean)}&output=embed`;
};

const cleanGmapsInput = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';

    // If pasted full <iframe> tag from Google Maps, extract src attribute
    const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
        return iframeMatch[1];
    }

    // If pasted regular Google Maps URL without output=embed, convert to embed format
    if (
        trimmed.includes('google.com/maps') &&
        !trimmed.includes('output=embed')
    ) {
        const placeMatch = trimmed.match(/\/place\/([^/@?]+)/i);
        if (placeMatch && placeMatch[1]) {
            const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
            return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
        }
    }

    return trimmed;
};

export default function AdminSettingsProfil({
    profileSettings,
}: AdminSettingsProfilProps) {
    const [footerBio, setFooterBio] = useState(
        profileSettings.footer_bio || '',
    );
    const [phone, setPhone] = useState(
        profileSettings.contact_phone
            ? profileSettings.contact_phone.replace(/^\+62\s?|^62|^0/, '')
            : '823-2177-3434',
    );
    const [email, setEmail] = useState(
        profileSettings.contact_email || 'halo@galuh.co',
    );
    const [hours, setHours] = useState(
        profileSettings.operational_hours || 'Senin - Sabtu: 08.00 - 18.00 WIB',
    );
    const initialAddress =
        profileSettings.company_address ||
        'Jl. Ir. H. Juanda No. 146, Ciamis, Jawa Barat 46211';
    const [address, setAddress] = useState(initialAddress);
    const [gmapsEmbed, setGmapsEmbed] = useState(
        profileSettings.studio_gmaps_embed || buildGmapsEmbed(initialAddress),
    );
    const [autoSyncMaps, setAutoSyncMaps] = useState(true);

    const handleAddressChange = (newAddress: string) => {
        setAddress(newAddress);
        if (autoSyncMaps) {
            setGmapsEmbed(buildGmapsEmbed(newAddress));
        }
    };

    const effectiveGmaps = gmapsEmbed.trim() || buildGmapsEmbed(address);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const cleanDigits = phone.replace(/\D/g, '');
        const formattedPhone = `+62 ${cleanDigits}`;

        router.post(
            '/admin/pengaturan/profil',
            {
                footer_bio: footerBio,
                contact_phone: formattedPhone,
                contact_email: email,
                operational_hours: hours,
                company_address: address,
                studio_gmaps_embed: effectiveGmaps,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AdminLayout
            title="Profil & Lokasi Studio"
            subtitle="Atur bio footer, kontak resmi (+62), jam operasional, dan titik peta studio kriya Galuh & Co."
        >
            <Head title="Profil & Lokasi Studio — Pengaturan Admin" />

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Kontak & Hotline Perusahaan */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                            <Phone className="size-4 text-[#D4AF37]" />
                            <span>INFORMASI KONTAK RESMI & HOTLINE (+62)</span>
                        </div>
                        <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                            Nomor Hotline, WhatsApp, & Email Galuh & Co.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                                Nomor Telepon / Hotline Resmi (+62):
                            </label>
                            <div className="mt-1 flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-[#16233B] focus-within:ring-1 focus-within:ring-[#16233B]">
                                <span className="inline-flex shrink-0 items-center border-r border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 select-none">
                                    +62
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="815-7241-4233"
                                    className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                                Alamat Email Resmi:
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="halo@galuh.co"
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                            Jam Operasional Studio & Concierge:
                        </label>
                        <input
                            type="text"
                            required
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            placeholder="Senin - Sabtu: 08.00 - 18.00 WIB"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                        />
                    </div>
                </div>

                {/* 2. Titik Lokasi Perusahaan & Google Maps */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                            <MapPin className="size-4 text-[#D4AF37]" />
                            <span>TITIK LOKASI PRODUKSI & PETA ATELIER</span>
                        </div>
                        <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                            Alamat Studio Produksi & Google Maps
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Data ini akan langsung memperbarui peta interaktif
                            di atas footer landing page secara real-time.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                                Alamat Lengkap Studio Atelier:
                            </label>
                            <span className="font-mono text-[9.5px] text-slate-500">
                                Terhubung Langsung ke Google Maps
                            </span>
                        </div>
                        <textarea
                            rows={2}
                            required
                            value={address}
                            onChange={(e) =>
                                handleAddressChange(e.target.value)
                            }
                            placeholder="Jl. Ir. H. Juanda No. 146, Ciamis, Jawa Barat 46211"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                                Google Maps Embed URL / Titik Koordinat:
                            </label>
                            <div className="flex items-center gap-2">
                                <label className="flex cursor-pointer items-center gap-1.5 font-mono text-[9.5px] text-slate-500">
                                    <input
                                        type="checkbox"
                                        checked={autoSyncMaps}
                                        onChange={(e) => {
                                            const nextSync = e.target.checked;
                                            setAutoSyncMaps(nextSync);
                                            if (nextSync) {
                                                setGmapsEmbed(
                                                    buildGmapsEmbed(address),
                                                );
                                            }
                                        }}
                                        className="size-3.5 accent-[#16233B]"
                                    />
                                    <span>Auto-Sync dari Alamat</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setGmapsEmbed(buildGmapsEmbed(address))
                                    }
                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-[#16233B] shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95"
                                    title="Klik untuk membuat embed URL otomatis berdasarkan alamat studio di atas"
                                >
                                    <Navigation className="size-3 text-[#16233B]" />
                                    <span>Isi Otomatis dari Alamat</span>
                                </button>
                            </div>
                        </div>

                        <input
                            type="text"
                            value={gmapsEmbed}
                            onChange={(e) => {
                                setGmapsEmbed(cleanGmapsInput(e.target.value));
                                setAutoSyncMaps(false);
                            }}
                            placeholder="Otomatis di-generate dari alamat studio di atas (atau paste link / tag <iframe> Google Maps)"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                        />

                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-500">
                            <span>
                                Otomatis terisi dari alamat di atas. Boleh
                                dikosongkan atau paste tag &lt;iframe&gt; / link
                                share Google Maps.
                            </span>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-[#16233B] hover:underline"
                            >
                                <span>Cek Titik di Google Maps</span>
                                <ExternalLink className="size-3" />
                            </a>
                        </div>
                    </div>

                    {/* Maps Live Preview */}
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
                            <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                                PREVIEW PETA STUDIO PADA WEBSITE:
                            </span>
                            <span className="max-w-xs truncate text-[10px] text-slate-500">
                                Titik: {address || 'Alamat Studio'}
                            </span>
                        </div>
                        <div className="h-64 w-full bg-slate-50">
                            {effectiveGmaps ? (
                                <iframe
                                    key={effectiveGmaps}
                                    title="Preview Maps Studio"
                                    src={effectiveGmaps}
                                    width="100%"
                                    height="100%"
                                    className="size-full border-0"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-500">
                                    <MapPin className="size-8 text-slate-400" />
                                    <p className="mt-2 font-semibold text-[#16233B]">
                                        Peta belum memiliki titik lokasi
                                    </p>
                                    <p className="text-xs">
                                        Isi alamat di atas untuk memuat peta
                                        Google Maps secara otomatis.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Teks Bio Footer Brand */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                            <FileText className="size-4 text-[#D4AF37]" />
                            <span>TEKS FILOSOFI PADA FOOTER</span>
                        </div>
                        <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                            Bio Ringkas Galuh & Co. di Bagian Footer
                        </h2>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                            Teks Profil Brand Footer:
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={footerBio}
                            onChange={(e) => setFooterBio(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#16233B] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#223354] disabled:opacity-50"
                    >
                        <Save className="size-4" />
                        <span>
                            {isSaving
                                ? 'Menyimpan...'
                                : 'Simpan Profil & Lokasi Studio'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
