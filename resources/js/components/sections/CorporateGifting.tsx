import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    CheckCircle2,
    Send,
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    Loader2,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';
import { trackWaLead } from '@/lib/wa-tracker';
import { detectCurrentAddress } from '@/lib/geolocation';

export interface CorporateGiftingProps {
    whatsappNumber: string;
}

export function CorporateGifting({ whatsappNumber }: CorporateGiftingProps) {
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const form = useForm({
        name: '',
        company_name: '',
        email: '',
        whatsapp_number: '',
        address: '',
        order_type: 'corporate',
        estimated_packages: '20 - 50 paket',
        budget_per_package: 'Rp 300.000 - Rp 500.000',
        needed_at: '',
        notes: '',
        website: '', // Honeypot field for bot protection
    });

    const handleDetectLocation = async () => {
        setIsDetectingLocation(true);
        try {
            const detected = await detectCurrentAddress();
            form.setData('address', detected);
        } catch (err: unknown) {
            alert(
                err instanceof Error ? err.message : 'Gagal mendeteksi lokasi',
            );
        } finally {
            setIsDetectingLocation(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate WhatsApp number: digits only, min 9 digits, max 12 digits
        const rawDigits = form.data.whatsapp_number.replace(/\D/g, '');
        if (!rawDigits) {
            form.setError('whatsapp_number', 'Nomor WhatsApp PIC wajib diisi.');
            return;
        }
        if (rawDigits.length < 9) {
            form.setError(
                'whatsapp_number',
                'Nomor WhatsApp minimal 9 digit setelah +62 (contoh: 81234567890).',
            );
            return;
        }

        // Validate email: must contain @ and valid domain
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.data.email.trim()) {
            form.setError('email', 'Email resmi perusahaan wajib diisi.');
            return;
        }
        if (!emailRegex.test(form.data.email)) {
            form.setError(
                'email',
                'Format email tidak valid. Pastikan menyertakan @ dan domain (contoh: nama@gmail.com).',
            );
            return;
        }

        const fullWaNumber = `+62${rawDigits}`;
        const cleanTargetNumber = (whatsappNumber || '6281572414233').replace(
            /\D/g,
            '',
        );
        const greetingLines = [
            'Halo Tim Concierge B2B GALUH & CO., saya ingin konsultasi penawaran corporate hampers:',
            '',
            `• Nama: ${form.data.name}`,
            form.data.company_name
                ? `• Perusahaan / Instansi: ${form.data.company_name}`
                : null,
            `• No. WhatsApp: ${fullWaNumber}`,
            `• Email: ${form.data.email}`,
            form.data.address
                ? `• Alamat Kantor / Pengiriman: ${form.data.address}`
                : null,
            `• Estimasi Jumlah: ${form.data.estimated_packages || 'Sesuai rekomendasi'}`,
            `• Alokasi Budget: ${form.data.budget_per_package || 'Fleksibel'}`,
            form.data.needed_at
                ? `• Jadwal Kebutuhan: ${form.data.needed_at}`
                : null,
            form.data.notes ? `• Catatan Kustom: ${form.data.notes}` : null,
            '',
            'Mohon informasi rekomendasi katalog dan proposal penawaran resmi. Terima kasih.',
        ].filter((line) => line !== null);

        const waUrl = `https://wa.me/${cleanTargetNumber}?text=${encodeURIComponent(greetingLines.join('\n'))}`;

        // 1. Silent lead tracking
        trackWaLead({
            source: 'catalog_corporate',
            client_name: form.data.name,
            company_name: form.data.company_name,
            wa_number: fullWaNumber,
            estimated_packages: form.data.estimated_packages,
            notes: `Formulir B2B Web: ${form.data.notes || '-'} | Alamat: ${form.data.address || '-'} | Budget: ${form.data.budget_per_package} | Tgl: ${form.data.needed_at}`,
        });

        // 2. Submit form to backend asynchronously (persists to inquiries & wa_leads, queues email)
        form.transform((data) => ({
            ...data,
            whatsapp_number: fullWaNumber,
        }));
        form.post('/inquiry', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });

        // 3. Immediately launch WhatsApp without stopping on intermediate confirmation screen
        const opened = window.open(waUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
            window.location.href = waUrl;
        }
    };

    const partnerLogos = [
        {
            name: 'Bank Central Asia',
            src: '/images/partners/bca.svg',
            heightClass: 'h-6 sm:h-7',
        },
        {
            name: 'Bank Mandiri',
            src: '/images/partners/mandiri.svg',
            heightClass: 'h-6 sm:h-7',
        },
        {
            name: 'Pertamina',
            src: '/images/partners/pertamina.svg',
            heightClass: 'h-6 sm:h-7',
        },
        {
            name: 'Bank Syariah Indonesia',
            src: '/images/partners/bsi.svg',
            heightClass: 'h-6 sm:h-7',
        },
        {
            name: 'Astra International',
            src: '/images/partners/astra.svg',
            heightClass: 'h-5 sm:h-6',
        },
        {
            name: 'Telkom Indonesia',
            src: '/images/partners/telkom.svg',
            heightClass: 'h-6 sm:h-7',
        },
        {
            name: 'Unilever',
            src: '/images/partners/unilever.svg',
            heightClass: 'h-7 sm:h-8',
        },
        {
            name: 'Gojek',
            src: '/images/partners/gojek.svg',
            heightClass: 'h-5 sm:h-6',
        },
    ];

    // Double items for pure seamless continuous marquee
    const marqueeItems = [...partnerLogos, ...partnerLogos];

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
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#7A5B24] uppercase">
                        <span>SOLUSI KORPORAT</span>
                        <span className="size-1 rounded-full bg-[#C5A880]" />
                        <span>B2B GIFTING CONCIERGE</span>
                    </div>

                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#1A1815] sm:text-4xl lg:text-5xl">
                        Apresiasi Kemitraan{' '}
                        <span className="text-[#7A5B24] italic">Berkelas</span>
                    </h2>

                    <p className="mt-3.5 text-sm leading-relaxed text-[#5C564C] sm:text-base">
                        Perkuat reputasi dan jalinan kemitraan bisnis Anda
                        melalui kurasi bingkisan elegan yang dapat dikustomisasi
                        logo perusahaan, lengkap dengan faktur resmi serta
                        pengiriman aman seluruh Nusantara.
                    </p>
                </motion.div>

                {/* 2. Seamless Corporate Client Logos Ticker (No Card Box, Pure Luxury Lookbook Style) */}
                <div className="my-10 border-y border-[#0B291E]/10 py-6 sm:my-14 sm:py-8">
                    <span className="block text-center font-mono text-[9.5px] font-bold tracking-[0.24em] text-[#7A5B24] uppercase sm:text-[10.5px]">
                        DIPERCAYA OLEH BERBAGAI PERUSAHAAN &amp; MITRA TERKEMUKA
                    </span>

                    <div className="relative mt-5 flex overflow-hidden sm:mt-6">
                        {/* Soft Edge Gradient Masks seamlessly matching section background */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent sm:w-32" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent sm:w-32" />

                        {/* Hardware-Accelerated Marquee (Compositor GPU Animation) */}
                        <div className="animate-marquee-css flex shrink-0 items-center gap-12 py-2 pr-12 sm:gap-16 sm:pr-16 lg:gap-20 lg:pr-20">
                            {marqueeItems.map((partner, i) => (
                                <div
                                    key={`${partner.name}-${i}`}
                                    className="flex shrink-0 items-center justify-center"
                                    title={partner.name}
                                >
                                    <img
                                        src={partner.src}
                                        alt={partner.name}
                                        width={140}
                                        height={32}
                                        decoding="async"
                                        className={`${partner.heightClass} w-auto max-w-[130px] object-contain transition-transform duration-300 hover:scale-105 sm:max-w-[150px]`}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
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
                        <div className="flex flex-col justify-between border-b border-[#EAE3D6] bg-gradient-to-br from-[#FAF8F5] via-[#F5EFEB] to-[#EFE7DE] p-5 sm:p-8 lg:col-span-5 lg:border-r lg:border-b-0 lg:p-12">
                            <div>
                                <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#7A5B24] uppercase">
                                    <span>LAYANAN RESMI B2B</span>
                                    <span>·</span>
                                    <span>CONCIERGE D'AFFAIRES</span>
                                </div>

                                <h3 className="mt-4 font-serif text-2xl leading-tight font-normal text-[#1A1815] sm:text-3xl">
                                    Dapatkan Sampel &amp; <br />
                                    <span className="text-[#7A5B24] italic">
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
                                        <Mail className="size-3.5 text-[#7A5B24]" />
                                        <span className="font-medium">
                                            corporate@galuh.co
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-3.5 text-[#7A5B24]" />
                                        <span className="font-medium">
                                            +62 815-7241-4233
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct WhatsApp CTA for Mobile */}
                            <div className="mt-6 block lg:hidden">
                                <a
                                    href={directWhatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Konsultasi Corporate Gifting via WhatsApp"
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0E2A1E] py-3.5 text-xs font-bold tracking-[0.12em] text-white shadow-md active:scale-98"
                                >
                                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                                    <span>KONSULTASI B2B VIA WHATSAPP</span>
                                </a>
                            </div>
                        </div>

                        {/* Mobile Form Section Header (< lg:) */}
                        <div className="border-t border-[#EAE3D6] bg-[#FAF8F5] px-5 py-3 lg:hidden">
                            <div className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-[#7A5B24]" />
                                <span className="font-mono text-[9.5px] font-bold tracking-[0.18em] text-[#7A5B24] uppercase">
                                    FORMULIR PENAWARAN &amp; SAMPEL B2B
                                </span>
                            </div>
                        </div>

                        {/* Right Side: Order Slip / Inquiry Form */}
                        <div className="p-5 sm:p-8 lg:col-span-7 lg:p-12">
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
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
                                                <label
                                                    htmlFor="b2b-name"
                                                    className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                                >
                                                    Nama Lengkap{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="b2b-name"
                                                    name="name"
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
                                                    className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden ${form.errors.name
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
                                                <label
                                                    htmlFor="b2b-company"
                                                    className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                                >
                                                    Nama Perusahaan &amp;
                                                    Jabatan
                                                </label>
                                                <input
                                                    id="b2b-company"
                                                    name="company_name"
                                                    type="text"
                                                    value={
                                                        form.data.company_name
                                                    }
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
                                                        {
                                                            form.errors
                                                                .company_name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="b2b-email"
                                                    className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                                >
                                                    Email Resmi Perusahaan{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    id="b2b-email"
                                                    name="email"
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
                                                    className={`mt-1.5 w-full rounded-xl border bg-[#FAF8F5] px-4 py-3 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden ${form.errors.email
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
                                                <label
                                                    htmlFor="b2b-whatsapp"
                                                    className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                                >
                                                    Nomor WhatsApp PIC{' '}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <div
                                                    className={`mt-1.5 flex items-center overflow-hidden rounded-xl border bg-[#FAF8F5] transition-all focus-within:border-[#C5A880] focus-within:bg-white ${form.errors
                                                        .whatsapp_number
                                                        ? 'border-red-400'
                                                        : 'border-[#EAE5DC]'
                                                        }`}
                                                >
                                                    <span className="inline-flex shrink-0 items-center border-r border-[#EAE5DC] bg-[#F2EDE4]/60 px-3 py-3 text-xs font-bold text-[#0E2A1E] select-none">
                                                        🇮🇩 +62
                                                    </span>
                                                    <input
                                                        id="b2b-whatsapp"
                                                        name="whatsapp_number"
                                                        type="tel"
                                                        inputMode="numeric"
                                                        required
                                                        value={
                                                            form.data
                                                                .whatsapp_number
                                                        }
                                                        onChange={(e) => {
                                                            let val =
                                                                e.target.value.replace(
                                                                    /\D/g,
                                                                    '',
                                                                );
                                                            if (
                                                                val.startsWith(
                                                                    '62',
                                                                )
                                                            )
                                                                val =
                                                                    val.slice(
                                                                        2,
                                                                    );
                                                            if (
                                                                val.startsWith(
                                                                    '0',
                                                                )
                                                            )
                                                                val =
                                                                    val.slice(
                                                                        1,
                                                                    );
                                                            val = val.slice(
                                                                0,
                                                                12,
                                                            );
                                                            form.setData(
                                                                'whatsapp_number',
                                                                val,
                                                            );
                                                        }}
                                                        placeholder="812-3456-7890"
                                                        maxLength={12}
                                                        className="w-full bg-transparent px-3 py-3 text-xs text-[#1A1815] focus:outline-hidden"
                                                    />
                                                </div>
                                                {form.errors
                                                    .whatsapp_number && (
                                                        <p className="mt-1 text-[10px] text-red-600">
                                                            {
                                                                form.errors
                                                                    .whatsapp_number
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor="b2b-address"
                                                    className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                                >
                                                    Alamat Kantor / Pengiriman
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleDetectLocation
                                                    }
                                                    disabled={
                                                        isDetectingLocation
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-[#7A5B24] transition-colors hover:text-[#0E2A1E] hover:underline disabled:opacity-50"
                                                >
                                                    {isDetectingLocation ? (
                                                        <>
                                                            <Loader2 className="size-3 animate-spin text-[#7A5B24]" />
                                                            <span>
                                                                Mendeteksi
                                                                Lokasi...
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MapPin className="size-3 text-[#7A5B24]" />
                                                            <span>
                                                                Deteksi Alamat
                                                                Otomatis
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <textarea
                                                id="b2b-address"
                                                name="address"
                                                rows={2}
                                                value={form.data.address}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Menara Kencana Lt. 18, Jl. Sudirman No. 45, Jakarta Selatan (atau klik 'Deteksi Alamat Otomatis')"
                                                className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] transition-all focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                            />
                                            {form.errors.address && (
                                                <p className="mt-1 text-[10px] text-red-600">
                                                    {form.errors.address}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="b2b-packages"
                                                    className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                                >
                                                    Estimasi Jumlah Paket
                                                </label>
                                                <select
                                                    id="b2b-packages"
                                                    name="estimated_packages"
                                                    value={
                                                        form.data
                                                            .estimated_packages
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
                                                        250+ paket (Custom
                                                        Scale)
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="b2b-budget"
                                                    className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                                >
                                                    Alokasi Budget / Paket
                                                </label>
                                                <select
                                                    id="b2b-budget"
                                                    name="budget_per_package"
                                                    value={
                                                        form.data
                                                            .budget_per_package
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
                                                        Rp 500.000 - Rp
                                                        1.000.000
                                                    </option>
                                                    <option value="Rp 1.000.000 - Rp 2.000.000">
                                                        Rp 1.000.000 - Rp
                                                        2.000.000
                                                    </option>
                                                    <option value="> Rp 2.000.000">
                                                        &gt; Rp 2.000.000 (VIP
                                                        Bespoke)
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="b2b-needed-at"
                                                className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                            >
                                                Target Tanggal Pengiriman /
                                                Kebutuhan
                                            </label>
                                            <input
                                                id="b2b-needed-at"
                                                name="needed_at"
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
                                            <label
                                                htmlFor="b2b-notes"
                                                className="block text-[10px] font-bold tracking-[0.16em] text-[#1A1815] uppercase"
                                            >
                                                Catatan Khusus / Preferensi Tema
                                            </label>
                                            <textarea
                                                id="b2b-notes"
                                                name="notes"
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

                                        <div className="space-y-3 pt-2">
                                            {form.recentlySuccessful && (
                                                <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-800">
                                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                                    <span>
                                                        Data formulir berhasil
                                                        dicatat &amp; dialihkan
                                                        langsung ke WhatsApp
                                                        Concierge.
                                                    </span>
                                                </div>
                                            )}

                                            <motion.button
                                                whileTap={buttonTap.tap}
                                                type="submit"
                                                disabled={form.processing}
                                                aria-label="Kirim formulir konsultasi corporate hampers via WhatsApp"
                                                className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#0E2A1E] py-4 text-xs font-bold tracking-[0.14em] text-white shadow-sm transition-all duration-300 hover:bg-[#163d2c] hover:shadow-md disabled:opacity-60"
                                            >
                                                <WhatsAppIcon className="size-4 text-[#25D366]" />
                                                <span>
                                                    {form.processing
                                                        ? 'MENGHUBUNGKAN KE WHATSAPP...'
                                                        : 'KIRIM & KONSULTASI VIA WHATSAPP'}
                                                </span>
                                            </motion.button>

                                            <div className="mt-3.5 flex items-center justify-center gap-2 text-[10px] text-[#8C877E]">
                                                <ShieldCheck className="size-3.5 text-[#0E2A1E]" />
                                                <span>
                                                    Data perusahaan Anda terjaga
                                                    aman dan hanya digunakan
                                                    untuk korespondensi resmi
                                                    penawaran.
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export const CorporateSection = CorporateGifting;
export default CorporateGifting;
