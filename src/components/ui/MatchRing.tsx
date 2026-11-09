import React from 'react';

interface MatchRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export const MatchRing: React.FC<MatchRingProps> = ({
  score,
  size = 54,
  strokeWidth = 3.5,
  showLabel = true,
  className = '',
}) => {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Match score: ${clampedScore}%`}
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Pale track background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border-hairline"
        />
        {/* Saffron accent progress indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-accent-saffron transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className="absolute font-serif text-ink-primary font-medium tracking-tight tabular-nums select-none"
          style={{ fontSize: `${Math.round(size * 0.32)}px` }}
        >
          {clampedScore}
          <span className="text-[0.65em] opacity-75 font-sans font-normal ml-px">%</span>
        </span>
      )}
    </div>
  );
};
