<x-mail::message>
# Permintaan Penawaran Corporate Baru

Halo Tim GALUH & CO.,

Terdapat pengajuan penawaran *corporate hampers* baru yang masuk melalui formulir landing page:

<x-mail::panel>
**Detail Kontak Pemohon:**
- **Nama Lengkap:** {{ $inquiry->name }}
- **Perusahaan / Organisasi:** {{ $inquiry->company_name ?? '-' }}
- **Alamat Email:** [{{ $inquiry->email }}](mailto:{{ $inquiry->email }})
- **Nomor WhatsApp:** [{{ $inquiry->whatsapp_number }}](https://wa.me/{{ preg_replace('/[^0-9]/', '', $inquiry->whatsapp_number) }})

**Rincian Kebutuhan Hampers:**
- **Estimasi Jumlah Paket:** {{ $inquiry->estimated_packages }}
- **Estimasi Budget / Paket:** {{ $inquiry->budget_per_package ?? 'Sesuai Rekomendasi' }}
- **Tanggal Kebutuhan Event:** {{ $inquiry->needed_at ? $inquiry->needed_at->format('d F Y') : 'Segera' }}

**Catatan Khusus / Kustomisasi:**  
{{ $inquiry->notes ?: 'Tidak ada catatan tambahan.' }}
</x-mail::panel>

<x-mail::button :url="'https://wa.me/' . preg_replace('/[^0-9]/', '', $inquiry->whatsapp_number) . '?text=' . urlencode('Halo ' . $inquiry->name . ', terima kasih telah menghubungi GALUH & CO. terkait penawaran hampers perusahaan.')">
Hubungi Pemohon via WhatsApp
</x-mail::button>

Salam hangat,<br>
**{{ config('app.name', 'GALUH & CO.') }}**
</x-mail::message>
