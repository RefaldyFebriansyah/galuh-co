<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $order_id
 * @property string $stage
 * @property string $title
 * @property string|null $description
 * @property string|null $location
 * @property Carbon $logged_at
 */
#[Fillable([
    'order_id',
    'stage',
    'title',
    'description',
    'location',
    'logged_at',
])]
class TrackingLog extends Model
{
    protected function casts(): array
    {
        return [
            'logged_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
