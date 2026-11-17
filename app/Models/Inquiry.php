<?php

namespace App\Models;

use Database\Factories\InquiryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $company_name
 * @property string $email
 * @property string $whatsapp_number
 * @property string $estimated_packages
 * @property string|null $budget_per_package
 * @property Carbon|string|null $needed_at
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'company_name',
    'email',
    'whatsapp_number',
    'estimated_packages',
    'budget_per_package',
    'needed_at',
    'notes',
])]
class Inquiry extends Model
{
    /** @use HasFactory<InquiryFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'needed_at' => 'date',
        ];
    }
}
