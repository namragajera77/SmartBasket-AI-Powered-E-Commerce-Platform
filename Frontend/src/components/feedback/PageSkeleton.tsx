interface PageSkeletonProps {
  rows?: number;
}

export function PageSkeleton({ rows = 4 }: PageSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-2xl border border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-white shadow-sm" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-2xl border border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-white shadow-sm" />
      ))}
    </div>
  );
}
