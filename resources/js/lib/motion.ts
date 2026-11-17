import type { Transition, Variants } from 'motion/react';

/**
 * GALUH & CO. - Motion Architecture
 *
 * Rules:
 * 1. Durasi 0.3s - 0.8s
 * 2. Easing halus (easeOut / spring lembut)
 * 3. Scroll animation runs once (viewport: { once: true })
 * 4. Strictly GPU-accelerated: ONLY transform & opacity (never width/height/top/left)
 * 5. Respect prefers-reduced-motion via <MotionConfig reducedMotion="user">
 */

// Timing and Easing Presets (0.3s - 0.8s)
export const transitionFast: Transition = {
    duration: 0.3,
    ease: [0.16, 1, 0.3, 1], // Smooth snappy easeOut
};

export const transitionBase: Transition = {
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1], // Refined natural ease
};

export const transitionSlow: Transition = {
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1], // Elegant luxury easeOut
};

export const transitionSpring: Transition = {
    type: 'spring',
    stiffness: 260,
    damping: 24,
    mass: 0.8,
};

export const transitionGentleSpring: Transition = {
    type: 'spring',
    stiffness: 140,
    damping: 18,
    mass: 0.9,
};

// Default Viewport config for scroll triggers (always once: true, eager trigger)
export const viewportOnce = {
    once: true,
    amount: 0.08,
} as const;

export const viewportHeader = {
    once: true,
    amount: 0.1,
} as const;

// Reusable Variants (strictly transform & opacity)
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: transitionBase,
    },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transitionBase,
    },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transitionBase,
    },
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: transitionBase,
    },
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: transitionBase,
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: transitionBase,
    },
};

// Staggered Container for Product Grids & Lists
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transitionBase,
    },
};

// Micro-interactions (hover & tap using transform only)
export const cardHover = {
    rest: { y: 0, scale: 1 },
    hover: {
        y: -6,
        scale: 1.015,
        transition: transitionFast,
    },
    tap: {
        scale: 0.99,
        transition: transitionFast,
    },
};

export const buttonTap = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: transitionFast },
    tap: { scale: 0.97, transition: transitionFast },
};

// Floating animation for luxury hampers hero visual
export const floatingVisual: Variants = {
    animate: {
        y: [-4, 6, -4],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
