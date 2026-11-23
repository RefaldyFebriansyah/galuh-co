<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $client_name
 * @property string|null $company_name
 * @property string $wa_number
 * @property string|null $address
 * @property string $source
 * @property string|null $package_name
 * @property string|null $estimated_packages
 * @property string|null $budget_range
 * @property string|null $greeting_card_message
 * @property string|null $engraving_name
 * @property Carbon|null $delivery_date
 * @property string $status
 * @property string|null $notes
 * @property Carbon|null $last_follow_up_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $wa_link
 * @property-read string $status_label
 */
#[Fillable([
    'client_name',
    'company_name',
    'wa_number',
    'address',
    'source',
    'package_name',
    'estimated_packages',
    'budget_range',
    'greeting_card_message',
    'engraving_name',
    'delivery_date',
    'status',
    'notes',
    'last_follow_up_at',
])]
class WaLead extends Model
{
    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'wa_link',
        'status_label',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'delivery_date' => 'date',
            'last_follow_up_at' => 'datetime',
        ];
    }

    /**
     * Generate normalized international WhatsApp link.
     */
    public function getWaLinkAttribute(): string
    {
        $cleanNumber = preg_replace('/[^0-9]/', '', $this->wa_number ?? '');
        if (str_starts_with($cleanNumber, '0')) {
            $cleanNumber = '62'.substr($cleanNumber, 1);
        }

        $greeting = urlencode("Halo {$this->client_name}, terima kasih telah menghubungi Concierge GALUH & CO. terkait pemesanan {$this->package_name}.");

        return "https://wa.me/{$cleanNumber}?text={$greeting}";
    }

    /**
     * Get human-friendly Indonesian label for status.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'chat_baru' => 'Chat Baru',
            'kirim_katalog' => 'Kirim Katalog',
            'negosiasi_custom' => 'Negosiasi Custom',
            'deal_produksi' => 'Deal / Masuk Produksi',
            'batal' => 'Batal',
            default => ucfirst(str_replace('_', ' ', $this->status ?? '')),
        };
    }

    /**
     * Related production orders.
     *
     * @return HasMany<ProductionOrder, $this>
     */
    public function productionOrders(): HasMany
    {
        return $this->hasMany(ProductionOrder::class, 'wa_lead_id');
    }
}
