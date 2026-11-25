<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $order_id
 * @property int|null $product_id
 * @property string $product_name
 * @property int $unit_price
 * @property int $quantity
 * @property int $subtotal
 * @property string $formatted_unit_price
 * @property string $formatted_subtotal
 */
#[Fillable([
    'order_id',
    'product_id',
    'product_name',
    'unit_price',
    'quantity',
    'subtotal',
])]
class OrderItem extends Model
{
    protected $appends = [
        'formatted_unit_price',
        'formatted_subtotal',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'integer',
            'quantity' => 'integer',
            'subtotal' => 'integer',
        ];
    }

    /**
     * @return Attribute<string, never>
     */
    protected function formattedUnitPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => 'Rp '.number_format($this->unit_price, 0, ',', '.'),
        );
    }

    /**
     * @return Attribute<string, never>
     */
    protected function formattedSubtotal(): Attribute
    {
        return Attribute::make(
            get: fn () => 'Rp '.number_format($this->subtotal, 0, ',', '.'),
        );
    }

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
