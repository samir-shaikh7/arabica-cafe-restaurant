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
  const [q, setQ] = useState("");
  const { items, add, setQty } = useCart();
  const revealRef = useScrollReveal();

  // Filter items matching the search query
  const searchedMenu = useMemo(() => {
    const search = q.toLowerCase().trim();
    if (!search) return menu;
    return menu.filter(
      (m) =>
        m.name.toLowerCase().includes(search) ||
        (m.description || "").toLowerCase().includes(search)
    );
  }, [q, menu]);

  // Group searched items by category
  const groupedCategories = useMemo(() => {
    return categories
      .map((c) => {
        const categoryItems = searchedMenu.filter((m) => m.category === c.id);
        return {
          category: c,
          items: categoryItems,
        };
      })
      .filter((group) => group.items.length > 0); // Only display categories that contain active searched items
  }, [categories, searchedMenu]);

  // Scroll smoothly to a category section
  const scrollToCategory = (id: string) => {
    const element = document.getElementById(`category-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="menu" ref={revealRef} className="relative scroll-mt-24 py-6 md:py-8 section-menu">

      {/* Subtle warm atmosphere blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange-50/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center reveal">
          <div className="mb-3 inline-block rounded-full bg-secondary border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Our Menu
          </div>
          <h2 className="text-4xl font-bold md:text-6xl text-foreground">
            Crafted to make you <span className="text-gradient-flame">crave</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/65">
            Premium coffee, artisanal pastries, and modern dining. Jump to any category or search your favorites.
          </p>
        </div>

        {/* Search + Jump Links */}
        <div className="reveal mb-8 space-y-4">
          <div className="relative mx-auto max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for espresso, lattes, pastries, salads..."
              className="w-full rounded-full bg-white border border-border py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-foreground/40 focus:border-primary shadow-soft transition-all duration-300 focus:shadow-[0_0_0_3px_oklch(0.58_0.2_42_/_15%)] text-foreground"
            />
          </div>
          
          {categories.length > 0 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 px-1 justify-center sm:justify-start">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollToCategory(c.id)}
                  className="shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 category-pill cursor-pointer hover:border-primary/30"
                >
                  <span className="mr-1.5">{c.icon}</span>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Category List */}
        <div className="space-y-12 min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : groupedCategories.length === 0 ? (
            <div className="col-span-full py-20 text-center text-foreground/50">
              No items found. Try a different search.
            </div>
          ) : (
            groupedCategories.map((group) => (
              <div
                key={group.category.id}
                id={`category-${group.category.id}`}
                className="scroll-mt-28 reveal"
              >
                {/* Category Heading with Icon */}
                <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-6 flex items-center gap-2 border-b border-border/40 pb-2">
                  <span className="text-3xl sm:text-4xl leading-none">{group.category.icon}</span>
                  <span>{group.category.name}</span>
                </h3>

                {/* Category Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {group.items.map((m) => {
                    const inCart = items.find((i) => i.id === m.id);
                    return (
                      <article
                        key={m.id}
                        className="group reveal tilt-card relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-card/90 backdrop-blur-md shadow-sm flex flex-col transition-all duration-500 hover:border-primary/20 hover:shadow-elegant"
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
                            <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center text-4xl text-foreground/30 font-bold">
                              ☕
                            </div>
                          )}
                          {/* Soft warm gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                          <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex gap-2">
                            {m.is_featured && (
                              <span className="gradient-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 shadow-md uppercase tracking-wider">
                                Featured
                              </span>
                            )}
                            {m.is_bestseller && !m.is_featured && (
                              <span className="bg-gradient-to-r from-saffron to-amber-500 text-foreground text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-saffron/30 shadow-md uppercase tracking-wider">
                                Best Seller
                              </span>
                            )}
                          </div>
                          <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex items-center gap-1 rounded-full bg-card/90 border border-border/60 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold shadow-sm backdrop-blur-md text-foreground">
                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-saffron text-saffron" />
                            <span className="text-foreground/90">{m.rating}</span>
                          </div>
                        </Link>

                        <div className="p-3 sm:p-5 md:p-5 flex flex-col flex-grow z-10 relative">
                          <div className="flex items-start justify-between gap-1 sm:gap-2">
                            <Link to="/product/$id" params={{ id: m.id }}>
                              <h4 className="text-sm sm:text-base md:text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">{m.name}</h4>
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
                          <p className="mt-1 sm:mt-2 line-clamp-2 text-[10px] sm:text-sm text-foreground/65 leading-relaxed flex-grow">{m.description}</p>

                          <div className="mt-2 sm:mt-3 flex flex-row items-center justify-between gap-1">
                            <SpiceMeter level={m.spice} />
                            <span className="text-sm sm:text-base md:text-lg font-black text-primary bg-secondary px-3 py-1 rounded-full border border-border/80 shadow-sm">KD {Number(m.price || 0).toFixed(3)}</span>
                          </div>

                          <div className="mt-3 sm:mt-4 shrink-0">
                            {inCart ? (
                              <div className="flex items-center justify-between rounded-full bg-secondary/80 border border-border/80 p-1 sm:p-1.5 animate-fade-in backdrop-blur-sm">
                                <button
                                  onClick={() => setQty(m.id, inCart.qty - 1)}
                                  className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-secondary active:scale-90 transition-all"
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                                <span className="font-bold text-[10px] sm:text-sm text-foreground">{inCart.qty} <span className="hidden sm:inline text-foreground/50">in cart</span></span>
                                <button
                                  onClick={() => setQty(m.id, inCart.qty + 1)}
                                  className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full gradient-primary border border-primary/20 text-primary-foreground hover:scale-105 active:scale-90 transition-all shadow-warm"
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => add(m)}
                                className="flex w-full items-center justify-center gap-1 sm:gap-2 rounded-full gradient-primary border border-primary/20 py-2 sm:py-3 text-xs sm:text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-warm active:scale-[0.98]"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> Add <span className="hidden sm:inline">to Cart</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {searchedMenu.length === 0 && (
          <div className="mt-8 text-center py-20 bg-white border border-border rounded-3xl animate-fade-in shadow-soft">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-foreground/50 font-medium">No dishes match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
