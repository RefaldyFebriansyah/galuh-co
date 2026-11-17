import { motion } from 'motion/react';
import { GaluhLogo } from '@/components/galuh-logo';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';

interface FooterSectionProps {
    whatsappNumber: string;
}

export function FooterSection({ whatsappNumber }: FooterSectionProps) {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya ingin konsultasi pemesanan hampers.',
    )}`;

    return (
        <footer className="relative bg-[#071911] text-white">
            {/* CTA Banner Card (Page 5 Bottom) */}
            <div className="mx-auto max-w-7xl px-6 pt-8 pb-6 lg:px-12">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="relative overflow-hidden rounded-3xl border border-[#C5A880]/20 bg-[#0C271B] p-8 text-center shadow-2xl md:p-12"
                >
                    <div className="mx-auto max-w-2xl">
                        {/* Gold Crest */}
                        <div className="flex justify-center">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#C5A880]/20 text-[#C5A880]">
                                ✦
                            </span>
                        </div>

                        <h2 className="mt-4 font-serif text-2xl leading-snug font-normal text-white md:text-4xl">
                            Hadirkan Momen Berharga Melalui <br />
                            <span className="text-[#C5A880] italic">
                                Sentuhan Hadiah Istimewa
                            </span>
                        </h2>

                        <p className="mt-3 text-xs leading-relaxed text-white/75 md:text-sm">
                            Konsultasikan kebutuhan hampers personal maupun
                            hadiah perusahaan Anda bersama tim GALUH &amp; CO.
                            Kami siap membantu merangkai bingkisan yang hangat
                            dan berkesan.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <motion.a
                                whileTap={buttonTap.tap}
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#FAF0D7] px-6 py-3 text-xs font-bold tracking-wider text-[#0E2A1E] shadow-lg transition-transform hover:scale-105"
                            >
                                <WhatsAppIcon className="size-4 text-[#25D366]" />
                                <span>KONSULTASI WHATSAPP SEKARANG</span>
                            </motion.a>

                            <motion.a
                                whileTap={buttonTap.tap}
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-xs font-bold tracking-wider text-white transition-colors hover:border-[#C5A880] hover:text-[#C5A880]"
                            >
                                <svg
                                    className="size-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                <span>UNDUH KATALOG LENGKAP PDF</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Columns (Page 6) */}
                <div className="mt-10 grid grid-cols-1 gap-8 border-b border-white/10 pb-8 sm:grid-cols-2 lg:grid-cols-12">
                    {/* Brand Info */}
                    <div className="lg:col-span-4">
                        <GaluhLogo
                            variant="white"
                            className="h-14 w-auto md:h-16"
                        />
                        <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/60">
                            Hampers premium dan layanan corporate gifting dengan
                            kurasi produk pilihan, kemasan eksklusif, serta
                            sentuhan personal untuk setiap momen berharga.
                        </p>
                    </div>

                    {/* Kontak & Layanan */}
                    <div className="lg:col-span-3">
                        <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                            KONTAK &amp; LAYANAN
                        </h4>
                        <ul className="mt-4 space-y-2 text-xs text-white/70">
                            <li>Email: Hampers@galuh.co</li>
                            <li>WhatsApp: +62 811-9283-888</li>
                            <li>Instagram: @galuh.co</li>
                        </ul>
                    </div>

                    {/* Galeri & Studio */}
                    <div className="lg:col-span-3">
                        <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                            GALERI &amp; STUDIO
                        </h4>
                        <p className="mt-4 text-xs leading-relaxed text-white/70">
                            Perumahan Jati Indah, Jl. Otista No. 57 <br />
                            Blok. B, Panyingkiran, Kec. Ciamis, <br />
                            Kabupaten Ciamis, Jawa Barat 46211
                        </p>
                    </div>

                    {/* Jam Operasional */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                            JAM OPERASIONAL
                        </h4>
                        <ul className="mt-4 space-y-1.5 text-xs text-white/70">
                            <li>Senin - Jumat: 09:00 - 18:00 WIB</li>
                            <li>Sabtu: 10:00 - 16:00 WIB</li>
                            <li className="text-[#C5A880]">
                                Minggu &amp; Libur: Berdasarkan Janji Temu
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 pt-5 pb-6 text-[10px] font-medium tracking-wider text-white/50 sm:flex-row">
                    <p>© 2026 GALUH &amp; CO. Hak Cipta Dilindungi.</p>
                    <div className="flex gap-6 uppercase">
                        <span className="cursor-pointer hover:text-white">
                            PRIVASI
                        </span>
                        <span className="cursor-pointer hover:text-white">
                            SYARAT &amp; KETENTUAN
                        </span>
                        <span className="cursor-pointer hover:text-white">
                            ETIKA KURASI
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
