import { Gift, HeartHandshake, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeInUp, viewportOnce } from '@/lib/motion';

export function AboutSection() {
    return (
        <section
            id="tentang"
            className="border-t border-[#EAE5DC] bg-[#FAF8F5] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    {/* Left Brand Atelier Arch Visual */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="flex justify-center lg:col-span-5"
                    >
                        <div className="group relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-[#EAE3D6] bg-white p-3 shadow-xl transition-all duration-500 hover:shadow-2xl">
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[#0E2A1E]">
                                {/* Real Product Photo: Besek Anyaman Bambu Eksklusif */}
                                <img
                                    src="/images/product_bamboo_box.jpg"
                                    alt="Sentuhan Ketulusan Hampers Galuh & Co."
                                    className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                                />

                                {/* Subtle Gradient Overlays for Readability */}
                                <div
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                                    aria-hidden="true"
                                />

                                {/* Top Left Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-3.5 py-1 text-[9px] font-bold tracking-[0.18em] text-[#FAF0D7] uppercase backdrop-blur-md">
                                        FILOSOFI KRIYA ATELIER
                                    </span>
                                </div>

                                {/* Bottom Dark Green Luxury Quote Block */}
                                <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-white/20 bg-[#0E2A1E]/92 p-4 text-left text-white shadow-xl backdrop-blur-md sm:p-5">
                                    <p className="font-serif text-xs leading-relaxed text-white/95 italic sm:text-[13px]">
                                        “Setiap kotak hadiah kami rangkai dengan
                                        teliti dan penuh kehangatan,
                                        menghadirkan senyum tulus saat pertama
                                        kali dibuka.”
                                    </p>
                                    <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5 text-[9px] font-bold tracking-widest text-[#C5A880] uppercase">
                                        <span>GALUH &amp; CO.</span>
                                        <span>ANYAMAN BAMBU MEWAH</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Story */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="space-y-6 lg:col-span-7"
                    >
                        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#9E7E45] uppercase">
                            <span>TENTANG GALUH &amp; CO.</span>
                            <span className="size-1 rounded-full bg-[#C5A880]" />
                            <span>SEJAK 2024</span>
                        </div>

                        <h2 className="font-serif text-3xl leading-[1.12] font-normal tracking-tight text-[#1A1815] sm:text-4xl lg:text-5xl">
                            Menghadirkan Kehangatan di Setiap{' '}
                            <span className="text-[#9E7E45] italic">
                                Kotak Hadiah
                            </span>
                        </h2>

                        <p className="text-sm leading-relaxed text-[#5C564C] sm:text-base">
                            GALUH &amp; CO. lahir dari keyakinan bahwa bingkisan
                            terbaik bukan sekadar benda di dalam wadah,
                            melainkan bahasa ketulusan yang merajut ikatan
                            emosional dan apresiasi berkelas. Kami
                            mendedikasikan ketelitian kriya pada setiap lembar
                            pita, lipatan linen, dan segel lilin wax.
                        </p>

                        <p className="text-sm leading-relaxed text-[#5C564C] sm:text-base">
                            Mulai dari bahan kudapan butter Wijsman autentik,
                            kopi single-origin, hingga tumbler termal yang
                            digrafir nama personal—setiap pesanan dikerjakan
                            dengan standar atelier terbaik untuk perayaan
                            keluarga maupun representasi resmi korporat.
                        </p>

                        {/* 3 Pillars Cards (Editorial Layout with Hairline Borders) */}
                        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                            <div className="group rounded-2xl border border-[#EAE5DC] bg-white p-4.5 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="flex size-9 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                                        <Gift className="size-4" />
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-[#8C877E]">
                                        01
                                    </span>
                                </div>
                                <h3 className="mt-3.5 font-serif text-sm font-bold text-[#1A1815]">
                                    Kurasi Pilihan
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-[#7A746B]">
                                    Bahan bermutu tinggi dan higienis yang
                                    dirangkai cermat untuk setiap perayaan.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-[#EAE5DC] bg-white p-4.5 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="flex size-9 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                                        <Package className="size-4" />
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-[#8C877E]">
                                        02
                                    </span>
                                </div>
                                <h3 className="mt-3.5 font-serif text-sm font-bold text-[#1A1815]">
                                    Kemasan Eksklusif
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-[#7A746B]">
                                    Hardbox linen kokoh, pita satin sutra, dan
                                    stempel segel lilin manual.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-[#EAE5DC] bg-white p-4.5 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <span className="flex size-9 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                                        <HeartHandshake className="size-4" />
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-[#8C877E]">
                                        03
                                    </span>
                                </div>
                                <h3 className="mt-3.5 font-serif text-sm font-bold text-[#1A1815]">
                                    Sentuhan Personal
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-[#7A746B]">
                                    Kustomisasi kartu ucapan, grafir nama, dan
                                    sleeve logo perusahaan.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
