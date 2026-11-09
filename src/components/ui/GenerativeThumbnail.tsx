import React, { useMemo } from 'react';

interface GenerativeThumbnailProps {
  id: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const GenerativeThumbnail: React.FC<GenerativeThumbnailProps> = ({
  id,
  className = '',
  aspectRatio = 'square',
}) => {
  const seed = useMemo(() => hashString(id), [id]);

  // Compute deterministic visual parameters
  const patternType = seed % 4; // 0: concentric arcs, 1: contour lines, 2: intersecting grid, 3: solar radius
  const baseHue = (seed * 37) % 360;
  const isSaffronDominant = (seed % 3) === 0;

  const bgFill = isSaffronDominant ? '#FAF4E8' : '#F2F6F3';
  const strokePrimary = isSaffronDominant ? '#D48624' : '#1C3829';
  const strokeSecondary = isSaffronDominant ? '#E89E36' : '#2D563F';

  const viewBox = aspectRatio === 'video' ? '0 0 240 135' : aspectRatio === 'wide' ? '0 0 320 120' : '0 0 160 160';
  const width = aspectRatio === 'video' ? 240 : aspectRatio === 'wide' ? 320 : 160;
  const height = aspectRatio === 'video' ? 135 : aspectRatio === 'wide' ? 120 : 160;

  return (
    <div
      className={`overflow-hidden relative bg-surface-raised rounded-[12px] border border-border-hairline flex items-center justify-center shrink-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={viewBox}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={width} height={height} fill={bgFill} />

        {patternType === 0 && (
          // Concentric geometric arcs
          <g opacity="0.85">
            <circle cx={width * 0.8} cy={height * 0.9} r={width * 0.25} stroke={strokePrimary} strokeWidth="1.5" />
            <circle cx={width * 0.8} cy={height * 0.9} r={width * 0.45} stroke={strokeSecondary} strokeWidth="1.2" strokeDasharray="4 3" />
            <circle cx={width * 0.8} cy={height * 0.9} r={width * 0.65} stroke={strokePrimary} strokeWidth="1" />
            <circle cx={width * 0.8} cy={height * 0.9} r={width * 0.85} stroke={strokeSecondary} strokeWidth="0.8" />
            <circle cx={width * 0.25} cy={height * 0.25} r="6" fill={strokePrimary} />
            <line x1={width * 0.25} y1={height * 0.25} x2={width * 0.8} y2={height * 0.9} stroke={strokeSecondary} strokeWidth="0.75" strokeDasharray="2 4" />
          </g>
        )}

        {patternType === 1 && (
          // Topographic contour curves
          <g opacity="0.8">
            <path
              d={`M0 ${height * 0.4} Q${width * 0.3} ${height * 0.1} ${width * 0.6} ${height * 0.5} T${width} ${height * 0.3}`}
              stroke={strokePrimary}
              strokeWidth="1.5"
            />
            <path
              d={`M0 ${height * 0.6} Q${width * 0.35} ${height * 0.3} ${width * 0.65} ${height * 0.7} T${width} ${height * 0.5}`}
              stroke={strokeSecondary}
              strokeWidth="1.2"
              strokeDasharray="5 3"
            />
            <path
              d={`M0 ${height * 0.8} Q${width * 0.4} ${height * 0.5} ${width * 0.7} ${height * 0.9} T${width} ${height * 0.7}`}
              stroke={strokePrimary}
              strokeWidth="1"
            />
            <circle cx={width * 0.65} cy={height * 0.7} r="4" fill={strokeSecondary} />
          </g>
        )}

        {patternType === 2 && (
          // Isometric blueprint grid lines
          <g opacity="0.75">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const xPos = idx * (width / 5);
              return (
                <line
                  key={`line-v-${idx}`}
                  x1={xPos}
                  y1={0}
                  x2={xPos + width * 0.3}
                  y2={height}
                  stroke={idx % 2 === 0 ? strokePrimary : strokeSecondary}
                  strokeWidth={idx % 2 === 0 ? '1.2' : '0.8'}
                  strokeDasharray={idx % 2 === 1 ? '3 3' : undefined}
                />
              );
            })}
            <rect
              x={width * 0.3}
              y={height * 0.3}
              width={width * 0.4}
              height={height * 0.4}
              rx="6"
              stroke={strokePrimary}
              strokeWidth="1.5"
            />
          </g>
        )}

        {patternType === 3 && (
          // Radial compass star & coordinates
          <g opacity="0.8">
            <circle cx={width / 2} cy={height / 2} r={height * 0.35} stroke={strokeSecondary} strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={width / 2} cy={height / 2} r={height * 0.18} stroke={strokePrimary} strokeWidth="1.5" />
            <line x1={width / 2} y1={height * 0.1} x2={width / 2} y2={height * 0.9} stroke={strokePrimary} strokeWidth="1" />
            <line x1={width * 0.15} y1={height / 2} x2={width * 0.85} y2={height / 2} stroke={strokePrimary} strokeWidth="1" />
            <circle cx={width / 2} cy={height / 2} r="4.5" fill={strokeSecondary} />
          </g>
        )}
      </svg>
    </div>
  );
};
