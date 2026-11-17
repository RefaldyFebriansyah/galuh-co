import { createInertiaApp } from '@inertiajs/react';
import { MotionConfig } from 'motion/react';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'GALUH & CO.';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    strictMode: true,
    withApp(app) {
        return <MotionConfig reducedMotion="user">{app}</MotionConfig>;
    },
    progress: {
        color: '#C5A880',
    },
});

// Set light theme on load
initializeTheme();
