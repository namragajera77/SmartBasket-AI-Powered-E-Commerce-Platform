interface PageSkeletonProps {
  rows?: number;
}

export function PageSkeleton({ rows = 4 }: PageSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-xl bg-white shadow-sm" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-xl bg-white shadow-sm" />
      ))}
    </div>
  );
}
