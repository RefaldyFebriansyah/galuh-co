import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Lock, Mail, Shield, ShieldCheck } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@galuhco.id',
        password: '',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <>
            <Head title="Masuk ke Panel Admin — GALUH & CO." />

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 font-sans selection:bg-[#16233B] selection:text-white">
                {/* Subtle Modern Ambient Background */}
                <div
                    className="pointer-events-none absolute -top-40 -left-40 size-[450px] rounded-full bg-slate-200/50 blur-[120px]"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -right-40 -bottom-40 size-[450px] rounded-full bg-[#16233B]/5 blur-[120px]"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-sm">
                    {/* Brand Logo & Header */}
                    <div className="mb-6 text-center">
                        <div className="inline-flex justify-center">
                            <GaluhLogo className="h-11 w-auto" />
                        </div>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold tracking-widest text-[#16233B] uppercase shadow-2xs">
                            <Shield className="size-3 text-[#D4AF37]" />
                            <span>PORTAL RESMI ADMIN</span>
                        </div>
                        <h1 className="mt-2.5 font-sans text-2xl font-extrabold tracking-tight text-[#16233B]">
                            Atelier Command Studio
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Masuk untuk memproses pesanan, tracking resi, dan
                            mengelola seluruh konten website.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                >
                                    Email Admin
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        required
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                                        placeholder="admin@galuhco.id"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        required
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-xs text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#16233B] focus:ring-1 focus:ring-[#16233B] focus:outline-hidden"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Checkbox */}
                            <div className="flex items-center justify-between pt-0.5 text-xs text-slate-500">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-slate-300 text-[#16233B] focus:ring-[#16233B]"
                                    />
                                    <span>Ingat sesi admin</span>
                                </label>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                                    <ShieldCheck className="size-3.5 text-emerald-600" />
                                    <span>Role: Admin</span>
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer rounded-xl bg-[#16233B] py-3 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-xs transition-all duration-300 hover:bg-[#223354] active:scale-[0.99] disabled:opacity-50"
                            >
                                {processing
                                    ? 'Memverifikasi...'
                                    : 'Masuk ke Dashboard Admin'}
                            </button>
                        </form>

                        {/* Helper credentials pill for quick test */}
                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-600">
                            <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                Kredensial Bawaan:
                            </div>
                            <div className="mt-1 font-mono text-[11px] font-semibold text-[#16233B]">
                                admin@galuhco.id &bull; password
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setData({
                                        email: 'admin@galuhco.id',
                                        password: 'password',
                                        remember: true,
                                    });
                                }}
                                className="mt-2 inline-flex cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#16233B] hover:border-slate-400"
                            >
                                Isi Otomatis Kredensial
                            </button>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-5 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#16233B]"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Halaman Depan</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
