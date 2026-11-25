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

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F2EBDC] px-4 py-12 font-sans selection:bg-[#A88B54] selection:text-white">
                {/* Subtle Luxury Ambient Background */}
                <div
                    className="pointer-events-none absolute -top-40 -left-40 size-[450px] rounded-full bg-[#A88B54]/10 blur-[120px]"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -right-40 -bottom-40 size-[450px] rounded-full bg-[#16233B]/10 blur-[120px]"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-sm">
                    {/* Brand Logo & Header */}
                    <div className="mb-6 text-center">
                        <div className="inline-flex justify-center">
                            <GaluhLogo className="h-11 w-auto" />
                        </div>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#A88B54]/30 bg-[#16233B] px-3 py-1 text-[10px] font-bold tracking-widest text-[#F2EBDC] uppercase">
                            <Shield className="size-3 text-[#A88B54]" />
                            <span>PORTAL RESMI ADMIN</span>
                        </div>
                        <h1 className="mt-2.5 font-serif text-2xl font-bold tracking-tight text-[#16233B]">
                            Atelier Command Studio
                        </h1>
                        <p className="mt-1 text-xs text-[#6E675D]">
                            Masuk untuk memproses pesanan, tracking resi, dan
                            mengelola seluruh konten website.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white/95 p-6 shadow-[0_16px_40px_-16px_rgba(22,35,59,0.12)] backdrop-blur-md">
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
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6E675D]" />
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
                                        className="w-full rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] py-2.5 pr-4 pl-9 text-xs text-[#16233B] transition-all placeholder:text-[#6E675D]/50 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
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
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6E675D]" />
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
                                        className="w-full rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] py-2.5 pr-4 pl-9 text-xs text-[#16233B] transition-all placeholder:text-[#6E675D]/50 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
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
                            <div className="flex items-center justify-between pt-0.5 text-xs text-[#6E675D]">
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
                                        className="size-4 rounded border-[#DFD7C5] text-[#16233B] focus:ring-[#A88B54]"
                                    />
                                    <span>Ingat sesi admin</span>
                                </label>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#A88B54]">
                                    <ShieldCheck className="size-3.5 text-emerald-600" />
                                    <span>Role: Admin</span>
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer rounded-full bg-[#16233B] py-3 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-md transition-all duration-300 hover:bg-[#223354] active:scale-[0.99] disabled:opacity-50"
                            >
                                {processing
                                    ? 'Memverifikasi...'
                                    : 'Masuk ke Dashboard Admin'}
                            </button>
                        </form>

                        {/* Helper credentials pill for quick test */}
                        <div className="mt-5 rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] p-3 text-center text-xs text-[#6E675D]">
                            <div className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
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
                                className="mt-2 inline-flex cursor-pointer items-center rounded-lg border border-[#DFD7C5] bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#16233B] hover:border-[#16233B]"
                            >
                                Isi Otomatis Kredensial
                            </button>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-5 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E675D] transition-colors hover:text-[#16233B]"
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
