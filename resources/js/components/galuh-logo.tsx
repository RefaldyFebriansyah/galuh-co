interface GaluhLogoProps {
    className?: string;
    variant?: 'dark' | 'light' | 'gold' | 'white';
}

export function GaluhLogo({
    className = 'h-10 md:h-11 w-auto',
    variant = 'gold',
}: GaluhLogoProps) {
    const isWhite = variant === 'light' || variant === 'white';
    const logoSrc = isWhite
        ? '/images/galuh_logo_white.png'
        : '/images/galuh_logo_gold.png';

    return (
        <div className="inline-flex items-center">
            <img
                src={logoSrc}
                alt="GALUH & CO. Hampers & Gift"
                className={`object-contain ${className}`}
                loading="eager"
            />
        </div>
    );
}
