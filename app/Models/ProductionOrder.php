<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $order_code
 * @property int|null $wa_lead_id
 * @property string $client_name
 * @property string|null $company_name
 * @property string|null $package_name
 * @property int $quantity
 * @property string|null $greeting_card_text
 * @property string $greeting_card_status
 * @property array<string>|null $engraving_names
 * @property string $engraving_status
 * @property Carbon|null $target_delivery_date
 * @property string $stage
 * @property string $priority
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'order_code',
    'wa_lead_id',
    'client_name',
    'company_name',
    'package_name',
    'quantity',
    'greeting_card_text',
    'greeting_card_status',
    'engraving_names',
    'engraving_status',
    'target_delivery_date',
    'stage',
    'priority',
    'notes',
])]
class ProductionOrder extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'engraving_names' => 'array',
            'target_delivery_date' => 'date',
        ];
    }

    /**
     * Associated lead.
     *
     * @return BelongsTo<WaLead, $this>
     */
    public function waLead(): BelongsTo
    {
        return $this->belongsTo(WaLead::class, 'wa_lead_id');
    }
}
