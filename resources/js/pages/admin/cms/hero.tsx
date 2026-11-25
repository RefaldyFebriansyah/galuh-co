import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Image as ImageIcon,
    Upload,
    Wand2,
    Save,
    RefreshCw,
    CheckCircle2,
    Type,
    ArrowRight,
    Trash2,
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';

interface HeroSettings {
    hero_badge: string;
    hero_title_prefix: string;
    hero_title: string;
    hero_subtitle: string;
    hero_tagline: string;
    active_edition: string;
    hero_floating_image_left: string;
    hero_floating_image_right: string;
    hero_rotating_words: string[];
    hero_marquee_text: string;
}

interface AdminCmsHeroProps {
    heroSettings: HeroSettings;
}

export default function AdminCmsHero({ heroSettings }: AdminCmsHeroProps) {
    const [badge, setBadge] = useState(heroSettings.hero_badge || '');
    const [titlePrefix, setTitlePrefix] = useState(
        heroSettings.hero_title_prefix || '',
    );
    const [title, setTitle] = useState(heroSettings.hero_title || '');
    const [subtitle, setSubtitle] = useState(heroSettings.hero_subtitle || '');
    const [activeEdition, setActiveEdition] = useState(
        heroSettings.active_edition || '',
    );
    const [marqueeText, setMarqueeText] = useState(
        heroSettings.hero_marquee_text || '',
    );
    const [imageLeft, setImageLeft] = useState(
        heroSettings.hero_floating_image_left || '',
    );
    const [imageRight, setImageRight] = useState(
        heroSettings.hero_floating_image_right || '',
    );

    // Rotating words list
    const [rotatingWords, setRotatingWords] = useState<string[]>(
        heroSettings.hero_rotating_words &&
            heroSettings.hero_rotating_words.length > 0
            ? heroSettings.hero_rotating_words
            : [
                  'Personal & Perusahaan',
                  'Mitra Perusahaan',
                  'Momen Istimewa',
                  'Momen yang Tak Diulang',
              ],
    );
    const [newWord, setNewWord] = useState('');

    const [isProcessingCanvas, setIsProcessingCanvas] = useState(false);
    const [canvasFeedback, setCanvasFeedback] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Client-side HTML5 Canvas background removal & WebP compression algorithm
    const processImageWithAutoBackgroundRemoval = (
        file: File,
        target: 'left' | 'right',
    ) => {
        setIsProcessingCanvas(true);
        setCanvasFeedback('Mengompresi ke WebP dan menghapus background...');

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas =
                    canvasRef.current || document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setIsProcessingCanvas(false);
                    return;
                }

                // Scale down if dimensions are excessively large to ensure ultra-fast load
                const maxDim = 800;
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = Math.round((height * maxDim) / height);
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                // Read image data pixel array
                const imgData = ctx.getImageData(0, 0, width, height);
                const data = imgData.data;

                // Sample background color from top-left, top-right, bottom-left, bottom-right corners
                const getPixel = (x: number, y: number) => {
                    const idx = (y * width + x) * 4;
                    return [data[idx], data[idx + 1], data[idx + 2]];
                };

                const corners = [
                    getPixel(0, 0),
                    getPixel(width - 1, 0),
                    getPixel(0, height - 1),
                    getPixel(width - 1, height - 1),
                ];

                const bgR =
                    corners.reduce((sum, c) => sum + c[0], 0) / corners.length;
                const bgG =
                    corners.reduce((sum, c) => sum + c[1], 0) / corners.length;
                const bgB =
                    corners.reduce((sum, c) => sum + c[2], 0) / corners.length;

                // Threshold background detection: corner color matching + light background detection
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    const dist = Math.sqrt(
                        (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2,
                    );
                    const isLightBg = r > 225 && g > 225 && b > 215;

                    if (dist < 40 || isLightBg) {
                        data[i + 3] = 0; // Transparan
                    } else if (dist < 55) {
                        const feather = (dist - 40) / 15;
                        data[i + 3] = Math.round(data[i + 3] * feather);
                    }
                }

                ctx.putImageData(imgData, 0, 0);

                // Export to highly compressed WebP format (0.85 quality)
                const webpDataUrl = canvas.toDataURL('image/webp', 0.85);

                if (target === 'left') {
                    setImageLeft(webpDataUrl);
                } else {
                    setImageRight(webpDataUrl);
                }

                setIsProcessingCanvas(false);
                setCanvasFeedback(
                    'Foto hampers berhasil diproses (Background terhapus & dikompresi ke WebP)!',
                );
                setTimeout(() => setCanvasFeedback(null), 4000);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleAddWord = () => {
        if (!newWord.trim()) return;
        setRotatingWords([...rotatingWords, newWord.trim()]);
        setNewWord('');
    };

    const handleRemoveWord = (index: number) => {
        setRotatingWords(rotatingWords.filter((_, i) => i !== index));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        router.post(
            '/admin/cms/hero',
            {
                hero_badge: badge,
                hero_title_prefix: titlePrefix,
                hero_title: title,
                hero_subtitle: subtitle,
                active_edition: activeEdition,
                hero_marquee_text: marqueeText,
                hero_floating_image_left: imageLeft,
                hero_floating_image_right: imageRight,
                hero_rotating_words: rotatingWords,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AdminLayout
            title="Hero Showcase CMS"
            subtitle="Atur foto hampers melayang (auto-hapus background & kompresi WebP), teks dinamis berganti, dan teks marquee berjalan."
        >
            <Head title="Hero Showcase — CMS Admin Galuh & Co." />

            <canvas ref={canvasRef} className="hidden" />

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Floating Hampers Cutouts (Auto-Background Removal & WebP Compression) */}
                <div className="rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                        <Wand2 className="size-4" />
                        <span>
                            FOTO HAMPERS MELAYANG DENGAN AUTO-HAPUS BACKGROUND &
                            KOMPRESI WEBP
                        </span>
                    </div>
                    <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                        Visual Kriya Hampers Kiri & Kanan
                    </h2>
                    <p className="mt-1 text-xs text-[#6E675D]">
                        Sistem secara otomatis menghapus background putih/terang
                        pada foto dan mengompresinya menjadi format WebP
                        berbobot sangat ringan agar loading website tetap super
                        cepat.
                    </p>

                    {canvasFeedback && (
                        <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                            {canvasFeedback}
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Hampers Kiri */}
                        <div className="rounded-2xl border border-[#A88B54]/25 bg-[#FAF8F5] p-5">
                            <span className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                HAMPERS MELAYANG KIRI (ANYAMAN BAMBU/ROTAN)
                            </span>

                            <div className="mt-3 flex h-48 items-center justify-center rounded-xl border border-dashed border-[#A88B54]/30 bg-[#F2EBDC]/50 p-4">
                                {imageLeft ? (
                                    <img
                                        src={imageLeft}
                                        alt="Hampers Kiri"
                                        className="max-h-full object-contain drop-shadow-lg"
                                    />
                                ) : (
                                    <div className="text-center text-xs text-[#6E675D]">
                                        <ImageIcon className="mx-auto size-8 text-[#A88B54]/40" />
                                        <p className="mt-1">Belum ada foto</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#16233B] px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]">
                                    <Upload className="size-3.5" />
                                    <span>Upload & Auto Hapus Background</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                processImageWithAutoBackgroundRemoval(
                                                    file,
                                                    'left',
                                                );
                                        }}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setImageLeft(
                                            '/images/floating-hamper-rattan.webp',
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border border-[#A88B54]/40 bg-[#F2EBDC] px-3 py-2 text-xs font-semibold text-[#16233B] hover:bg-[#A88B54] hover:text-[#16233B]"
                                    title="Gunakan foto hampers artisanal transparan asli tanpa kotak latar"
                                >
                                    Reset ke Asli
                                </button>
                            </div>
                        </div>

                        {/* Hampers Kanan */}
                        <div className="rounded-2xl border border-[#A88B54]/25 bg-[#FAF8F5] p-5">
                            <span className="text-[10px] font-bold tracking-wider text-[#A88B54] uppercase">
                                HAMPERS MELAYANG KANAN (HARDBOX EMERALD)
                            </span>

                            <div className="mt-3 flex h-48 items-center justify-center rounded-xl border border-dashed border-[#A88B54]/30 bg-[#F2EBDC]/50 p-4">
                                {imageRight ? (
                                    <img
                                        src={imageRight}
                                        alt="Hampers Kanan"
                                        className="max-h-full object-contain drop-shadow-lg"
                                    />
                                ) : (
                                    <div className="text-center text-xs text-[#6E675D]">
                                        <ImageIcon className="mx-auto size-8 text-[#A88B54]/40" />
                                        <p className="mt-1">Belum ada foto</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#16233B] px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-[#A88B54] hover:text-[#16233B]">
                                    <Upload className="size-3.5" />
                                    <span>Upload & Auto Hapus Background</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                processImageWithAutoBackgroundRemoval(
                                                    file,
                                                    'right',
                                                );
                                        }}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setImageRight(
                                            '/images/floating-hamper-emerald.webp',
                                        )
                                    }
                                    className="cursor-pointer rounded-xl border border-[#A88B54]/40 bg-[#F2EBDC] px-3 py-2 text-xs font-semibold text-[#16233B] hover:bg-[#A88B54] hover:text-[#16233B]"
                                    title="Gunakan foto hampers emerald transparan asli tanpa kotak latar"
                                >
                                    Reset ke Asli
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Rotating Words Editor */}
                <div className="rounded-2xl border border-[#A88B54]/30 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#A88B54] uppercase">
                        <RefreshCw className="size-4" />
                        <span>
                            KATA-KATA BERGANTI SECARA OTOMATIS (ROTATING WORDS)
                        </span>
                    </div>
                    <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                        Teks yang Berubah-ubah di Headline Hero
                    </h2>
                    <p className="mt-1 text-xs text-[#6E675D]">
                        Kata-kata ini akan berganti secara halus dengan animasi
                        motion di samping teks "{titlePrefix}".
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {rotatingWords.map((word, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-sans text-xs font-bold text-[#16233B]"
                            >
                                <span>{word}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveWord(idx)}
                                    className="cursor-pointer rounded-full p-0.5 text-[#6E675D] hover:bg-rose-100 hover:text-rose-700"
                                >
                                    <Trash2 className="size-3" />
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 flex max-w-md items-center gap-2">
                        <input
                            type="text"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddWord();
                                }
                            }}
                            placeholder="Ketik kata baru..."
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[#16233B] focus:border-[#16233B] focus:outline-hidden"
                        />
                        <button
                            type="button"
                            onClick={handleAddWord}
                            className="rounded-xl bg-[#16233B] px-4 py-2 text-xs font-bold text-white hover:bg-[#223354]"
                        >
                            Tambah Kata
                        </button>
                    </div>
                </div>

                {/* 3. Headline, Subheadline & Marquee Running Text */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                            <Type className="size-4 text-[#D4AF37]" />
                            <span>
                                KONTEN HEADLINE & TEKS BERJALAN (MARQUEE)
                            </span>
                        </div>
                        <h2 className="mt-1 font-sans text-lg font-bold text-[#16233B]">
                            Headline, Subtitle, dan Marquee Text
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                Badge Atas Hero:
                            </label>
                            <input
                                type="text"
                                required
                                value={badge}
                                onChange={(e) => setBadge(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                                    Edisi Musiman Aktif:
                                </label>
                                <span className="rounded-full bg-[#A88B54]/10 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#A88B54]">
                                    Opsional
                                </span>
                            </div>
                            <input
                                type="text"
                                value={activeEdition}
                                onChange={(e) =>
                                    setActiveEdition(e.target.value)
                                }
                                placeholder="Contoh: Edisi Spesial 1447 H (Boleh dikosongkan)"
                                className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] placeholder:text-[#6E675D]/40 focus:border-[#A88B54] focus:outline-hidden"
                            />
                        </div>
                    </div>

                    {/* Live Preview Pill for Admin */}
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#A88B54]/30 bg-[#FAF8F5] p-3 text-xs text-[#6E675D]">
                        <span className="font-bold text-[#16233B]">
                            Preview Tampilan Badge di Hero:
                        </span>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#DFD7C5] bg-white px-3.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase shadow-2xs">
                            <span className="font-bold text-[#A88B54]">
                                GALUH & CO.
                            </span>
                            {badge.trim() && (
                                <>
                                    <span className="size-1 rounded-full bg-[#A88B54]" />
                                    <span className="font-bold text-[#A88B54]">
                                        {badge
                                            .replace(
                                                /^galuh\s*&\s*co\.?\s*[•\-|]?\s*/i,
                                                '',
                                            )
                                            .trim() || badge}
                                    </span>
                                </>
                            )}
                            {activeEdition && activeEdition.trim() && (
                                <>
                                    <span className="size-1 rounded-full bg-[#A88B54]" />
                                    <span>{activeEdition.trim()}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                            Judul Utama Hero:
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                            Subheadline / Deskripsi Hero:
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-[10.5px] font-bold tracking-wider text-[#16233B] uppercase">
                            Isi Teks Berjalan (Marquee Ticker):
                        </label>
                        <input
                            type="text"
                            required
                            value={marqueeText}
                            onChange={(e) => setMarqueeText(e.target.value)}
                            placeholder="Gunakan tanda titik tengah (•) sebagai pemisah teks berjalan..."
                            className="mt-1 w-full rounded-xl border border-[#A88B54]/30 bg-[#F2EBDC]/20 px-3.5 py-2.5 text-xs text-[#16233B] focus:border-[#A88B54] focus:outline-hidden"
                        />
                        <p className="mt-1 text-[11px] text-[#6E675D]">
                            Teks ini berjalan secara looping terus-menerus di
                            bawah hero section.
                        </p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 rounded-2xl border border-[#A88B54]/30 bg-white p-4 shadow-sm">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#16233B] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#A88B54] hover:text-[#16233B] disabled:opacity-50"
                    >
                        <Save className="size-4" />
                        <span>
                            {isSaving ? 'Menyimpan...' : 'Simpan Hero Showcase'}
                        </span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
