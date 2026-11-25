import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePage, router } from '@inertiajs/react';
import {
    Star,
    ThumbsUp,
    MessageSquarePlus,
    X,
    CheckCircle2,
    Loader2,
    ShieldCheck,
} from 'lucide-react';
import { fadeInUp, viewportOnce, buttonTap } from '@/lib/motion';
import type { PageProps } from '@/types';

export interface ReviewItem {
    id: number;
    name: string;
    role: string;
    orderType?: string;
    quote: string;
    rating: number;
    likesCount: number;
    createdAt?: string;
}

export interface TestimonialsSectionProps {
    reviews?: ReviewItem[];
    userCanReview?: boolean;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
    {
        id: 1,
        quote: 'Untuk hampers keluarga dan suvenir pernikahan kami, GALUH & CO. benar-benar memuaskan. Tulisan kartu ucapannya rapi, kemasannya mewah, dan harum saat pertama kali kotak dibuka.',
        name: 'Asep Saepuloh',
        role: 'Pembeli Terverifikasi',
        orderType: 'Bespoke Anyaman Bambu & Kudapan Wijsman',
        rating: 5,
        likesCount: 14,
        createdAt: '2 hari lalu',
    },
    {
        id: 2,
        quote: 'Kami memesan 350 paket hampers akhir tahun untuk klien dan mitra perusahaan. Pengirimannya tepat waktu, kemasannya aman sampai tujuan, dan semua penerima memberikan kesan yang sangat baik.',
        name: 'Rasya Syahreza',
        role: 'HRD & GA, Perusahaan Fintech',
        orderType: '350 Paket Executive Hardbox Emerald',
        rating: 5,
        likesCount: 28,
        createdAt: '1 minggu lalu',
    },
    {
        id: 3,
        quote: 'Sudah tiga tahun berturut-turut memesan bingkisan Lebaran di GALUH & CO. Pilihan kue kering dan isinya selalu berkualitas, kemasannya pun terasa eksklusif dan berbeda dari yang lain.',
        name: 'Muhammad Rizky P.',
        role: 'Pembeli Terverifikasi',
        orderType: 'Heritage Besek & Single-Origin Roast',
        rating: 5,
        likesCount: 9,
        createdAt: '2 minggu lalu',
    },
    {
        id: 4,
        quote: 'Pengerjaan grafir laser logo dan box linen hijau zamrud sangat presisi. Sangat prestisius sebagai cinderamata untuk dewan komisaris dan mitra investor VIP kami.',
        name: 'Clara Widjaja',
        role: 'Corporate VIP Gifting',
        orderType: 'Emerald Hardbox & Engraved Tumbler',
        rating: 5,
        likesCount: 19,
        createdAt: '1 bulan lalu',
    },
];

export function TestimonialsSection({
    reviews = [],
    userCanReview = false,
}: TestimonialsSectionProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;

    const initialList: ReviewItem[] =
        reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

    const [reviewList, setReviewList] = useState<ReviewItem[]>(initialList);
    const [selectedStar, setSelectedStar] = useState<'all' | number>('all');
    const [selectedSort, setSelectedSort] = useState<
        'likes' | 'rating' | 'newest'
    >('likes');

    // Local likes state for optimistic updates
    const [likedReviews, setLikedReviews] = useState<{ [id: number]: boolean }>(
        {},
    );

    // Write review modal state
    const [writeModalOpen, setWriteModalOpen] = useState(false);
    const [ratingInput, setRatingInput] = useState<number>(5);
    const [commentInput, setCommentInput] = useState<string>('');
    const [titleInput, setTitleInput] = useState<string>('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState<string>('');

    // Filter & Sort
    const filteredAndSortedReviews = useMemo(() => {
        let list = [...reviewList];

        if (selectedStar !== 'all') {
            list = list.filter((r) => r.rating === selectedStar);
        }

        if (selectedSort === 'likes') {
            list.sort((a, b) => b.likesCount - a.likesCount);
        } else if (selectedSort === 'rating') {
            list.sort(
                (a, b) => b.rating - a.rating || b.likesCount - a.likesCount,
            );
        } else if (selectedSort === 'newest') {
            list.sort((a, b) => b.id - a.id);
        }

        return list;
    }, [reviewList, selectedStar, selectedSort]);

    // Handle Like Toggle
    const handleLike = async (reviewId: number) => {
        const isCurrentlyLiked = likedReviews[reviewId];

        // Optimistic UI update
        setLikedReviews((prev) => ({ ...prev, [reviewId]: !isCurrentlyLiked }));
        setReviewList((prev) =>
            prev.map((r) =>
                r.id === reviewId
                    ? {
                          ...r,
                          likesCount: isCurrentlyLiked
                              ? Math.max(0, r.likesCount - 1)
                              : r.likesCount + 1,
                      }
                    : r,
            ),
        );

        try {
            await fetch(`/reviews/${reviewId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
            });
        } catch {
            // Silently rollback on network failure
            setLikedReviews((prev) => ({
                ...prev,
                [reviewId]: isCurrentlyLiked,
            }));
        }
    };

    const handleOpenWriteReview = () => {
        if (!currentUser) {
            router.visit('/login');
            return;
        }

        if (!userCanReview) {
            alert(
                'Hanya pelanggan yang telah menyelesaikan pemesanan hampers di GALUH & CO. yang dapat memberikan ulasan dan rating.',
            );
            return;
        }

        setWriteModalOpen(true);
        setReviewError('');
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();

        if (commentInput.trim().length < 5) {
            setReviewError('Komentar ulasan minimal 5 karakter.');
            return;
        }

        setIsSubmittingReview(true);
        setReviewError('');

        router.post(
            '/reviews',
            {
                rating: ratingInput,
                comment: commentInput,
                customer_title: titleInput || 'Pembeli Terverifikasi',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setWriteModalOpen(false);
                    setCommentInput('');
                    setTitleInput('');
                    setIsSubmittingReview(false);
                    // Append optimistic review
                    const newRev: ReviewItem = {
                        id: Date.now(),
                        name: currentUser?.name || 'Pelanggan',
                        role: titleInput || 'Pembeli Terverifikasi',
                        orderType: 'Pesanan Terverifikasi',
                        quote: commentInput,
                        rating: ratingInput,
                        likesCount: 0,
                        createdAt: 'Baru saja',
                    };
                    setReviewList((prev) => [newRev, ...prev]);
                },
                onError: (errs) => {
                    setIsSubmittingReview(false);
                    setReviewError(
                        Object.values(errs)[0] || 'Gagal mengirim ulasan.',
                    );
                },
            },
        );
    };

    return (
        <section
            id="ulasan"
            className="relative bg-[#F2EBDC] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase">
                        <span>TESTIMONI &amp; RATING PELANGGAN</span>
                        <span className="size-1 rounded-full bg-[#A88B54]" />
                        <span>VERIFIED REVIEWS</span>
                    </div>

                    <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#16233B] sm:text-4xl lg:text-5xl">
                        Apresiasi &amp; Pengalaman{' '}
                        <span className="text-[#A88B54] italic">
                            Klien Kami
                        </span>
                    </h2>

                    <p className="mt-3.5 text-xs leading-relaxed text-[#6E675D] sm:text-sm">
                        Ulasan nyata dari para pembeli dan mitra korporat yang
                        telah mempercayakan kurasi bingkisan mereka kepada Galuh
                        &amp; Co.
                    </p>
                </motion.div>

                {/* Controls Bar: Star Filter, Sort Selector, and Write Review Button */}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#A88B54]/20 pb-5">
                    {/* Star Filters */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setSelectedStar('all')}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                                selectedStar === 'all'
                                    ? 'bg-[#16233B] text-white shadow-xs'
                                    : 'border border-[#A88B54]/30 bg-white/70 text-[#16233B] hover:bg-[#F2EBDC]'
                            }`}
                        >
                            Semua Bintang
                        </button>
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <button
                                key={stars}
                                type="button"
                                onClick={() => setSelectedStar(stars)}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all ${
                                    selectedStar === stars
                                        ? 'bg-[#16233B] text-white shadow-xs'
                                        : 'border border-[#A88B54]/30 bg-white/70 text-[#16233B] hover:bg-[#F2EBDC]'
                                }`}
                            >
                                <span>{stars}</span>
                                <Star className="size-3 fill-[#A88B54] text-[#A88B54]" />
                            </button>
                        ))}
                    </div>

                    {/* Sorting & Write Review */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-wider text-[#6E675D] uppercase">
                                Urutkan:
                            </span>
                            <select
                                value={selectedSort}
                                onChange={(e) =>
                                    setSelectedSort(
                                        e.target.value as
                                            | 'likes'
                                            | 'rating'
                                            | 'newest',
                                    )
                                }
                                className="rounded-xl border border-[#A88B54]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                            >
                                <option value="likes">
                                    Like Terbanyak (Paling Relevan)
                                </option>
                                <option value="rating">Rating Tertinggi</option>
                                <option value="newest">Ulasan Terbaru</option>
                            </select>
                        </div>

                        <motion.button
                            whileTap={buttonTap.tap}
                            type="button"
                            onClick={handleOpenWriteReview}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#16233B] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#A88B54] hover:text-[#16233B]"
                        >
                            <MessageSquarePlus className="size-3.5" />
                            <span>Tulis Ulasan &amp; Rating</span>
                        </motion.button>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedReviews.map((review) => {
                        const isLiked = likedReviews[review.id];
                        return (
                            <motion.article
                                key={review.id}
                                layout
                                className="flex flex-col justify-between rounded-2xl border border-[#A88B54]/25 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#A88B54] hover:shadow-md"
                            >
                                <div>
                                    {/* Star Rating & Date */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`size-4 ${
                                                        i < review.rating
                                                            ? 'fill-[#A88B54] text-[#A88B54]'
                                                            : 'text-[#E0D8CB]'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        {review.createdAt && (
                                            <span className="text-[10px] text-[#6E675D]">
                                                {review.createdAt}
                                            </span>
                                        )}
                                    </div>

                                    {/* Comment Quote */}
                                    <p className="mt-3 text-xs leading-relaxed text-[#16233B]">
                                        "{review.quote}"
                                    </p>
                                </div>

                                <div className="mt-5 border-t border-[#F2EBDC] pt-3.5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-serif text-sm font-bold text-[#16233B]">
                                                    {review.name}
                                                </h4>
                                                <CheckCircle2 className="size-3 text-[#A88B54]" />
                                            </div>
                                            <span className="block text-[10px] text-[#6E675D]">
                                                {review.role}
                                            </span>
                                            {review.orderType && (
                                                <span className="mt-0.5 block text-[9.5px] font-semibold text-[#A88B54]">
                                                    {review.orderType}
                                                </span>
                                            )}
                                        </div>

                                        {/* Interactive Like Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleLike(review.id)
                                            }
                                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all ${
                                                isLiked
                                                    ? 'border-[#16233B] bg-[#16233B] text-white shadow-xs'
                                                    : 'border-[#A88B54]/30 bg-[#F2EBDC]/50 text-[#16233B] hover:bg-[#F2EBDC]'
                                            }`}
                                        >
                                            <ThumbsUp
                                                className={`size-3 ${isLiked ? 'fill-white' : ''}`}
                                            />
                                            <span>{review.likesCount}</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>

            {/* WRITE REVIEW MODAL */}
            <AnimatePresence>
                {writeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() =>
                                !isSubmittingReview && setWriteModalOpen(false)
                            }
                            className="fixed inset-0 bg-[#16233B]/60 backdrop-blur-xs"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-10 w-full max-w-lg rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-2xl sm:p-8"
                        >
                            <button
                                type="button"
                                onClick={() => setWriteModalOpen(false)}
                                disabled={isSubmittingReview}
                                className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#A88B54]/30 bg-[#F2EBDC] text-[#16233B]"
                            >
                                <X className="size-4" />
                            </button>

                            <div className="border-b border-[#F2EBDC] pb-3">
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A88B54] uppercase">
                                    ULASAN PEMBELI TERVERIFIKASI
                                </span>
                                <h3 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                                    Bagikan Pengalaman Berbelanja Anda
                                </h3>
                            </div>

                            <form
                                onSubmit={handleSubmitReview}
                                className="mt-4 space-y-4"
                            >
                                {/* Interactive Star Picker */}
                                <div>
                                    <label className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase">
                                        Pilih Rating Kepuasan
                                    </label>
                                    <div className="mt-2 flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    setRatingInput(star)
                                                }
                                                className="cursor-pointer p-1 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`size-7 ${
                                                        star <= ratingInput
                                                            ? 'fill-[#A88B54] text-[#A88B54]'
                                                            : 'text-[#E0D8CB]'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 font-serif text-sm font-bold text-[#16233B]">
                                            {ratingInput} / 5 Bintang
                                        </span>
                                    </div>
                                </div>

                                {/* Title / Role */}
                                <div>
                                    <label
                                        htmlFor="review-title"
                                        className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                    >
                                        Gelar / Status Pemesan (Opsional)
                                    </label>
                                    <input
                                        id="review-title"
                                        type="text"
                                        value={titleInput}
                                        onChange={(e) =>
                                            setTitleInput(e.target.value)
                                        }
                                        placeholder="Contoh: Pembeli Paket Lebaran / HRD PT XYZ"
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                {/* Comment */}
                                <div>
                                    <label
                                        htmlFor="review-comment"
                                        className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                    >
                                        Tuliskan Ulasan Anda{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="review-comment"
                                        rows={4}
                                        required
                                        value={commentInput}
                                        onChange={(e) =>
                                            setCommentInput(e.target.value)
                                        }
                                        placeholder="Ceritakan kesan kemasan, rasa kue kering, stempel wax, maupun respon kurir..."
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                    />
                                </div>

                                {reviewError && (
                                    <p className="text-xs text-red-600">
                                        {reviewError}
                                    </p>
                                )}

                                <motion.button
                                    whileTap={buttonTap.tap}
                                    type="submit"
                                    disabled={isSubmittingReview}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#16233B] py-3 text-xs font-bold tracking-wider text-white shadow-md transition-all hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-60"
                                >
                                    {isSubmittingReview ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>MENGIRIM ULASAN...</span>
                                        </>
                                    ) : (
                                        <span>
                                            KIRIM ULASAN &amp; RATING SEKARANG
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default TestimonialsSection;
