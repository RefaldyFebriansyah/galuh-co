import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'motion/react';
import { CheckCircle2, Send, ShieldCheck, Mail, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';

export interface CorporateGiftingProps {
    whatsappNumber: string;
}

export function CorporateGifting({ whatsappNumber }: CorporateGiftingProps) {
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

    // Double items for pure seamless continuous marquee
    const marqueeItems = [...clientPartners, ...clientPartners];

    const directWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo Tim Concierge B2B GALUH & CO., saya ingin konsultasi penawaran corporate hampers.',
    )}`;

    return (
        <section
            id="corporate"
            className="relative bg-[#FAF8F5] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* 1. Header Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#9E7E45] uppercase">
                        <span>SOLUSI KORPORAT</span>
                        <span className="size-1 rounded-full bg-[#C5A880]" />
                        <span>B2B GIFTING CONCIERGE</span>
                    </div>

                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#1A1815] sm:text-4xl lg:text-5xl">
                        Apresiasi Kemitraan{' '}
                        <span className="text-[#9E7E45] italic">Berkelas</span>
                    </h2>

                    <p className="mt-3.5 text-sm leading-relaxed text-[#5C564C] sm:text-base">
                        Perkuat reputasi dan jalinan kemitraan bisnis Anda
                        melalui kurasi bingkisan elegan yang dapat dikustomisasi
                        logo perusahaan, lengkap dengan faktur resmi serta
                        pengiriman aman seluruh Nusantara.
                    </p>
                </motion.div>

                {/* 2. Seamless Client Logos Marquee (Pure CSS/Motion Transform, No Jitter) */}
                <div className="mt-10 overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-2xs">
                    <span className="block text-center text-[9px] font-bold tracking-[0.22em] text-[#8C877E] uppercase">
                        DIPERCAYA OLEH BERBAGAI PERUSAHAAN &amp; MITRA TERKEMUKA
                    </span>

                    <div className="relative mt-4 flex overflow-hidden">
                        {/* Soft Edge Gradient Masks */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

                        <motion.div
                            animate={{ x: ['0%', '-50%'] }}
                            transition={{
                                repeat: Infinity,
                                ease: 'linear',
                                duration: 26,
                            }}
                            className="flex shrink-0 items-center gap-10 py-1 pr-10 whitespace-nowrap"
                        >
                            {marqueeItems.map((brand, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-3 font-serif text-xs font-bold tracking-[0.22em] text-[#6E6962] transition-colors hover:text-[#0E2A1E] md:text-sm"
                                >
                                    <span className="size-1 rounded-full bg-[#C5A880]" />
                                    <span>{brand}</span>
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* 3. Bespoke Corporate Inquiry Card (Invitation / Order Slip Aesthetic) */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-12 overflow-hidden rounded-[2.5rem] border border-[#EAE3D6] bg-white shadow-xl lg:mt-16"
                >
                    <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
                        {/* Left Side: Exclusive Invitation Cover & Concierge Privileges */}
                        <div className="flex flex-col justify-between border-b border-[#EAE3D6] bg-gradient-to-br from-[#FAF8F5] via-[#F5EFEB] to-[#EFE7DE] p-8 sm:p-10 lg:col-span-5 lg:border-r lg:border-b-0 lg:p-12">
                            <div>
                                <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#9E7E45] uppercase">
                                    <span>LAYANAN RESMI B2B</span>
                                    <span>·</span>
                                    <span>CONCIERGE D'AFFAIRES</span>
                                </div>

                                <h3 className="mt-4 font-serif text-2xl leading-tight font-normal text-[#1A1815] sm:text-3xl">
                                    Dapatkan Sampel &amp; <br />
                                    <span className="text-[#9E7E45] italic">
                                        Proposal Penawaran
                                    </span>
                                </h3>

                                <p className="mt-3.5 text-xs leading-relaxed text-[#5C564C] sm:text-sm">
                                    Tim konsultan atelier kami siap menyusun
                                    rekomendasi katalog kustom yang selaras
                                    dengan tema acara, identitas brand, dan
                                    alokasi anggaran perusahaan Anda.
                                </p>

                                {/* Key Corporate Privileges */}
                                <div className="mt-8 space-y-3.5 text-xs text-[#1A1815]">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="size-4 shrink-0 text-[#0E2A1E]" />
                                        <span className="leading-snug">
                                            Pengiriman langsung ke ratusan
                                            alamat penerima di seluruh Indonesia
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="size-4 shrink-0 text-[#0E2A1E]" />
                                        <span className="leading-snug">
                                            Gratis mockup kartu ucapan &amp;
                                            grafir logo perusahaan
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="size-4 shrink-0 text-[#0E2A1E]" />
                                        <span className="leading-snug">
                                            Dukungan invoice, faktur pajak
                                            resmi, &amp; administrasi korporat
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Contact Bar */}
                            <div className="mt-10 rounded-2xl border border-[#D5CEC2] bg-white/80 p-4 shadow-2xs backdrop-blur-xs">
                                <span className="block text-[9px] font-bold tracking-[0.18em] text-[#8C877E] uppercase">
                                    KONTAK KHUSUS CONCIERGE PERUSAHAAN:
                                </span>
                                <div className="mt-2 space-y-1 text-xs text-[#1A1815]">
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-3.5 text-[#9E7E45]" />
                                        <span className="font-medium">
                                            corporate@galuh.co
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-3.5 text-[#9E7E45]" />
                                        <span className="font-medium">
                                            +62 815-7241-4233
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Order Slip / Inquiry Form */}
                        <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
                            {submitted || form.recentlySuccessful ? (
                                <div className="flex size-full flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center sm:p-12">
                                    <span className="flex size-14 items-center justify-center rounded-full bg-[#0E2A1E] text-[#C5A880] shadow-md">
                                        <CheckCircle2 className="size-7" />
                                    </span>
                                    <h4 className="mt-5 font-serif text-2xl font-normal text-[#0E2A1E] sm:text-3xl">
                                        Permintaan Penawaran Terkirim
                                    </h4>
                                    <p className="mt-2.5 max-w-md text-xs leading-relaxed text-[#4A5D53] sm:text-sm">
                                        Terima kasih. Data kebutuhan bingkisan
                                        Anda telah diterima oleh tim concierge
                                        GALUH &amp; CO. Kami akan segera
                                        menghubungi kontak Anda dalam waktu 1x24
                                        jam kerja.
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                        <a
                                            href={directWhatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-bold text-white shadow-sm transition-transform hover:scale-102"
                                        >
                                            <WhatsAppIcon className="size-4" />
                                            <span>Hubungi via WhatsApp</span>
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setSubmitted(false)}
                                            className="cursor-pointer rounded-full border border-[#D5CEC2] bg-white px-6 py-3 text-xs font-bold text-[#1A1815] shadow-2xs hover:bg-[#FAF8F5]"
                                        >
                                            Kirim Formulir Baru
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
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

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                                Nama Lengkap{' '}
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
                                                placeholder="Contoh: Ibu Rina Sastrowardoyo"
                                                className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden ${
                                                    form.errors.name
                                                        ? 'border-red-400'
                                                        : 'border-[#EAE5DC]'
                                                }`}
                                            />
                                            {form.errors.name && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {form.errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                                Nama Perusahaan &amp; Jabatan
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
                                                placeholder="Contoh: PT. Adhi Kencana - Head of HR"
                                                className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                            />
                                            {form.errors.company_name && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {form.errors.company_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                                Email Resmi Perusahaan{' '}
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
                                                placeholder="rina@adhikencana.co.id"
                                                className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden ${
                                                    form.errors.email
                                                        ? 'border-red-400'
                                                        : 'border-[#EAE5DC]'
                                                }`}
                                            />
                                            {form.errors.email && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {form.errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                                Nomor WhatsApp PIC{' '}
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
                                                className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden ${
                                                    form.errors.whatsapp_number
                                                        ? 'border-red-400'
                                                        : 'border-[#EAE5DC]'
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

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                                Estimasi Jumlah Paket
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
                                                className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
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
                                                    250+ paket (Custom Scale)
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                                Alokasi Budget / Paket
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
                                                className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
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
                                                    &gt; Rp 2.000.000 (VIP
                                                    Bespoke)
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                            Target Tanggal Pengiriman /
                                            Kebutuhan
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
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase">
                                            Catatan Khusus / Preferensi Tema
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
                                            placeholder="Jelaskan kebutuhan spesifik Anda (misal: warna pita korporat, kartu ucapan bilingual, request grafir nama, dll.)"
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <motion.button
                                            whileTap={buttonTap.tap}
                                            type="submit"
                                            disabled={form.processing}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#0E2A1E] py-4 text-xs font-bold tracking-[0.14em] text-white shadow-sm transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md disabled:opacity-60"
                                        >
                                            <Send className="size-3.5 text-[#C5A880]" />
                                            <span>
                                                {form.processing
                                                    ? 'MENGIRIMKAN DATA...'
                                                    : 'KIRIM PERMINTAAN PENAWARAN'}
                                            </span>
                                        </motion.button>

                                        <div className="mt-3.5 flex items-center justify-center gap-2 text-[10px] text-[#8C877E]">
                                            <ShieldCheck className="size-3.5 text-[#0E2A1E]" />
                                            <span>
                                                Data perusahaan Anda terjaga
                                                aman dan hanya digunakan untuk
                                                korespondensi resmi penawaran.
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export const CorporateSection = CorporateGifting;
export default CorporateGifting;
