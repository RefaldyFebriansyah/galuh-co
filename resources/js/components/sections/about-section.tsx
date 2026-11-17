import { Gift, HeartHandshake, Package, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeInUp, viewportOnce } from '@/lib/motion';

export function AboutSection() {
    return (
        <section
            id="tentang"
            className="border-t border-[#EAE5DC] bg-[#FAF8F5] py-10 md:py-14 lg:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left Brand Atelier Card */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="flex justify-center lg:col-span-5 lg:h-full"
                    >
                        <div className="group relative flex w-full max-w-md flex-col overflow-hidden rounded-[26px] border border-[#EAE5DC] bg-white p-2.5 shadow-xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(26,24,21,0.15)] sm:p-3 lg:h-full lg:max-w-none">
                            <div className="relative flex size-full min-h-[440px] flex-1 flex-col justify-between overflow-hidden rounded-[20px] border border-[#EAE3D6] bg-[#FAF8F3] sm:min-h-[480px]">
                                {/* Real Product Photo: Besek Anyaman Bambu Eksklusif */}
                                <img
                                    src="/images/product_bamboo_box.jpg"
                                    alt="Sentuhan Ketulusan Hampers Galuh & Co."
                                    className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* Subtle Gradient Overlays for Readability */}
                                <div
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40"
                                    aria-hidden="true"
                                />

                                {/* Top Badge */}
                                <div className="relative z-10 p-4 sm:p-5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[8.5px] font-bold tracking-[0.2em] text-[#FAF0D7] uppercase backdrop-blur-md sm:text-[9px]">
                                        <Sparkles className="size-2.5 text-[#C5A880]" />
                                        <span>SENTUHAN KETULUSAN</span>
                                    </span>
                                </div>

                                {/* Bottom Dark Green Luxury Quote Block */}
                                <div className="relative z-10 m-3 rounded-2xl border border-white/20 bg-[#0E2A1E]/90 p-4 text-left text-white shadow-2xl backdrop-blur-md sm:m-4 sm:p-5">
                                    <p className="font-serif text-xs leading-relaxed text-white/95 italic sm:text-[13px]">
                                        “Setiap kotak hadiah kami rangkai dengan
                                        teliti dan penuh kehangatan,
                                        menghadirkan senyum tulus saat pertama
                                        kali dibuka.”
                                    </p>
                                    <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5 text-[9px] font-bold tracking-widest text-[#C5A880] uppercase sm:text-[10px]">
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
                        className="lg:col-span-7"
                    >
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                            ✦ TENTANG GALUH &amp; CO.
                        </span>

                        <h2 className="mt-2 font-serif text-3xl leading-snug font-normal text-[#1A1815] md:text-4xl lg:text-5xl">
                            Menghadirkan Kehangatan <br />
                            di Setiap Kotak Hadiah
                        </h2>

                        <p className="mt-4 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                            GALUH &amp; CO. hadir dari keyakinan bahwa hadiah
                            terbaik bukan sekadar soal isi di dalamnya,
                            melainkan cara kita menyampaikan perhatian dan
                            ketulusan. Setiap bingkisan kami rancang untuk
                            menciptakan momen hangat dan senyum tulus saat
                            pertama kali kotak dibuka.
                        </p>

                        <p className="mt-3 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                            Mulai dari kurasi produk pilihan berkualitas tinggi,
                            kemasan eksklusif yang rapi hingga detail terkecil,
                            sampai kartu ucapan dengan sentuhan
                            personal—semuanya disiapkan agar setiap hadiah untuk
                            keluarga maupun mitra perusahaan terasa begitu
                            berkesan.
                        </p>

                        {/* 2 Big Highlights */}
                        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#EAE5DC] pt-5 sm:grid-cols-2">
                            <div>
                                <span className="font-serif text-base font-bold text-[#1A1815]">
                                    Kurasi Pilihan
                                </span>
                                <span className="mt-1 block text-[8px] font-bold tracking-widest text-[#8C877E] uppercase">
                                    HAMPERS PERSONAL &amp; PERUSAHAAN
                                </span>
                            </div>

                            <div>
                                <span className="font-serif text-base font-bold text-[#1A1815]">
                                    Kemasan Eksklusif
                                </span>
                                <span className="mt-1 block text-[8px] font-bold tracking-widest text-[#8C877E] uppercase">
                                    DIRANGKAI RAPI DENGAN SENTUHAN PERSONAL
                                </span>
                            </div>
                        </div>

                        {/* 3 Pillars Cards */}
                        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                            <motion.div
                                whileHover={{
                                    y: -4,
                                    transition: {
                                        duration: 0.25,
                                        ease: [0.16, 1, 0.3, 1],
                                    },
                                }}
                                className="group rounded-2xl border border-[#EAE5DC] bg-white p-4 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md"
                            >
                                <span className="flex size-9.5 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                                    <Gift className="size-4.5" />
                                </span>
                                <h4 className="mt-3 font-serif text-sm font-bold text-[#1A1815]">
                                    Kurasi Pilihan
                                </h4>
                                <p className="mt-1 text-[11px] leading-relaxed text-[#7A746B]">
                                    Produk pilihan berkualitas tinggi yang
                                    dirangkai cermat untuk setiap momen.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{
                                    y: -4,
                                    transition: {
                                        duration: 0.25,
                                        ease: [0.16, 1, 0.3, 1],
                                    },
                                }}
                                className="group rounded-2xl border border-[#EAE5DC] bg-white p-4 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md"
                            >
                                <span className="flex size-9.5 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                                    <Package className="size-4.5" />
                                </span>
                                <h4 className="mt-3 font-serif text-sm font-bold text-[#1A1815]">
                                    Kemasan Premium
                                </h4>
                                <p className="mt-1 text-[11px] leading-relaxed text-[#7A746B]">
                                    Kotak hadiah mewah dengan detail pita dan
                                    sentuhan akhir yang berkelas.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{
                                    y: -4,
                                    transition: {
                                        duration: 0.25,
                                        ease: [0.16, 1, 0.3, 1],
                                    },
                                }}
                                className="group rounded-2xl border border-[#EAE5DC] bg-white p-4 shadow-2xs transition-all duration-300 hover:border-[#C5A880]/60 hover:shadow-md"
                            >
                                <span className="flex size-9.5 items-center justify-center rounded-xl border border-[#C5A880]/30 bg-[#FAF0D7] text-[#8B6B38] shadow-2xs transition-transform duration-300 group-hover:scale-110">
                                    <HeartHandshake className="size-4.5" />
                                </span>
                                <h4 className="mt-3 font-serif text-sm font-bold text-[#1A1815]">
                                    Sentuhan Personal
                                </h4>
                                <p className="mt-1 text-[11px] leading-relaxed text-[#7A746B]">
                                    Bebas custom kartu ucapan dan pesan khusus
                                    agar hadiah terasa lebih hangat.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
