<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $order_id
 * @property int|null $product_id
 * @property string $customer_name
 * @property string|null $customer_title
 * @property int $rating
 * @property string $comment
 * @property int $likes_count
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id',
    'order_id',
    'product_id',
    'customer_name',
    'customer_title',
    'rating',
    'comment',
    'likes_count',
    'is_published',
])]
class Review extends Model
{
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'likes_count' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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

    /**
     * @return HasMany<ReviewLike, $this>
     */
    public function likes(): HasMany
    {
        return $this->hasMany(ReviewLike::class);
    }
}
