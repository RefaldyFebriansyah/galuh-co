import type { Transition, Variants } from 'motion/react';

/**
 * GALUH & CO. - Editorial Luxury Motion Architecture
 *
 * Rules:
 * 1. Durasi 0.3s - 0.8s
 * 2. Easing lembut (easeOut / smooth spring)
 * 3. Scroll animation runs once (viewport: { once: true })
 * 4. Strictly GPU-accelerated: ONLY transform & opacity (never width, height, top, left)
 * 5. Respect prefers-reduced-motion via <MotionConfig reducedMotion="user">
 */

// 1. Timing and Easing Presets (0.3s - 0.8s)
export const transitionFast: Transition = {
    duration: 0.35,
    ease: [0.16, 1, 0.3, 1], // Crisp snappy easeOut
};

export const transitionBase: Transition = {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1], // Natural luxury ease
};

export const transitionSlow: Transition = {
    duration: 0.75,
    ease: [0.19, 1, 0.22, 1], // Elegant stately easeOut
};

export const transitionSpring: Transition = {
    type: 'spring',
    stiffness: 220,
    damping: 22,
    mass: 0.8,
};

export const transitionGentleSpring: Transition = {
    type: 'spring',
    stiffness: 130,
    damping: 18,
    mass: 0.9,
};

// 2. Default Viewport Config for Scroll Triggers (Strictly once: true)
export const viewportOnce = {
    once: true,
    amount: 0.1,
} as const;

export const viewportEager = {
    once: true,
    amount: 0.05,
} as const;

// 3. Reusable Variants (Transform & Opacity Only)
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: transitionBase,
    },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transitionBase,
    },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -22 },
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
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: transitionBase,
    },
};

// 4. Staggered Container for Grids & Lists
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.05,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transitionBase,
    },
};

// 5. Interactive Micro-Interactions (GPU-Friendly)
export const cardHover = {
    rest: { y: 0, scale: 1 },
    hover: {
        y: -5,
        scale: 1.012,
        transition: transitionFast,
    },
    tap: {
        scale: 0.99,
        transition: transitionFast,
    },
};

export const buttonTap = {
    rest: { scale: 1 },
    hover: { scale: 1.025, transition: transitionFast },
    tap: { scale: 0.97, transition: transitionFast },
};

export const floatingVisual: Variants = {
    animate: {
        y: [-3, 5, -3],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const pulseGlow: Variants = {
    animate: {
        opacity: [0.6, 1, 0.6],
        scale: [0.98, 1.02, 0.98],
        transition: {
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
