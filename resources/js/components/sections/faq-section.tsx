import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { fadeInUp, viewportOnce } from '@/lib/motion';

export interface FaqItem {
    id?: number;
    question: string;
    answer: string;
    category?: string;
}

export interface FaqSectionProps {
    whatsappNumber?: string;
    faqs?: FaqItem[];
}

const DEFAULT_FAQS: FaqItem[] = [
    {
        question:
            '1. Berapa minimum pemesanan untuk hampers custom corporate?',
        answer: 'Untuk hampers custom dengan logo korporat, minimal pemesanan mulai dari 20 paket. Kami juga menyediakan fasilitas pembuatan sampel mock-up sebelum produksi massal agar Anda dapat meninjau kualitas secara langsung.',
    },
    {
        question:
            '2. Apakah bisa mengirimkan hampers ke banyak alamat berbeda di seluruh Indonesia?',
        answer: 'Ya, kami melayani sistem pengiriman multi-destination ke alamat rumah penerima maupun kantor cabang di seluruh Indonesia, lengkap dengan dashboard laporan resi pengiriman berkala.',
    },
    {
        question: '3. Berapa lama estimasi waktu pengerjaan pesanan?',
        answer: 'Koleksi siap kirim dapat dikirimkan H+1. Untuk custom hampers skala personal membutuhkan 2-3 hari kerja, dan proyek korporat besar membutuhkan 7-14 hari kerja tergantung jumlah dan detail kustomisasi.',
    },
    {
        question:
            '4. Apakah kartu ucapan bisa ditulis dengan tangan kaligrafi?',
        answer: 'Bisa. Kami memiliki seniman kaligrafi khusus yang siap menuliskan pesan personal Anda dengan tinta khusus dan segel wax seal untuk menambah kesan mewah dan intim.',
    },
    {
        question:
            '5. Bisakah kami menyertakan merchandise atau produk perusahaan sendiri ke dalam hampers?',
        answer: 'Tentu. Anda dapat mengirimkan merchandise perusahaan (seperti tumbler berlogo, powerbank, agenda, atau kartu ucapan internal) ke studio kami untuk kami rangkai rapi ke dalam kotak hampers.',
    },
    {
        question: '6. Metode pembayaran apa saja yang diterima?',
        answer: 'Kami menerima pembayaran transfer bank (BCA, Mandiri, BNI, BRI), kartu kredit, serta invoice resmi dengan sistem termin (Term of Payment / TOP) khusus klien perusahaan yang telah terverifikasi.',
    },
    {
        question:
            '7. Bagaimana jaminan keamanan kemasan selama pengiriman luar kota?',
        answer: 'Setiap paket kami lindungi dengan bubble wrap berlapis, pelindung sudut hardbox, dan kardus luar tersegel rapat. Kami juga menyertakan garansi penggantian penuh jika terjadi kerusakan akibat pengiriman kurir ekspedisi.',
    },
    {
        question:
            '8. Apakah GALUH & CO. dapat menerbitkan Faktur Pajak resmi?',
        answer: 'Ya, sebagai entitas berbadan hukum resmi, kami menyediakan dokumen legalitas lengkap mencakup Invoice resmi, Kwitansi, e-Faktur Pajak PPN, dan perjanjian kerja sama pengadaan (PKS).',
    },
];

export function FaqSection({
    whatsappNumber = '6281572414233',
    faqs: customFaqs,
}: FaqSectionProps = {}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const activeFaqs =
        customFaqs && Array.isArray(customFaqs) && customFaqs.length > 0
            ? customFaqs
            : DEFAULT_FAQS;

    return (
        <section id="faq" className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16">
            <div className="mx-auto max-w-4xl px-6 lg:px-12">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#7A5B24] uppercase">
                        <span>INFORMASI &amp; BANTUAN</span>
                        <span className="size-1 rounded-full bg-[#C5A880]" />
                        <span>FAQ ATELIER</span>
                    </div>
                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#1A1815] md:text-4xl lg:text-5xl">
                        Pertanyaan yang Sering{' '}
                        <span className="text-[#7A5B24] italic">Diajukan</span>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#5C564C] md:text-base">
                        Informasi lengkap seputar pemesanan, kustomisasi paket,
                        hingga jaminan pengiriman hampers kami ke seluruh
                        Indonesia.
                    </p>
                </div>

                {/* Accordion Rows */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-8 space-y-2.5"
                >
                    {activeFaqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 ${
                                    isOpen
                                        ? 'border-[#C5A880] shadow-xs'
                                        : 'border-[#EAE5DC] hover:border-[#D5CEC2]'
                                }`}
                            >
                                <button
                                    type="button"
                                    id={`faq-question-${idx}`}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${idx}`}
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : idx)
                                    }
                                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                                >
                                    <span
                                        className={`font-serif text-xs font-semibold md:text-sm ${
                                            isOpen
                                                ? 'text-[#143628]'
                                                : 'text-[#1A1815]'
                                        }`}
                                    >
                                        {faq.question}
                                    </span>
                                    <span className="ml-4 flex size-5 shrink-0 items-center justify-center text-[#8C877E]">
                                        <ChevronDown
                                            className={`size-4 transition-transform duration-300 ${
                                                isOpen
                                                    ? 'rotate-180 text-[#C5A880]'
                                                    : ''
                                            }`}
                                        />
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={`faq-answer-${idx}`}
                                            role="region"
                                            aria-labelledby={`faq-question-${idx}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                height: {
                                                    duration: 0.32,
                                                    ease: [0.16, 1, 0.3, 1],
                                                },
                                                opacity: { duration: 0.22 },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-[#F2ECE4] px-5 pt-3 pb-4">
                                                <p className="text-xs leading-relaxed text-[#6E6962]">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}

export default FaqSection;

export { FaqSection as Faq, FaqSection as FAQSection };
