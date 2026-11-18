import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import { HeroBackgroundAnimation } from '@/components/hero-background-animation';
import { AboutSection } from '@/components/sections/about-section';
import { CorporateSection } from '@/components/sections/corporate-section';
import { FaqSection } from '@/components/sections/faq-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { FooterSection } from '@/components/sections/footer-section';
import { HeroSection } from '@/components/sections/hero-section';
import { Navbar } from '@/components/sections/navbar';
import { ProductsSection } from '@/components/sections/products-section';
import { StepsSection } from '@/components/sections/steps-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import type { Product } from '@/types';

interface WelcomeProps {
    products?: Product[];
    whatsappNumber?: string;
    settings?: {
        whatsapp_number?: string;
        contact_email?: string;
        contact_phone?: string;
        company_address?: string;
        operational_hours?: string;
        instagram_url?: string;
        tiktok_url?: string;
        linkedin_url?: string;
        logo_gold?: string;
        logo_white?: string;
        hero_badge?: string;
        hero_title_prefix?: string;
        hero_description?: string;
    };
}

export default function Welcome({
    products = [],
    whatsappNumber = '6281572414233',
    settings,
}: WelcomeProps) {
    useEffect(() => {
        // Ensure luxury ivory brand theme is active on landing page
        document.documentElement.classList.remove('dark');
    }, []);

    const activeWa = settings?.whatsapp_number || whatsappNumber;

    return (
        <>
            <Head title="GALUH & CO. — Hampers Premium & Corporate Gifting" />

            <div className="relative min-h-screen bg-[#FAF7F2] font-sans text-[#1A1815] selection:bg-[#C59746] selection:text-white">
                {/* Subtle Luxury Paper Grain Texture Overlay (Opacity ~2.5%, Quiet Luxury Invitation Paper) */}
                <div
                    className="pointer-events-none fixed inset-0 z-30 opacity-[0.025] mix-blend-multiply"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                    }}
                    aria-hidden="true"
                />

                {/* 1 & 2. Continuous Hero Area: Navbar + Hero Section sharing one seamless animated luxury background */}
                <div className="relative overflow-hidden bg-[#FAF7F2]">
                    <HeroBackgroundAnimation />
                    <Navbar
                        whatsappNumber={activeWa}
                        logoSrc={settings?.logo_gold}
                    />
                    <HeroSection
                        whatsappNumber={activeWa}
                        heroBadge={settings?.hero_badge}
                        heroTitlePrefix={settings?.hero_title_prefix}
                        heroDescription={settings?.hero_description}
                    />
                    {/* Soft gradient fade into subsequent section */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#FAF7F2]" />
                </div>

                {/* 3. Tentang Brand */}
                <AboutSection />

                {/* 4. Koleksi Hampers (Database Products with Filter) */}
                <ProductsSection
                    products={products}
                    whatsappNumber={activeWa}
                />

                {/* 5. Kenapa Memilih Kami & Metrik Stats */}
                <FeaturesSection />

                {/* 6. Cara Pesan 4 Langkah */}
                <StepsSection />

                {/* 7. Corporate Gifting & Inquiry Form */}
                <CorporateSection whatsappNumber={activeWa} />

                {/* 8. Testimoni Pelanggan */}
                <TestimonialsSection />

                {/* 9. FAQ Accordion */}
                <FaqSection />

                {/* 10. CTA Penutup & Footer */}
                <FooterSection
                    whatsappNumber={activeWa}
                    logoSrc={settings?.logo_white}
                    contactEmail={settings?.contact_email}
                    contactPhone={settings?.contact_phone}
                    companyAddress={settings?.company_address}
                    operationalHours={settings?.operational_hours}
                    instagramUrl={settings?.instagram_url}
                    tiktokUrl={settings?.tiktok_url}
                    linkedinUrl={settings?.linkedin_url}
                />

                {/* Floating WhatsApp CTA (Pojok Kanan Bawah) */}
                <FloatingWhatsApp whatsappNumber={activeWa} />
            </div>
        </>
    );
}
