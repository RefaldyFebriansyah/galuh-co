import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';

// Distribusi partikel emas yang terkurasi elegan (stardust / ambient shimmer)
const PARTICLES = [
    { id: 1, left: '8%', top: '22%', size: 14, char: '✦', delay: 0, duration: 6.2 },
    { id: 2, left: '18%', top: '65%', size: 9, char: '•', delay: 1.4, duration: 5.5 },
    { id: 3, left: '28%', top: '32%', size: 12, char: '⋆', delay: 0.8, duration: 7.1 },
    { id: 4, left: '44%', top: '16%', size: 11, char: '✦', delay: 2.1, duration: 6.8 },
    { id: 5, left: '52%', top: '78%', size: 8, char: '•', delay: 0.4, duration: 5.2 },
    { id: 6, left: '68%', top: '25%', size: 13, char: '⋆', delay: 1.8, duration: 7.4 },
    { id: 7, left: '82%', top: '55%', size: 10, char: '✦', delay: 2.7, duration: 6.0 },
    { id: 8, left: '91%', top: '20%', size: 8, char: '•', delay: 1.1, duration: 5.8 },
    { id: 9, left: '14%', top: '84%', size: 12, char: '⋆', delay: 2.3, duration: 6.5 },
    { id: 10, left: '60%', top: '45%', size: 10, char: '✦', delay: 0.9, duration: 6.3 },
    { id: 11, left: '36%', top: '88%', size: 9, char: '•', delay: 1.6, duration: 5.9 },
    { id: 12, left: '88%', top: '82%', size: 11, char: '⋆', delay: 2.5, duration: 7.0 },
];

export function HeroBackgroundAnimation() {
    // Mouse follower spring yang halus dan elegan
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { damping: 28, stiffness: 100 });
    const smoothMouseY = useSpring(mouseY, { damping: 28, stiffness: 100 });

    useEffect(() => {
        // Posisi awal di tengah atas layar sebelum mouse bergerak
        if (typeof window !== 'undefined') {
            mouseX.set(window.innerWidth * 0.45);
            mouseY.set(window.innerHeight * 0.35);
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
        >
            {/* 1. Interactive Mouse Spotlight (Subtle Warm Champagne Gold Glow) */}
            <motion.div
                className="absolute size-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 mix-blend-multiply blur-[100px]"
                style={{
                    x: smoothMouseX,
                    y: smoothMouseY,
                    background:
                        'radial-gradient(circle, rgba(197, 168, 128, 0.25) 0%, rgba(229, 186, 115, 0.10) 40%, transparent 70%)',
                }}
            />

            {/* 2. Floating Ambient Luxury Orb 1 (Kiri Atas - Warm Champagne Gold) */}
            <motion.div
                animate={{
                    x: [0, 40, -25, 0],
                    y: [0, -30, 25, 0],
                    scale: [1, 1.15, 0.95, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background:
                        'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(197, 168, 128, 0.10) 45%, transparent 70%)',
                }}
                className="absolute -top-16 -left-16 size-[560px] rounded-full blur-[100px] sm:size-[680px]"
            />

            {/* 3. Floating Ambient Luxury Orb 2 (Kanan Belakang Card - Emerald Forest Depth) */}
            <motion.div
                animate={{
                    x: [0, -35, 25, 0],
                    y: [0, 35, -25, 0],
                    scale: [1, 1.18, 0.92, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background:
                        'radial-gradient(circle, rgba(14, 42, 30, 0.08) 0%, rgba(22, 66, 47, 0.05) 45%, transparent 70%)',
                }}
                className="absolute top-1/4 -right-20 size-[600px] rounded-full blur-[110px] sm:size-[720px]"
            />

            {/* 4. Floating Ambient Luxury Orb 3 (Tengah Bawah - Amber Warmth) */}
            <motion.div
                animate={{
                    x: [0, 30, -30, 0],
                    y: [0, -20, 25, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                style={{
                    background:
                        'radial-gradient(circle, rgba(229, 186, 115, 0.12) 0%, rgba(197, 168, 128, 0.06) 50%, transparent 70%)',
                }}
                className="absolute -bottom-16 left-1/3 size-[480px] rounded-full blur-[90px]"
            />

            {/* 5. Flowing Silk Ribbon Hairline Waves (Garis Kurva Sutra Emas Eksklusif) */}
            <svg
                className="absolute inset-0 size-full opacity-[0.15]"
                viewBox="0 0 1440 900"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <motion.path
                    d="M-100 250 C 300 120, 650 420, 1100 200 C 1300 100, 1500 280, 1600 240"
                    stroke="#C5A880"
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                    initial={{ pathOffset: 0 }}
                    animate={{ pathOffset: [0, 1] }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
                <motion.path
                    d="M-100 680 C 250 540, 700 780, 1050 560 C 1300 420, 1500 620, 1600 580"
                    stroke="#0E2A1E"
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                    strokeDasharray="3 5"
                    initial={{ pathOffset: 0 }}
                    animate={{ pathOffset: [1, 0] }}
                    transition={{
                        duration: 42,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </svg>

            {/* 6. Floating Golden Stardust Particles (✦, ⋆, •) */}
            {PARTICLES.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute select-none font-serif text-[#C5A880]"
                    style={{
                        left: p.left,
                        top: p.top,
                        fontSize: `${p.size}px`,
                        textShadow: '0 0 10px rgba(197, 168, 128, 0.45)',
                    }}
                    animate={{
                        y: [0, -20, -38, -16, 0],
                        x: [0, 8, -6, 10, 0],
                        opacity: [0.15, 0.75, 0.35, 0.8, 0.15],
                        scale: [0.85, 1.25, 0.9, 1.2, 0.85],
                        rotate: [0, 25, -20, 15, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'easeInOut',
                    }}
                >
                    {p.char}
                </motion.div>
            ))}
        </div>
    );
}
