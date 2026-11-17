import { motion } from 'motion/react';
import { fadeInUp, viewportOnce } from '@/lib/motion';

export function AboutSection() {
    return (
        <section
            id="tentang"
            className="border-t border-[#EAE5DC] bg-[#FAF8F5] py-10 md:py-14 lg:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left Image with Quote Card Overlay */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="lg:col-span-5"
                    >
                        <div className="relative aspect-[4/4.8] overflow-hidden rounded-[26px] border border-[#EAE5DC] bg-white p-2 shadow-xl">
                            <img
                                src="/images/about_artisan.jpg"
                                alt="Perakitan Kemasan Eksklusif Galuh & Co"
                                className="size-full rounded-[20px] object-cover"
                                loading="lazy"
                            />

                            {/* Dark Green Overlay Card at Bottom */}
                            <div className="absolute right-5 bottom-5 left-5 rounded-2xl bg-[#0E2A1E]/95 p-4 text-white shadow-xl backdrop-blur-xs">
                                <p className="font-serif text-[11px] leading-relaxed text-white/90 italic">
                                    “Setiap kotak hadiah kami rangkai dengan
                                    hangat, agar menghadirkan senyum tulus saat
                                    pertama kali dibuka.”
                                </p>
                                <span className="mt-2 block text-[9px] font-bold tracking-widest text-[#C5A880] uppercase">
                                    — GALUH &amp; CO.
                                </span>
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
                            <div className="rounded-2xl border border-[#EAE5DC] bg-white p-3.5 shadow-2xs">
                                <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF0D7] text-xs">
                                    🎁
                                </span>
                                <h4 className="mt-2.5 font-serif text-xs font-bold text-[#1A1815]">
                                    Kurasi Pilihan
                                </h4>
                                <p className="mt-1 text-[10px] leading-relaxed text-[#8C877E]">
                                    Produk pilihan berkualitas tinggi yang
                                    dirangkai cermat untuk setiap momen.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#EAE5DC] bg-white p-3.5 shadow-2xs">
                                <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF0D7] text-xs">
                                    📦
                                </span>
                                <h4 className="mt-2.5 font-serif text-xs font-bold text-[#1A1815]">
                                    Kemasan Premium
                                </h4>
                                <p className="mt-1 text-[10px] leading-relaxed text-[#8C877E]">
                                    Kotak hadiah mewah dengan detail pita dan
                                    sentuhan akhir yang berkelas.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#EAE5DC] bg-white p-3.5 shadow-2xs">
                                <span className="flex size-7 items-center justify-center rounded-lg bg-[#FAF0D7] text-xs">
                                    ✍️
                                </span>
                                <h4 className="mt-2.5 font-serif text-xs font-bold text-[#1A1815]">
                                    Sentuhan Personal
                                </h4>
                                <p className="mt-1 text-[10px] leading-relaxed text-[#8C877E]">
                                    Bebas custom kartu ucapan dan pesan khusus
                                    agar hadiah terasa lebih hangat.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
