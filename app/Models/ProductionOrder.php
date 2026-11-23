<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    use HasFactory;

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
     */
    public function waLead(): BelongsTo
    {
        return $this->belongsTo(WaLead::class, 'wa_lead_id');
    }
}
