import { motion } from 'motion/react';
import { useState } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';

interface CorporateSectionProps {
    whatsappNumber: string;
}

export function CorporateSection({ whatsappNumber }: CorporateSectionProps) {
    const [formData, setFormData] = useState({
        name: '',
        company_role: '',
        email: '',
        whatsapp: '',
        packages: '20 - 50 paket',
        budget: 'Rp 300.000 - Rp 500.000',
        needed_at: '',
        notes: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const text = `Halo Tim B2B GALUH & CO., saya ingin mengajukan penawaran corporate hampers:
• Nama Lengkap: ${formData.name || 'Refaldy Febriansyah'}
• Perusahaan & Jabatan: ${formData.company_role || 'PT. Makmoer Abadi - HRD'}
• Email Bisnis: ${formData.email || 'ipang@makmuer.co.id'}
• No. WhatsApp: ${formData.whatsapp || '+62 812-3456-7890'}
• Jumlah Paket: ${formData.packages}
• Estimasi Budget / Paket: ${formData.budget}
• Tanggal Kebutuhan Event: ${formData.needed_at || 'Segera'}
• Catatan & Kebutuhan Khusus: ${formData.notes || '-'}`;

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <section
            id="corporate"
            className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* 1. Corporate Form Big Card (Page 3 Bottom) */}
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
                                Tim kami siap membantu menyiapkan paket hampers
                                custom sesuai identitas brand dan anggaran
                                perusahaan Anda.
                            </p>

                            <div className="mt-6 space-y-3 text-xs text-[#1A1815]">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E2EBE5] text-[10px] text-[#0E2A1E]">
                                        ✓
                                    </span>
                                    <span>
                                        Pengiriman Langsung Ke Banyak Alamat
                                        Penerima
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E2EBE5] text-[10px] text-[#0E2A1E]">
                                        ✓
                                    </span>
                                    <span>
                                        Gratis Pratinjau Desain Kartu Ucapan
                                        &amp; Kemasan
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E2EBE5] text-[10px] text-[#0E2A1E]">
                                        ✓
                                    </span>
                                    <span>
                                        Dukungan Invoice &amp; Administrasi
                                        Resmi Perusahaan
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

                            {/* Logo */}
                            <div className="mt-8">
                                <GaluhLogo />
                            </div>
                        </div>

                        {/* Right Side Form */}
                        <div className="lg:col-span-7">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                            NAMA LENGKAP
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Refaldy Febriansyah"
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                            NAMA PERUSAHAAN &amp; JABATAN
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company_role}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    company_role:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="PT. Makmoer Abadi - HRD"
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                            EMAIL BISNIS
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                            placeholder="ipang@makmuer.co.id"
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                            NO. WHATSAPP
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.whatsapp}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    whatsapp: e.target.value,
                                                })
                                            }
                                            placeholder="+62 812-3456-7890"
                                            className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-wider text-[#1A1815] uppercase">
                                            JUMLAH PAKET
                                        </label>
                                        <select
                                            value={formData.packages}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    packages: e.target.value,
                                                })
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
                                            value={formData.budget}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    budget: e.target.value,
                                                })
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
                                        value={formData.needed_at}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                needed_at: e.target.value,
                                            })
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
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                notes: e.target.value,
                                            })
                                        }
                                        placeholder="Tuliskan tema acara, kebutuhan custom logo, atau permintaan khusus lainnya..."
                                        className="mt-1.5 w-full rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] px-4 py-2.5 text-xs text-[#1A1815] focus:border-[#C5A880] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                <motion.button
                                    whileTap={buttonTap.tap}
                                    type="submit"
                                    className="mt-2 w-full rounded-full bg-[#0E2A1E] py-4 text-xs font-bold tracking-[0.14em] text-white shadow-md transition-colors hover:bg-[#163d2c]"
                                >
                                    KIRIM PERMINTAAN PENAWARAN ▷
                                </motion.button>

                                {submitted && (
                                    <p className="text-center text-xs text-emerald-700">
                                        ✓ Membuka WhatsApp Concierge B2B...
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Layanan Corporate Gifting & Logo Mitra (Page 4 Top) */}
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

                    {/* Logo Box */}
                    <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-2xs">
                        <span className="block text-[9px] font-bold tracking-[0.2em] text-[#8C877E] uppercase">
                            DIPERCAYA OLEH BERBAGAI PERUSAHAAN &amp; MITRA
                            BISNIS
                        </span>
                        <div className="mt-3 flex items-center justify-center">
                            <img
                                src="/images/partner_logos.jpg"
                                alt="Mitra Perusahaan: Mandiri, Tokopedia, Shopee, Gojek, Grab, BCA, BSI"
                                className="h-9 w-auto max-w-full object-contain md:h-11"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
