import { Star, Plus } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/lib/cart";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SkeletonCard } from "@/components/ui/skeleton";

export function BestSellers() {
  const { data: siteData, loading } = useSite();
  const { menu } = siteData;
  const { add } = useCart();

  // ── Filter bestsellers — support both is_bestseller and badge fallback ──
  let top = menu
    .filter((m) => {
      const isBest = m.is_bestseller === true;
      if (!isBest) return false;
      return Boolean(m.image || m.image_url);
    })
    .slice(0, 6);

  // Fallback: If nothing is marked as bestseller yet, just show the first 6 items
  if (top.length === 0) {
    top = menu.filter((m) => Boolean(m.image || m.image_url)).slice(0, 6);
  }

  // Debug
  console.log(`[BestSellers] menu.length=${menu.length}, bestsellers=${top.length}`);

  const revealRef = useScrollReveal([top.length]);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <section id="bestsellers" className="scroll-mt-24 py-6 md:py-8 section-bestsellers relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-6">
            <div className="h-6 w-32 rounded-full bg-orange-100 animate-pulse mb-3" />
            <div className="h-12 w-80 rounded-xl bg-foreground/5 animate-pulse" />
          </div>
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-72 md:w-80 shrink-0">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── No bestsellers — hide section entirely ───────────────────────────────
  if (top.length === 0) {
    console.log("[BestSellers] No bestseller items found — section hidden.");
    return null;
  }

  return (
    <section
      id="bestsellers"
      ref={revealRef}
      className="scroll-mt-24 py-6 md:py-8 section-bestsellers relative overflow-hidden"
    >
      {/* Decorative warm orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-orange-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="reveal mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-block rounded-full bg-orange-100 border border-orange-200 px-4 py-1 text-xs uppercase tracking-widest text-orange-700 font-semibold">
              Best Sellers
            </div>
            <h2 className="text-4xl font-bold md:text-6xl text-foreground">
              Most <span className="text-gradient-flame">ordered</span> this week
            </h2>
          </div>
        </div>

        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
          {top.map((m) => {
            // Safe rating display — normalize to 1-5 range
            const rating = Math.min(5, Math.max(1, Number(m.rating) || 4.5));
            const imgSrc = m.image || m.image_url || "";

            return (
              <article
                key={m.id}
                className="reveal snap-start group relative w-72 shrink-0 overflow-hidden rounded-3xl bg-white shadow-warm border border-amber-100/80 md:w-80 transition-all duration-500 hover:shadow-elegant hover:-translate-y-2"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={m.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        // If image fails to load, hide it gracefully
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-6xl">
                      🍽️
                    </div>
                  )}
                  {/* Cinematic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <span className="absolute left-3 top-3 badge-warm">
                    Best Seller
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1 text-xs text-amber-300">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-white">{m.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-300">KD {Number(m.price || 0).toFixed(3)}</span>
                      <button
                        onClick={() => add(m)}
                        className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground transition hover:scale-110 hover:shadow-warm"
                        aria-label={`Add ${m.name}`}
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
