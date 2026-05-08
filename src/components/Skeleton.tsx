export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{ animation: "skeleton-shimmer 1.5s infinite" }} />
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-[var(--mecsa-bg)] rounded-xl overflow-hidden">
      <SkeletonBox className="aspect-[16/10] rounded-none" />
      <div className="p-6 space-y-3">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-5 w-full" />
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-5/6" />
        <SkeletonBox className="h-3 w-4/6" />
        <SkeletonBox className="h-4 w-20 mt-2" />
      </div>
    </div>
  );
}

export function GalleryImageSkeleton() {
  return <SkeletonBox className="aspect-[4/3] rounded-lg" />;
}
