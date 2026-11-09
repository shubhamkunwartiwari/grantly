import React from 'react';

interface VisualProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Alt text is strictly required. Pass empty string only when element is explicitly decorative.
   */
  alt: string;
  fallbackText?: string;
  className?: string;
}

export const Visual: React.FC<VisualProps> = ({
  alt,
  fallbackText,
  className = '',
  src,
  ...rest
}) => {
  const [hasError, setHasError] = React.useState(!src);

  if (hasError || !src) {
    return (
      <div
        className={`bg-surface-raised border border-border-hairline rounded-[12px] flex items-center justify-center text-ink-muted text-xs p-4 text-center select-none ${className}`}
        role={alt ? 'img' : 'presentation'}
        aria-label={alt || undefined}
        aria-hidden={!alt}
      >
        <span>{fallbackText || alt || 'Grantly visual asset'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === ''}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`rounded-[12px] object-cover ${className}`}
      {...rest}
    />
  );
};
