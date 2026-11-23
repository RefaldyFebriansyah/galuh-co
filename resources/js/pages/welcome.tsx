import { Head } from '@inertiajs/react';
import React, { Suspense, lazy, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { HeroBackgroundAnimation } from '@/components/hero-background-animation';
import { Hero } from '@/components/sections/Hero';
import { Navbar } from '@/components/sections/navbar';
import type { Product } from '@/types';

// Code-splitting below-the-fold sections via React.lazy to reduce TBT and initial bundle size
const AboutSection = lazy(() => import('@/components/sections/about-section'));
const Catalog = lazy(() => import('@/components/sections/Catalog'));
const FeaturesSection = lazy(() => import('@/components/sections/features-section'));
const HowToOrder = lazy(() => import('@/components/sections/HowToOrder'));
const CorporateGifting = lazy(() => import('@/components/sections/CorporateGifting'));
const TestimonialsSection = lazy(() => import('@/components/sections/testimonials-section'));
const FaqSection = lazy(() => import('@/components/sections/faq-section'));
const FooterSection = lazy(() => import('@/components/sections/footer-section'));
const FloatingWhatsApp = lazy(() => import('@/components/floating-whatsapp'));

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
        active_edition?: string;
        hero_eyebrow?: string;
        hero_title?: string;
        hero_subtitle?: string;
        hero_tagline?: string;
        about_pillars?: any[];
    };
    testimonials?: any[];
    faqs?: any[];
}

export default function Welcome({
    products = [],
    whatsappNumber = '6281572414233',
    settings,
    testimonials = [],
    faqs = [],
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

            <div className="relative min-h-screen bg-[#FAF7F2] font-sans text-[#1A1815] selection:bg-[#7A5B24] selection:text-white">
                {/* Subtle Luxury Paper Grain Texture Overlay (Quiet Luxury Invitation Paper) */}
                <div
                    className="paper-texture pointer-events-none fixed inset-0 z-30 opacity-[0.03] mix-blend-multiply"
                    aria-hidden="true"
                />

                {/* Fixed Top Luxury Sticky Header (Eagerly loaded for immediate paint) */}
                <Navbar
                    whatsappNumber={activeWa}
                    logoSrc={settings?.logo_gold}
                />

                {/* Semantic Landmark: <main> wrapping all primary landing page sections */}
                <main id="main-content">
                    {/* 1 & 2. Continuous Hero Area with 3D Background (Eagerly loaded for instant LCP < 2.5s) */}
                    <div className="relative overflow-hidden bg-[#FAF7F2]">
                        <HeroBackgroundAnimation />
                        <Hero
                            whatsappNumber={activeWa}
                            heroBadge={settings?.hero_badge}
                            heroTitlePrefix={settings?.hero_title_prefix}
                            heroDescription={settings?.hero_description}
                            activeEdition={settings?.active_edition}
                            heroEyebrow={settings?.hero_eyebrow}
                            heroTitle={settings?.hero_title}
                            heroSubtitle={settings?.hero_subtitle}
                            heroTagline={settings?.hero_tagline}
                        />
                    </div>

                    {/* Below-the-fold sections lazily loaded in isolated Suspense boundaries */}
                    {/* 3. Tentang Brand (3 Pilar Filosofi Kriya dari CMS) */}
                    <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                        <AboutSection pillars={settings?.about_pillars} />
                    </Suspense>

                    {/* 4. Koleksi Hampers (Database Products with Filter) */}
                    <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                        <Catalog
                            products={safeProducts}
                            whatsappNumber={activeWa}
                            activeEdition={settings?.active_edition}
                        />
                    </Suspense>

                    {/* 5. Kenapa Memilih Kami & Metrik Stats */}
                    <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                        <FeaturesSection />
                    </Suspense>

                    {/* 6. Cara Pesan 4 Langkah */}
                    <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                        <HowToOrder />
                    </Suspense>

                    {/* 7. Corporate Gifting & Inquiry Form */}
                    <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                        <CorporateGifting whatsappNumber={activeWa} />
                    </Suspense>

                    {/* 8. Testimoni Pelanggan (Dari Database Testimonial CMS) */}
                    <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                        <TestimonialsSection testimonials={testimonials} />
                    </Suspense>

                    {/* 9. FAQ Accordion (Dari Database FAQ CMS) */}
                    <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
                        <FaqSection whatsappNumber={activeWa} faqs={faqs} />
                    </Suspense>
                </main>

                {/* 10. CTA Penutup & Footer (Semantic Landmark <footer>) */}
                <Suspense fallback={<div className="min-h-[300px]" aria-hidden="true" />}>
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
                </Suspense>

                {/* Floating WhatsApp CTA (Pojok Kanan Bawah) */}
                <Suspense fallback={null}>
                    <FloatingWhatsApp whatsappNumber={activeWa} />
                </Suspense>
            </div>
        </MotionConfig>
    );
}
