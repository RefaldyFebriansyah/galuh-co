<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property string $group
 * @property string $type
 * @property string|null $label
 * @property string|null $description
 */
#[Fillable([
    'key',
    'value',
    'group',
    'type',
    'label',
    'description',
])]
class Setting extends Model
{
    protected $table = 'site_settings';

    /**
     * Get a setting value by key, with default fallback.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            if (! $setting) {
                return $default;
            }

            $val = $setting->value;
            if ($setting->type === 'array' || (is_string($val) && (str_starts_with(trim($val), '[') || str_starts_with(trim($val), '{')))) {
                $decoded = json_decode($val, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    return $decoded;
                }
            }

            return $val ?? $default;
        });
    }

    /**
     * Set a setting value.
     */
    public static function set(
        string $key,
        mixed $value,
        ?string $group = 'general',
        ?string $type = 'string',
        ?string $label = null,
        ?string $description = null
    ): void {
        $data = [
            'value' => is_array($value) ? json_encode($value) : $value,
            'group' => $group ?? 'general',
            'type' => $type ?? 'string',
        ];

        if ($label !== null) {
            $data['label'] = $label;
        }

        if ($description !== null) {
            $data['description'] = $description;
        }

        static::updateOrCreate(['key' => $key], $data);
        Cache::forget("setting_{$key}");
        Cache::forget('landing_page_settings');
    }

    /**
     * Get all settings grouped for the admin dashboard.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function getAllGrouped(): array
    {
        $settings = static::all();
        $grouped = [];

        foreach ($settings as $setting) {
            $grouped[$setting->group][$setting->key] = [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => $setting->value,
                'type' => $setting->type,
                'label' => $setting->label,
                'description' => $setting->description,
            ];
        }

        return $grouped;
    }

    /**
     * Get aggregated settings ready for the public landing page.
     *
     * @return array<string, mixed>
     */
    public static function forLandingPage(): array
    {
        return Cache::remember('landing_page_settings', 3600, function () {
            $settings = static::all()->pluck('value', 'key');

            $aboutPillarsRaw = $settings->get('about_pillars');
            $aboutPillars = null;
            if ($aboutPillarsRaw) {
                $decoded = is_string($aboutPillarsRaw) ? json_decode($aboutPillarsRaw, true) : $aboutPillarsRaw;
                if (is_array($decoded)) {
                    $aboutPillars = $decoded;
                }
            }

            $atelierCardsRaw = $settings->get('atelier_cards');
            $atelierCards = null;
            if ($atelierCardsRaw) {
                $decoded = is_string($atelierCardsRaw) ? json_decode($atelierCardsRaw, true) : $atelierCardsRaw;
                if (is_array($decoded)) {
                    $atelierCards = $decoded;
                }
            }

            $orderGuideStepsRaw = $settings->get('order_guide_steps');
            $orderGuideSteps = null;
            if ($orderGuideStepsRaw) {
                $decoded = is_string($orderGuideStepsRaw) ? json_decode($orderGuideStepsRaw, true) : $orderGuideStepsRaw;
                if (is_array($decoded)) {
                    $orderGuideSteps = $decoded;
                }
            }

            $heroRotatingWordsRaw = $settings->get('hero_rotating_words');
            $heroRotatingWords = null;
            if ($heroRotatingWordsRaw) {
                $decoded = is_string($heroRotatingWordsRaw) ? json_decode($heroRotatingWordsRaw, true) : $heroRotatingWordsRaw;
                if (is_array($decoded)) {
                    $heroRotatingWords = $decoded;
                }
            }

            return [
                'whatsapp_number' => $settings->get('whatsapp_number', (string) config('services.whatsapp.number', '6282321773434')),
                'contact_email' => $settings->get('contact_email', 'halo@galuh.co'),
                'contact_phone' => $settings->get('contact_phone', '+62 823-2177-3434'),
                'company_address' => $settings->get('company_address', 'Jl. Ir. H. Juanda No. 146, Ciamis, Jawa Barat 46211'),
                'operational_hours' => $settings->get('operational_hours', 'Senin - Sabtu: 08.00 - 18.00 WIB'),
                'instagram_url' => $settings->get('instagram_url', 'https://instagram.com/galuh.co'),
                'tiktok_url' => $settings->get('tiktok_url', 'https://tiktok.com/@galuh.co'),
                'linkedin_url' => $settings->get('linkedin_url', ''),
                'logo_gold' => $settings->get('logo_gold', '/images/galuh_logo_gold.png'),
                'logo_white' => $settings->get('logo_white', '/images/galuh_logo_white.png'),
                'hero_badge' => $settings->get('hero_badge', 'Atelier Bingkisan'),
                'hero_title_prefix' => $settings->get('hero_title_prefix', 'Hampers Eksklusif'),
                'hero_description' => $settings->get('hero_description', 'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.'),
                'active_edition' => $settings->get('active_edition', ''),
                'hero_eyebrow' => $settings->get('hero_badge') ? 'GALUH & CO. • '.$settings->get('hero_badge') : $settings->get('hero_eyebrow', 'GALUH & CO. • ATELIER BINGKISAN'),
                'hero_title' => $settings->get('hero_title', 'Kriya Bingkisan untuk Momen yang Tak Diulang.'),
                'hero_subtitle' => $settings->get('hero_subtitle', 'Kurasi hantaran mewah berbalut hardbox zamrud dan anyaman bambu artisanal untuk representasi prestisius keluarga dan korporat.'),
                'hero_tagline' => $settings->get('hero_tagline', 'Sentuhan Ketulusan di Setiap Kotak Hadiah'),
                'hero_floating_image_left' => $settings->get('hero_floating_image_left', '/images/floating-hamper-rattan.webp'),
                'hero_floating_image_right' => $settings->get('hero_floating_image_right', '/images/floating-hamper-emerald.webp'),
                'hero_rotating_words' => $heroRotatingWords,
                'hero_marquee_text' => $settings->get('hero_marquee_text', 'Sentuhan Ketulusan di Setiap Kotak Hadiah • Kemasan Hardbox Linen 1200 GSM • Kartu Ucapan Stempel Wax Personal • Pelacakan Resi Transparan'),
                'about_badge' => $settings->get('about_badge', 'TENTANG GALUH & CO.'),
                'about_title' => $settings->get('about_title', 'Menghadirkan Kehangatan di Setiap Kotak Hadiah'),
                'about_description' => $settings->get('about_description', "GALUH & CO. lahir dari keyakinan bahwa bingkisan terbaik bukan sekadar benda di dalam wadah, melainkan bahasa ketulusan yang merajut ikatan emosional dan apresiasi berkelas. Kami mendedikasikan ketelitian kriya pada setiap lembar pita, lipatan linen, dan segel lilin wax.\n\nMulai dari bahan kudapan butter Wijsman autentik, madu hutan murni, hingga kemasan anyaman bambu eksklusif—setiap pesanan diproses langsung di website dengan sistem pelacakan resi transparan untuk perayaan keluarga maupun representasi resmi korporat."),
                'about_pillars' => $aboutPillars,
                'active_event' => $settings->get('active_event', 'ramadhan'),
                'event_banner_title' => $settings->get('event_banner_title', 'Kurasi Hantaran Istimewa Hari Raya'),
                'event_banner_subtitle' => $settings->get('event_banner_subtitle', 'Sambut momen suci dengan bingkisan mewah berbalut hardbox zamrud dan anyaman bambu artisanal.'),
                'event_banner_image' => $settings->get('event_banner_image', '/images/product_emerald_box.jpg'),
                'event_banner_active' => (bool) $settings->get('event_banner_active', true),
                'catalog_badge' => $settings->get('catalog_badge', 'KOLEKSI HAMPERS • IDUL FITRI & RAMADHAN 1447H'),
                'catalog_title' => $settings->get('catalog_title', 'Koleksi Bingkisan Istimewa'),
                'catalog_subtitle' => $settings->get('catalog_subtitle', 'Pilihan kurasi hampers eksklusif dengan wadah anyaman bambu kriya dan hardbox linen berstempel wax personal untuk melengkapi kebersamaan Anda.'),
                'atelier_badge' => $settings->get('atelier_badge', 'STANDAR MUTU ATELIER'),
                'atelier_title' => $settings->get('atelier_title', 'Integritas Atelier Galuh & Co.'),
                'atelier_subtitle' => $settings->get('atelier_subtitle', 'Dedikasi tanpa kompromi dalam setiap detail kurasi, pengemasan, dan penghantaran bingkisan Anda.'),
                'atelier_cards' => $atelierCards,
                'order_guide_badge' => $settings->get('order_guide_badge', 'PANDUAN PEMESANAN • SISTEM WEBSITE RESMI'),
                'order_guide_title' => $settings->get('order_guide_title', 'Alur Pemesanan Mudah & Transparan'),
                'order_guide_subtitle' => $settings->get('order_guide_subtitle', 'Seluruh transaksi diproses langsung di dalam website setelah Anda mendaftar atau masuk ke akun Anda, lengkap dengan konfirmasi instan dan pelacakan resi.'),
                'order_guide_steps' => $orderGuideSteps,
                'studio_gmaps_embed' => $settings->get('studio_gmaps_embed') ?: ('https://maps.google.com/maps?q='.urlencode($settings->get('company_address', 'Jl. Ir. H. Juanda No. 146, Ciamis, Jawa Barat 46211')).'&output=embed'),
                'footer_bio' => $settings->get('footer_bio', 'Atelier kriya bingkisan premium dan corporate gifting artisanal yang memadukan kehangatan tradisi anyaman bambu Nusantara dengan kemewahan hardbox linen berstempel wax.'),
            ];
        });
    }
}
