import { useForm } from '@inertiajs/react';
import { CheckCircle2, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';

interface CorporateSectionProps {
    whatsappNumber: string;
}

export function CorporateSection({ whatsappNumber }: CorporateSectionProps) {
    const [submitted, setSubmitted] = useState(false);

    const form = useForm({
        name: '',
        company_name: '',
        email: '',
        whatsapp_number: '',
        estimated_packages: '20 - 50 paket',
        budget_per_package: 'Rp 300.000 - Rp 500.000',
        needed_at: '',
        notes: '',
        website: '', // Honeypot field for bot protection
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post('/inquiry', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setSubmitted(true);
            },
        });
    };

    const clientPartners = [
        'BANK MANDIRI',
        'BANK BCA',
        'TELKOMSEL',
        'TOKOPEDIA',
        'SHOPEE INDONESIA',
        'ASTRA INTERNATIONAL',
        'BANK SYARIAH INDONESIA',
        'PERTAMINA',
        'UNILEVER',
        'GOJEK GRAB',
    ];

    // Double the array for seamless infinite marquee loop
    const marqueeItems = [...clientPartners, ...clientPartners];

    const directWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo Tim Concierge B2B GALUH & CO., saya ingin konsultasi penawaran corporate hampers.',
    )}`;

    return (
        <section
            id="corporate"
            className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* 1. Corporate Form Big Card */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="overflow-hidden rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-xl lg:p-10"
                >
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Left Side Info */}
                        <div className="lg:col-span-5">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                                PENAWARAN KHUSUS PERUSAHAAN
                            </span>

                            <h3 className="mt-3 font-serif text-3xl leading-snug font-normal text-[#1A1815] md:text-4xl">
                                Dapatkan Penawaran &amp; <br />
                                Sampel Paket
                            </h3>

                            <p className="mt-4 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                                Tim konsultan kami siap membantu menyiapkan
                                paket hampers kustom yang selaras dengan
                                identitas brand, nilai estetika, dan anggaran
                                korporat Anda.
                            </p>

                            <div className="mt-6 space-y-3 text-xs text-[#1A1815]">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="size-4 shrink-0 text-[#0E2A1E]" />
                                    <span>
                                        Pengiriman Langsung Ke Banyak Alamat
                                        Penerima Seluruh Indonesia
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="size-4 shrink-0 text-[#0E2A1E]" />
                                    <span>
                                        Gratis Pratinjau Desain Kartu Ucapan
                                        &amp; Branding Logo Perusahaan
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="size-4 shrink-0 text-[#0E2A1E]" />
                                    <span>
                                        Dukungan Invoice, Faktur Pajak, &amp;
                                        Administrasi Resmi Perusahaan
                                    </span>
                                </div>
                            </div>

                            {/* Contact Box */}
                            <div className="mt-8 rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] p-4 text-[11px]">
                                <span className="block text-[9px] font-bold tracking-wider text-[#8C877E] uppercase">
                                    KONTAK LAYANAN PERUSAHAAN:
                                </span>
                                <span className="mt-1 block font-serif font-bold text-[#1A1815]">
                                    Hampers@galuh.co | +62 811-9283-888
                                </span>
                            </div>
                        </div>

                        {/* Right Side Form (Inertia useForm) */}
                        <div className="lg:col-span-7">
                            {submitted || form.recentlySuccessful ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center">
                                    <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                                        <CheckCircle2 className="size-6" />
                                    </span>
                                    <h4 className="mt-4 font-serif text-2xl font-bold text-[#0E2A1E]">
                                        Permintaan Penawaran Berhasil Dikirim!
                                    </h4>
                                    <p className="mt-2 text-xs leading-relaxed text-[#4A5D53]">
                                        Data penawaran Anda telah tersimpan dan
                                        notifikasi email telah diteruskan ke tim
                                        corporate gifting GALUH &amp; CO. Kami
                                        akan segera menghubungi kontak Anda.
                                    </p>

                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                        <a
                                            href={directWhatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20ba5a]"
                                        >
                                            <WhatsAppIcon className="size-4" />
                                            <span>Chat WhatsApp Langsung</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setSubmitted(false)}
                                            className="rounded-full border border-[#D5CEC2] bg-white px-5 py-2.5 text-xs font-bold text-[#1A1815] hover:bg-[#FAF8F5]"
                                        >
                                            Kirim Formulir Lain
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {/* Honeypot field (hidden from real users, traps automated spam bots) */}
                                    <input
                                        type="text"
                                        name="website"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                        className="pointer-events-none sr-only absolute -z-50 opacity-0"
                                        value={form.data.website}
                                        onChange={(e) =>
                                            form.setData(
                                                'website',
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                                NAMA LENGKAP{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.data.name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Nama Anda"
                                                className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:bg-white focus:outline-hidden ${
                                                    form.errors.name
                                                        ? 'border-red-400 focus:border-red-500'
                                                        : 'border-[#EAE5DC] focus:border-[#C5A880]'
                                                }`}
                                            />
                                            {form.errors.name && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {form.errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                                PERUSAHAAN &amp; JABATAN
                                            </label>
                                            <input
                                                type="text"
                                                value={form.data.company_name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'company_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="PT. Nama Perusahaan - HRD"
                                                className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                            />
                                            {form.errors.company_name && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {form.errors.company_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                                EMAIL BISNIS{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={form.data.email}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="corporate@perusahaan.co.id"
                                                className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:bg-white focus:outline-hidden ${
                                                    form.errors.email
                                                        ? 'border-red-400 focus:border-red-500'
                                                        : 'border-[#EAE5DC] focus:border-[#C5A880]'
                                                }`}
                                            />
                                            {form.errors.email && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {form.errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                                NO. WHATSAPP{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={
                                                    form.data.whatsapp_number
                                                }
                                                onChange={(e) =>
                                                    form.setData(
                                                        'whatsapp_number',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="+62 812-3456-7890"
                                                className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:bg-white focus:outline-hidden ${
                                                    form.errors.whatsapp_number
                                                        ? 'border-red-400 focus:border-red-500'
                                                        : 'border-[#EAE5DC] focus:border-[#C5A880]'
                                                }`}
                                            />
                                            {form.errors.whatsapp_number && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {
                                                        form.errors
                                                            .whatsapp_number
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                                JUMLAH PAKET
                                            </label>
                                            <select
                                                value={
                                                    form.data.estimated_packages
                                                }
                                                onChange={(e) =>
                                                    form.setData(
                                                        'estimated_packages',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                            >
                                                <option value="20 - 50 paket">
                                                    20 - 50 paket
                                                </option>
                                                <option value="50 - 100 paket">
                                                    50 - 100 paket
                                                </option>
                                                <option value="100 - 250 paket">
                                                    100 - 250 paket
                                                </option>
                                                <option value="250+ paket">
                                                    250+ paket
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                                ESTIMASI BUDGET / PAKET
                                            </label>
                                            <select
                                                value={
                                                    form.data.budget_per_package
                                                }
                                                onChange={(e) =>
                                                    form.setData(
                                                        'budget_per_package',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                            >
                                                <option value="Rp 300.000 - Rp 500.000">
                                                    Rp 300.000 - Rp 500.000
                                                </option>
                                                <option value="Rp 500.000 - Rp 1.000.000">
                                                    Rp 500.000 - Rp 1.000.000
                                                </option>
                                                <option value="Rp 1.000.000 - Rp 2.000.000">
                                                    Rp 1.000.000 - Rp 2.000.000
                                                </option>
                                                <option value="> Rp 2.000.000">
                                                    &gt; Rp 2.000.000
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                            TANGGAL KEBUTUHAN EVENT
                                        </label>
                                        <input
                                            type="date"
                                            value={form.data.needed_at}
                                            onChange={(e) =>
                                                form.setData(
                                                    'needed_at',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                            CATATAN &amp; KEBUTUHAN KHUSUS
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={form.data.notes}
                                            onChange={(e) =>
                                                form.setData(
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Tuliskan tema acara, kebutuhan custom logo, atau permintaan khusus lainnya..."
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>

                                    <motion.button
                                        whileTap={buttonTap.tap}
                                        type="submit"
                                        disabled={form.processing}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0E2A1E] py-4 text-xs font-bold tracking-[0.14em] text-white shadow-md transition-colors hover:bg-[#163d2c] disabled:opacity-60"
                                    >
                                        {form.processing ? (
                                            'MEMPROSES PERMINTAAN...'
                                        ) : (
                                            <>
                                                <span>
                                                    KIRIM PERMINTAAN PENAWARAN
                                                </span>
                                                <Send className="size-3.5" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* 2. Layanan Corporate Gifting & Marquee Logo Klien */}
                <div className="mt-12 text-center md:mt-14">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                        ✦ LAYANAN CORPORATE GIFTING ✦
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#1A1815] md:text-4xl lg:text-5xl">
                        Apresiasi Berkelas untuk Klien &amp; <br />
                        Karyawan
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-[#6E6962] md:text-sm">
                        Perkuat hubungan bisnis dan apresiasi tim Anda melalui
                        hampers eksklusif yang dapat disesuaikan dengan logo
                        perusahaan serta dikirimkan aman ke berbagai alamat.
                    </p>

                    {/* Marquee Container */}
                    <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-2xs">
                        <span className="block text-[9px] font-bold tracking-[0.2em] text-[#8C877E] uppercase">
                            DIPERCAYA OLEH BERBAGAI PERUSAHAAN &amp; MITRA
                            BISNIS
                        </span>

                        <div className="relative mt-4 flex overflow-x-hidden">
                            {/* Left & Right Elegant Edge Fades */}
                            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />

                            <motion.div
                                animate={{ x: ['0%', '-50%'] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: 'linear',
                                    duration: 24,
                                }}
                                className="flex shrink-0 items-center gap-10 py-1 pr-10 whitespace-nowrap"
                            >
                                {marqueeItems.map((brand, i) => (
                                    <span
                                        key={i}
                                        className="font-serif text-xs font-bold tracking-[0.25em] text-[#8C877E] transition-colors hover:text-[#0E2A1E] md:text-sm"
                                    >
                                        ✦ {brand}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export {
    CorporateSection as CorporateGifting,
    CorporateSection as CorporateGiftingSection,
};
