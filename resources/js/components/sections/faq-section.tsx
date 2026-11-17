import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { fadeInUp, viewportOnce } from '@/lib/motion';

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question:
                '1. Berapa minimum pemesanan untuk hampers custom corporate?',
            answer: 'Untuk hampers custom dengan logo korporat, minimal pemesanan mulai dari 20 paket. Kami juga menyediakan fasilitas pembuatan sampel mock-up sebelum produksi massal.',
        },
        {
            question:
                '2. Apakah bisa mengirimkan hampers ke banyak alamat berbeda di seluruh Indonesia?',
            answer: 'Ya, kami melayani sistem pengiriman multi-destination ke alamat rumah penerima maupun kantor cabang di seluruh Indonesia dengan laporan resi pengiriman berkala.',
        },
        {
            question: '3. Berapa lama estimasi waktu pengerjaan pesanan?',
            answer: 'Koleksi siap kirim dapat dikirimkan H+1. Untuk custom hampers skala personal butuh 2-3 hari kerja, dan proyek korporat besar membutuhkan 7-14 hari kerja tergantung jumlah dan detail kustomisasi.',
        },
        {
            question:
                '4. Apakah kartu ucapan bisa ditulis dengan tangan kaligrafi?',
            answer: 'Bisa. Kami memiliki seniman kaligrafi khusus yang siap menuliskan pesan personal Anda dengan tinta khusus dan segel wax seal untuk menambah kesan mewah.',
        },
        {
            question:
                '5. Bisakah kami menyertakan merchandise atau produk perusahaan sendiri ke dalam hampers?',
            answer: 'Tentu. Anda dapat mengirimkan merchandise perusahaan (seperti tumbler, powerbank, kaos, atau buku agenda) ke studio kami untuk kami rangkai rapi ke dalam kotak hampers.',
        },
        {
            question: '6. Metode pembayaran apa saja yang diterima?',
            answer: 'Kami menerima pembayaran transfer bank (BCA, Mandiri, BNI, BRI), kartu kredit, serta invoice resmi dengan sistem termin (Term of Payment) khusus klien perusahaan yang telah terverifikasi.',
        },
    ];

    return (
        <section id="faq" className="bg-[#FAF8F5] py-10 md:py-14 lg:py-16">
            <div className="mx-auto max-w-4xl px-6 lg:px-12">
                {/* Header */}
                <div className="text-center">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase">
                        ✦ TANYA JAWAB ✦
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-normal text-[#1A1815] md:text-4xl lg:text-5xl">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#6E6962] md:text-sm">
                        Informasi lengkap seputar pemesanan, kustomisasi paket,
                        hingga proses pengiriman hampers kami.
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
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="overflow-hidden rounded-2xl border border-[#EAE5DC] bg-white transition-colors"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : idx)
                                    }
                                    className="flex w-full items-center justify-between px-5 py-3.5 text-left"
                                >
                                    <span className="font-serif text-xs font-semibold text-[#1A1815] md:text-sm">
                                        {faq.question}
                                    </span>
                                    <span className="ml-4 flex size-5 shrink-0 items-center justify-center text-[#8C877E]">
                                        <svg
                                            className={`size-3.5 transition-transform duration-300 ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{
                                                duration: 0.25,
                                                ease: 'easeOut',
                                            }}
                                        >
                                            <div className="border-t border-[#EAE5DC] px-6 pt-3 pb-5 text-xs leading-relaxed text-[#6E6962]">
                                                {faq.answer}
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
