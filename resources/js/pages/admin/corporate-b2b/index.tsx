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
    Sparkles,
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
    const [quotationNo, setQuotationNo] = useState(`QUO-GLH-${new Date().getFullYear()}-018`);
    const [selectedHamperId, setSelectedHamperId] = useState<number>(hampers[0]?.id || 1);
    const [quantity, setQuantity] = useState(75);
    const [enabledAddons, setEnabledAddons] = useState<Record<string, boolean>>({
        custom_sleeve: true,
        wax_seal_custom: true,
        laser_engraving: false,
        multi_drop_handling: false,
    });
    const [includePpn, setIncludePpn] = useState(false);
    const [notes, setNotes] = useState(
        'Termasuk gratis kartu ucapan kaligrafi, pita satin bertingkat, dan pengiriman aman berkardus pallet.'
    );
    const [copiedWa, setCopiedWa] = useState(false);

    const selectedHamper = useMemo(
        () => hampers.find((h) => h.id === selectedHamperId) || hampers[0],
        [hampers, selectedHamperId]
    );

    // Active tier discount based on qty
    const activeTier = useMemo(() => {
        const found = tierDiscounts.find(
            (t) => quantity >= t.min_qty && quantity <= t.max_qty
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
    const discountAmount = Math.round(grossHamperTotal * (activeTier.discount_pct / 100));
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
    const pricePerBoxAllIn = quantity > 0 ? Math.round(grandTotal / quantity) : 0;

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
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B291E]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B291E] shadow-2xs hover:border-[#B89352] hover:text-[#B89352]"
                    >
                        {copiedWa ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3 text-[#B89352]" />}
                        <span>{copiedWa ? 'Tersalin ke WA' : 'Salin Teks WA'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B291E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#143E2E]"
                    >
                        <Printer className="size-3.5 text-[#B89352]" />
                        <span>Cetak / PDF Quotation</span>
                    </button>
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* 1. Left Column: Interactive Calculator (5 Cols) */}
                <div className="space-y-5 lg:col-span-5 print:hidden">
                    <div className="rounded-2xl border border-[#0B291E]/10 bg-white p-5 shadow-2xs space-y-4">
                        <div className="border-b border-[#0B291E]/10 pb-3">
                            <h3 className="text-base font-semibold text-[#0B291E]">
                                Parameter Penawaran B2B
                            </h3>
                            <p className="text-xs text-[#0B291E]/60">
                                Masukkan profil klien, volume pesanan &amp; add-on kustom
                            </p>
                        </div>

                        {/* Company & PIC */}
                        <div className="space-y-3 text-xs">
                            <div className="space-y-1">
                                <label className="font-semibold text-[#0B291E]">
                                    Nama Perusahaan Klien
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="PT Astra Sedaya Finance"
                                    className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Nama PIC / Klien
                                    </label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Bpk. Raditya Pratama"
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#0B291E]">
                                        Nomor Surat Penawaran
                                    </label>
                                    <input
                                        type="text"
                                        value={quotationNo}
                                        onChange={(e) => setQuotationNo(e.target.value)}
                                        className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 font-mono text-xs focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Hamper Selector */}
                            <div className="space-y-1 pt-1">
                                <label className="font-semibold text-[#0B291E]">
                                    Pilih Paket Hampers
                                </label>
                                <select
                                    value={selectedHamperId}
                                    onChange={(e) => setSelectedHamperId(Number(e.target.value))}
                                    className="w-full rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
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
                                    <label className="font-semibold text-[#0B291E]">
                                        Jumlah Pesanan (Volume Box)
                                    </label>
                                    <span className="font-mono text-xs font-bold text-[#B89352]">
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
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="flex-1 accent-[#0B291E]"
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-20 rounded-lg border border-[#0B291E]/15 bg-[#FAF8F5] p-1.5 font-mono text-xs text-center focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* Add-on Checklist */}
                            <div className="space-y-2 pt-2">
                                <label className="font-semibold text-[#0B291E]">
                                    Add-on Kustomisasi Perusahaan
                                </label>
                                <div className="space-y-2">
                                    {addOns.map((addon) => (
                                        <label
                                            key={addon.id}
                                            className="flex items-center justify-between rounded-lg border border-[#0B291E]/10 bg-[#FAF8F5] p-2.5 cursor-pointer hover:bg-white transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    checked={!!enabledAddons[addon.id]}
                                                    onChange={() => toggleAddon(addon.id)}
                                                    className="rounded border-[#0B291E]/30 text-[#0B291E] focus:ring-0"
                                                />
                                                <span className="text-xs text-[#0B291E] font-medium">
                                                    {addon.name}
                                                </span>
                                            </div>
                                            <span className="font-mono text-[11px] text-[#B89352]">
                                                +{formatIdr(addon.price_per_box)}/box
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* PPN Toggle */}
                            <label className="flex items-center gap-2 pt-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includePpn}
                                    onChange={(e) => setIncludePpn(e.target.checked)}
                                    className="rounded border-[#0B291E]/30 text-[#0B291E] focus:ring-0"
                                />
                                <span className="text-xs text-[#0B291E]">
                                    Sertakan Faktur Pajak PPN 11% Resmi
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 2. Right Column: Printable Official Quotation Sheet (7 Cols) */}
                <div className="lg:col-span-7">
                    <div className="rounded-2xl border border-[#0B291E]/15 bg-white p-8 shadow-sm text-xs print:border-none print:p-0 print:shadow-none">
                        {/* Letterhead Header */}
                        <div className="flex items-start justify-between border-b-2 border-[#0B291E] pb-5">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <GaluhLogo className="h-8 w-auto text-[#0B291E]" showText={false} />
                                    <div>
                                        <h2 className="text-lg font-bold tracking-wider text-[#0B291E]">
                                            GALUH &amp; CO.
                                        </h2>
                                        <span className="font-mono text-[9px] font-bold tracking-widest text-[#B89352] uppercase">
                                            ATELIER BINGKISAN NUSANTARA
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-[10.5px] text-[#0B291E]/60 max-w-sm">
                                    {studioInfo.company} • NPWP: {studioInfo.npwp}
                                    <br />
                                    {studioInfo.address}
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="rounded bg-[#0B291E] px-2.5 py-1 text-[10px] font-bold text-white tracking-widest uppercase">
                                    SURAT PENAWARAN
                                </span>
                                <p className="mt-2 font-mono text-xs font-bold text-[#0B291E]">
                                    {quotationNo}
                                </p>
                                <p className="text-[10.5px] text-[#0B291E]/60">
                                    Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                </p>
                            </div>
                        </div>

                        {/* Recipient Block */}
                        <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-[#0B291E]/10 bg-[#FAF8F5] p-4">
                            <div>
                                <span className="font-mono text-[9px] font-bold text-[#B89352] uppercase">
                                    DITUJUKAN KEPADA:
                                </span>
                                <h4 className="mt-1 text-sm font-bold text-[#0B291E]">
                                    {clientName || 'Bapak/Ibu Pimpinan'}
                                </h4>
                                <p className="text-xs font-semibold text-[#0B291E]/80">
                                    {companyName || 'Mitra Korporat'}
                                </p>
                            </div>
                            <div>
                                <span className="font-mono text-[9px] font-bold text-[#B89352] uppercase">
                                    KONTAK KONSULTASI:
                                </span>
                                <p className="mt-1 text-xs text-[#0B291E]/70">
                                    WhatsApp Concierge: +{studioInfo.phone}
                                </p>
                                <p className="text-xs text-[#0B291E]/70">
                                    Validitas Penawaran: 14 Hari Kalender
                                </p>
                            </div>
                        </div>

                        {/* Itemized Table */}
                        <div className="mt-5 overflow-hidden rounded-xl border border-[#0B291E]/10">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-[#FAF8F5] border-b border-[#0B291E]/10 font-mono text-[9px] font-bold tracking-wider text-[#B89352] uppercase">
                                        <th className="py-2.5 px-3">Uraian Paket &amp; Spesifikasi</th>
                                        <th className="py-2.5 px-3 text-center">Qty</th>
                                        <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                                        <th className="py-2.5 px-3 text-right">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#0B291E]/5 text-[#0B291E]">
                                    <tr>
                                        <td className="py-3 px-3">
                                            <div className="font-bold text-[#0B291E]">
                                                {selectedHamper?.name}
                                            </div>
                                            <p className="text-[10.5px] text-[#0B291E]/60 max-w-xs">
                                                {selectedHamper?.short_description}
                                            </p>
                                        </td>
                                        <td className="py-3 px-3 text-center font-mono">{quantity} Box</td>
                                        <td className="py-3 px-3 text-right font-mono">{formatIdr(baseHamperPrice)}</td>
                                        <td className="py-3 px-3 text-right font-mono font-semibold">
                                            {formatIdr(grossHamperTotal)}
                                        </td>
                                    </tr>

                                    {/* Volume Discount Line */}
                                    {discountAmount > 0 && (
                                        <tr className="bg-emerald-50/50">
                                            <td colSpan={3} className="py-2 px-3 text-emerald-800 font-medium">
                                                Diskon Apresiasi Volume Korporat ({activeTier.discount_pct}%)
                                            </td>
                                            <td className="py-2 px-3 text-right font-mono text-emerald-800 font-bold">
                                                -{formatIdr(discountAmount)}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Add-ons Lines */}
                                    {addOns
                                        .filter((a) => enabledAddons[a.id])
                                        .map((addon) => (
                                            <tr key={addon.id}>
                                                <td className="py-2 px-3 text-[11px] text-[#0B291E]/80">
                                                    + {addon.name}
                                                </td>
                                                <td className="py-2 px-3 text-center font-mono">{quantity} Box</td>
                                                <td className="py-2 px-3 text-right font-mono">
                                                    {formatIdr(addon.price_per_box)}
                                                </td>
                                                <td className="py-2 px-3 text-right font-mono font-medium">
                                                    {formatIdr(addon.price_per_box * quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Calculation Summary Block */}
                        <div className="mt-4 flex justify-end">
                            <div className="w-64 space-y-1.5 text-xs">
                                <div className="flex justify-between text-[#0B291E]/70">
                                    <span>Subtotal Paket &amp; Add-on</span>
                                    <span className="font-mono">{formatIdr(subtotal)}</span>
                                </div>
                                {includePpn && (
                                    <div className="flex justify-between text-[#0B291E]/70">
                                        <span>PPN 11% Resmi</span>
                                        <span className="font-mono">{formatIdr(ppnAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t-2 border-[#0B291E] pt-2 text-sm font-bold text-[#0B291E]">
                                    <span>Total Penawaran Resmi</span>
                                    <span className="font-mono text-[#B89352]">{formatIdr(grandTotal)}</span>
                                </div>
                                <div className="text-right text-[10.5px] text-[#0B291E]/50 font-mono">
                                    Rata-rata: {formatIdr(pricePerBoxAllIn)} / box
                                </div>
                            </div>
                        </div>

                        {/* Payment & Signatures Block */}
                        <div className="mt-6 border-t border-[#0B291E]/10 pt-4 grid grid-cols-2 gap-4">
                            <div>
                                <span className="font-mono text-[9px] font-bold text-[#B89352] uppercase">
                                    PEMBAYARAN RESMI ATELIER:
                                </span>
                                <p className="mt-1 font-mono text-xs font-semibold text-[#0B291E]">
                                    {studioInfo.bank_info}
                                </p>
                                <p className="mt-1 text-[10.5px] text-[#0B291E]/60 leading-relaxed">
                                    {notes}
                                </p>
                            </div>
                            <div className="text-right flex flex-col justify-between">
                                <span className="font-mono text-[9px] font-bold text-[#B89352] uppercase">
                                    GALUH &amp; CO. ATELIER LEAD
                                </span>
                                <div className="mt-8 font-bold text-xs text-[#0B291E] underline">
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
