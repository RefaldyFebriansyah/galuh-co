import { motion } from 'motion/react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';
import { fadeInUp, viewportOnce, buttonTap } from '@/lib/motion';

interface StudioLocationSectionProps {
    address?: string;
    operationalHours?: string;
    phone?: string;
    gmapsEmbed?: string;
}

export function StudioLocationSection({
    address = 'Jl. Ir. H. Juanda No. 146, Ciamis, Jawa Barat 46211',
    operationalHours = 'Senin - Sabtu: 08.00 - 18.00 WIB',
    phone = '+62 823-2177-3434',
    gmapsEmbed,
}: StudioLocationSectionProps) {
    const cleanAddress = address.trim();
    const mapsQuery = encodeURIComponent(cleanAddress);
    const mapsEmbedUrl =
        gmapsEmbed || `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
    const mapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    return (
        <section
            id="lokasi-studio"
            className="relative border-t border-[#A88B54]/20 bg-[#F2EBDC] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Editorial Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <span>STUDIO PRODUKSI &amp; WORKSHOP</span>
                        <span className="size-1 rounded-full bg-[#A88B54]" />
                        <span>ATELIER GALUH &amp; CO.</span>
                    </div>

                    <h2 className="mt-2.5 font-serif text-3xl font-normal tracking-tight text-[#16233B] sm:text-4xl lg:text-5xl">
                        Kunjungi Studio Kriya &amp;{' '}
                        <span className="text-[#A88B54] italic">
                            Atelier Kami
                        </span>
                    </h2>

                    <p className="mt-3 text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                        Setiap bingkisan dan hampers eksklusif dikurasi,
                        dirangkai, dan dikemas dengan standar presisi tinggi
                        langsung dari studio produksi kami di Ciamis.
                    </p>
                </motion.div>

                {/* Content: Map Embed + Studio Atelier Details Card */}
                <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                    {/* Google Maps Embed Frame */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="relative min-h-[340px] overflow-hidden rounded-2xl border border-[#A88B54]/30 bg-white shadow-lg lg:col-span-7 lg:min-h-[420px]"
                    >
                        <iframe
                            title="Lokasi Studio Produksi Galuh & Co."
                            src={mapsEmbedUrl}
                            width="100%"
                            height="100%"
                            className="size-full min-h-[340px] border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </motion.div>

                    {/* Studio Information Details Panel */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="flex flex-col justify-between rounded-2xl border border-[#A88B54]/30 bg-[#16233B] p-6 text-white shadow-xl sm:p-8 lg:col-span-5"
                    >
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#A88B54] uppercase">
                                ATELIER &amp; SHOWROOM
                            </span>
                            <h3 className="mt-2 font-serif text-2xl font-normal text-[#F2EBDC]">
                                Galuh &amp; Co. Atelier Bingkisan
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[#F2EBDC]/70">
                                Ruang kreasi di mana karya anyaman artisanal,
                                kemasan hardbox premium, dan kartu ucapan
                                berstempel wax dipersiapkan untuk momen istimewa
                                Anda.
                            </p>

                            <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                                {/* Alamat Lengkap */}
                                <div className="flex items-start gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#A88B54]/20 text-[#A88B54]">
                                        <MapPin className="size-4" />
                                    </div>
                                    <div>
                                        <span className="block text-[9.5px] font-bold tracking-wider text-[#A88B54] uppercase">
                                            Alamat Produksi &amp; Workshop
                                        </span>
                                        <p className="mt-0.5 text-xs leading-relaxed text-[#F2EBDC]/90">
                                            {address}
                                        </p>
                                    </div>
                                </div>

                                {/* Jam Operasional */}
                                <div className="flex items-start gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#A88B54]/20 text-[#A88B54]">
                                        <Clock className="size-4" />
                                    </div>
                                    <div>
                                        <span className="block text-[9.5px] font-bold tracking-wider text-[#A88B54] uppercase">
                                            Jam Operasional Studio
                                        </span>
                                        <p className="mt-0.5 text-xs text-[#F2EBDC]/90">
                                            {operationalHours}
                                        </p>
                                    </div>
                                </div>

                                {/* Telepon Studio */}
                                <div className="flex items-start gap-3">
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#A88B54]/20 text-[#A88B54]">
                                        <Phone className="size-4" />
                                    </div>
                                    <div>
                                        <span className="block text-[9.5px] font-bold tracking-wider text-[#A88B54] uppercase">
                                            Layanan Pelanggan Studio
                                        </span>
                                        <p className="mt-0.5 text-xs text-[#F2EBDC]/90">
                                            {phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Button Action: Open in Google Maps */}
                        <div className="mt-8 border-t border-white/10 pt-5">
                            <motion.a
                                whileTap={buttonTap.tap}
                                href={mapsDirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#A88B54] bg-[#A88B54] px-5 py-3 text-xs font-bold tracking-wider text-[#16233B] transition-all hover:bg-[#F2EBDC] hover:text-[#16233B]"
                            >
                                <span>BUKA DI GOOGLE MAPS</span>
                                <ExternalLink className="size-3.5" />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default StudioLocationSection;
