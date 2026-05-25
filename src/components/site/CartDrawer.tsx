import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, total, clear, setCheckoutOpen } = useCart();

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-red-950 text-white shadow-2xl border-l border-red-900/50 transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-red-900/50 p-5 bg-black/20">
          <div>
            <h3 className="text-xl font-semibold">Your Order</h3>
            <p className="text-xs text-white/60">{items.length} item{items.length === 1 ? "" : "s"}</p>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close cart">
            <X className="h-5 w-5 text-white/80" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 drop-shadow-sm text-5xl">
                🛒
              </div>
              <p className="text-white/70">Your cart is empty</p>
              <p className="mt-1 text-sm text-white/50">Add delicious dishes from our menu.</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-gradient-to-r from-red-600 to-red-800 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition-transform"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 rounded-2xl bg-black/40 border border-red-900/40 p-3 shadow-lg">
                  <img src={i.image} alt={i.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-semibold leading-tight text-white">{i.name}</h4>
                      <button 
                        onClick={() => remove(i.id)} 
                        className="text-white/40 hover:text-red-400 transition-colors group/trash" 
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1 text-sm text-red-400 font-bold">KD {Number(i.price * i.qty || 0).toFixed(3)}</div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/60 border border-red-900/50 px-1 py-1">
                      <button
                        onClick={() => setQty(i.id, i.qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black border border-red-800 text-white hover:bg-red-900 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold text-white/90">{i.qty}</span>
                      <button
                        onClick={() => setQty(i.id, i.qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 border border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)] hover:bg-red-500 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-3 border-t border-red-900/50 p-5 bg-black/20">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Subtotal</span>
              <span>KD {Number(total || 0).toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-red-400">KD {Number(total || 0).toFixed(3)}</span>
            </div>
            <button
              onClick={() => {
                setCheckoutOpen(true);
                setOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-700 to-red-900 border border-red-500/50 py-4 font-semibold text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-glow transition hover:scale-[1.02]"
            >
              <ShoppingBag className="h-5 w-5" />
              Checkout Order
            </button>
            <button
              onClick={clear}
              className="w-full rounded-full py-2 text-sm text-white/40 hover:text-red-400 transition-colors"
            >
              Clear cart
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
