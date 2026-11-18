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

            return $setting?->value ?? $default;
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

            return [
                'whatsapp_number' => $settings->get('whatsapp_number', (string) config('services.whatsapp.number', '6281572414233')),
                'contact_email' => $settings->get('contact_email', 'halo@galuh.co'),
                'contact_phone' => $settings->get('contact_phone', '+62 815-7241-4233'),
                'company_address' => $settings->get('company_address', 'Jl. Galuh Mas Raya No. 88, Karawang Barat, Jawa Barat 41361'),
                'operational_hours' => $settings->get('operational_hours', 'Senin - Sabtu: 08.00 - 20.00 WIB'),
                'instagram_url' => $settings->get('instagram_url', 'https://instagram.com/galuh.co'),
                'tiktok_url' => $settings->get('tiktok_url', 'https://tiktok.com/@galuh.co'),
                'linkedin_url' => $settings->get('linkedin_url', ''),
                'logo_gold' => $settings->get('logo_gold', '/images/galuh_logo_gold.png'),
                'logo_white' => $settings->get('logo_white', '/images/galuh_logo_white.png'),
                'hero_badge' => $settings->get('hero_badge', '✦ ATELIER HAMPERS & KADO KORPORAT ✦'),
                'hero_title_prefix' => $settings->get('hero_title_prefix', 'Hampers Eksklusif'),
                'hero_description' => $settings->get('hero_description', 'Pilihan hampers premium dan hadiah perusahaan dengan kemasan eksklusif. Siap melengkapi setiap momen istimewa Anda dengan mudah dan berkelas.'),
            ];
        });
    }
}
