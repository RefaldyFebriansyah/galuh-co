<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'question',
    'answer',
    'category',
    'sort_order',
    'is_active',
])]
class Faq extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Standard landing page FAQs.
     *
     * @return array<int, array{question: string, answer: string, category: string, sort_order: int, is_active: bool}>
     */
    public static function defaultFaqs(): array
    {
        return [
            [
                'question' => '1. Berapa minimum pemesanan untuk hampers corporate / grosir?',
                'answer' => 'Pemesanan paket corporate dengan harga grosir resmi di website minimal 25 paket. Anda dapat menginput jumlah sendiri atau memilih preset yang tersedia, dan harga per paket otomatis menyesuaikan harga corporate.',
                'category' => 'pemesanan',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'question' => '2. Apakah bisa mengirimkan hampers ke banyak alamat berbeda di seluruh Indonesia?',
                'answer' => 'Ya, kami melayani sistem pengiriman multi-destination ke alamat rumah penerima maupun kantor cabang di seluruh Indonesia, lengkap dengan pelacakan nomor resi pengiriman.',
                'category' => 'pengiriman',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'question' => '3. Berapa lama estimasi waktu pengerjaan pesanan?',
                'answer' => 'Koleksi siap kirim dapat dikirimkan H+1. Untuk pesanan personal membutuhkan 1-2 hari kerja, dan proyek korporat besar membutuhkan 5-10 hari kerja tergantung jumlah dan detail kustomisasi.',
                'category' => 'pemesanan',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'question' => '4. Bagaimana cara melacak status pesanan yang telah dibuat?',
                'answer' => 'Setelah Anda melakukan pemesanan di website, sistem otomatis menerbitkan Nomor Resi. Anda dapat memantau setiap tahapan pengerjaan studio hingga kurir tiba melalui menu "Lacak Pesanan" di navigasi website.',
                'category' => 'pemesanan',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'question' => '5. Apakah kartu ucapan berstempel wax seal disertakan secara gratis?',
                'answer' => 'Ya, setiap paket hampers GALUH & CO. sudah termasuk kartu ucapan personal berstempel segel lilin wax mewah sesuai teks ucapan yang Anda tuliskan saat pemesanan.',
                'category' => 'custom_branding',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'question' => '6. Metode pembayaran apa saja yang diterima?',
                'answer' => 'Kami menerima pembayaran transfer bank, e-wallet, kartu kredit, serta invoice resmi bagi klien perusahaan yang telah terverifikasi.',
                'category' => 'pembayaran',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];
    }

    /**
     * Seed default FAQs if table is empty.
     */
    public static function seedDefaultsIfEmpty(): void
    {
        if (static::count() === 0) {
            foreach (static::defaultFaqs() as $faq) {
                static::create($faq);
            }
        }
    }
}
