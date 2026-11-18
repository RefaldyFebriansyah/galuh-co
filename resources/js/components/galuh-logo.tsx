interface GaluhLogoProps {
    className?: string;
    variant?: 'dark' | 'light' | 'gold' | 'white';
    showText?: boolean;
    textClassName?: string;
    src?: string;
}

export function GaluhLogo({
    className = 'h-10 w-auto md:h-11',
    variant = 'gold',
    showText = true,
    textClassName = '',
    src,
}: GaluhLogoProps) {
    const isWhite = variant === 'light' || variant === 'white';
    const logoSrc =
        src ||
        (isWhite
            ? '/images/galuh_logo_white.png'
            : '/images/galuh_logo_gold.png');

    return (
        <div className="inline-flex items-center gap-6 text-left sm:gap-7">
            <img
                src={logoSrc}
                alt="GALUH & CO. Hampers & Gift"
                className={`object-contain ${className}`}
                loading="eager"
            />
            {showText && (
                <div
                    className={`flex flex-col pl-1 text-left sm:pl-2 ${textClassName}`}
                >
                    <span
                        className={`font-serif text-base font-bold tracking-[0.16em] uppercase md:text-lg ${
                            isWhite ? 'text-white' : 'text-[#1A1815]'
                        }`}
                    >
                        GALUH &amp; CO
                    </span>
                    <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="h-px w-3 bg-[#C5A880]/60" />
                        <span className="text-[7.5px] font-bold tracking-[0.22em] text-[#C5A880] uppercase md:text-[8.5px]">
                            HAMPERS &amp; GIFT
                        </span>
                        <span className="h-px w-3 bg-[#C5A880]/60" />
                    </div>
                </div>
            )}
        </div>
    );
}
