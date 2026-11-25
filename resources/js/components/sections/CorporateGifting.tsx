import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Building2,
    ShieldCheck,
    MapPin,
    Loader2,
    CheckCircle2,
    ArrowRight,
    LogIn,
    PackageCheck,
    Mail,
    Phone,
} from 'lucide-react';
import { buttonTap, fadeInUp, viewportOnce } from '@/lib/motion';
import { detectCurrentAddress } from '@/lib/geolocation';
import type { PageProps, Product } from '@/types';

export interface CorporateGiftingProps {
    whatsappNumber?: string;
    products?: Product[];
}

export function CorporateGifting({ products = [] }: CorporateGiftingProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;

    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [name, setName] = useState(currentUser?.name || '');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [phone, setPhone] = useState(
        currentUser?.phone_number
            ? currentUser.phone_number.replace(/^\+62|^62|^0/, '')
            : '',
    );
    const [address, setAddress] = useState('');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(25); // Enforced min 25
    const [neededAt, setNeededAt] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleDetectLocation = async () => {
        setIsDetectingLocation(true);
        try {
            const detected = await detectCurrentAddress();
            setAddress(detected);
        } catch (err: unknown) {
            alert(
                err instanceof Error ? err.message : 'Gagal mendeteksi lokasi',
            );
        } finally {
            setIsDetectingLocation(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            router.visit('/login');
            return;
        }

        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) newErrors.name = 'Nama lengkap PIC wajib diisi.';
        if (!companyName.trim())
            newErrors.company_name = 'Nama perusahaan / instansi wajib diisi.';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            newErrors.email = 'Format email resmi perusahaan tidak valid.';
        }

        const rawDigits = phone.replace(/\D/g, '');
        if (!rawDigits || rawDigits.length < 9) {
            newErrors.phone = 'Nomor telepon / WhatsApp PIC minimal 9 digit.';
        }

        if (!address.trim())
            newErrors.address = 'Alamat kantor / pengiriman wajib diisi.';

        if (quantity < 25) {
            newErrors.quantity =
                'Pemesanan corporate wajib minimal 25 paket ke atas.';
        }

        const prodId = selectedProductId
            ? parseInt(selectedProductId, 10)
            : products[0]?.id;
        if (!prodId) {
            newErrors.product = 'Pilih salah satu seri hampers corporate.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        const cleanPhoneDigits = rawDigits
            .replace(/^62/, '')
            .replace(/^0+/, '');
        const formattedPhone = `+62${cleanPhoneDigits}`;

        router.post(
            '/orders',
            {
                order_type: 'corporate',
                product_id: prodId,
                quantity,
                company_name: companyName,
                recipient_name: name,
                recipient_phone: formattedPhone,
                shipping_address: address,
                needed_at: neededAt || null,
                customer_notes: notes || null,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <section
            id="corporate"
            className="relative bg-[#F2EBDC] py-14 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Bespoke Corporate Inquiry Card (Invitation / Order Slip Aesthetic) */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="overflow-hidden rounded-[2.5rem] border border-[#A88B54]/30 bg-white shadow-xl"
                >
                    <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
                        {/* Left Side: Luxury Deep Navy Atelier Concierge Cover (High contrast against Warm Ivory background) */}
                        <div className="relative flex flex-col justify-between overflow-hidden border-b border-[#A88B54]/30 bg-[#16233B] p-6 text-[#F2EBDC] shadow-2xl sm:p-8 lg:col-span-5 lg:border-r lg:border-b-0 lg:p-10">
                            {/* Subtle Ambient Gold Glow for Atelier Depth */}
                            <div
                                className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-[#A88B54]/15 blur-3xl"
                                aria-hidden="true"
                            />
                            <div
                                className="pointer-events-none absolute -right-20 -bottom-20 size-64 rounded-full bg-[#A88B54]/10 blur-3xl"
                                aria-hidden="true"
                            />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#A88B54]/40 bg-[#A88B54]/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.2em] text-[#A88B54] uppercase backdrop-blur-xs">
                                    <Building2 className="size-3.5" />
                                    <span>LAYANAN RESMI B2B</span>
                                    <span className="size-1 rounded-full bg-[#A88B54]" />
                                    <span>CONCIERGE D'AFFAIRES</span>
                                </div>

                                <h2 className="mt-4 font-serif text-2xl font-normal tracking-tight text-[#F2EBDC] sm:text-3xl lg:text-4xl">
                                    Solusi Bingkisan Korporat &amp;{' '}
                                    <span className="text-[#A88B54] italic">
                                        Grosir Resmi
                                    </span>
                                </h2>

                                <p className="mt-3.5 text-xs leading-relaxed text-[#F2EBDC]/80 sm:text-sm">
                                    Pesanan partai besar langsung di dalam
                                    website dengan harga khusus korporat
                                    (minimal 25 paket), grafir logo perusahaan,
                                    dan invoice resmi instan.
                                </p>

                                <div className="mt-6 space-y-3.5">
                                    {[
                                        'Harga grosir per paket otomatis disesuaikan (Minimal 25 paket).',
                                        'Gratis mockup kartu ucapan berstempel wax & grafir laser logo instansi.',
                                        'Pengiriman aman serentak ke ratusan alamat cabang di seluruh Indonesia.',
                                        'Dukungan invoice, faktur pajak resmi, dan sistem pelacakan resi.',
                                    ].map((point, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-2.5 text-xs text-[#F2EBDC]/90"
                                        >
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#A88B54]" />
                                            <span className="leading-snug">
                                                {point}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Direct Concierge Contact Bar */}
                            <div className="relative z-10 mt-8 rounded-2xl border border-[#A88B54]/30 bg-[#1E2E4A]/80 p-4 shadow-md backdrop-blur-md">
                                <span className="block text-[9.5px] font-bold tracking-[0.18em] text-[#A88B54] uppercase">
                                    KONTAK KHUSUS CONCIERGE PERUSAHAAN:
                                </span>
                                <div className="mt-2.5 space-y-1.5 text-xs text-[#F2EBDC]">
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-3.5 text-[#A88B54]" />
                                        <span className="font-semibold text-white">
                                            corporate@galuh.co.id
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-3.5 text-[#A88B54]" />
                                        <span className="font-semibold text-white">
                                            +62 815-7241-4233
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Direct Corporate Order Form */}
                        <div className="bg-white p-6 sm:p-8 lg:col-span-7 lg:p-10">
                            <div className="border-b border-[#F2EBDC] pb-4">
                                <span className="text-[10px] font-bold tracking-[0.18em] text-[#A88B54] uppercase">
                                    FORMULIR PEMESANAN CORPORATE
                                </span>
                                <h3 className="mt-1 font-serif text-xl font-bold text-[#16233B]">
                                    Lengkapi Rincian Kebutuhan B2B Anda
                                </h3>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-5 space-y-4"
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="b2b-name"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Nama Lengkap PIC{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="b2b-name"
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Contoh: Ibu Rina Sastrowardoyo"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="b2b-company"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Nama Perusahaan &amp; Jabatan{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="b2b-company"
                                            type="text"
                                            required
                                            value={companyName}
                                            onChange={(e) =>
                                                setCompanyName(e.target.value)
                                            }
                                            placeholder="Contoh: PT. Adhi Kencana - Head of HR"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                        {errors.company_name && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.company_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="b2b-email"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Email Resmi Perusahaan{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="b2b-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="rina@adhikencana.co.id"
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="b2b-phone"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Nomor Telepon / WhatsApp PIC{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1 flex items-center overflow-hidden rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 transition-all focus-within:border-[#A88B54] focus-within:bg-white">
                                            <span className="inline-flex shrink-0 items-center border-r border-[#A88B54]/30 bg-[#F2EBDC] px-3 py-2.5 text-xs font-bold text-[#16233B] select-none">
                                                ID +62
                                            </span>
                                            <input
                                                id="b2b-phone"
                                                type="tel"
                                                inputMode="numeric"
                                                required
                                                value={phone}
                                                onChange={(e) => {
                                                    let val =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            '',
                                                        );
                                                    if (val.startsWith('62'))
                                                        val = val.slice(2);
                                                    if (val.startsWith('0'))
                                                        val = val.slice(1);
                                                    val = val.slice(0, 13);
                                                    setPhone(val);
                                                }}
                                                placeholder="812-3456-7890"
                                                maxLength={13}
                                                className="w-full bg-transparent px-3 py-2.5 text-xs text-[#16233B] focus:outline-hidden"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Address with Detection */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="b2b-address"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Alamat Kantor / Pengiriman{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            disabled={isDetectingLocation}
                                            className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-semibold text-[#A88B54] hover:underline disabled:opacity-50"
                                        >
                                            {isDetectingLocation ? (
                                                <>
                                                    <Loader2 className="size-3 animate-spin" />
                                                    <span>
                                                        Mendeteksi Lokasi...
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="size-3" />
                                                    <span>
                                                        Deteksi Alamat Otomatis
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <textarea
                                        id="b2b-address"
                                        rows={2}
                                        required
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        placeholder="Alamat kantor pusat atau alamat tujuan distribusi hampers"
                                        className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                {/* Paket Pilihan & Jumlah Paket (Min 25 Enforced) */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="b2b-product"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Pilihan Seri Hampers
                                        </label>
                                        <select
                                            id="b2b-product"
                                            value={selectedProductId}
                                            onChange={(e) =>
                                                setSelectedProductId(
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        >
                                            <option value="">
                                                Pilih Seri Hampers...
                                            </option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} - Rp{' '}
                                                    {(
                                                        p.corporate_price ||
                                                        Math.round(
                                                            p.price_from * 0.85,
                                                        )
                                                    ).toLocaleString('id-ID')}
                                                    /paket
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="b2b-quantity"
                                                className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                            >
                                                Jumlah Paket (Min. 25){' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="flex gap-1">
                                                {[25, 50, 100, 250].map(
                                                    (preset) => (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            onClick={() =>
                                                                setQuantity(
                                                                    preset,
                                                                )
                                                            }
                                                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                                                quantity ===
                                                                preset
                                                                    ? 'bg-[#16233B] text-white'
                                                                    : 'bg-[#F2EBDC] text-[#16233B]'
                                                            }`}
                                                        >
                                                            {preset}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            id="b2b-quantity"
                                            type="number"
                                            min={25}
                                            required
                                            value={quantity}
                                            onChange={(e) =>
                                                setQuantity(
                                                    parseInt(
                                                        e.target.value,
                                                        10,
                                                    ) || 25,
                                                )
                                            }
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2.5 text-xs font-bold text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                        {errors.quantity && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.quantity}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="b2b-date"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Target Tanggal Kebutuhan
                                        </label>
                                        <input
                                            id="b2b-date"
                                            type="date"
                                            value={neededAt}
                                            onChange={(e) =>
                                                setNeededAt(e.target.value)
                                            }
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="b2b-notes"
                                            className="block text-[10px] font-bold tracking-[0.16em] text-[#16233B] uppercase"
                                        >
                                            Catatan / Preferensi Tema
                                        </label>
                                        <input
                                            id="b2b-notes"
                                            type="text"
                                            value={notes}
                                            onChange={(e) =>
                                                setNotes(e.target.value)
                                            }
                                            placeholder="Warna pita korporat, kartu bilingual, dll."
                                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/30 px-3.5 py-2 text-xs text-[#16233B] focus:border-[#A88B54] focus:bg-white focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileTap={buttonTap.tap}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#16233B] py-3.5 text-xs font-bold tracking-[0.12em] text-white shadow-md transition-all duration-300 hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>
                                                MEMPROSES PESANAN CORPORATE...
                                            </span>
                                        </>
                                    ) : !currentUser ? (
                                        <>
                                            <LogIn className="size-4" />
                                            <span>
                                                MASUK UNTUK MEMPROSES PESANAN
                                                B2B
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <PackageCheck className="size-4" />
                                            <span>
                                                PROSES PESANAN CORPORATE DI
                                                WEBSITE
                                            </span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default CorporateGifting;
export { CorporateGifting as CorporateSection };
