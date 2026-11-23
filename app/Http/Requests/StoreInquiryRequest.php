<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInquiryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:1000'],
            'order_type' => ['nullable', 'string', 'max:50'],
            'estimated_packages' => [$this->input('order_type') === 'personal' ? 'nullable' : 'required', 'string', 'max:255'],
            'budget_per_package' => ['nullable', 'string', 'max:255'],
            'needed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'website' => ['nullable', 'prohibited'], // Honeypot field
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid. Pastikan menyertakan @ dan domain yang benar (contoh: nama@gmail.com).',
            'whatsapp_number.required' => 'Nomor WhatsApp aktif wajib diisi.',
            'whatsapp_number.min' => 'Nomor WhatsApp minimal 9 digit.',
            'estimated_packages.required' => 'Estimasi jumlah paket hampers wajib dipilih.',
            'needed_at.date' => 'Format tanggal kebutuhan event tidak valid.',
            'website.prohibited' => 'Pengiriman formulir terdeteksi tidak valid.',
        ];
    }
}
