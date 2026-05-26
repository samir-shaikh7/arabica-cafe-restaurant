import { memo, useMemo } from "react";
import { Star } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SkeletonReview } from "@/components/ui/skeleton";

export const ReviewsSection = memo(function ReviewsSection() {
  const { data: siteData, loading } = useSite();
  const revealRef = useScrollReveal();
  // SiteContext already filtered is_active=true, so use reviews directly
  const reviews = siteData.reviews || [];

  // Loading skeleton
  if (loading) {
    return (
      <section id="reviews" ref={revealRef} className="scroll-mt-24 py-6 md:py-8 section-reviews relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 text-center">
            <div className="h-6 w-28 rounded-full bg-secondary animate-pulse mx-auto mb-3" />
            <div className="h-12 w-80 rounded-xl bg-foreground/5 animate-pulse mx-auto" />
          </div>
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-80 shrink-0">
                <SkeletonReview />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No active reviews - hide section
  if (reviews.length === 0) return null;

  // Duplicate for seamless marquee loop
  const items = [...reviews, ...reviews];

  // Calculate average rating safely
  const total = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
  const avg = total / reviews.length;
  const displayRating = isNaN(avg) ? "5.0" : avg.toFixed(1);
  const roundedRating = Math.round(Number(displayRating));

  return (
    <section
      id="reviews"
      ref={revealRef}
      className="scroll-mt-24 overflow-hidden py-6 md:py-8 section-reviews relative"
    >
      {/* Warm texture blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-1/4 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="reveal mb-6 text-center">
          <div className="mb-3 inline-block rounded-full bg-secondary border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Reviews
          </div>
          <h2 className="text-4xl font-bold md:text-6xl text-foreground">
            Loved by <span className="text-gradient-flame">thousands</span>
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-foreground/75">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i <= roundedRating ? "fill-saffron text-saffron" : "text-border"}`}
                />
              ))}
            </div>
            {displayRating} average rating · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="reveal relative">
        <div className="flex w-max animate-marquee gap-5">
          {items.map((r, i) => {
            // Safe field access - SiteContext normalizes name/text
            const displayName = r.name || r.author_name || "Guest";
            const displayText = r.text || r.content || "";
            const displayRatingItem = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
            const initial = displayName.trim().charAt(0).toUpperCase() || "G";
            const imgSrc = r.author_image || "";

            return (
              <article
                key={`${r.id}-${i}`}
                className="w-80 shrink-0 rounded-3xl bg-card border border-border/60 p-6 shadow-sm hover:border-primary/20 hover:shadow-elegant transition-all duration-500 hover:-translate-y-2"
              >
                <div className="flex items-center gap-1 text-saffron">
                  {Array.from({ length: displayRatingItem }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current drop-shadow-sm" />
                  ))}
                  {Array.from({ length: 5 - displayRatingItem }).map((_, j) => (
                    <Star key={`empty-${j}`} className="h-4 w-4 text-saffron/20" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  "{displayText || "Great experience!"}"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full gradient-primary text-sm font-bold text-primary-foreground shadow-warm border border-primary/20 shrink-0">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={displayName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Fallback to initial on image error
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          const parent = (e.currentTarget as HTMLImageElement).parentElement;
                          if (parent) parent.textContent = initial;
                        }}
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{displayName}</div>
                    <div className="text-[11px] text-foreground/45">Verified customer</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});
