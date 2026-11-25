import { Head } from '@inertiajs/react';
import React, { Suspense, lazy, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { Hero } from '@/components/sections/Hero';
import { Navbar } from '@/components/sections/navbar';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import type { Product } from '@/types';

// Code-splitting non-critical components via React.lazy to minimize TBT and initial bundle size
const HeroBackgroundAnimation = lazy(() =>
    import('@/components/hero-background-animation').then((mod) => ({
        default: mod.HeroBackgroundAnimation,
    })),
);
const AboutSection = lazy(() => import('@/components/sections/about-section'));
const Catalog = lazy(() => import('@/components/sections/Catalog'));
const FeaturesSection = lazy(
    () => import('@/components/sections/features-section'),
);
const HowToOrder = lazy(() => import('@/components/sections/HowToOrder'));
const CorporateGifting = lazy(
    () => import('@/components/sections/CorporateGifting'),
);
const TestimonialsSection = lazy(
    () => import('@/components/sections/testimonials-section'),
);
const FaqSection = lazy(() => import('@/components/sections/faq-section'));
const StudioLocationSection = lazy(
    () => import('@/components/sections/studio-location-section'),
);
const FooterSection = lazy(
    () => import('@/components/sections/footer-section'),
);

interface WelcomeProps {
    products?: Product[];
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
        active_event?: string;
        event_banner_title?: string;
        event_banner_subtitle?: string;
        event_banner_image?: string;
        event_banner_active?: boolean;
        hero_eyebrow?: string;
        hero_title?: string;
        hero_subtitle?: string;
        hero_tagline?: string;
        hero_floating_image_left?: string;
        hero_floating_image_right?: string;
        hero_rotating_words?: string[];
        hero_marquee_text?: string;
        about_badge?: string;
        about_title?: string;
        about_description?: string;
        about_pillars?: any[];
        catalog_badge?: string;
        catalog_title?: string;
        catalog_subtitle?: string;
        atelier_badge?: string;
        atelier_title?: string;
        atelier_subtitle?: string;
        atelier_cards?: any[];
        order_guide_badge?: string;
        order_guide_title?: string;
        order_guide_subtitle?: string;
        order_guide_steps?: any[];
        studio_gmaps_embed?: string;
        footer_bio?: string;
    };
    dynamicStats?: {
        total_hampers_sold: number;
        total_corporate_clients: number;
        average_rating: number;
        total_reviews: number;
    };
    reviews?: any[];
    userCanReview?: boolean;
    activeEvent?: string;
    faqs?: any[];
    whatsappNumber?: string;
}

export default function Welcome({
    products = [],
    settings,
    dynamicStats,
    reviews = [],
    userCanReview = false,
    activeEvent,
    faqs = [],
    whatsappNumber,
}: WelcomeProps) {
    useEffect(() => {
        // Ensure luxury ivory brand theme is active on landing page
        document.documentElement.classList.remove('dark');
    }, []);

    const rawWa = (
        settings?.whatsapp_number ||
        whatsappNumber ||
        '6281572414233'
    ).trim();
    const cleanDigits = rawWa.replace(/\D/g, '');
    const resolvedWhatsappNumber = cleanDigits.startsWith('0')
        ? `62${cleanDigits.slice(1)}`
        : cleanDigits || '6281572414233';

    const safeProducts: Product[] = Array.isArray(products)
        ? products
        : products && typeof products === 'object'
          ? Object.values(products)
          : [];

    return (
        <MotionConfig reducedMotion="user">
            <Head title="GALUH & CO. — Hampers Premium & Corporate Gifting" />

            <div className="relative min-h-screen bg-[#F2EBDC] font-sans text-[#16233B] selection:bg-[#A88B54] selection:text-white">
                {/* Fixed Top Luxury Sticky Header */}
                <Navbar logoSrc={settings?.logo_gold} />

                {/* Semantic Landmark: <main> wrapping all primary landing page sections */}
                <main id="main-content">
                    {/* 1 & 2. Continuous Hero Area with 3D Background */}
                    <div className="relative overflow-hidden bg-[#F2EBDC]">
                        <Suspense fallback={null}>
                            <HeroBackgroundAnimation />
                        </Suspense>
                        <Hero
                            heroBadge={settings?.hero_badge}
                            heroTitlePrefix={settings?.hero_title_prefix}
                            heroDescription={settings?.hero_description}
                            activeEdition={settings?.active_edition}
                            heroEyebrow={settings?.hero_eyebrow}
                            heroTitle={settings?.hero_title}
                            heroSubtitle={settings?.hero_subtitle}
                            heroTagline={settings?.hero_tagline}
                            heroFloatingImageLeft={
                                settings?.hero_floating_image_left
                            }
                            heroFloatingImageRight={
                                settings?.hero_floating_image_right
                            }
                            heroRotatingWords={settings?.hero_rotating_words}
                            heroMarqueeText={settings?.hero_marquee_text}
                            dynamicStats={dynamicStats}
                            whatsappNumber={resolvedWhatsappNumber}
                        />
                    </div>

                    {/* Below-the-fold sections lazily loaded in isolated Suspense boundaries */}
                    {/* 3. Tentang Brand (3 Pilar Filosofi Kriya dari CMS) */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <AboutSection
                            badge={settings?.about_badge}
                            title={settings?.about_title}
                            description={settings?.about_description}
                            pillars={settings?.about_pillars}
                        />
                    </Suspense>

                    {/* 4. Koleksi Hampers (Database Products with Filter & Direct Order) */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <Catalog
                            products={safeProducts}
                            activeEdition={settings?.active_edition}
                            catalogBadge={settings?.catalog_badge}
                            catalogTitle={settings?.catalog_title}
                            catalogSubtitle={settings?.catalog_subtitle}
                            activeEvent={activeEvent || settings?.active_event}
                            eventBannerTitle={settings?.event_banner_title}
                            eventBannerSubtitle={
                                settings?.event_banner_subtitle
                            }
                            eventBannerImage={settings?.event_banner_image}
                            eventBannerActive={settings?.event_banner_active}
                        />
                    </Suspense>

                    {/* 5. Kenapa Memilih Kami & Metrik Stats Nyata Mulai dari 0 */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <FeaturesSection
                            dynamicStats={dynamicStats}
                            atelierBadge={settings?.atelier_badge}
                            atelierTitle={settings?.atelier_title}
                            atelierSubtitle={settings?.atelier_subtitle}
                            atelierCards={settings?.atelier_cards}
                        />
                    </Suspense>

                    {/* 6. Cara Pesan 4 Langkah */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <HowToOrder
                            orderGuideBadge={settings?.order_guide_badge}
                            orderGuideTitle={settings?.order_guide_title}
                            orderGuideSubtitle={settings?.order_guide_subtitle}
                            orderGuideSteps={settings?.order_guide_steps}
                        />
                    </Suspense>

                    {/* 7. Corporate Gifting & Direct B2B Order Form */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <CorporateGifting
                            products={safeProducts}
                            whatsappNumber={resolvedWhatsappNumber}
                        />
                    </Suspense>

                    {/* 8. Testimoni Pelanggan Interaktif (Google Review Style) */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <TestimonialsSection
                            reviews={reviews}
                            userCanReview={userCanReview}
                        />
                    </Suspense>

                    {/* 9. FAQ Accordion (Dari Database FAQ CMS) */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <FaqSection faqs={faqs} />
                    </Suspense>

                    {/* 10. Peta Lokasi Produksi Studio Tepat di Atas Footer */}
                    <Suspense
                        fallback={
                            <div className="min-h-[300px]" aria-hidden="true" />
                        }
                    >
                        <StudioLocationSection
                            address={settings?.company_address}
                            operationalHours={settings?.operational_hours}
                            phone={settings?.contact_phone}
                            gmapsEmbed={settings?.studio_gmaps_embed}
                        />
                    </Suspense>
                </main>

                {/* 11. CTA Penutup & Footer */}
                <Suspense
                    fallback={
                        <div className="min-h-[300px]" aria-hidden="true" />
                    }
                >
                    <FooterSection
                        logoSrc={settings?.logo_white}
                        contactEmail={settings?.contact_email}
                        contactPhone={settings?.contact_phone}
                        whatsappNumber={resolvedWhatsappNumber}
                        companyAddress={settings?.company_address}
                        operationalHours={settings?.operational_hours}
                        instagramUrl={settings?.instagram_url}
                        tiktokUrl={settings?.tiktok_url}
                        linkedinUrl={settings?.linkedin_url}
                        footerBio={settings?.footer_bio}
                    />
                </Suspense>

                {/* Floating WhatsApp Consultation Button (ikut bergulir saat halaman di-scroll) */}
                <FloatingWhatsApp whatsappNumber={resolvedWhatsappNumber} />
            </div>
        </MotionConfig>
    );
}
