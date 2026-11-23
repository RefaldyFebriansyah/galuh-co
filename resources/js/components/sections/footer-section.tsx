import { ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GaluhLogo } from '@/components/galuh-logo';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';

interface FooterSectionProps {
    whatsappNumber: string;
    logoSrc?: string;
    contactEmail?: string;
    contactPhone?: string;
    companyAddress?: string;
    operationalHours?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    linkedinUrl?: string;
}

export function FooterSection({
    whatsappNumber,
    logoSrc,
    contactEmail = 'halo@galuh.co',
    contactPhone = '+62 815-7241-4233',
    companyAddress = 'Jl. Galuh Mas Raya No. 88, Karawang Barat, Jawa Barat 41361',
    operationalHours = 'Senin - Sabtu: 08.00 - 20.00 WIB',
    instagramUrl = 'https://instagram.com/galuh.co',
    tiktokUrl = 'https://tiktok.com/@galuh.co',
    linkedinUrl,
}: FooterSectionProps) {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya ingin konsultasi pemesanan hampers.',
    )}`;

    return (
        <>
            {/* 1. Final CTA Banner Section (Sitting on Cream Background) */}
            <section className="bg-[#FAF8F5] py-12 md:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        whileHover={{
                            y: -6,
                            transition: {
                                duration: 0.35,
                                ease: [0.16, 1, 0.3, 1],
                            },
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-[#C5A880]/25 bg-gradient-to-b from-[#0E2F21] to-[#0A2218] p-6 text-center shadow-2xl transition-all duration-500 hover:border-[#C5A880]/50 hover:shadow-[0_30px_70px_rgba(10,34,24,0.35)] sm:p-8 md:p-12 lg:p-14"
                    >
                        {/* Subtle Ambient Glow that expands on hover */}
                        <div
                            className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#C5A880]/[0.08] blur-[80px] transition-all duration-700 group-hover:scale-125 group-hover:bg-[#C5A880]/[0.16]"
                            aria-hidden="true"
                        />
                        <div
                            className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-[#143628] blur-[80px] transition-all duration-700 group-hover:scale-125"
                            aria-hidden="true"
                        />

                        <div className="relative mx-auto max-w-2xl">
                            {/* Gold Crest */}
                            <div className="flex justify-center">
                                <span className="flex size-9 items-center justify-center rounded-full bg-[#C5A880]/20 text-[#C5A880] shadow-xs transition-all duration-500 group-hover:scale-110 group-hover:bg-[#C5A880]/30">
                                    <Sparkles className="size-4" />
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
                                hadiah perusahaan Anda bersama tim GALUH &amp;
                                CO. Kami siap membantu merangkai bingkisan yang
                                hangat dan berkesan.
                            </p>

                            <div className="mt-7 flex justify-center">
                                <motion.a
                                    whileTap={buttonTap.tap}
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Konsultasi Hampers via WhatsApp Sekarang"
                                    className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#FAF0D7] px-6 py-3.5 text-xs font-bold tracking-wider text-[#0E2A1E] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#FFF5DE] sm:w-auto sm:px-7"
                                >
                                    <WhatsAppIcon className="size-4.5 text-[#25D366]" />
                                    <span>KONSULTASI WHATSAPP SEKARANG</span>
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Deep Forest Green Footer (Distinct & Separated) */}
            <footer className="relative bg-[#071911] text-white">
                <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-12">
                    {/* Footer Columns */}
                    <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-12">
                        {/* Brand Info */}
                        <div className="lg:col-span-4">
                            <GaluhLogo
                                variant="white"
                                src={logoSrc}
                                className="h-14 w-auto md:h-16"
                            />
                            <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/60">
                                Hampers premium dan layanan corporate gifting
                                dengan kurasi produk pilihan, kemasan eksklusif,
                                serta sentuhan personal untuk setiap momen
                                berharga.
                            </p>
                        </div>

                        {/* Kontak & Layanan */}
                        <div className="lg:col-span-3">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                                KONTAK &amp; LAYANAN
                            </h4>
                            <ul className="mt-4 space-y-2 text-xs text-white/70">
                                <li>
                                    Email:{' '}
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        aria-label={`Kirim email ke ${contactEmail}`}
                                        className="transition-colors hover:text-white"
                                    >
                                        {contactEmail}
                                    </a>
                                </li>
                                <li>
                                    WhatsApp:{' '}
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Hubungi WhatsApp resmi GALUH & CO."
                                        className="transition-colors hover:text-white"
                                    >
                                        {contactPhone}
                                    </a>
                                </li>
                                {instagramUrl && (
                                    <li>
                                        Instagram:{' '}
                                        <a
                                            href={instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Kunjungi akun Instagram resmi @galuh.co"
                                            className="transition-colors hover:text-white"
                                        >
                                            @galuh.co
                                        </a>
                                    </li>
                                )}
                                {tiktokUrl && (
                                    <li>
                                        TikTok:{' '}
                                        <a
                                            href={tiktokUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Kunjungi akun TikTok resmi @galuh.co"
                                            className="transition-colors hover:text-white"
                                        >
                                            @galuh.co
                                        </a>
                                    </li>
                                )}
                                {linkedinUrl && (
                                    <li>
                                        LinkedIn:{' '}
                                        <a
                                            href={linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Kunjungi profil LinkedIn Galuh & Co."
                                            className="transition-colors hover:text-white"
                                        >
                                            Galuh &amp; Co.
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Galeri & Studio */}
                        <div className="lg:col-span-3">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                                GALERI &amp; STUDIO
                            </h4>
                            <p className="mt-4 text-xs leading-relaxed whitespace-pre-line text-white/70">
                                {companyAddress}
                            </p>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(companyAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Buka lokasi studio Galuh & Co. di Google Maps"
                                className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#C5A880] hover:underline"
                            >
                                <span>Buka di Google Maps</span>
                                <ExternalLink className="size-3" />
                            </a>
                        </div>

                        {/* Jam Operasional */}
                        <div className="lg:col-span-2">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                                JAM OPERASIONAL
                            </h4>
                            <p className="mt-4 text-xs leading-relaxed whitespace-pre-line text-white/70">
                                {operationalHours}
                            </p>
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
        </>
    );
}

export { FooterSection as Footer };
export default FooterSection;
