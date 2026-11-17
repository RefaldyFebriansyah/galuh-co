import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
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
}

export default function Welcome({
    products = [],
    whatsappNumber = '6281572414233',
}: WelcomeProps) {
    useEffect(() => {
        // Ensure luxury ivory brand theme is active on landing page
        document.documentElement.classList.remove('dark');
    }, []);

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

                {/* 1. Navbar */}
                <Navbar whatsappNumber={whatsappNumber} />

                {/* 2. Hero Section */}
                <HeroSection whatsappNumber={whatsappNumber} />

                {/* 3. Tentang Brand */}
                <AboutSection />

                {/* 4. Koleksi Hampers (Database Products with Filter) */}
                <ProductsSection
                    products={products}
                    whatsappNumber={whatsappNumber}
                />

                {/* 5. Kenapa Memilih Kami & Metrik Stats */}
                <FeaturesSection />

                {/* 6. Cara Pesan 4 Langkah */}
                <StepsSection />

                {/* 7. Corporate Gifting & Inquiry Form */}
                <CorporateSection whatsappNumber={whatsappNumber} />

                {/* 8. Testimoni Pelanggan */}
                <TestimonialsSection />

                {/* 9. FAQ Accordion */}
                <FaqSection />

                {/* 10. CTA Penutup & Footer */}
                <FooterSection whatsappNumber={whatsappNumber} />

                {/* Floating WhatsApp CTA (Pojok Kanan Bawah) */}
                <FloatingWhatsApp whatsappNumber={whatsappNumber} />
            </div>
        </>
    );
}
