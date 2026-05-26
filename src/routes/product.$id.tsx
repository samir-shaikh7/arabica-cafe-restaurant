import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Star, Leaf, Plus, Minus, ShoppingBag } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useCart } from "@/lib/cart";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SpiceMeter } from "@/components/site/MenuSection";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: siteData } = useSite();
  const { items, add, setQty } = useCart();

  const product = siteData?.menu?.find((m: any) => m.id === id || m.id?.toString() === id);

  if (!siteData?.menu || siteData.menu.length === 0) {
    // If data is still loading, show a loading state
    return (
      <div className="min-h-screen bg-atmosphere text-foreground flex flex-col relative">
        <div className="bg-noise" />
        <Navbar />
        <main className="flex-1 pt-28 pb-20 px-4 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary/15 border-t-primary animate-spin" />
            <p className="mt-4 text-foreground/45 font-medium">Loading dish...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-atmosphere text-foreground flex flex-col relative">
        <div className="bg-noise" />
        <Navbar />
        <main className="flex-1 pt-28 pb-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Dish not found</h1>
            <p className="text-foreground/55 mb-8">This dish might have been removed or is currently unavailable.</p>
            <Link to="/" className="rounded-full gradient-primary px-8 py-3.5 font-bold text-white shadow-warm">
              Back to Menu
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inCart = items.find((i) => i.id === product.id);

  return (
    <div className="min-h-screen bg-atmosphere text-foreground flex flex-col relative">
      <div className="bg-noise" />
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            hash="menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/55 hover:text-primary mb-8 sm:mb-12 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Image Column */}
            <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-card to-foreground/5 shadow-elegant animate-fade-in">
              {(product.image || product.image_url) ? (
                <img
                  src={product.image || product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover mix-blend-multiply"
                />
              ) : (
                <div className="h-full w-full bg-secondary flex items-center justify-center text-7xl">
                  🍽️
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="flex flex-col animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/70">
                  {siteData?.categories?.find((c: any) => c.id === product.category)?.name || product.category || "Authentic"}
                </span>
                {product.is_bestseller && (
                  <>
                    <span className="text-foreground/15">•</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-saffron">
                      Best Seller
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1 text-sm font-bold shadow-sm">
                  <Star className="h-4 w-4 fill-saffron text-saffron" />
                  <span className="text-foreground/70">{product.rating || "4.5"}</span>
                </div>
                <span className="text-foreground/20">•</span>
                <span className="text-sm font-medium text-foreground/55">Premium Choice</span>
              </div>

              <div className="mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/35 mb-3">
                  About this dish
                </h3>
                <p className="text-base sm:text-lg text-foreground/65 leading-relaxed font-medium">
                  {product.description || "Authentic specialty prepared using a secret family recipe passed down through generations. We source our ingredients daily from local farmers to ensure every plate captures the true essence of fine dining."}
                </p>
              </div>



              <div className="mt-auto pt-8 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/35 mb-1">
                    Dish Price
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-primary">
                    KD {Number(product.price || 0).toFixed(3)}
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  {inCart ? (
                    <div className="flex h-14 sm:h-16 w-full sm:w-48 items-center justify-between rounded-full bg-card border border-border shadow-soft px-2">
                      <button
                        onClick={() => setQty(product.id, inCart.qty - 1)}
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-muted text-foreground/65 transition-colors hover:bg-primary/8 hover:text-primary active:scale-95"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="text-lg sm:text-xl font-bold text-foreground w-8 text-center">
                        {inCart.qty}
                      </span>
                      <button
                        onClick={() => setQty(product.id, inCart.qty + 1)}
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full gradient-primary text-white shadow-sm transition-transform active:scale-95"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => add(product)}
                      className="flex h-14 sm:h-16 w-full sm:w-48 items-center justify-center gap-3 rounded-full gradient-primary text-lg font-bold text-white shadow-warm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Add to Cart <Plus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
