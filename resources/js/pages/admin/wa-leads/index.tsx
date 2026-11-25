import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Copy,
    Edit3,
    ExternalLink,
    Filter,
    MessageSquare,
    Phone,
    Plus,
    Search,
    Send,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';

interface WaLeadItem {
    id: number;
    client_name: string;
    company_name?: string | null;
    wa_number: string;
    source: string;
    package_name?: string | null;
    estimated_packages?: string | null;
    budget_range?: string | null;
    greeting_card_message?: string | null;
    engraving_name?: string | null;
    delivery_date?: string | null;
    status:
        | 'chat_baru'
        | 'kirim_katalog'
        | 'negosiasi_custom'
        | 'deal_produksi'
        | 'batal';
    status_label?: string;
    notes?: string | null;
    last_follow_up_at?: string | null;
    created_at: string;
}

interface WaTemplateItem {
    id: number;
    title: string;
    category: string;
    message_body: string;
    is_active: boolean;
}

interface WaLeadsProps {
    leads: WaLeadItem[];
    templates: WaTemplateItem[];
    statusCounts: {
        total: number;
        chat_baru: number;
        kirim_katalog: number;
        negosiasi_custom: number;
        deal_produksi: number;
        batal: number;
    };
    filters: {
        search?: string;
        status?: string;
        source?: string;
    };
}

export default function AdminWaLeadsIndex({
    leads,
    templates,
    statusCounts,
    filters,
}: WaLeadsProps) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [followUpDrawerOpen, setFollowUpDrawerOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<WaLeadItem | null>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
        templates[0]?.id || null,
    );
    const [customizedMessage, setCustomizedMessage] = useState('');
    const [copied, setCopied] = useState(false);

    // Modal Add Manual Lead
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const manualForm = useForm({
        client_name: '',
        company_name: '',
        wa_number: '628',
        source: 'direct_wa',
        package_name: 'Seri Emerald Royal Nusantara',
        estimated_packages: '50 Box',
        budget_range: 'Rp 15.000.000 - Rp 25.000.000',
        greeting_card_message:
            'Semoga kemitraan kita senantiasa diberkahi keberlimpahan.',
        engraving_name: '',
        delivery_date: '',
        status: 'chat_baru' as
            | 'chat_baru'
            | 'kirim_katalog'
            | 'negosiasi_custom'
            | 'deal_produksi'
            | 'batal',
        notes: '',
    });

    const handleFilterApply = (statusKey?: string) => {
        router.get(
            '/admin/wa-leads',
            {
                search: searchVal || undefined,
                status:
                    statusKey !== undefined
                        ? statusKey || undefined
                        : selectedStatus || undefined,
                source: filters.source || undefined,
            },
            { preserveState: true },
        );
    };

    const handleQuickStatusChange = (
        lead: WaLeadItem,
        nextStatus: WaLeadItem['status'],
    ) => {
        router.patch(
            `/admin/wa-leads/${lead.id}/status`,
            { status: nextStatus },
            { preserveScroll: true },
        );
    };

    const handleDelete = (lead: WaLeadItem) => {
        if (confirm(`Hapus lead dari "${lead.client_name}"?`)) {
            router.delete(`/admin/wa-leads/${lead.id}`, {
                preserveScroll: true,
            });
        }
    };

    const openFollowUp = (lead: WaLeadItem) => {
        setSelectedLead(lead);
        const initialTemplate = templates[0];
        if (initialTemplate) {
            setSelectedTemplateId(initialTemplate.id);
            setCustomizedMessage(
                populateTemplateVariables(initialTemplate.message_body, lead),
            );
        } else {
            setCustomizedMessage(
                `Halo ${lead.client_name}, terima kasih telah menghubungi Concierge GALUH & CO.`,
            );
        }
        setFollowUpDrawerOpen(true);
    };

    const handleTemplateSelect = (templateId: number) => {
        setSelectedTemplateId(templateId);
        const tmpl = templates.find((t) => t.id === templateId);
        if (tmpl && selectedLead) {
            setCustomizedMessage(
                populateTemplateVariables(tmpl.message_body, selectedLead),
            );
        }
    };

    const populateTemplateVariables = (body: string, lead: WaLeadItem) => {
        return body
            .replace(/\{nama_klien\}/g, lead.client_name)
            .replace(
                /\{nama_perusahaan\}/g,
                lead.company_name || 'perusahaan Bapak/Ibu',
            )
            .replace(
                /\{nama_paket\}/g,
                lead.package_name || 'kurasi hampers GALUH & CO.',
            )
            .replace(/\{jumlah_box\}/g, lead.estimated_packages || '50 box');
    };

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(customizedMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenWhatsApp = () => {
        if (!selectedLead) return;
        router.post(
            `/admin/wa-leads/${selectedLead.id}/follow-up`,
            {},
            { preserveScroll: true },
        );
        const cleanPhone = selectedLead.wa_number.replace(/\D/g, '');
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customizedMessage)}`;
        window.open(waUrl, '_blank');
        setFollowUpDrawerOpen(false);
    };

    const submitManualLead = (e: React.FormEvent) => {
        e.preventDefault();
        manualForm.post('/admin/wa-leads', {
            onSuccess: () => setManualModalOpen(false),
        });
    };

    const getStatusBadge = (status: WaLeadItem['status']) => {
        switch (status) {
            case 'deal_produksi':
                return {
                    label: 'Deal / Masuk Produksi',
                    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                };
            case 'negosiasi_custom':
                return {
                    label: 'Negosiasi Custom',
                    bg: 'bg-purple-50 text-purple-800 border-purple-200',
                };
            case 'kirim_katalog':
                return {
                    label: 'Kirim Katalog',
                    bg: 'bg-sky-50 text-sky-800 border-sky-200',
                };
            case 'batal':
                return {
                    label: 'Batal',
                    bg: 'bg-stone-100 text-stone-600 border-stone-200',
                };
            default:
                return {
                    label: 'Chat Baru',
                    bg: 'bg-amber-50 text-amber-800 border-amber-200',
                };
        }
    };

    return (
        <AdminLayout
            title="Pelacak Lead & Chat WhatsApp"
            subtitle="Pipeline Konsultasi dari Tombol Website, 1-Click Follow Up & Konversi Pesanan"
            headerAction={
                <button
                    type="button"
                    onClick={() => setManualModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#16233B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#2B3B5C]"
                >
                    <Plus className="size-3.5 text-[#A88B54]" />
                    <span>Catat Lead Manual</span>
                </button>
            }
        >
            <div className="space-y-6">
                {/* 1. Pipeline Status Filter Tabs */}
                <div className="flex scrollbar-none overflow-x-auto rounded-2xl border-b border-[#16233B]/10 bg-white px-4 shadow-2xs sm:px-6">
                    <nav className="flex min-w-max space-x-6">
                        {[
                            {
                                key: '',
                                label: 'Semua Leads',
                                count: statusCounts.total,
                            },
                            {
                                key: 'chat_baru',
                                label: 'Chat Baru',
                                count: statusCounts.chat_baru,
                            },
                            {
                                key: 'kirim_katalog',
                                label: 'Kirim Katalog',
                                count: statusCounts.kirim_katalog,
                            },
                            {
                                key: 'negosiasi_custom',
                                label: 'Negosiasi Custom',
                                count: statusCounts.negosiasi_custom,
                            },
                            {
                                key: 'deal_produksi',
                                label: 'Deal / Produksi',
                                count: statusCounts.deal_produksi,
                            },
                            {
                                key: 'batal',
                                label: 'Batal',
                                count: statusCounts.batal,
                            },
                        ].map((tab) => {
                            const isCurrent =
                                (filters.status || '') === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => {
                                        setSelectedStatus(tab.key);
                                        handleFilterApply(tab.key);
                                    }}
                                    className={`relative flex items-center gap-2 py-4 text-xs font-semibold transition-colors ${
                                        isCurrent
                                            ? 'text-[#16233B]'
                                            : 'text-[#16233B]/50 hover:text-[#16233B]'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                                            isCurrent
                                                ? 'bg-[#16233B] text-white'
                                                : 'bg-[#16233B]/5 text-[#16233B]/60'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="pipeline-active-tab"
                                            className="absolute inset-x-0 bottom-0 h-0.5 bg-[#A88B54]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* 2. Search & Filter Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[#16233B]/10 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-3">
                        <div className="relative min-w-[260px] flex-1">
                            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#16233B]/40" />
                            <input
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleFilterApply()
                                }
                                placeholder="Cari nama klien, perusahaan, nomor WA..."
                                className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF6EE] py-1.5 pr-3 pl-8 text-xs text-[#16233B] placeholder-[#16233B]/40 focus:outline-hidden"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => handleFilterApply()}
                            className="rounded-lg bg-[#16233B]/10 px-3 py-1.5 text-xs font-semibold text-[#16233B] hover:bg-[#16233B] hover:text-white"
                        >
                            Terapkan
                        </button>
                    </div>
                </div>

                {/* 3. Leads Table */}
                <div className="overflow-hidden rounded-2xl border border-[#16233B]/10 bg-white shadow-2xs">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-[#16233B]/10 bg-[#FAF8F5] font-mono text-[9.5px] font-bold tracking-wider text-[#A88B54] uppercase">
                                <th className="px-4 py-3">
                                    Klien / Perusahaan
                                </th>
                                <th className="px-4 py-3">Kontak WhatsApp</th>
                                <th className="px-4 py-3">
                                    Paket &amp; Estimasi Box
                                </th>
                                <th className="px-4 py-3">
                                    Kartu &amp; Grafir
                                </th>
                                <th className="px-4 py-3">Status Pipeline</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#16233B]/5 text-[#16233B]">
                            {leads.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-xs text-[#16233B]/50"
                                    >
                                        Tidak ada data lead WhatsApp yang cocok.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => {
                                    const badge = getStatusBadge(lead.status);

                                    return (
                                        <tr
                                            key={lead.id}
                                            className="transition-colors hover:bg-[#FAF6EE]/50"
                                        >
                                            {/* Client / Company */}
                                            <td className="px-4 py-3.5">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[#16233B]">
                                                        {lead.client_name}
                                                    </h4>
                                                    {lead.company_name ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-[#16233B]/60">
                                                            <Building2 className="size-3 text-[#A88B54]" />
                                                            {lead.company_name}
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono text-[10px] text-[#16233B]/40">
                                                            Personal Client
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Phone & Source */}
                                            <td className="px-4 py-3.5">
                                                <div>
                                                    <a
                                                        href={`https://wa.me/${lead.wa_number.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 font-mono text-xs font-semibold text-[#16233B] hover:text-[#A88B54]"
                                                    >
                                                        <span>
                                                            +{lead.wa_number}
                                                        </span>
                                                        <ExternalLink className="size-2.5 opacity-40" />
                                                    </a>
                                                    <span className="py-0.2 mt-0.5 inline-block rounded border border-[#16233B]/10 bg-[#FAF8F5] px-1.5 font-mono text-[9px] text-[#16233B]/60">
                                                        {lead.source}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Package & Boxes */}
                                            <td className="px-4 py-3.5">
                                                <div>
                                                    <span className="font-medium text-[#16233B]">
                                                        {lead.package_name ||
                                                            'Konsultasi Kustom'}
                                                    </span>
                                                    <p className="font-mono text-[11px] text-[#A88B54]">
                                                        {lead.estimated_packages ||
                                                            '1 - 25 Box'}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Greeting Card & Engraving */}
                                            <td className="max-w-xs px-4 py-3.5">
                                                <div className="space-y-0.5">
                                                    {lead.greeting_card_message ? (
                                                        <p className="line-clamp-1 text-[11px] text-[#16233B]/70 italic">
                                                            &ldquo;
                                                            {
                                                                lead.greeting_card_message
                                                            }
                                                            &rdquo;
                                                        </p>
                                                    ) : (
                                                        <span className="text-[10px] text-[#16233B]/40">
                                                            -
                                                        </span>
                                                    )}
                                                    {lead.engraving_name && (
                                                        <span className="inline-block rounded border border-[#16233B]/10 bg-[#FAF8F5] px-1.5 font-mono text-[9.5px] text-[#16233B]">
                                                            Grafir:{' '}
                                                            {
                                                                lead.engraving_name
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Pipeline Status Dropdown */}
                                            <td className="px-4 py-3.5">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) =>
                                                        handleQuickStatusChange(
                                                            lead,
                                                            e.target
                                                                .value as WaLeadItem['status'],
                                                        )
                                                    }
                                                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium focus:outline-hidden ${badge.bg}`}
                                                >
                                                    <option value="chat_baru">
                                                        Chat Baru
                                                    </option>
                                                    <option value="kirim_katalog">
                                                        Kirim Katalog
                                                    </option>
                                                    <option value="negosiasi_custom">
                                                        Negosiasi Custom
                                                    </option>
                                                    <option value="deal_produksi">
                                                        Deal / Masuk Produksi
                                                    </option>
                                                    <option value="batal">
                                                        Batal
                                                    </option>
                                                </select>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openFollowUp(lead)
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-md border border-[#16233B]/15 bg-white px-2.5 py-1 text-xs font-semibold text-[#16233B] shadow-2xs hover:border-[#A88B54] hover:text-[#A88B54]"
                                                    >
                                                        <Send className="size-3 text-[#A88B54]" />
                                                        <span>Follow Up</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(lead)
                                                        }
                                                        className="rounded p-1 text-rose-600 hover:bg-rose-50"
                                                        title="Hapus Lead"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Slide-Over Drawer: 1-Click WhatsApp Follow-Up */}
            <AnimatePresence>
                {followUpDrawerOpen && selectedLead && (
                    <div
                        className="backdrop-blur-2xs fixed inset-0 z-50 flex justify-end bg-black/50"
                        onClick={() => setFollowUpDrawerOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 26,
                                stiffness: 220,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-full w-full max-w-lg flex-col justify-between bg-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#16233B]/10 bg-[#FAF8F5] px-6 py-4">
                                <div>
                                    <h3 className="text-base font-semibold text-[#16233B]">
                                        1-Click WhatsApp Follow-Up
                                    </h3>
                                    <p className="text-xs text-[#16233B]/60">
                                        Kirim balasan cepat &amp;
                                        terpersonalisasi ke klien
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFollowUpDrawerOpen(false)}
                                    className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <div className="flex-1 scrollbar-none space-y-4 overflow-y-auto p-6 text-xs">
                                {/* Selected Client Card */}
                                <div className="space-y-1 rounded-xl border border-[#16233B]/10 bg-[#FAF8F5] p-3.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-[#16233B]">
                                            {selectedLead.client_name}
                                        </h4>
                                        <span className="font-mono text-xs text-[#A88B54]">
                                            +{selectedLead.wa_number}
                                        </span>
                                    </div>
                                    <p className="text-[11.5px] text-[#16233B]/60">
                                        {selectedLead.package_name ||
                                            'Konsultasi Kustom'}{' '}
                                        �{' '}
                                        {selectedLead.estimated_packages ||
                                            'Belum ditargetkan'}
                                    </p>
                                </div>

                                {/* Template Picker */}
                                <div className="space-y-1.5">
                                    <label className="font-semibold text-[#16233B]">
                                        Pilih Template Balasan Cepat
                                    </label>
                                    <div className="space-y-1.5">
                                        {templates.map((tmpl) => (
                                            <button
                                                key={tmpl.id}
                                                type="button"
                                                onClick={() =>
                                                    handleTemplateSelect(
                                                        tmpl.id,
                                                    )
                                                }
                                                className={`w-full rounded-lg border p-2.5 text-left transition-colors ${
                                                    selectedTemplateId ===
                                                    tmpl.id
                                                        ? 'border-[#A88B54] bg-[#A88B54]/10 text-[#16233B]'
                                                        : 'border-[#16233B]/10 bg-white hover:bg-[#FAF8F5]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold">
                                                        {tmpl.title}
                                                    </span>
                                                    <span className="font-mono text-[9px] text-[#A88B54] uppercase">
                                                        {tmpl.category}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview & Edit Message Body */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="font-semibold text-[#16233B]">
                                            Isi Pesan WhatsApp Terpersonalisasi
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleCopyMessage}
                                            className="inline-flex items-center gap-1 font-mono text-[10px] text-[#A88B54] hover:underline"
                                        >
                                            <Copy className="size-3" />
                                            <span>
                                                {copied
                                                    ? 'Tersalin!'
                                                    : 'Salin Teks'}
                                            </span>
                                        </button>
                                    </div>
                                    <textarea
                                        rows={8}
                                        value={customizedMessage}
                                        onChange={(e) =>
                                            setCustomizedMessage(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-[#16233B]/15 bg-[#FAF8F5] p-3 font-sans text-xs leading-relaxed text-[#16233B] focus:outline-hidden"
                                    />
                                    <p className="text-[10px] text-[#16233B]/50">
                                        Anda dapat mengedit teks sebelum menekan
                                        tombol buka WhatsApp di bawah.
                                    </p>
                                </div>
                            </div>

                            {/* Drawer Footer Action */}
                            <div className="flex items-center justify-between border-t border-[#16233B]/10 bg-[#FAF8F5] px-6 py-4">
                                <button
                                    type="button"
                                    onClick={() => setFollowUpDrawerOpen(false)}
                                    className="rounded-lg border px-3.5 py-2 text-xs text-[#16233B]"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOpenWhatsApp}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-800"
                                >
                                    <Send className="size-3.5" />
                                    <span>Buka WhatsApp Web / App</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Manual Lead Modal */}
            <AnimatePresence>
                {manualModalOpen && (
                    <div
                        className="backdrop-blur-2xs fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setManualModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#16233B]/10 pb-3">
                                <h3 className="text-base font-semibold text-[#16233B]">
                                    Catat Lead WhatsApp Manual
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setManualModalOpen(false)}
                                    className="p-1 text-[#16233B]/60 hover:text-[#16233B]"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form
                                onSubmit={submitManualLead}
                                className="mt-4 space-y-3 text-xs"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Nama Klien
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={manualForm.data.client_name}
                                            onChange={(e) =>
                                                manualForm.setData(
                                                    'client_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama lengkap klien"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Perusahaan (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={manualForm.data.company_name}
                                            onChange={(e) =>
                                                manualForm.setData(
                                                    'company_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="PT / Instansi"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Nomor WhatsApp
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={manualForm.data.wa_number}
                                            onChange={(e) =>
                                                manualForm.setData(
                                                    'wa_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="628123456789"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 font-mono text-xs focus:outline-hidden"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-semibold text-[#16233B]">
                                            Estimasi Jumlah Box
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                manualForm.data
                                                    .estimated_packages
                                            }
                                            onChange={(e) =>
                                                manualForm.setData(
                                                    'estimated_packages',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: 50 Box"
                                            className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Paket yang Ditanyakan
                                    </label>
                                    <input
                                        type="text"
                                        value={manualForm.data.package_name}
                                        onChange={(e) =>
                                            manualForm.setData(
                                                'package_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Seri Emerald Royal Nusantara"
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#16233B]">
                                        Teks Kartu Ucapan yang Diinginkan
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={
                                            manualForm.data
                                                .greeting_card_message
                                        }
                                        onChange={(e) =>
                                            manualForm.setData(
                                                'greeting_card_message',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Pesan ucapan hangat yang akan dicetak di kartu..."
                                        className="w-full rounded-lg border border-[#16233B]/15 bg-[#FAF8F5] p-2 text-xs focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#16233B]/10 pt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setManualModalOpen(false)
                                        }
                                        className="rounded-lg border px-3 py-1.5 text-xs text-[#16233B]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={manualForm.processing}
                                        className="rounded-lg bg-[#16233B] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2B3B5C]"
                                    >
                                        Simpan Lead
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
