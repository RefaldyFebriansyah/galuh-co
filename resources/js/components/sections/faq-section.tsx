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
    faqs?: FaqItem[];
}

const DEFAULT_FAQS: FaqItem[] = [
    {
        question:
            '1. Berapa minimum pemesanan untuk hampers corporate / grosir?',
        answer: 'Pemesanan paket corporate dengan harga grosir resmi di website minimal 25 paket. Anda dapat menginput jumlah sendiri atau memilih preset yang tersedia, dan harga per paket otomatis menyesuaikan harga corporate.',
    },
    {
        question:
            '2. Apakah bisa mengirimkan hampers ke banyak alamat berbeda di seluruh Indonesia?',
        answer: 'Ya, kami melayani sistem pengiriman multi-destination ke alamat rumah penerima maupun kantor cabang di seluruh Indonesia, lengkap dengan pelacakan nomor resi pengiriman.',
    },
    {
        question: '3. Berapa lama estimasi waktu pengerjaan pesanan?',
        answer: 'Koleksi siap kirim dapat dikirimkan H+1. Untuk pesanan personal membutuhkan 1-2 hari kerja, dan proyek korporat besar membutuhkan 5-10 hari kerja tergantung jumlah dan detail kustomisasi.',
    },
    {
        question: '4. Bagaimana cara melacak status pesanan yang telah dibuat?',
        answer: 'Setelah Anda melakukan pemesanan di website, sistem otomatis menerbitkan Nomor Resi. Anda dapat memantau setiap tahapan pengerjaan studio hingga kurir tiba melalui menu "Lacak Pesanan" di navigasi website.',
    },
    {
        question:
            '5. Apakah kartu ucapan berstempel wax seal disertakan secara gratis?',
        answer: 'Ya, setiap paket hampers GALUH & CO. sudah termasuk kartu ucapan personal berstempel segel lilin wax mewah sesuai teks ucapan yang Anda tuliskan saat pemesanan.',
    },
    {
        question: '6. Metode pembayaran apa saja yang diterima?',
        answer: 'Kami menerima pembayaran transfer bank, e-wallet, kartu kredit, serta invoice resmi bagi klien perusahaan yang telah terverifikasi.',
    },
];

export function FaqSection({ faqs: customFaqs }: FaqSectionProps = {}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const activeFaqs =
        customFaqs && Array.isArray(customFaqs) && customFaqs.length > 0
            ? customFaqs
            : DEFAULT_FAQS;

    return (
        <section id="faq" className="bg-[#F2EBDC] py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <span>INFORMASI &amp; BANTUAN</span>
                        <span className="size-1 rounded-full bg-[#A88B54]" />
                        <span>FAQ ATELIER</span>
                    </div>
                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#16233B] md:text-4xl lg:text-5xl">
                        Pertanyaan yang Sering{' '}
                        <span className="text-[#A88B54] italic">Diajukan</span>
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#6E675D] sm:text-sm md:text-base">
                        Informasi lengkap seputar pemesanan online, paket
                        corporate, hingga sistem pelacakan resi hampers kami ke
                        seluruh Indonesia.
                    </p>
                </div>

                {/* Accordion Rows */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-8 space-y-3"
                >
                    {activeFaqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 ${
                                    isOpen
                                        ? 'border-[#A88B54] shadow-xs'
                                        : 'border-[#A88B54]/20 hover:border-[#A88B54]/50'
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
                                                ? 'text-[#16233B]'
                                                : 'text-[#16233B]/80'
                                        }`}
                                    >
                                        {faq.question}
                                    </span>
                                    <span className="ml-4 flex size-5 shrink-0 items-center justify-center text-[#6E675D]">
                                        <ChevronDown
                                            className={`size-4 transition-transform duration-300 ${
                                                isOpen
                                                    ? 'rotate-180 text-[#A88B54]'
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
                                            <div className="border-t border-[#F2EBDC] px-5 pt-3 pb-4">
                                                <p className="text-xs leading-relaxed text-[#6E675D]">
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
