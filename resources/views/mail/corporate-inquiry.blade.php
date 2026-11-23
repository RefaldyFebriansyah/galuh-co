<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifikasi Pesanan — GALUH &amp; CO.</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1C1917; -webkit-font-smoothing: antialiased; line-height: 1.5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F6F4EE; padding: 36px 12px;">
        <tr>
            <td align="center">
                <!-- Main Atelier Order Slip (Clean 560px Editorial Letterhead) -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E5DFD5; border-radius: 6px; overflow: hidden;">
                    
                    <!-- 1. Atelier Header (Pure Letterhead, No Big Dark Blocks) -->
                    <tr>
                        <td align="center" style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #EDE8E0;">
                            @if(file_exists(public_path('images/galuh_logo_gold.png')))
                                <img src="{{ $message->embed(public_path('images/galuh_logo_gold.png')) }}" alt="GALUH & CO." width="38" height="38" style="display: block; margin: 0 auto 10px; object-fit: contain;" />
                            @endif
                            <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: normal; letter-spacing: 0.22em; color: #0E2A1E; text-transform: uppercase;">
                                GALUH &amp; CO.
                            </div>
                            <div style="margin-top: 4px; font-size: 8.5px; font-weight: 600; letter-spacing: 0.24em; color: #8C8479; text-transform: uppercase;">
                                Atelier Bingkisan Artisanal
                            </div>
                        </td>
                    </tr>

                    <!-- 2. Order Reference & Date Bar -->
                    <tr>
                        <td style="background-color: #FAF8F5; padding: 12px 32px; border-bottom: 1px solid #EDE8E0;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 11px;">
                                <tr>
                                    <td align="left" style="color: #6E675F; font-weight: 500;">
                                        Tipe: <strong style="color: #0E2A1E;">{{ $inquiry->order_type === 'personal' ? 'Pesanan Personal' : 'Corporate B2B' }}</strong>
                                    </td>
                                    <td align="right" style="color: #8C8479; font-family: monospace; font-size: 10.5px;">
                                        REF: #GC-{{ date('ymd') }}-{{ str_pad((string)$inquiry->id, 3, '0', STR_PAD_LEFT) }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- 3. Slip Body -->
                    <tr>
                        <td style="padding: 28px 32px 24px;">
                            <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-weight: normal; color: #0E2A1E; margin-bottom: 6px;">
                                {{ $inquiry->order_type === 'personal' ? 'Lembar Pemesanan Personal' : 'Permintaan Penawaran Korporat' }}
                            </div>
                            <div style="font-size: 12px; color: #78716C; margin-bottom: 24px;">
                                Data reservasi yang diterima melalui situs galuh.co pada {{ now()->translatedFormat('d F Y, H:i') }} WIB.
                            </div>

                            <!-- Customer Information Table -->
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #1C1917; margin-bottom: 24px; font-size: 12.5px;">
                                <tr>
                                    <td colspan="2" style="padding: 10px 0 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; color: #7A5B24; text-transform: uppercase;">
                                        Data Pemesan
                                    </td>
                                </tr>
                                <tr>
                                    <td width="34%" style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4;">Nama Lengkap</td>
                                    <td width="66%" style="padding: 6px 0; font-weight: 600; color: #1C1917; border-bottom: 1px solid #F0ECE4;">{{ $inquiry->name }}</td>
                                </tr>
                                @if($inquiry->company_name)
                                <tr>
                                    <td style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4;">Perusahaan / Instansi</td>
                                    <td style="padding: 6px 0; font-weight: 500; color: #1C1917; border-bottom: 1px solid #F0ECE4;">{{ $inquiry->company_name }}</td>
                                </tr>
                                @endif
                                <tr>
                                    <td style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4;">Nomor WhatsApp</td>
                                    <td style="padding: 6px 0; border-bottom: 1px solid #F0ECE4;">
                                        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $inquiry->whatsapp_number) }}" style="color: #0E2A1E; font-weight: 600; text-decoration: none;">
                                            {{ $inquiry->whatsapp_number }}
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4;">Alamat Email</td>
                                    <td style="padding: 6px 0; border-bottom: 1px solid #F0ECE4;">
                                        <a href="mailto:{{ $inquiry->email }}" style="color: #0E2A1E; text-decoration: none;">
                                            {{ $inquiry->email }}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Shipping Destination Block -->
                            @if($inquiry->address)
                            <div style="background-color: #FAF8F5; border: 1px solid #EAE5DC; border-radius: 4px; padding: 14px 16px; margin-bottom: 24px;">
                                <div style="font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; color: #7A5B24; text-transform: uppercase; margin-bottom: 4px;">
                                    Tujuan Pengiriman
                                </div>
                                <div style="font-size: 12.5px; line-height: 1.55; color: #1C1917;">
                                    {{ $inquiry->address }}
                                </div>
                            </div>
                            @endif

                            <!-- Order Details Table -->
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid #1C1917; margin-bottom: 28px; font-size: 12.5px;">
                                <tr>
                                    <td colspan="2" style="padding: 10px 0 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; color: #7A5B24; text-transform: uppercase;">
                                        Rincian Kurasi
                                    </td>
                                </tr>
                                <tr>
                                    <td width="34%" style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4;">Jumlah Paket</td>
                                    <td width="66%" style="padding: 6px 0; font-weight: 600; color: #1C1917; border-bottom: 1px solid #F0ECE4;">{{ $inquiry->estimated_packages ?: '1 Paket' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4;">Alokasi Anggaran</td>
                                    <td style="padding: 6px 0; color: #1C1917; border-bottom: 1px solid #F0ECE4;">{{ $inquiry->budget_per_package ?? 'Sesuai Rekomendasi' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4;">Jadwal Kebutuhan</td>
                                    <td style="padding: 6px 0; color: #1C1917; border-bottom: 1px solid #F0ECE4;">{{ $inquiry->needed_at ? $inquiry->needed_at->translatedFormat('d F Y') : 'Segera' }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #78716C; border-bottom: 1px solid #F0ECE4; vertical-align: top;">Catatan / Kartu</td>
                                    <td style="padding: 6px 0; color: #1C1917; border-bottom: 1px solid #F0ECE4; line-height: 1.5;">
                                        {{ $inquiry->notes ?: '-' }}
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Action (Understated Editorial Button, No Speech Bubble or Sparkles) -->
                            <div style="text-align: center; margin-top: 28px; margin-bottom: 8px;">
                                <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $inquiry->whatsapp_number) }}?text={{ urlencode('Halo ' . $inquiry->name . ', saya dari Concierge GALUH & CO., mengonfirmasi terkait reservasi pesanan hampers Anda.') }}"
                                   style="display: inline-block; background-color: #0E2A1E; color: #FAF7F2; border-radius: 4px; padding: 12px 28px; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-decoration: none; text-transform: uppercase;">
                                    Hubungi Pemesan via WhatsApp &rarr;
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- 4. Quiet Luxury Footer -->
                    <tr>
                        <td align="center" style="background-color: #FAF8F5; border-top: 1px solid #EDE8E0; padding: 18px 32px; text-align: center;">
                            <div style="font-size: 10.5px; color: #8C8479; line-height: 1.5;">
                                Notifikasi internal atelier &bull; <strong>GALUH &amp; CO.</strong> &bull; Hak Cipta dilindungi.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
