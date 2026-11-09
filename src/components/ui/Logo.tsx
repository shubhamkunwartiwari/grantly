import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showText = true,
}) => {
  // Dimensions
  let imgHeightClass = 'h-7 w-auto';
  let textSizeClass = 'text-2xl';

  if (size === 'sm') {
    imgHeightClass = 'h-5 w-auto';
    textSizeClass = 'text-lg';
  } else if (size === 'lg') {
    imgHeightClass = 'h-10 w-auto';
    textSizeClass = 'text-3xl';
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dual Theme Image Container:
          - Light mode displays logo_light.png (deep pine green on transparent)
          - Dark mode displays logo_dark.png (luminous warm ivory on transparent)
          - Also supports fallback to /assets/aistudio/image_6cd57641.png
      */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Light theme logo version */}
        <img
          src="/assets/aistudio/logo_light.png"
          alt="Grantly graduation cap mark"
          className={`${imgHeightClass} object-contain transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 block dark:hidden`}
          loading="eager"
        />

        {/* Dark theme logo version */}
        <img
          src="/assets/aistudio/logo_dark.png"
          alt="Grantly graduation cap mark"
          className={`${imgHeightClass} object-contain transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 hidden dark:block`}
          loading="eager"
        />
      </div>

      {/* Brand Wordmark Text */}
      {showText && variant === 'full' && (
        <span className={`font-serif tracking-tight text-ink-primary group-hover:text-brand-primary transition-colors duration-200 font-normal ${textSizeClass}`}>
          Grantly
        </span>
      )}
    </div>
  );
};
