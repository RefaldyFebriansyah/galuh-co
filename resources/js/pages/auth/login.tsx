import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Lock,
    Mail,
    Phone,
    User,
    CheckCircle2,
    Eye,
    EyeOff,
} from 'lucide-react';
import { useState, type FormEventHandler } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Masuk Akun — GALUH & CO." />

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F2EBDC] px-4 py-4 font-sans selection:bg-[#A88B54] selection:text-white md:h-screen md:overflow-hidden md:py-0">
                {/* Decorative Subtle Foil Glow */}
                <div
                    className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-[#A88B54]/10 blur-[100px]"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-[#16233B]/10 blur-[100px]"
                    aria-hidden="true"
                />

                <div className="relative z-10 w-full max-w-md">
                    {/* Brand Header */}
                    <div className="mb-3 text-center sm:mb-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wider text-[#6E675D] uppercase transition-colors hover:text-[#16233B]"
                        >
                            <ArrowLeft className="size-3" />
                            <span>Kembali ke Beranda</span>
                        </Link>

                        <div className="mt-2.5 flex justify-center">
                            <GaluhLogo className="h-9 w-auto sm:h-10" />
                        </div>

                        <h1 className="mt-2 font-serif text-xl font-bold tracking-tight text-[#16233B] sm:text-2xl">
                            Masuk Akun Pelanggan &amp; Pengelola
                        </h1>
                        <p className="mt-0.5 text-xs text-[#6E675D]">
                            Masuk untuk melakukan pemesanan hampers, pelacakan
                            resi, atau mengelola pesanan Anda.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-3 rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 text-xs text-emerald-800">
                            {status}
                        </div>
                    )}

                    {/* Card Container */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white/95 p-5 shadow-[0_12px_36px_-12px_rgba(22,35,59,0.08)] backdrop-blur-md sm:p-6 md:p-7">
                        <form
                            onSubmit={submit}
                            className="space-y-3 sm:space-y-3.5"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                >
                                    Alamat Email
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
                                        placeholder="nama@email.com"
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
                                <div className="mb-1 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                    >
                                        Kata Sandi
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10.5px] font-medium text-[#A88B54] hover:underline"
                                        >
                                            Lupa kata sandi?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6E675D]" />
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        required
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] py-2.5 pr-10 pl-9 text-xs text-[#16233B] transition-all placeholder:text-[#6E675D]/50 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6E675D] transition-colors hover:text-[#16233B] focus:outline-hidden"
                                        aria-label={
                                            showPassword
                                                ? 'Sembunyikan kata sandi'
                                                : 'Tampilkan kata sandi'
                                        }
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between pt-0.5">
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
                                    <span className="text-xs text-[#6E675D]">
                                        Ingat saya di perangkat ini
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer rounded-full bg-[#16233B] py-2.5 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-md transition-all duration-300 hover:bg-[#223354] active:scale-[0.99] disabled:opacity-50 sm:py-3"
                            >
                                {processing ? 'Memproses...' : 'Masuk ke Akun'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-3.5 flex items-center justify-center sm:my-4">
                            <div className="w-full border-t border-[#DFD7C5]" />
                            <span className="absolute bg-white px-3 text-[10px] font-bold tracking-wider text-[#6E675D] uppercase">
                                atau masuk dengan google
                            </span>
                        </div>

                        {/* Google OAuth Login Button */}
                        <a
                            href="/auth/google"
                            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#DFD7C5] bg-white py-2 text-xs font-bold text-[#16233B] shadow-2xs transition-all duration-200 hover:border-[#16233B] hover:bg-[#FAF6EE] sm:py-2.5"
                        >
                            <svg className="size-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span>Lanjutkan dengan Google</span>
                        </a>

                        {/* Register Link */}
                        <p className="mt-3.5 text-center text-xs text-[#6E675D] sm:mt-4">
                            Belum memiliki akun?{' '}
                            <Link
                                href="/register"
                                className="font-bold text-[#16233B] underline underline-offset-2 hover:text-[#A88B54]"
                            >
                                Daftar Akun Baru
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
