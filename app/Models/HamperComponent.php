<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'category',
    'sku',
    'unit_cost',
    'stock_status',
    'description',
    'is_active',
])]
class HamperComponent extends Model
{
    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'formatted_unit_cost',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'unit_cost' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Format cost to Indonesian Rupiah (Rp X.XXX.XXX)
     *
     * @return Attribute<string, never>
     */
    protected function formattedUnitCost(): Attribute
    {
        return Attribute::make(
            get: fn (): string => 'Rp '.number_format((float) $this->unit_cost, 0, ',', '.'),
        );
    }
}
