import { memo, useMemo } from "react";
import { Star, Plus } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/lib/cart";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SkeletonCard } from "@/components/ui/skeleton";

export const BestSellers = memo(function BestSellers() {
  const { data: siteData, loading } = useSite();
  const { menu } = siteData;
  const { add } = useCart();
  const revealRef = useScrollReveal();

  // Filter bestsellers - memoized to prevent recalculation
  const top = useMemo(() => {
    let items = menu
      .filter((m) => m.is_bestseller === true && Boolean(m.image || m.image_url))
      .slice(0, 6);

    // Fallback: If nothing is marked as bestseller yet, show first 6
    if (items.length === 0) {
      items = menu.filter((m) => Boolean(m.image || m.image_url)).slice(0, 6);
    }
    return items;
  }, [menu]);

  // Loading skeleton
  if (loading) {
    return (
      <section id="bestsellers" ref={revealRef} className="scroll-mt-24 py-6 md:py-8 section-bestsellers relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-6">
            <div className="h-6 w-32 rounded-full bg-secondary animate-pulse mb-3" />
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

  // No bestsellers - hide section entirely
  if (top.length === 0) return null;

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
            <div className="mb-3 inline-block rounded-full bg-secondary border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              Best Sellers
            </div>
            <h2 className="text-4xl font-bold md:text-6xl text-foreground">
              Most <span className="text-gradient-flame">ordered</span> this week
            </h2>
          </div>
        </div>

        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
          {top.map((m) => {
            const rating = Math.min(5, Math.max(1, Number(m.rating) || 4.5));
            const imgSrc = m.image || m.image_url || "";

            return (
              <article
                key={m.id}
                className="reveal snap-start group relative w-72 shrink-0 overflow-hidden rounded-3xl bg-card border border-border/60 md:w-80 transition-all duration-500 hover:border-primary/20 hover:shadow-elegant hover:-translate-y-2 shadow-sm"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={m.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center text-4xl text-foreground/40 font-bold">
                      Arabica Cafe
                    </div>
                  )}
                  {/* Cinematic espresso-warm overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/20 to-transparent opacity-85" />
                  <span className="absolute left-3 top-3 gradient-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-primary/20 shadow-md uppercase tracking-wider">
                    Best Seller
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1 text-xs text-saffron">
                      <Star className="h-3 w-3 fill-saffron text-saffron" />
                      <span className="font-bold">{rating.toFixed(1)}</span>
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-white group-hover:text-saffron transition-colors">{m.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-black text-white bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20 shadow-inner">KD {Number(m.price || 0).toFixed(3)}</span>
                      <button
                        onClick={() => add(m)}
                        className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary border border-primary/20 text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-warm"
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
});
