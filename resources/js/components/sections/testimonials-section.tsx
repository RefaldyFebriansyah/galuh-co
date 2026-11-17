import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { fadeInUp, viewportOnce } from '@/lib/motion';

export function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const reviews = [
        {
            quote: 'Untuk hampers keluarga dan suvenir pernikahan kami, GALUH & CO. benar-benar memuaskan. Tulisan kartu ucapannya rapi, kemasannya mewah, dan harum saat pertama kali kotak dibuka.',
            name: 'Asep Saepuloh',
            role: 'PELANGGAN PAKET WEDDING',
            rating: 5,
        },
        {
            quote: 'Kami memesan 350 paket hampers akhir tahun untuk klien dan mitra perusahaan. Pengirimannya tepat waktu, kemasannya aman sampai tujuan, dan semua penerima memberikan kesan yang sangat baik.',
            name: 'Rasya Syahreza',
            role: 'HRD & GA, PERUSAHAAN FINTECH',
            rating: 5,
        },
        {
            quote: 'Sudah tiga tahun berturut-turut memesan bingkisan Lebaran di GALUH & CO. Pilihan kue kering dan isinya selalu berkualitas, kemasannya pun terasa eksklusif dan berbeda dari yang lain.',
            name: 'Muhammad Rizky P',
            role: 'PEMBELI PAKET LEBARAN',
            rating: 5,
        },
        {
            quote: 'Pelayanan konsultasi sangat ramah dan responsif. Custom logo perusahaan pada pita dan wax seal terlihat sangat profesional. Klien kami sangat terkesan.',
            name: 'Dian Paramitha',
            role: 'MARKETING DIRECTOR, LOGISTICS CORP',
            rating: 5,
        },
    ];

    const prevSlide = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    };

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
                        hadiah istimewa.
                    </p>
                </div>

                {/* Draggable & Swipeable Carousel Container */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="relative mx-auto mt-8 max-w-4xl"
                >
                    {/* Navigation Buttons (Desktop & Tablet) */}
                    <div className="mb-4 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Testimoni Sebelumnya"
                            className="flex size-9 items-center justify-center rounded-full border border-[#EAE5DC] bg-white text-[#1A1815] shadow-xs transition-colors hover:border-[#0E2A1E] hover:bg-[#0E2A1E] hover:text-white"
                        >
                            <ChevronLeft className="size-4.5" />
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Testimoni Selanjutnya"
                            className="flex size-9 items-center justify-center rounded-full border border-[#EAE5DC] bg-white text-[#1A1815] shadow-xs transition-colors hover:border-[#0E2A1E] hover:bg-[#0E2A1E] hover:text-white"
                        >
                            <ChevronRight className="size-4.5" />
                        </button>
                    </div>

                    {/* Active Review Card with Drag and Animation */}
                    <div className="overflow-hidden rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-md md:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.25}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -35) nextSlide();
                                    else if (info.offset.x > 35) prevSlide();
                                }}
                                initial={{ opacity: 0, x: direction * 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction * -40 }}
                                transition={{
                                    x: {
                                        type: 'spring',
                                        stiffness: 280,
                                        damping: 26,
                                    },
                                    opacity: { duration: 0.25 },
                                }}
                                className="cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-center gap-1">
                                    {Array.from({
                                        length: reviews[activeIndex].rating,
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="size-4 fill-[#D4AF37] text-[#D4AF37]"
                                        />
                                    ))}
                                </div>

                                <blockquote className="mt-4 font-serif text-base leading-relaxed text-[#2C2723] md:text-xl">
                                    “{reviews[activeIndex].quote}”
                                </blockquote>

                                <div className="mt-8 flex items-center gap-4 border-t border-[#EAE5DC] pt-5">
                                    <span className="flex size-11 items-center justify-center rounded-full bg-[#143628] font-serif text-sm font-bold text-white shadow-xs">
                                        {reviews[activeIndex].name.charAt(0)}
                                    </span>
                                    <div>
                                        <h4 className="font-serif text-sm font-bold text-[#1A1815] md:text-base">
                                            {reviews[activeIndex].name}
                                        </h4>
                                        <span className="block text-[9px] font-bold tracking-widest text-[#8C877E] uppercase">
                                            {reviews[activeIndex].role}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination Indicator Dots */}
                    <div className="mt-5 flex items-center justify-center gap-2">
                        {reviews.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveIndex(idx)}
                                aria-label={`Buka slide testimoni ${idx + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeIndex === idx
                                        ? 'w-7 bg-[#143628]'
                                        : 'w-2 bg-[#D8D2C7] hover:bg-[#8C877E]'
                                }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export {
    TestimonialsSection as Testimonials,
    TestimonialsSection as TestimonialSection,
};
