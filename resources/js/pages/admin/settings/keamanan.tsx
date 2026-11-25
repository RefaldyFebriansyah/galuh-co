import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Shield, Key, User, Mail, Save, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface AdminUserData {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface AdminSettingsKeamananProps {
    adminUser: AdminUserData;
}

export default function AdminSettingsKeamanan({
    adminUser,
}: AdminSettingsKeamananProps) {
    const [name, setName] = useState(adminUser?.name || 'Administrator Utama');
    const [email, setEmail] = useState(adminUser?.email || 'admin@galuhco.id');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (newPassword && newPassword.length < 6) {
            setErrors({ new_password: 'Kata sandi baru minimal 6 karakter.' });
            return;
        }

        if (newPassword && newPassword !== newPasswordConfirmation) {
            setErrors({
                new_password_confirmation:
                    'Konfirmasi kata sandi baru tidak cocok.',
            });
            return;
        }

        setIsSaving(true);
        router.post(
            '/admin/pengaturan/keamanan',
            {
                name,
                email,
                current_password: currentPassword || null,
                new_password: newPassword || null,
                new_password_confirmation: newPasswordConfirmation || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setNewPasswordConfirmation('');
                    setIsSaving(false);
                },
                onError: (errs) => {
                    setErrors(errs);
                    setIsSaving(false);
                },
            },
        );
    };

    return (
        <AdminLayout
            title="Akun & Keamanan"
            subtitle="Kelola profil administrator utama, alamat email sistem, dan ubah kata sandi akses."
        >
            <Head title="Akun & Keamanan — Pengaturan Admin" />

            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                {/* 1. Profil Administrator */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                            <User className="size-4 text-[#D4AF37]" />
                            <span>DATA PROFIL ADMINISTRATOR</span>
                        </div>
                        <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                            Identitas Akun Admin Tunggal
                        </h2>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                            Nama Lengkap Administrator:
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                        />
                        {errors.name && (
                            <p className="mt-1 text-[11px] text-rose-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                            Alamat Email Login:
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                        />
                        {errors.email && (
                            <p className="mt-1 text-[11px] text-rose-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. Ubah Kata Sandi */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                            <Key className="size-4 text-[#D4AF37]" />
                            <span>KEAMANAN & KATA SANDI</span>
                        </div>
                        <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                            Perbarui Kata Sandi Akses
                        </h2>
                        <p className="mt-1 text-[11px] text-slate-500">
                            Kosongkan jika Anda tidak ingin mengubah kata sandi.
                        </p>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                            Kata Sandi Saat Ini:
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Masukkan sandi saat ini..."
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                        />
                        {errors.current_password && (
                            <p className="mt-1 text-[11px] text-rose-600">
                                {errors.current_password}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                                Kata Sandi Baru:
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimal 6 karakter..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                            />
                            {errors.new_password && (
                                <p className="mt-1 text-[11px] text-rose-600">
                                    {errors.new_password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase">
                                Konfirmasi Kata Sandi Baru:
                            </label>
                            <input
                                type="password"
                                value={newPasswordConfirmation}
                                onChange={(e) =>
                                    setNewPasswordConfirmation(e.target.value)
                                }
                                placeholder="Ulangi kata sandi baru..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                            />
                            {errors.new_password_confirmation && (
                                <p className="mt-1 text-[11px] text-rose-600">
                                    {errors.new_password_confirmation}
                                </p>
                            )}
                        </div>
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
                                : 'Simpan Profil & Keamanan'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
