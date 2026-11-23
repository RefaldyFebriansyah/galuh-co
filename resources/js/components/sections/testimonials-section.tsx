import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useRef, useState } from 'react';

export interface ReviewItem {
    id?: number;
    quote: string;
    name: string;
    role: string;
    orderType?: string;
    city?: string;
    rating: number;
}

export interface TestimonialsSectionProps {
    testimonials?: ReviewItem[];
}

const REVIEWS: ReviewItem[] = [
    {
        quote: 'Untuk hampers keluarga dan suvenir pernikahan kami, GALUH & CO. benar-benar memuaskan. Tulisan kartu ucapannya rapi, kemasannya mewah, dan harum saat pertama kali kotak dibuka.',
        name: 'Asep Saepuloh',
        role: 'Pelanggan Paket Wedding',
        orderType: 'Bespoke Anyaman Bambu & Kudapan Wijsman',
        rating: 5,
    },
    {
        quote: 'Kami memesan 350 paket hampers akhir tahun untuk klien dan mitra perusahaan. Pengirimannya tepat waktu, kemasannya aman sampai tujuan, dan semua penerima memberikan kesan yang sangat baik.',
        name: 'Rasya Syahreza',
        role: 'HRD & GA, Perusahaan Fintech',
        orderType: '350 Paket Executive Hardbox Emerald',
        rating: 5,
    },
    {
        quote: 'Sudah tiga tahun berturut-turut memesan bingkisan Lebaran di GALUH & CO. Pilihan kue kering dan isinya selalu berkualitas, kemasannya pun terasa eksklusif dan berbeda dari yang lain.',
        name: 'Muhammad Rizky P.',
        role: 'Pembeli Paket Lebaran',
        orderType: 'Heritage Besek & Single-Origin Roast',
        rating: 5,
    },
    {
        quote: 'Pelayanan konsultasi sangat ramah dan responsif. Custom logo perusahaan pada pita dan wax seal terlihat sangat profesional. Klien kami sangat terkesan.',
        name: 'Dian Paramitha',
        role: 'Marketing Director, Logistics Corp',
        orderType: 'Custom Wax Seal & Monogram Tumbler',
        rating: 5,
    },
    {
        quote: 'Pengerjaan grafir laser logo dan box linen hijau zamrud sangat presisi. Sangat prestisius sebagai cinderamata untuk dewan komisaris dan mitra investor VIP kami.',
        name: 'Clara Widjaja',
        role: 'Corporate VIP Gifting',
        orderType: 'Emerald Hardbox & Engraved Tumbler',
        rating: 5,
    },
    {
        quote: 'Rasa nastar butter Wijsman autentik lumer di mulut dan madu hutannya harum murni. Kerabat keluarga besar sangat memuji kerapian anyaman bambunya.',
        name: 'Bambang Haryanto',
        role: 'Pelanggan Seri Tradisi',
        orderType: 'Anyaman Bambu & Madu Hutan Murni',
        rating: 5,
    },
];

export function TestimonialsSection({
    testimonials,
}: TestimonialsSectionProps = {}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    const activeReviews: ReviewItem[] =
        testimonials && Array.isArray(testimonials) && testimonials.length > 0
            ? testimonials.map((t) => ({
                  quote: t.quote,
                  name: t.name,
                  role: t.role,
                  orderType: t.orderType || 'Koleksi Signature Hampers',
                  rating: t.rating || 5,
              }))
            : REVIEWS;

    const scrollToCard = (index: number) => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const card = container.children[index] as HTMLElement | undefined;
        if (card) {
            container.scrollTo({
                left: card.offsetLeft - container.offsetLeft,
                behavior: 'smooth',
            });
            setActiveIdx(index);
        }
    };

    const handlePrev = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const card = container.firstElementChild as HTMLElement | null;
        const cardWidth = card ? card.offsetWidth + 24 : 360;
        container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    };

    const handleNext = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const card = container.firstElementChild as HTMLElement | null;
        const cardWidth = card ? card.offsetWidth + 24 : 360;
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const card = container.firstElementChild as HTMLElement | null;
        if (!card) return;
        const cardWidth = card.offsetWidth + 24;
        const newIndex = Math.round(container.scrollLeft / cardWidth);
        if (
            newIndex !== activeIdx &&
            newIndex >= 0 &&
            newIndex < activeReviews.length
        ) {
            setActiveIdx(newIndex);
        }
    };

    return (
        <section
            id="testimoni"
            className="relative overflow-hidden bg-[#FAF8F5] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* 1. Header (Centered) */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.22em] text-[#7A5B24] uppercase">
                        <span>KISAH &amp; APRESIASI</span>
                        <span className="size-1 rounded-full bg-[#7A5B24]" />
                        <span>TESTIMONI KLIEN</span>
                    </div>
                    <h2 className="mt-2.5 font-serif text-3xl font-normal tracking-tight text-[#0B291E] sm:text-4xl lg:text-5xl">
                        Kisah dari Mereka yang{' '}
                        <span className="text-[#7A5B24] italic">
                            Mempercayai Kami
                        </span>
                    </h2>
                    <p className="mt-3.5 text-sm leading-relaxed text-[#5C564C] sm:text-base">
                        Senyum penerima dan kepuasan setiap pengirim selalu
                        menjadi motivasi utama kami dalam merangkai setiap kotak
                        hadiah istimewa.
                    </p>
                </div>

                {/* Navigation Buttons Row */}
                <div className="mt-8 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Lihat ulasan testimoni sebelumnya"
                        className="flex size-10 items-center justify-center rounded-full border border-[#EAE5DC] bg-white text-[#0B291E] shadow-2xs transition-all duration-300 hover:border-[#0B291E] hover:bg-[#0B291E] hover:text-[#FAF8F5] active:scale-95"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Lihat ulasan testimoni selanjutnya"
                        className="flex size-10 items-center justify-center rounded-full border border-[#EAE5DC] bg-white text-[#0B291E] shadow-2xs transition-all duration-300 hover:border-[#0B291E] hover:bg-[#0B291E] hover:text-[#FAF8F5] active:scale-95"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>

                {/* 2. Multi-Card Luxury Carousel Track (3 cards on desktop, 2 on tablet, 1 on mobile) */}
                <div className="relative mt-4">
                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className="flex snap-x snap-mandatory scrollbar-none gap-6 overflow-x-auto scroll-smooth pb-4"
                    >
                        {activeReviews.map((rev, idx) => (
                            <div
                                key={idx}
                                className="w-full shrink-0 snap-start md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                            >
                                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-[#EAE3D6] bg-white p-7 shadow-[0_12px_32px_-10px_rgba(11,41,30,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B89352]/50 hover:shadow-[0_20px_40px_-12px_rgba(11,41,30,0.12)] sm:p-8">
                                    {/* Ambient Gold Quote Watermark */}
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -top-3 -right-2 font-serif text-7xl text-[#B89352]/10 transition-colors select-none group-hover:text-[#B89352]/15"
                                    >
                                        “
                                    </div>

                                    <div>
                                        {/* Card Top: Stars */}
                                        <div className="relative z-10 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-1 text-[#B89352]">
                                                {Array.from({
                                                    length: rev.rating,
                                                }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="size-3.5 fill-[#B89352] text-[#B89352]"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quote Text */}
                                        <p className="relative z-10 mt-5 font-serif text-base leading-relaxed text-[#0B291E] italic sm:text-[17px]">
                                            “{rev.quote}”
                                        </p>
                                    </div>

                                    {/* Card Footer: Client Avatar, Name & Order Details */}
                                    <div className="relative z-10 mt-6 border-t border-[#EAE3D6] pt-5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0B291E] font-serif text-sm font-bold text-[#FAF8F5] shadow-xs ring-2 ring-[#B89352]/25">
                                                {rev.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate font-serif text-sm font-bold text-[#0B291E] sm:text-base">
                                                    {rev.name}
                                                </h4>
                                                <p className="truncate font-mono text-[9.5px] font-semibold tracking-wider text-[#7A5B24] uppercase">
                                                    {rev.role}
                                                </p>
                                                <p className="truncate text-[11px] text-[#0B291E]/50 italic">
                                                    {rev.orderType}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Pagination Dots */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    {REVIEWS.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => scrollToCard(idx)}
                            aria-label={`Buka ulasan testimoni nomor ${idx + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                activeIdx === idx
                                    ? 'w-8 bg-[#0B291E]'
                                    : 'w-2 bg-[#D8D2C7] hover:bg-[#7A5B24]'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export {
    TestimonialsSection as Testimonials,
    TestimonialsSection as TestimonialSection,
};
export default TestimonialsSection;
