import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@galuh.co',
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

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#071911] px-4 py-12 selection:bg-[#C5A880] selection:text-[#0E2A1E]">
                {/* Subtle Luxury Mesh Ambient Overlay */}
                <div
                    className="pointer-events-none absolute -top-40 -left-40 size-[450px] rounded-full bg-[#C5A880]/10 blur-[120px]"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -right-40 -bottom-40 size-[450px] rounded-full bg-[#113825]/30 blur-[120px]"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-sm">
                    {/* Brand Logo & Header */}
                    <div className="mb-6 text-center">
                        <div className="inline-flex justify-center">
                            <GaluhLogo
                                variant="white"
                                className="h-10 w-auto"
                                textClassName="text-white"
                            />
                        </div>
                        <h1 className="mt-3 font-serif text-xl font-bold tracking-tight text-white">
                            Atelier CMS &amp; Command Studio
                        </h1>
                        <p className="mt-1 text-xs text-white/60">
                            Masuk untuk mengelola katalog, leads, dan pengaturan
                            situs.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-xl border border-white/10 bg-[#0A2218]/90 p-6 shadow-2xl backdrop-blur-md">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-[11px] font-semibold tracking-wider text-white/80 uppercase"
                                >
                                    Email Admin
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-white/40" />
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
                                        className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pr-3 pl-8 text-xs text-white placeholder:text-white/30 focus:border-[#C5A880] focus:bg-white/10 focus:outline-hidden"
                                        placeholder="admin@galuh.co"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-rose-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-[11px] font-semibold tracking-wider text-white/80 uppercase"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-white/40" />
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
                                        className="w-full rounded-lg border border-white/15 bg-white/5 py-2 pr-3 pl-8 text-xs text-white placeholder:text-white/30 focus:border-[#C5A880] focus:bg-white/10 focus:outline-hidden"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-rose-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Checkbox */}
                            <div className="flex items-center justify-between pt-0.5 text-xs text-white/70">
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
                                        className="size-3.5 rounded border-white/20 bg-white/10 text-[#0E2A1E] focus:ring-0"
                                    />
                                    <span>Ingat sesi login</span>
                                </label>
                                <span className="inline-flex items-center gap-1 text-[10px] text-white/50">
                                    <ShieldCheck className="size-3 text-emerald-400" />
                                    <span>SSL Terenkripsi</span>
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-[#C5A880] py-2.5 text-xs font-semibold text-[#071911] shadow-md transition-all hover:bg-[#d4b993] disabled:opacity-50"
                            >
                                {processing
                                    ? 'Memverifikasi...'
                                    : 'Masuk ke Dashboard'}
                            </button>
                        </form>

                        {/* Helper credentials */}
                        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-center text-[10px] text-white/60">
                            <span className="font-medium text-white/80">
                                Default:
                            </span>{' '}
                            <code className="font-mono text-[#E6CFA8]">
                                admin@galuh.co
                            </code>{' '}
                            &bull;{' '}
                            <code className="font-mono text-[#E6CFA8]">
                                password
                            </code>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-5 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="size-3" />
                            <span>Kembali ke Landing Page Utama</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
