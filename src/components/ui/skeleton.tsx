import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50 overflow-hidden relative", className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export { Skeleton };

export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border/50 bg-white/50 shadow-sm backdrop-blur-sm p-4 gap-4 animate-fade-in-up">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGallery() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-soft">
      <Skeleton className="absolute inset-0" />
    </div>
  );
}

export function SkeletonReview() {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8 shadow-elegant border border-border/50 gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="flex items-center gap-4 pt-4">
        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}
