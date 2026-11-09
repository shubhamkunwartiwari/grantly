import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-border-hairline/60 rounded-[8px] ${className}`}
      aria-hidden="true"
    />
  );
};

export const ScholarshipCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-card border border-border-hairline rounded-[14px] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="w-14 h-14 rounded-[12px] shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
};
