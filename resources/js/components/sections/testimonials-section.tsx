import { motion } from 'motion/react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

export function TestimonialsSection() {
    const reviews = [
        {
            quote: 'Untuk hampers keluarga dan suvenir pernikahan kami, GALUH & CO. benar-benar memuaskan. Tulisan kartu ucapannya rapi, kemasannya mewah, dan harum saat pertama kali kotak dibuka.',
            name: 'Asep Saepuloh',
            role: 'PELANGGAN PAKET WEDDING',
        },
        {
            quote: 'Kami memesan 350 paket hampers akhir tahun untuk klien dan mitra perusahaan. Pengirimannya tepat waktu, kemasannya aman sampai tujuan, dan semua penerima memberikan kesan yang sangat baik.',
            name: 'Rasya Syahreza',
            role: 'HRD & GA, PERUSAHAAN FINTECH',
        },
        {
            quote: 'Sudah tiga tahun berturut-turut memesan bingkisan Lebaran di GALUH & CO. Pilihan kue kering dan isinya selalu berkualitas, kemasannya pun terasa eksklusif dan berbeda dari yang lain.',
            name: 'Muhammad Rizky P',
            role: 'PEMBELI PAKET LEBARAN',
        },
    ];

    return (
        <section
            id="testimoni"
            className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                        ✦ KATA MEREKA ✦
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#1A1815] md:text-4xl lg:text-5xl">
                        Kisah dari Mereka yang <br />
                        Mempercayai Galuh &amp; Co.
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                        Senyum penerima dan kepuasan setiap pengirim selalu
                        menjadi motivasi utama kami dalam merangkai setiap kotak
                        hadiah.
                    </p>
                </div>

                {/* 3 Review Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3"
                >
                    {reviews.map((rev, idx) => (
                        <motion.div
                            key={idx}
                            variants={staggerItem}
                            className="flex flex-col justify-between rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-2xs md:p-6"
                        >
                            <div>
                                <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
                                    {'★★★★★'.split('').map((star, i) => (
                                        <span key={i}>{star}</span>
                                    ))}
                                </div>
                                <p className="mt-3.5 font-serif text-xs leading-relaxed text-[#5A564F]">
                                    “{rev.quote}”
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-3 border-t border-[#EAE5DC] pt-4">
                                <span className="flex size-8 items-center justify-center rounded-full bg-[#D8D2C7] text-xs font-bold text-white">
                                    {rev.name.charAt(0)}
                                </span>
                                <div>
                                    <h4 className="font-serif text-xs font-bold text-[#1A1815]">
                                        {rev.name}
                                    </h4>
                                    <span className="block text-[8px] font-bold tracking-widest text-[#8C877E] uppercase">
                                        {rev.role}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
