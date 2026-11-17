interface GaluhLogoProps {
    className?: string;
    variant?: 'dark' | 'light' | 'gold';
}

export function GaluhLogo({
    className = 'h-10',
    variant = 'dark',
}: GaluhLogoProps) {
    const isLight = variant === 'light';

    return (
        <div className={`flex items-center gap-3.5 ${className}`}>
            {/* Intertwined Luxury Gold Monogram */}
            <div className="relative flex size-10 shrink-0 items-center justify-center">
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-full"
                >
                    {/* Outer Gold Crest / Emblem */}
                    <circle
                        cx="50"
                        cy="50"
                        r="46"
                        stroke="#C5A880"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="41"
                        stroke="#C5A880"
                        strokeWidth="0.8"
                        strokeOpacity="0.3"
                    />
                    {/* Intertwined Stylized G & Ampersand */}
                    <path
                        d="M58 32C52 26 40 26 34 32C26 40 26 58 34 66C42 74 54 74 60 67C65 61 65 52 65 52H48"
                        stroke="#C5A880"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M52 40C48 35 44 42 48 48C52 54 58 60 54 66C50 71 43 69 41 64"
                        stroke="#C5A880"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
                <span
                    className={`font-serif text-lg font-bold tracking-[0.2em] uppercase ${
                        isLight ? 'text-white' : 'text-[#1A1815]'
                    }`}
                >
                    GALUH & CO
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="h-px w-3 bg-[#C5A880]/60" />
                    <span className="text-[8px] font-medium tracking-[0.25em] text-[#C5A880] uppercase">
                        HAMPERS & GIFT
                    </span>
                    <span className="h-px w-3 bg-[#C5A880]/60" />
                </div>
            </div>
        </div>
    );
}
