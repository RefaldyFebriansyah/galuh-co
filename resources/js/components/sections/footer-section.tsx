import { ExternalLink, PackageSearch, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GaluhLogo } from '@/components/galuh-logo';
import { WhatsAppIcon } from '@/components/whatsapp-icon';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';

interface FooterSectionProps {
    whatsappNumber?: string;
    logoSrc?: string;
    contactEmail?: string;
    contactPhone?: string;
    companyAddress?: string;
    operationalHours?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    linkedinUrl?: string;
    footerBio?: string;
}

export function FooterSection({
    whatsappNumber = '6282321773434',
    logoSrc,
    contactEmail = 'halo@galuh.co.id',
    contactPhone = '+62 823-2177-3434',
    companyAddress = 'Jl. Ir. H. Juanda No. 146, Ciamis, Jawa Barat 46211',
    operationalHours = 'Senin - Sabtu: 08.00 - 18.00 WIB',
    instagramUrl = 'https://instagram.com/galuh.co',
    tiktokUrl = 'https://tiktok.com/@galuh.co',
    linkedinUrl,
    footerBio = 'Atelier kriya bingkisan premium dan corporate gifting artisanal yang memadukan kehangatan tradisi anyaman bambu Nusantara dengan kemewahan hardbox linen berstempel wax.',
}: FooterSectionProps) {
    const rawWa = (whatsappNumber || '').replace(/\D/g, '');
    const cleanWaNumber = rawWa.startsWith('0') ? `62${rawWa.slice(1)}` : rawWa || '6281572414233';

    const handleScrollToCatalog = () => {
        const el = document.getElementById('koleksi');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* 1. Final CTA Banner Section */}
            <section className="bg-[#F2EBDC] py-12 md:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
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
                        className="group relative overflow-hidden rounded-3xl border border-[#A88B54]/30 bg-[#16233B] p-6 text-center shadow-2xl transition-all duration-500 hover:border-[#A88B54]/60 hover:shadow-[0_30px_70px_rgba(22,35,59,0.35)] sm:p-8 md:p-12 lg:p-14"
                    >
                        {/* Ambient Glow */}
                        <div
                            className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-[#A88B54]/[0.1] blur-[80px] transition-all duration-700 group-hover:scale-125 group-hover:bg-[#A88B54]/[0.2]"
                            aria-hidden="true"
                        />
                        <div
                            className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-[#A88B54]/[0.08] blur-[80px] transition-all duration-700 group-hover:scale-125"
                            aria-hidden="true"
                        />

                        <div className="relative mx-auto max-w-2xl">
                            <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-[#A88B54] uppercase">
                                <span>ATELIER BINGKISAN</span>
                                <span className="size-1 rounded-full bg-[#A88B54]" />
                                <span>KONSULTASI &amp; PEMESANAN CUSTOM</span>
                            </div>

                            <h2 className="mt-4 font-serif text-2xl leading-snug font-normal text-[#F2EBDC] md:text-4xl">
                                Hadirkan Momen Berharga Melalui <br />
                                <span className="text-[#A88B54] italic">
                                    Sentuhan Hadiah Istimewa
                                </span>
                            </h2>

                            <p className="mt-3 text-xs leading-relaxed text-[#F2EBDC]/75 md:text-sm">
                                Konsultasikan kebutuhan hampers personal, bingkisan momen spesial,
                                maupun pengadaan korporat berskala besar langsung bersama konsultan atelier kami via WhatsApp.
                            </p>

                            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <motion.a
                                    whileTap={buttonTap.tap}
                                    href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                                        'Halo GALUH & CO., saya ingin konsultasi mengenai pesanan hampers eksklusif & custom corporate gifting.',
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-xs font-bold tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#20ba5a] sm:w-auto"
                                >
                                    <WhatsAppIcon className="size-4.5 text-white" />
                                    <span>KONSULTASI VIA WHATSAPP</span>
                                </motion.a>
                                <motion.button
                                    whileTap={buttonTap.tap}
                                    type="button"
                                    onClick={handleScrollToCatalog}
                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#A88B54]/40 bg-white/10 px-6 py-3.5 text-xs font-bold tracking-wider text-[#F2EBDC] backdrop-blur-xs transition-all duration-300 hover:bg-white/20 sm:w-auto"
                                >
                                    <span>JELAJAHI KATALOG HAMPERS</span>
                                    <ArrowUpRight className="size-4 text-[#A88B54]" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Deep Navy Footer */}
            <footer className="relative border-t border-[#A88B54]/20 bg-[#16233B] text-white">
                <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-12">
                    {/* Footer Columns */}
                    <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-12">
                        {/* Brand Info */}
                        <div className="lg:col-span-4">
                            <GaluhLogo
                                variant="white"
                                src={logoSrc}
                                className="h-14 w-auto md:h-16"
                            />
                            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#F2EBDC]/70">
                                {footerBio}
                            </p>
                        </div>

                        {/* Kontak & Layanan */}
                        <div className="lg:col-span-3">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#A88B54] uppercase">
                                KONTAK &amp; LAYANAN
                            </h4>
                            <ul className="mt-4 space-y-2 text-xs text-[#F2EBDC]/80">
                                <li>
                                    Email:{' '}
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="transition-colors hover:text-white"
                                    >
                                        {contactEmail}
                                    </a>
                                </li>
                                <li>
                                    Telepon Studio:{' '}
                                    <span className="text-[#F2EBDC]">
                                        {contactPhone}
                                    </span>
                                </li>
                                <li>
                                    <a
                                        href="/lacak-pesanan"
                                        className="inline-flex items-center gap-1 font-semibold text-[#A88B54] hover:underline"
                                    >
                                        <span>Lacak Resi Pengiriman</span>
                                        <ArrowUpRight className="size-3" />
                                    </a>
                                </li>
                                {instagramUrl && (
                                    <li>
                                        Instagram:{' '}
                                        <a
                                            href={instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
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
                                            className="transition-colors hover:text-white"
                                        >
                                            @galuh.co
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Galeri & Studio */}
                        <div className="lg:col-span-3">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#A88B54] uppercase">
                                STUDIO PRODUKSI &amp; WORKSHOP
                            </h4>
                            <p className="mt-4 text-xs leading-relaxed whitespace-pre-line text-[#F2EBDC]/80">
                                {companyAddress}
                            </p>
                            <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(companyAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#A88B54] hover:underline"
                            >
                                <span>Buka di Google Maps</span>
                                <ExternalLink className="size-3" />
                            </a>
                        </div>

                        {/* Jam Operasional */}
                        <div className="lg:col-span-2">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#A88B54] uppercase">
                                JAM OPERASIONAL
                            </h4>
                            <p className="mt-4 text-xs leading-relaxed whitespace-pre-line text-[#F2EBDC]/80">
                                {operationalHours}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col items-center justify-between gap-4 pt-5 pb-6 text-[10px] font-medium tracking-wider text-[#F2EBDC]/50 sm:flex-row">
                        <p>© 2026 GALUH &amp; CO. Hak Cipta Dilindungi.</p>
                        <div className="flex gap-6 uppercase">
                            <span className="cursor-pointer hover:text-white">
                                PRIVASI
                            </span>
                            <span className="cursor-pointer hover:text-white">
                                SYARAT &amp; KETENTUAN
                            </span>
                            <span className="cursor-pointer hover:text-white">
                                STANDAR KRIYA
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
