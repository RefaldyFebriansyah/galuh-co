import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import { HeroBackgroundAnimation } from '@/components/hero-background-animation';
import { AboutSection } from '@/components/sections/about-section';
import { CorporateGifting } from '@/components/sections/CorporateGifting';
import { FaqSection } from '@/components/sections/faq-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { FooterSection } from '@/components/sections/footer-section';
import { Hero } from '@/components/sections/Hero';
import { HowToOrder } from '@/components/sections/HowToOrder';
import { Navbar } from '@/components/sections/navbar';
import { Catalog } from '@/components/sections/Catalog';
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

    const safeProducts: Product[] = Array.isArray(products)
        ? products
        : products && typeof products === 'object'
          ? Object.values(products)
          : [];

    return (
        <MotionConfig reducedMotion="user">
            <Head title="GALUH & CO. — Hampers Premium & Corporate Gifting" />

            <div className="relative min-h-screen bg-[#FAF7F2] font-sans text-[#1A1815] selection:bg-[#C59746] selection:text-white">
                {/* Subtle Luxury Paper Grain Texture Overlay (Opacity ~2.5%, Quiet Luxury Invitation Paper) */}
                <div
                    className="paper-texture pointer-events-none fixed inset-0 z-30 opacity-[0.03] mix-blend-multiply"
                    aria-hidden="true"
                />

                {/* Fixed Top Luxury Sticky Header: Stays at the top of the viewport when scrolling */}
                <Navbar
                    whatsappNumber={activeWa}
                    logoSrc={settings?.logo_gold}
                />

                {/* 1 & 2. Continuous Hero Area with 3D Background */}
                <div className="relative overflow-hidden bg-[#FAF7F2]">
                    <HeroBackgroundAnimation />
                    <Hero
                        whatsappNumber={activeWa}
                        heroBadge={settings?.hero_badge}
                        heroTitlePrefix={settings?.hero_title_prefix}
                        heroDescription={settings?.hero_description}
                    />
                </div>

                {/* 3. Tentang Brand */}
                <AboutSection />

                {/* 4. Koleksi Hampers (Database Products with Filter) */}
                <Catalog products={safeProducts} whatsappNumber={activeWa} />

                {/* 5. Kenapa Memilih Kami & Metrik Stats */}
                <FeaturesSection />

                {/* 6. Cara Pesan 4 Langkah */}
                <HowToOrder />

                {/* 7. Corporate Gifting & Inquiry Form */}
                <CorporateGifting whatsappNumber={activeWa} />

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
        </MotionConfig>
    );
}
