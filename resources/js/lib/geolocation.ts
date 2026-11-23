/**
 * Helper to automatically detect user location using HTML5 Geolocation
 * and reverse-geocode into a human-readable address.
 */
export async function detectCurrentAddress(): Promise<string> {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        throw new Error('Fitur geolokasi tidak didukung oleh browser Anda.');
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse geocoding via OpenStreetMap Nominatim (supports Indonesian language results)
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=id`,
                        {
                            headers: {
                                Accept: 'application/json',
                            },
                        },
                    );

                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.display_name) {
                            resolve(data.display_name);
                            return;
                        }
                    }
                } catch {
                    // Network or CORS fallback
                }

                // Fallback to accurate coordinate link
                resolve(
                    `Lokasi GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (https://maps.google.com/?q=${latitude},${longitude})`,
                );
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(
                            new Error(
                                'Izin akses lokasi ditolak oleh browser. Anda dapat mengetik alamat pengiriman secara manual.',
                            ),
                        );
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(
                            new Error(
                                'Informasi lokasi GPS tidak tersedia dari perangkat Anda.',
                            ),
                        );
                        break;
                    case error.TIMEOUT:
                        reject(
                            new Error(
                                'Waktu pencarian lokasi GPS habis. Silakan coba lagi atau ketik manual.',
                            ),
                        );
                        break;
                    default:
                        reject(
                            new Error(
                                'Gagal mendeteksi lokasi secara otomatis.',
                            ),
                        );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            },
        );
    });
}
