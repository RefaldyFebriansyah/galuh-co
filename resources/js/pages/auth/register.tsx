import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Lock,
    Mail,
    Phone,
    User as UserIcon,
    Eye,
    EyeOff,
} from 'lucide-react';
import { useState, type FormEventHandler } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Daftar Akun Pelanggan — GALUH & CO." />

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F2EBDC] px-4 py-10 font-sans selection:bg-[#A88B54] selection:text-white">
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
                    <div className="mb-6 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#6E675D] uppercase transition-colors hover:text-[#16233B]"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Kembali ke Beranda</span>
                        </Link>

                        <div className="mt-4 flex justify-center">
                            <GaluhLogo className="h-11 w-auto" />
                        </div>

                        <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-[#16233B]">
                            Pendaftaran Akun Pelanggan
                        </h1>
                        <p className="mt-1 text-xs text-[#6E675D]">
                            Daftar untuk melakukan pemesanan hampers personal
                            &amp; corporate secara langsung di website.
                        </p>
                    </div>

                    {/* Card Container */}
                    <div className="rounded-2xl border border-[#DFD7C5] bg-white/95 p-6 shadow-[0_12px_36px_-12px_rgba(22,35,59,0.08)] backdrop-blur-md sm:p-8">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-1 block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                >
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6E675D]" />
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        required
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] py-2.5 pr-4 pl-9 text-xs text-[#16233B] transition-all placeholder:text-[#6E675D]/50 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        placeholder="Contoh: Rina Sastrowardoyo"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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
                                        autoComplete="email"
                                        required
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] py-2.5 pr-4 pl-9 text-xs text-[#16233B] transition-all placeholder:text-[#6E675D]/50 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        placeholder="rina@perusahaan.co.id"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label
                                    htmlFor="phone_number"
                                    className="mb-1 block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                >
                                    Nomor WhatsApp / Handphone
                                </label>
                                <div className="flex items-center overflow-hidden rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] transition-all focus-within:border-[#A88B54] focus-within:bg-white">
                                    <span className="inline-flex shrink-0 items-center border-r border-[#DFD7C5] bg-[#F2EBDC] px-3 py-2.5 text-xs font-bold text-[#16233B] select-none">
                                        ID +62
                                    </span>
                                    <input
                                        id="phone_number"
                                        type="tel"
                                        inputMode="numeric"
                                        name="phone_number"
                                        value={data.phone_number}
                                        required
                                        onChange={(e) => {
                                            let val = e.target.value.replace(
                                                /\D/g,
                                                '',
                                            );
                                            if (val.startsWith('62'))
                                                val = val.slice(2);
                                            if (val.startsWith('0'))
                                                val = val.slice(1);
                                            val = val.slice(0, 13);
                                            setData('phone_number', val);
                                        }}
                                        className="w-full bg-transparent px-3 py-2.5 text-xs text-[#16233B] focus:outline-hidden"
                                        placeholder="812-3456-7890"
                                    />
                                </div>
                                {errors.phone_number && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.phone_number}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                >
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6E675D]" />
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        required
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] py-2.5 pr-10 pl-9 text-xs text-[#16233B] transition-all placeholder:text-[#6E675D]/50 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        placeholder="Minimal 8 karakter"
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

                            {/* Password Confirmation */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-1 block text-[11px] font-bold tracking-wider text-[#16233B] uppercase"
                                >
                                    Ulangi Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6E675D]" />
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        required
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-[#DFD7C5] bg-[#FAF6EE] py-2.5 pr-10 pl-9 text-xs text-[#16233B] transition-all placeholder:text-[#6E675D]/50 focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        placeholder="Ketik ulang kata sandi"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6E675D] transition-colors hover:text-[#16233B] focus:outline-hidden"
                                        aria-label={
                                            showConfirmPassword
                                                ? 'Sembunyikan konfirmasi kata sandi'
                                                : 'Tampilkan konfirmasi kata sandi'
                                        }
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-xs text-rose-600">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer rounded-full bg-[#16233B] py-3 text-xs font-bold tracking-[0.14em] text-white uppercase shadow-md transition-all duration-300 hover:bg-[#223354] active:scale-[0.99] disabled:opacity-50"
                            >
                                {processing
                                    ? 'Mendaftarkan Akun...'
                                    : 'Daftar Akun Baru'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-5 flex items-center justify-center">
                            <div className="w-full border-t border-[#DFD7C5]" />
                            <span className="absolute bg-white px-3 text-[10px] font-bold tracking-wider text-[#6E675D] uppercase">
                                atau daftar dengan google
                            </span>
                        </div>

                        {/* Google OAuth Register Button */}
                        <a
                            href="/auth/google"
                            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#DFD7C5] bg-white py-2.5 text-xs font-bold text-[#16233B] shadow-2xs transition-all duration-200 hover:border-[#16233B] hover:bg-[#FAF6EE]"
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
                            <span>Daftar Cepat dengan Google</span>
                        </a>

                        {/* Login Link */}
                        <p className="mt-6 text-center text-xs text-[#6E675D]">
                            Sudah memiliki akun?{' '}
                            <Link
                                href="/login"
                                className="font-bold text-[#16233B] underline underline-offset-2 hover:text-[#A88B54]"
                            >
                                Masuk di Sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
