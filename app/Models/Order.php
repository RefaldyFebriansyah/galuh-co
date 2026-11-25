<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $order_number
 * @property int $user_id
 * @property string $order_type
 * @property string|null $company_name
 * @property string $recipient_name
 * @property string $recipient_phone
 * @property string $shipping_address
 * @property string|null $city
 * @property string|null $postal_code
 * @property Carbon|null $needed_at
 * @property string|null $greeting_card_text
 * @property string|null $engraving_name
 * @property int $total_quantity
 * @property int $subtotal
 * @property int $shipping_cost
 * @property int $total_amount
 * @property string $payment_status
 * @property string $status
 * @property string|null $tracking_number
 * @property string|null $shipping_courier
 * @property string $shipping_status
 * @property string|null $customer_notes
 * @property string|null $admin_notes
 * @property string $formatted_total
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'order_number',
    'user_id',
    'order_type',
    'company_name',
    'recipient_name',
    'recipient_phone',
    'shipping_address',
    'city',
    'postal_code',
    'needed_at',
    'greeting_card_text',
    'engraving_name',
    'total_quantity',
    'subtotal',
    'shipping_cost',
    'total_amount',
    'payment_status',
    'status',
    'tracking_number',
    'shipping_courier',
    'shipping_status',
    'customer_notes',
    'admin_notes',
])]
class Order extends Model
{
    protected $appends = [
        'formatted_total',
    ];

    protected function casts(): array
    {
        return [
            'needed_at' => 'date',
            'total_quantity' => 'integer',
            'subtotal' => 'integer',
            'shipping_cost' => 'integer',
            'total_amount' => 'integer',
        ];
    }

    /**
     * Format total amount to Rupiah
     *
     * @return Attribute<string, never>
     */
    protected function formattedTotal(): Attribute
    {
        return Attribute::make(
            get: fn () => 'Rp '.number_format($this->total_amount, 0, ',', '.'),
        );
    }

    /**
     * Get the user that owns the order.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get items in the order.
     *
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get tracking logs for the order.
     *
     * @return HasMany<TrackingLog, $this>
     */
    public function trackingLogs(): HasMany
    {
        return $this->hasMany(TrackingLog::class)->orderBy('logged_at', 'asc');
    }

    /**
     * Helper to generate a unique order number.
     */
    public static function generateOrderNumber(): string
    {
        $prefix = 'GLH-'.date('Ymd');
        $random = strtoupper(substr(uniqid(), -4));

        return "{$prefix}-{$random}";
    }

    /**
     * Helper to generate a unique tracking receipt number (Nomor Resi).
     */
    public static function generateTrackingNumber(): string
    {
        return 'GLH-RES-'.date('ymd').'-'.rand(1000, 9999);
    }
}
