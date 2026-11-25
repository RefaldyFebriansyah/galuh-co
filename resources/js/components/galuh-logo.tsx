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
            ? '/images/galuh_logo_white.webp'
            : '/images/galuh_logo_gold.webp');

    return (
        <div className="inline-flex shrink-0 items-center gap-2.5 text-left sm:gap-3">
            <img
                src={logoSrc}
                alt="GALUH & CO. Hampers & Gift"
                className={`shrink-0 object-contain ${className}`}
                loading="eager"
                decoding="async"
                width={44}
                height={44}
            />
            {showText && (
                <div
                    className={`flex shrink-0 flex-col text-left whitespace-nowrap ${textClassName}`}
                >
                    <span
                        className={`font-serif text-base font-bold tracking-[0.16em] whitespace-nowrap uppercase md:text-lg ${
                            isWhite ? 'text-white' : 'text-[#16233B]'
                        }`}
                    >
                        GALUH &amp; CO.
                    </span>
                    <div className="flex items-center gap-1.5 pt-0.5 whitespace-nowrap">
                        <span className="h-px w-2.5 bg-[#A88B54]/60" />
                        <span className="text-[7.5px] font-bold tracking-[0.22em] whitespace-nowrap text-[#A88B54] uppercase md:text-[8px]">
                            HAMPERS &amp; GIFT
                        </span>
                        <span className="h-px w-2.5 bg-[#A88B54]/60" />
                    </div>
                </div>
            )}
        </div>
    );
}
