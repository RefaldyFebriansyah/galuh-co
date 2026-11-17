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
            <motion.a
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3.5 text-xs font-semibold text-white shadow-2xl transition-all duration-300 hover:bg-[#20ba5a] hover:shadow-[0_8px_30px_rgb(37,211,102,0.4)]"
            >
                <WhatsAppIcon className="size-5 text-white" />
                <span className="hidden sm:inline">Pesan via WhatsApp</span>
            </motion.a>
        </aside>
    );
}
