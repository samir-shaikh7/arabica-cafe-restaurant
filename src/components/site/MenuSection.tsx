import { useState, useMemo, memo } from "react";
import { Search, Star, Plus, Minus, Flame, Leaf } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/lib/cart";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SkeletonCard } from "@/components/ui/skeleton";

export const SpiceMeter = memo(function SpiceMeter({ level = 1 }: { level?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <Flame
          key={i}
          className={`h-2.5 w-2.5 sm:h-3 sm:w-3 transition ${i <= level ? "text-flame fill-flame" : "text-foreground/15"}`}
        />
      ))}
    </div>
  );
});

export function MenuSection() {
  const { data: siteData, loading } = useSite();
  const { categories, menu } = siteData;
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");
  const { items, add, setQty } = useCart();

  console.log(`[MenuSection] menu=${menu.length}, categories=${categories.length}, active=${active}`);

  const filtered = useMemo(() => {
    const search = q.toLowerCase();
    const result = menu.filter((m) => {
      // Category match: menu.category stores the category UUID (c.id)
      const categoryMatch = active === "all" || m.category === active;
      const searchMatch = search === "" || m.name.toLowerCase().includes(search) || (m.description || "").toLowerCase().includes(search);
      return categoryMatch && searchMatch;
    });
    console.log(`[MenuSection] filtered=${result.length} (active=${active}, q="${q}")`);
    return result;
  }, [active, q, menu]);

  const revealRef = useScrollReveal([filtered]);

  return (
    <section id="menu" ref={revealRef} className="relative scroll-mt-24 py-6 md:py-8 section-menu">

      {/* Subtle warm atmosphere blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange-50/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center reveal">
          <div className="mb-3 inline-block rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-xs uppercase tracking-widest text-amber-700 font-semibold">
            Our Menu
          </div>
          <h2 className="text-4xl font-bold md:text-6xl text-white">
            Crafted to make you <span className="text-gradient-flame">crave</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Premium coffee, artisanal pastries, and modern dining. Pick your favorites — we'll prepare them fresh.
          </p>
        </div>

        {/* Search + filters */}
        <div className="reveal mb-8 space-y-4">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for espresso, lattes, pastries..."
              className="w-full rounded-full bg-white border border-border py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-foreground/40 focus:border-primary shadow-soft transition-all duration-300 focus:shadow-[0_0_0_3px_oklch(0.58_0.2_42_/_15%)] text-foreground"
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 px-1">
            <button
              onClick={() => setActive("all")}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                active === "all"
                  ? "gradient-primary text-primary-foreground shadow-warm scale-105"
                  : "category-pill"
              }`}
            >
              ✨ All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  active === c.id
                    ? "gradient-primary text-primary-foreground shadow-warm scale-105"
                    : "category-pill"
                }`}
              >
                <span className="mr-1.5">{c.icon}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 min-h-[400px]">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center text-foreground/50">
              No items found. Try a different search.
            </div>
          ) : (
            filtered.map((m) => {
              const inCart = items.find((i) => i.id === m.id);
              return (
              <article
                key={m.id}
                className="group reveal tilt-card relative overflow-hidden rounded-2xl sm:rounded-3xl border border-red-900/40 bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-500 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]"
              >
                <Link to="/product/$id" params={{ id: m.id }} className="relative aspect-[4/3] overflow-hidden shrink-0 block">
                  {(m.image || m.image_url) ? (
                  <img
                    src={m.image || m.image_url}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-red-950 to-black flex items-center justify-center text-5xl">
                    🍽️
                  </div>
                )}
                  {/* Subtle red gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex gap-2">
                    {m.is_featured && (
                      <span className="bg-gradient-to-r from-red-600 to-red-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/50">
                        Featured
                      </span>
                    )}
                    {m.is_bestseller && !m.is_featured && (
                      <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500/50">
                        Best Seller
                      </span>
                    )}
                  </div>
                  <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex items-center gap-1 rounded-full bg-black/60 border border-red-900/50 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold shadow-lg backdrop-blur-md">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
                    <span className="text-white/90">{m.rating}</span>
                  </div>
                </Link>

                <div className="p-3 sm:p-5 md:p-5 flex flex-col flex-grow z-10 relative">
                  <div className="flex items-start justify-between gap-1 sm:gap-2">
                    <Link to="/product/$id" params={{ id: m.id }}>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold leading-tight text-white group-hover:text-red-400 transition-colors">{m.name}</h3>
                    </Link>
                    <div
                      className={`mt-0.5 sm:mt-1 flex h-3 w-3 sm:h-4 sm:w-4 shrink-0 items-center justify-center rounded-[2px] sm:rounded-sm border-2 ${
                        m.veg ? "border-emerald-500" : "border-red-500"
                      }`}
                      aria-label={m.veg ? "Veg" : "Non-Veg"}
                    >
                      {m.veg ? (
                        <Leaf className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-500" />
                      ) : (
                        <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="mt-1 sm:mt-2 line-clamp-2 text-[10px] sm:text-sm text-white/60 leading-relaxed flex-grow">{m.description}</p>

                  <div className="mt-2 sm:mt-3 flex flex-row items-center justify-between gap-1">
                    <SpiceMeter level={m.spice} />
                    <span className="text-sm sm:text-base md:text-lg font-black text-white bg-red-900/80 px-3 py-1 rounded-full border border-red-500/50 shadow-inner">KD {Number(m.price || 0).toFixed(3)}</span>
                  </div>

                  <div className="mt-3 sm:mt-4 shrink-0">
                    {inCart ? (
                      <div className="flex items-center justify-between rounded-full bg-red-950/50 border border-red-900/50 p-1 sm:p-1.5 animate-fade-in backdrop-blur-sm">
                        <button
                          onClick={() => setQty(m.id, inCart.qty - 1)}
                          className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black border border-red-800 text-white hover:bg-red-900 active:scale-90 transition-all"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <span className="font-bold text-[10px] sm:text-sm text-white/90">{inCart.qty} <span className="hidden sm:inline text-white/50">in cart</span></span>
                        <button
                          onClick={() => setQty(m.id, inCart.qty + 1)}
                          className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-red-600 border border-red-500 text-white hover:bg-red-500 active:scale-90 transition-all shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => add(m)}
                        className="flex w-full items-center justify-center gap-1 sm:gap-2 rounded-full bg-gradient-to-r from-red-700 to-red-900 border border-red-500/40 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:border-red-400 active:scale-[0.98]"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> Add <span className="hidden sm:inline">to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
              );
            })
          )}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 text-center py-20 bg-white border border-border rounded-3xl animate-fade-in shadow-soft">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-foreground/50 font-medium">No dishes match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}

