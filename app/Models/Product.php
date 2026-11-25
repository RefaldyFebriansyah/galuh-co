<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $category
 * @property string $packaging
 * @property bool $is_halal
 * @property bool $is_featured_hero
 * @property string $visibility
 * @property string $short_description
 * @property array<int, string> $contents
 * @property int $price_from
 * @property int|null $corporate_price
 * @property string|null $event_tag
 * @property string $image
 * @property array<int, string>|null $images
 * @property int $sort_order
 * @property bool $is_active
 * @property string $formatted_price
 * @property string|null $formatted_corporate_price
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder<static> active()
 * @method static Builder<static> category(string $category)
 */
#[Fillable([
    'name',
    'slug',
    'category',
    'packaging',
    'is_halal',
    'is_featured_hero',
    'visibility',
    'short_description',
    'contents',
    'price_from',
    'corporate_price',
    'event_tag',
    'image',
    'images',
    'sort_order',
    'is_active',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'formatted_price',
        'formatted_corporate_price',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('landing_page_active_products_v4');
        });

        static::deleted(function () {
            Cache::forget('landing_page_active_products_v4');
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'contents' => 'array',
            'images' => 'array',
            'price_from' => 'integer',
            'corporate_price' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
            'is_halal' => 'boolean',
            'is_featured_hero' => 'boolean',
        ];
    }

    /**
     * Format price to Indonesian Rupiah (Rp X.XXX.XXX)
     *
     * @return Attribute<string, never>
     */
    protected function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => 'Rp '.number_format($this->price_from, 0, ',', '.'),
        );
    }

    /**
     * Format corporate wholesale price to Indonesian Rupiah
     *
     * @return Attribute<string|null, never>
     */
    protected function formattedCorporatePrice(): Attribute
    {
        return Attribute::make(
            get: function () {
                $price = $this->corporate_price ?: (int) ($this->price_from * 0.88); // Default 12% wholesale tier

                return 'Rp '.number_format($price, 0, ',', '.');
            },
        );
    }

    /**
     * Scope a query to only include active products.
     *
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by category.
     *
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Get reviews for this product.
     *
     * @return HasMany<Review, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
