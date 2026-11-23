/**
 * Silent WhatsApp Lead Tracker for Galuh & Co.
 * Logs click events from Catalog, Hero Customizer, Floating WA, and Corporate buttons
 * without hindering navigation to wa.me.
 */

interface TrackWaLeadPayload {
    source: 'hero_customizer' | 'catalog_corporate' | 'catalog_personal' | 'floating_wa' | 'festive_banner' | string;
    package_name?: string;
    client_name?: string;
    company_name?: string;
    wa_number?: string;
    estimated_packages?: string;
    greeting_card_message?: string;
    engraving_name?: string;
    notes?: string;
}

export function trackWaLead(payload: TrackWaLeadPayload): void {
    try {
        const csrfToken =
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

        const bodyData = JSON.stringify(payload);

        // Try beacon or keepalive fetch
        if (typeof fetch === 'function') {
            fetch('/track-wa-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: bodyData,
                keepalive: true,
            }).catch(() => {
                // Silently ignore network failures to avoid blocking user flow
            });
        }
    } catch {
        // Silently ignore
    }
}
