import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Check,
    CheckCircle2,
    Clock,
    Edit3,
    Image as ImageIcon,
    Key,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Plus,
    Save,
    Share2,
    Shield,
    Trash2,
    UploadCloud,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface SettingItem {
    id: number;
    key: string;
    value: string | null;
    type: string;
    label: string | null;
    description: string | null;
}

interface TeamUser {
    id: number;
    name: string;
    email: string;
    role: string;
    phone_number?: string | null;
    created_at: string;
}

interface Props {
    settings: Record<string, Record<string, SettingItem>>;
    team: TeamUser[];
}

export default function AdminSettingsIndex({ settings, team }: Props) {
    const [activeTab, setActiveTab] = useState<'concierge' | 'team' | 'branding' | 'social'>('concierge');

    // Branding files preview
    const currentLogoGold = settings.branding?.logo_gold?.value || '/images/galuh_logo_gold.png';
    const currentLogoWhite = settings.branding?.logo_white?.value || '/images/galuh_logo_white.png';
    const [goldLogoPreview, setGoldLogoPreview] = useState<string | null>(null);
    const [whiteLogoPreview, setWhiteLogoPreview] = useState<string | null>(null);
    const goldInputRef = useRef<HTMLInputElement>(null);
    const whiteInputRef = useRef<HTMLInputElement>(null);

    // Main settings form
    const form = useForm({
        // Concierge & Contact
        whatsapp_number: settings.contact?.whatsapp_number?.value || '6281572414233',
        whatsapp_backup_number: settings.contact?.whatsapp_backup_number?.value || '6281298765432',
        whatsapp_default_message:
            settings.contact?.whatsapp_default_message?.value ||
            'Halo Concierge GALUH & CO., saya ingin konsultasi kurasi bingkisan eksklusif.',
        contact_phone: settings.contact?.contact_phone?.value || '+62 815-7241-4233',
        contact_email: settings.contact?.contact_email?.value || 'concierge@galuh.co',
        company_address:
            settings.contact?.company_address?.value ||
            'Jl. Sukajadi No. 128, Pasteur, Bandung, Jawa Barat 40162',
        operational_hours:
            settings.contact?.operational_hours?.value ||
            'Senin - Sabtu: 08.30 - 18.00 WIB (Minggu Studio Libur)',

        // Branding
        logo_gold_file: null as File | null,
        logo_white_file: null as File | null,

        // Social
        instagram_url: settings.social?.instagram_url?.value || 'https://instagram.com/galuh.co',
        tiktok_url: settings.social?.tiktok_url?.value || 'https://tiktok.com/@galuh.co',
        linkedin_url: settings.social?.linkedin_url?.value || 'https://linkedin.com/company/galuh-co',
    });

    const submitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/pengaturan');
    };

    // Team user modal form
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<TeamUser | null>(null);
    const userForm = useForm({
        name: '',
        email: '',
        role: 'admin',
        phone_number: '628',
        password: '',
    });

    const openAddUser = () => {
        setEditingUser(null);
        userForm.setData({
            name: '',
            email: '',
            role: 'admin',
            phone_number: '628',
            password: '',
        });
        setUserModalOpen(true);
    };

    const openEditUser = (u: TeamUser) => {
        setEditingUser(u);
        userForm.setData({
            name: u.name,
            email: u.email,
            role: 'admin',
            phone_number: u.phone_number || '628',
            password: '',
        });
        setUserModalOpen(true);
    };

    const submitUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            userForm.post(`/admin/pengaturan/users/${editingUser.id}`, {
                onSuccess: () => setUserModalOpen(false),
            });
        } else {
            userForm.post('/admin/pengaturan/users', {
                onSuccess: () => setUserModalOpen(false),
            });
        }
    };

    const handleDeleteUser = (u: TeamUser) => {
        if (confirm(`Hapus akses akun "${u.name}"?`)) {
            router.delete(`/admin/pengaturan/users/${u.id}`, { preserveScroll: true });
        }
    };

    const getRoleBadge = (_role: string) => {
        return {
            label: 'Administrator (Full Access)',
            bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
    };

    return (
        <AdminLayout
            title="Pengaturan WhatsApp Concierge & Tim"
            subtitle="Konfigurasi Nomor Layanan Klien, Studio Operasional & Akun Staf"
        >
            <div className="space-y-6">
                {/* 1. Atelier Nav Tabs */}
                <div className="flex border-b border-[#0B291E]/10 bg-white px-4 rounded-2xl shadow-2xs sm:px-6">
                    <nav className="flex space-x-6">
                        {[
                            { id: 'concierge', label: 'Concierge & Kontak WA', icon: MessageCircle },
                            { id: 'team', label: 'Tim Admin & Hak Akses', icon: Users },
                            { id: 'branding', label: 'Identitas Logo Brand', icon: ImageIcon },
                            { id: 'social', label: 'Tautan Media Sosial', icon: Share2 },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                    className={`relative flex items-center gap-2 py-4 text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'text-[#0B291E]'
                                            : 'text-[#0B291E]/50 hover:text-[#0B291E]'
                                    }`}
                                >
                                    <Icon
                                        className={`size-3.5 ${
                                            isActive ? 'text-[#B89352]' : 'text-[#0B291E]/40'
                                        }`}
                                    />
                                    <span>{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="settings-tab-active"
                                            className="absolute bottom-0 inset-x-0 h-0.5 bg-[#B89352]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* 2. TAB CONTENTS */}
                {/* TAB 1: CONCIERGE & KONTAK WA */}
                {activeTab === 'concierge' && (
                    <div className="rounded-2xl border border-[#0B291E]/10 bg-white p-6 shadow-2xs">
                        <div className="border-b border-[#0B291E]/10 pb-4">
                            <h3 className="text-base font-semibold text-[#0B291E]">
                                Nomor WhatsApp Resmi Concierge
                            </h3>
                            <p className="text-xs text-[#0B291E]/60">
                                Seluruh tombol &ldquo;Konsultasi WhatsApp&rdquo; di katalog, hero customizer, dan corporate gifting diarahkan ke nomor ini
                            </p>
                        </div>

                        <form onSubmit={submitSettings} className="mt-6 space-y-4 max-w-3xl text-xs">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Nomor WhatsApp Utama (Wajib Format 62)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.data.whatsapp_number}
                                        onChange={(e) => form.setData('whatsapp_number', e.target.value)}
                                        placeholder="6281572414233"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 font-mono text-xs focus:outline-hidden"
                                    />
                                    <p className="text-[10px] text-[#0B291E]/50">
                                        Nomor penerima utama semua chat konsultasi website
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Nomor WhatsApp Cadangan / Hotline
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.whatsapp_backup_number}
                                        onChange={(e) => form.setData('whatsapp_backup_number', e.target.value)}
                                        placeholder="6281298765432"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 font-mono text-xs focus:outline-hidden"
                                    />
                                    <p className="text-[10px] text-[#0B291E]/50">
                                        Nomor alternatif saat peak season Idul Fitri / Akhir Tahun
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-[#0B291E]">
                                    Pesan Default Pembuka WhatsApp
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.data.whatsapp_default_message}
                                    onChange={(e) => form.setData('whatsapp_default_message', e.target.value)}
                                    className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 text-xs focus:outline-hidden"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Jam Operasional Studio &amp; Layanan WA
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.operational_hours}
                                        onChange={(e) => form.setData('operational_hours', e.target.value)}
                                        placeholder="Senin - Sabtu: 08.30 - 18.00 WIB"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Email Resmi Korespondensi
                                    </label>
                                    <input
                                        type="email"
                                        value={form.data.contact_email}
                                        onChange={(e) => form.setData('contact_email', e.target.value)}
                                        placeholder="concierge@galuh.co"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 text-xs focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 pt-1">
                                <label className="font-semibold text-[#0B291E]">
                                    Alamat Workshop / Studio Gallery
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.data.company_address}
                                    onChange={(e) => form.setData('company_address', e.target.value)}
                                    className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 text-xs focus:outline-hidden"
                                />
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E] disabled:opacity-50"
                                >
                                    <Save className="size-3.5 text-[#B89352]" />
                                    <span>{form.processing ? 'Menyimpan...' : 'Simpan Pengaturan Concierge'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 2: TIM ADMIN & HAK AKSES */}
                {activeTab === 'team' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-[#0B291E]">
                                    Tim Admin &amp; Hak Akses Staf
                                </h3>
                                <p className="text-xs text-[#0B291E]/60">
                                    Akun operasional studio: Super Admin, Admin CS WhatsApp, dan Tim Produksi
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openAddUser}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E]"
                            >
                                <Plus className="size-3.5 text-[#B89352]" />
                                <span>Tambah Anggota Tim</span>
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[#0B291E]/10 bg-white shadow-2xs">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#0B291E]/10 bg-[#FAF8F5] font-mono text-[9.5px] font-bold tracking-wider text-[#B89352] uppercase">
                                        <th className="py-3 px-4">Nama Staf &amp; Avatar</th>
                                        <th className="py-3 px-4">Email Login</th>
                                        <th className="py-3 px-4">Peran / Hak Akses</th>
                                        <th className="py-3 px-4">No. WhatsApp</th>
                                        <th className="py-3 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#0B291E]/5 text-[#0B291E]">
                                    {team.map((u) => {
                                        const rBadge = getRoleBadge(u.role);

                                        return (
                                            <tr key={u.id} className="transition-colors hover:bg-[#F7F5F0]/50">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] font-bold text-[#0B291E]">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-sm text-[#0B291E]">
                                                            {u.name}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 font-mono text-xs text-[#0B291E]/80">
                                                    {u.email}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span
                                                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${rBadge.bg}`}
                                                    >
                                                        {rBadge.label}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 font-mono text-xs text-[#0B291E]/70">
                                                    {u.phone_number ? `+${u.phone_number}` : '-'}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditUser(u)}
                                                            className="p-1 text-[#0B291E]/60 hover:text-[#0B291E]"
                                                            title="Edit Akun"
                                                        >
                                                            <Edit3 className="size-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteUser(u)}
                                                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                                            title="Hapus Akun"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: BRANDING LOGO */}
                {activeTab === 'branding' && (
                    <div className="rounded-2xl border border-[#0B291E]/10 bg-white p-6 shadow-2xs">
                        <div className="border-b border-[#0B291E]/10 pb-4">
                            <h3 className="text-base font-semibold text-[#0B291E]">
                                Identitas Brand &amp; Aset Logo
                            </h3>
                            <p className="text-xs text-[#0B291E]/60">
                                Logo resmi Galuh &amp; Co. dalam format Gold dan White untuk header website &amp; surat penawaran
                            </p>
                        </div>

                        <form onSubmit={submitSettings} className="mt-6 space-y-6 max-w-3xl text-xs">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Gold Logo */}
                                <div className="space-y-2 rounded-xl border border-[#0B291E]/10 bg-[#FAF8F5] p-4">
                                    <span className="font-semibold text-xs text-[#0B291E]">
                                        Logo Brand (Emas / Gelap)
                                    </span>
                                    <div className="flex h-24 items-center justify-center rounded-lg border border-[#0B291E]/10 bg-white p-4">
                                        <img
                                            src={goldLogoPreview || currentLogoGold}
                                            alt="Logo Gold"
                                            className="h-10 w-auto object-contain"
                                        />
                                    </div>
                                    <input
                                        ref={goldInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) {
                                                form.setData('logo_gold_file', f);
                                                setGoldLogoPreview(URL.createObjectURL(f));
                                            }
                                        }}
                                        className="w-full text-xs"
                                    />
                                </div>

                                {/* White Logo */}
                                <div className="space-y-2 rounded-xl border border-[#0B291E]/10 bg-[#0B291E] p-4 text-white">
                                    <span className="font-semibold text-xs text-[#FAF8F5]">
                                        Logo Brand (Putih / Kontras)
                                    </span>
                                    <div className="flex h-24 items-center justify-center rounded-lg border border-white/10 bg-[#071D15] p-4">
                                        <img
                                            src={whiteLogoPreview || currentLogoWhite}
                                            alt="Logo White"
                                            className="h-10 w-auto object-contain"
                                        />
                                    </div>
                                    <input
                                        ref={whiteInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) {
                                                form.setData('logo_white_file', f);
                                                setWhiteLogoPreview(URL.createObjectURL(f));
                                            }
                                        }}
                                        className="w-full text-xs text-white/70"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E] disabled:opacity-50"
                                >
                                    <Save className="size-3.5 text-[#B89352]" />
                                    <span>{form.processing ? 'Menyimpan...' : 'Simpan Logo Brand'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB 4: SOSIAL MEDIA */}
                {activeTab === 'social' && (
                    <div className="rounded-2xl border border-[#0B291E]/10 bg-white p-6 shadow-2xs">
                        <div className="border-b border-[#0B291E]/10 pb-4">
                            <h3 className="text-base font-semibold text-[#0B291E]">
                                Tautan Media Sosial Resmi
                            </h3>
                            <p className="text-xs text-[#0B291E]/60">
                                Akun Instagram, TikTok, dan LinkedIn yang dicantumkan pada footer website
                            </p>
                        </div>

                        <form onSubmit={submitSettings} className="mt-6 space-y-4 max-w-2xl text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-[#0B291E]">
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    value={form.data.instagram_url}
                                    onChange={(e) => form.setData('instagram_url', e.target.value)}
                                    placeholder="https://instagram.com/galuh.co"
                                    className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 text-xs focus:outline-hidden"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-[#0B291E]">
                                    TikTok URL
                                </label>
                                <input
                                    type="url"
                                    value={form.data.tiktok_url}
                                    onChange={(e) => form.setData('tiktok_url', e.target.value)}
                                    placeholder="https://tiktok.com/@galuh.co"
                                    className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 text-xs focus:outline-hidden"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-[#0B291E]">
                                    LinkedIn URL (B2B Profile)
                                </label>
                                <input
                                    type="text"
                                    value={form.data.linkedin_url}
                                    onChange={(e) => form.setData('linkedin_url', e.target.value)}
                                    placeholder="https://linkedin.com/company/galuh-co"
                                    className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2.5 text-xs focus:outline-hidden"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E] disabled:opacity-50"
                                >
                                    <Save className="size-3.5 text-[#B89352]" />
                                    <span>{form.processing ? 'Menyimpan...' : 'Simpan Media Sosial'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Modal Add / Edit User */}
            <AnimatePresence>
                {userModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs"
                        onClick={() => setUserModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#0B291E]/10 pb-3">
                                <h3 className="text-base font-semibold text-[#0B291E]">
                                    {editingUser ? 'Edit Akun Staf' : 'Tambah Anggota Tim Baru'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setUserModalOpen(false)}
                                    className="p-1 text-[#0B291E]/60 hover:text-[#0B291E]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form onSubmit={submitUser} className="mt-4 space-y-3 text-xs">
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={userForm.data.name}
                                        onChange={(e) => userForm.setData('name', e.target.value)}
                                        placeholder="Nama staf"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Alamat Email Login
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={userForm.data.email}
                                        onChange={(e) => userForm.setData('email', e.target.value)}
                                        placeholder="staf@galuh.co"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            Peran / Role
                                        </label>
                                        <select
                                            value={userForm.data.role}
                                            onChange={(e) =>
                                                userForm.setData('role', e.target.value)
                                            }
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        >
                                            <option value="admin">Administrator (Full Access)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#0B291E]">
                                            No. WhatsApp
                                        </label>
                                        <input
                                            type="text"
                                            value={userForm.data.phone_number || ''}
                                            onChange={(e) => userForm.setData('phone_number', e.target.value)}
                                            placeholder="628..."
                                            className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 font-mono text-xs focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        {editingUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        value={userForm.data.password}
                                        onChange={(e) => userForm.setData('password', e.target.value)}
                                        placeholder="Minimal 6 karakter"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-[#0B291E]/10">
                                    <button
                                        type="button"
                                        onClick={() => setUserModalOpen(false)}
                                        className="rounded-lg border px-3 py-1.5 text-xs text-[#0B291E]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={userForm.processing}
                                        className="rounded-lg bg-[#0B291E] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#143E2E]"
                                    >
                                        Simpan Akun
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
