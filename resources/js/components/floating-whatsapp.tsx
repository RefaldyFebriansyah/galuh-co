import { motion } from 'motion/react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

interface FloatingWhatsAppProps {
    whatsappNumber: string;
}

export function FloatingWhatsApp({ whatsappNumber }: FloatingWhatsAppProps) {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo GALUH & CO., saya tertarik bertanya mengenai koleksi hampers premium.',
    )}`;

    return (
        <aside
            className="fixed right-6 bottom-6 z-50 flex items-center"
            aria-label="Kontak WhatsApp Langsung"
        >
            {/* Entrance animation wrapper */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            >
                {/* Continuous gentle floating motion */}
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="relative flex items-center justify-center"
                >
                    {/* Sonar / Radar Pulse Ripple */}
                    <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#25D366]/40"
                        animate={{
                            scale: [1, 1.32],
                            opacity: [0.55, 0],
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: 'easeOut',
                        }}
                    />

                    {/* Ambient Glow Aura */}
                    <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-[#25D366]/30 blur-md"
                        animate={{
                            opacity: [0.35, 0.7, 0.35],
                        }}
                        transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Main Interactive Button */}
                    <motion.a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-[#25D366] px-5 py-3.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(37,211,102,0.35)] transition-all duration-300 hover:bg-[#20ba5a] hover:shadow-[0_12px_32px_rgba(37,211,102,0.48)]"
                    >
                        {/* Elegant Light Shimmer Sweep */}
                        <motion.span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                repeatDelay: 3.5,
                                ease: 'easeInOut',
                            }}
                        />

                        {/* WhatsApp Icon with Periodic Subtle Ringing Tilt */}
                        <motion.div
                            animate={{
                                rotate: [0, -12, 12, -8, 8, 0],
                                scale: [1, 1.12, 1.12, 1.05, 1],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                repeatDelay: 3.8,
                                ease: 'easeInOut',
                            }}
                            className="flex items-center justify-center"
                        >
                            <WhatsAppIcon className="size-5 text-white" />
                        </motion.div>

                        <span className="relative z-10 hidden font-medium tracking-wide sm:inline">
                            Pesan via WhatsApp
                        </span>
                    </motion.a>
                </motion.div>
            </motion.div>
        </aside>
    );
}
