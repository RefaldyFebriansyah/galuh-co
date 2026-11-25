import { Head } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Copy,
    DollarSign,
    FileText,
    Percent,
    Printer,
    Send,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { GaluhLogo } from '@/components/galuh-logo';
import { AdminLayout } from '@/layouts/admin-layout';

interface HamperItem {
    id: number;
    name: string;
    category: string;
    packaging?: string | null;
    price_from: number;
    short_description: string;
    image?: string | null;
}

interface TierDiscount {
    min_qty: number;
    max_qty: number;
    discount_pct: number;
    label: string;
}

interface AddOnItem {
    id: string;
    name: string;
    price_per_box: number;
    is_default: boolean;
}

interface StudioInfo {
    brand: string;
    company: string;
    npwp: string;
    phone: string;
    address: string;
    bank_info: string;
}

interface CorporateB2bProps {
    hampers: HamperItem[];
    tierDiscounts: TierDiscount[];
    addOns: AddOnItem[];
    studioInfo: StudioInfo;
}

export default function AdminCorporateB2bIndex({
    hampers,
    tierDiscounts,
    addOns,
    studioInfo,
}: CorporateB2bProps) {
    // Form States
    const [clientName, setClientName] = useState('Bpk. Raditya Pratama');
    const [companyName, setCompanyName] = useState('PT Astra Sedaya Finance');
    const [quotationNo, setQuotationNo] = useState(
        `QUO-GLH-${new Date().getFullYear()}-018`,
    );
    const [selectedHamperId, setSelectedHamperId] = useState<number>(
        hampers[0]?.id || 1,
    );
    const [quantity, setQuantity] = useState(75);
    const [enabledAddons, setEnabledAddons] = useState<Record<string, boolean>>(
        {
            custom_sleeve: true,
            wax_seal_custom: true,
            laser_engraving: false,
            multi_drop_handling: false,
        },
    );
    const [includePpn, setIncludePpn] = useState(false);
    const [notes, setNotes] = useState(
        'Termasuk gratis kartu ucapan kaligrafi, pita satin bertingkat, dan pengiriman aman berkardus pallet.',
    );
    const [copiedWa, setCopiedWa] = useState(false);

    const selectedHamper = useMemo(
        () => hampers.find((h) => h.id === selectedHamperId) || hampers[0],
        [hampers, selectedHamperId],
    );

    // Active tier discount based on qty
    const activeTier = useMemo(() => {
        const found = tierDiscounts.find(
            (t) => quantity >= t.min_qty && quantity <= t.max_qty,
        );
        return (
            found || {
                min_qty: 0,
                max_qty: 0,
                discount_pct: 0,
                label: 'Harga Standar',
            }
        );
    }, [quantity, tierDiscounts]);

    // Financial calculations
    const baseHamperPrice = selectedHamper?.price_from || 0;
    const grossHamperTotal = baseHamperPrice * quantity;
    const discountAmount = Math.round(
        grossHamperTotal * (activeTier.discount_pct / 100),
    );
    const netHamperTotal = grossHamperTotal - discountAmount;

    // Addons calculation
    const addOnTotal = useMemo(() => {
        return addOns.reduce((acc, curr) => {
            if (enabledAddons[curr.id]) {
                return acc + curr.price_per_box * quantity;
            }
            return acc;
        }, 0);
    }, [addOns, enabledAddons, quantity]);

    const subtotal = netHamperTotal + addOnTotal;
    const ppnAmount = includePpn ? Math.round(subtotal * 0.11) : 0;
    const grandTotal = subtotal + ppnAmount;
    const pricePerBoxAllIn =
        quantity > 0 ? Math.round(grandTotal / quantity) : 0;

    const toggleAddon = (id: string) => {
        setEnabledAddons((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const formatIdr = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyWhatsAppSummary = () => {
        const text = `*SURAT PENAWARAN RESMI CORPORATE HAMPERS*
*GALUH & CO. ATELIER BINGKISAN*
No: ${quotationNo}

Kepada Yth.
*${clientName}*
${companyName}

*Rincian Paket Terpilih:*
• Paket: ${selectedHamper?.name}
• Jumlah: ${quantity} Box
• Harga Satuan Normal: ${formatIdr(baseHamperPrice)}
• Diskon Volume B2B (${activeTier.discount_pct}%): -${formatIdr(discountAmount)}
• Add-on Kustomisasi:
${addOns
    .filter((a) => enabledAddons[a.id])
    .map((a) => `  - ${a.name} (${formatIdr(a.price_per_box)}/box)`)
    .join('\n')}

*Total Estimasi Resmi: ${formatIdr(grandTotal)}*
_(Rata-rata: ${formatIdr(pricePerBoxAllIn)} / box all-in)_

Ketentuan:
• Rekening Resmi: ${studioInfo.bank_info}
• ${notes}

Terima kasih atas kepercayaan kemitraan Anda bersama GALUH & CO.`;

        navigator.clipboard.writeText(text);
        setCopiedWa(true);
        setTimeout(() => setCopiedWa(false), 2000);
    };

    return (
        <AdminLayout
            title="Kalkulator Penawaran B2B & Surat Resmi"
            subtitle="Simulasi Harga Bertingkat, Add-on Kustomisasi Perusahaan & Cetak Quotation"
            headerAction={
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopyWhatsAppSummary}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#16233B]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#16233B] shadow-2xs hover:border-[#A88B54] hover:text-[#A88B54]"
                    >
                        {copiedWa ? (
                            <Check className="size-3 text-emerald-600" />
                        ) : (
                            <Copy className="size-3 text-[#A88B54]" />
                        )}
                        <span>
                            {copiedWa ? 'Tersalin ke WA' : 'Salin Teks WA'}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2B3B5C]"
                    >
                        <Printer className="size-3.5 text-[#A88B54]" />
                        <span>Cetak / PDF Quotation</span>
                    </button>
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* 1. Left Column: Interactive Calculator (5 Cols) */}
                <div className="space-y-5 lg:col-span-5 print:hidden">
                    <div className="space-y-4 rounded-2xl border border-[#16233B]/10 bg-white p-5 shadow-2xs">
                        <div className="border-b border-[#16233B]/10 pb-3">
                            <h3 className="text-base font-semibold text-[#16233B]">
                                Parameter Penawaran B2B
                            </h3>
                            <p className="text-xs text-[#16233B]/60">
                                Masukkan profil klien, volume pesanan &amp;
                                add-on kustom
                            </p>
                        </div>

                        {/* Company & PIC */}
                        <div className="space-y-3 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-[#16233B]">
                                    Nama Perusahaan Klien
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }
                                    placeholder="PT Astra Sedaya Finance"
                                    className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Nama PIC / Klien
                                    </label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) =>
                                            setClientName(e.target.value)
                                        }
                                        placeholder="Bpk. Raditya Pratama"
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Nomor Surat Penawaran
                                    </label>
                                    <input
                                        type="text"
                                        value={quotationNo}
                                        onChange={(e) =>
                                            setQuotationNo(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 font-mono text-xs focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Hamper Selector */}
                            <div className="space-y-1 pt-1">
                                <label className="font-semibold text-[#16233B]">
                                    Pilih Paket Hampers
                                </label>
                                <select
                                    value={selectedHamperId}
                                    onChange={(e) =>
                                        setSelectedHamperId(
                                            Number(e.target.value),
                                        )
                                    }
                                    className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                >
                                    {hampers.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.name} — {formatIdr(h.price_from)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity & Tier */}
                            <div className="space-y-1 pt-1">
                                <div className="flex items-center justify-between">
                                    <label className="font-semibold text-[#16233B]">
                                        Jumlah Pesanan (Volume Box)
                                    </label>
                                    <span className="font-mono text-xs font-bold text-[#A88B54]">
                                        {activeTier.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="20"
                                        max="500"
                                        step="5"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(Number(e.target.value))
                                        }
                                        className="flex-1 accent-[#16233B]"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                Math.max(
                                                    1,
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                        className="w-20 rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-1.5 text-center font-mono text-xs focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Add-on Checklist */}
                            <div className="space-y-2 pt-2">
                                <label className="font-semibold text-[#16233B]">
                                    Add-on Kustomisasi Perusahaan
                                </label>
                                <div className="space-y-2">
                                    {addOns.map((addon) => (
                                        <label
                                            key={addon.id}
                                            className="flex cursor-pointer items-center justify-between rounded-lg border border-[#16233B]/10 bg-[#FAF8F5] p-2.5 transition-colors hover:bg-white"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        !!enabledAddons[
                                                            addon.id
                                                        ]
                                                    }
                                                    onChange={() =>
                                                        toggleAddon(addon.id)
                                                    }
                                                    className="rounded border-[#16233B]/30 text-[#16233B] focus:ring-0"
                                                />
                                                <span className="text-xs font-medium text-[#16233B]">
                                                    {addon.name}
                                                </span>
                                            </div>
                                            <span className="font-mono text-[11px] text-[#A88B54]">
                                                +
                                                {formatIdr(addon.price_per_box)}
                                                /box
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* PPN Toggle */}
                            <label className="flex cursor-pointer items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    checked={includePpn}
                                    onChange={(e) =>
                                        setIncludePpn(e.target.checked)
                                    }
                                    className="rounded border-[#16233B]/30 text-[#16233B] focus:ring-0"
                                />
                                <span className="text-xs text-[#16233B]">
                                    Sertakan Faktur Pajak PPN 11% Resmi
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column: Printable Official Quotation Sheet (7 Cols) */}
                <div className="lg:col-span-7">
                    <div className="rounded-2xl border border-[#16233B]/15 bg-white p-8 text-xs shadow-sm print:border-none print:p-0 print:shadow-none">
                        {/* Letterhead Header */}
                        <div className="flex items-start justify-between border-b-2 border-[#16233B] pb-5">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <GaluhLogo
                                        className="h-8 w-auto text-[#16233B]"
                                        showText={false}
                                    />
                                    <div>
                                        <h2 className="text-lg font-bold tracking-wider text-[#16233B]">
                                            GALUH &amp; CO.
                                        </h2>
                                        <span className="font-mono text-[9px] font-bold tracking-widest text-[#A88B54] uppercase">
                                            ATELIER BINGKISAN NUSANTARA
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 max-w-sm text-[10.5px] text-[#16233B]/60">
                                    {studioInfo.company} • NPWP:{' '}
                                    {studioInfo.npwp}
                                    <br />
                                    {studioInfo.address}
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="rounded bg-[#16233B] px-2.5 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
                                    SURAT PENAWARAN
                                </span>
                                <p className="mt-2 font-mono text-xs font-bold text-[#16233B]">
                                    {quotationNo}
                                </p>
                                <p className="text-[10.5px] text-[#16233B]/60">
                                    Tanggal:{' '}
                                    {new Date().toLocaleDateString('id-ID', {
                                        dateStyle: 'long',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Recipient Block */}
                        <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-[#16233B]/10 bg-[#FAF8F5] p-4">
                            <div>
                                <span className="font-mono text-[9px] font-bold text-[#A88B54] uppercase">
                                    DITUJUKAN KEPADA:
                                </span>
                                <h4 className="mt-1 text-sm font-bold text-[#16233B]">
                                    {clientName || 'Bapak/Ibu Pimpinan'}
                                </h4>
                                <p className="text-xs font-semibold text-[#16233B]/80">
                                    {companyName || 'Mitra Korporat'}
                                </p>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-[#A88B54] uppercase">
                                    KONTAK KONSULTASI:
                                </span>
                                <p className="mt-1 text-xs text-[#16233B]/70">
                                    WhatsApp Concierge: +{studioInfo.phone}
                                </p>
                                <p className="text-xs text-[#16233B]/70">
                                    Validitas Penawaran: 14 Hari Kalender
                                </p>
                            </div>
                        </div>

                        {/* Itemized Table */}
                        <div className="mt-5 overflow-hidden rounded-xl border border-[#16233B]/10">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-[#16233B]/10 bg-[#FAF8F5] font-mono text-[9px] font-bold tracking-wider text-[#A88B54] uppercase">
                                        <th className="px-3 py-2.5">
                                            Uraian Paket &amp; Spesifikasi
                                        </th>
                                        <th className="px-3 py-2.5 text-center">
                                            Qty
                                        </th>
                                        <th className="px-3 py-2.5 text-right">
                                            Harga Satuan
                                        </th>
                                        <th className="px-3 py-2.5 text-right">
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#16233B]/5 text-[#16233B]">
                                    <tr>
                                        <td className="px-3 py-3">
                                            <div className="font-bold text-[#16233B]">
                                                {selectedHamper?.name}
                                            </div>
                                            <p className="max-w-xs text-[10.5px] text-[#16233B]/60">
                                                {
                                                    selectedHamper?.short_description
                                                }
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 text-center font-mono">
                                            {quantity} Box
                                        </td>
                                        <td className="px-3 py-3 text-right font-mono">
                                            {formatIdr(baseHamperPrice)}
                                        </td>
                                        <td className="px-3 py-3 text-right font-mono font-semibold">
                                            {formatIdr(grossHamperTotal)}
                                        </td>
                                    </tr>

                                    {/* Volume Discount Line */}
                                    {discountAmount > 0 && (
                                        <tr className="bg-emerald-50/50">
                                            <td
                                                colSpan={3}
                                                className="px-3 py-2 font-medium text-emerald-800"
                                            >
                                                Diskon Apresiasi Volume Korporat
                                                ({activeTier.discount_pct}%)
                                            </td>
                                            <td className="px-3 py-2 text-right font-mono font-bold text-emerald-800">
                                                -{formatIdr(discountAmount)}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Add-ons Lines */}
                                    {addOns
                                        .filter((a) => enabledAddons[a.id])
                                        .map((addon) => (
                                            <tr key={addon.id}>
                                                <td className="px-3 py-2 text-[11px] text-[#16233B]/80">
                                                    + {addon.name}
                                                </td>
                                                <td className="px-3 py-2 text-center font-mono">
                                                    {quantity} Box
                                                </td>
                                                <td className="px-3 py-2 text-right font-mono">
                                                    {formatIdr(
                                                        addon.price_per_box,
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-right font-mono font-medium">
                                                    {formatIdr(
                                                        addon.price_per_box *
                                                            quantity,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Calculation Summary Block */}
                        <div className="mt-4 flex justify-end">
                            <div className="w-64 space-y-1.5 text-xs">
                                <div className="flex justify-between text-[#16233B]/70">
                                    <span>Subtotal Paket &amp; Add-on</span>
                                    <span className="font-mono">
                                        {formatIdr(subtotal)}
                                    </span>
                                </div>
                                {includePpn && (
                                    <div className="flex justify-between text-[#16233B]/70">
                                        <span>PPN 11% Resmi</span>
                                        <span className="font-mono">
                                            {formatIdr(ppnAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t-2 border-[#16233B] pt-2 text-sm font-bold text-[#16233B]">
                                    <span>Total Penawaran Resmi</span>
                                    <span className="font-mono text-[#A88B54]">
                                        {formatIdr(grandTotal)}
                                    </span>
                                </div>
                                <div className="text-right font-mono text-[10.5px] text-[#16233B]/50">
                                    Rata-rata: {formatIdr(pricePerBoxAllIn)} /
                                    box
                                </div>
                            </div>
                        </div>

                        {/* Payment & Signatures Block */}
                        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#16233B]/10 pt-4">
                            <div>
                                <span className="font-mono text-[9px] font-bold text-[#A88B54] uppercase">
                                    PEMBAYARAN RESMI ATELIER:
                                </span>
                                <p className="mt-1 font-mono text-xs font-semibold text-[#16233B]">
                                    {studioInfo.bank_info}
                                </p>
                                <p className="mt-1 text-[10.5px] leading-relaxed text-[#16233B]/60">
                                    {notes}
                                </p>
                            </div>
                            <div className="flex flex-col justify-between text-right">
                                <span className="font-mono text-[9px] font-bold text-[#A88B54] uppercase">
                                    GALUH &amp; CO. ATELIER LEAD
                                </span>
                                <div className="mt-8 text-xs font-bold text-[#16233B] underline">
                                    Tim Concierge Kriya
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
