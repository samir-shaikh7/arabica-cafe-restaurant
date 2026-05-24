import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/lib/cart";
import { Link } from "@tanstack/react-router";
import { useSite } from "@/context/SiteContext";

const LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#menu", label: "Menu" },
  { href: "/#bestsellers", label: "Specials" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { data: siteData } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();

  const logoUrl = siteData?.settings?.logo_url || logo;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={`flex items-center justify-between rounded-2xl px-5 py-2.5 md:py-3 transition-all duration-700 ease-out ${
            scrolled
              ? "glass-nav shadow-elegant"
              : "bg-white/40 backdrop-blur-sm border border-white/60"
          }`}
        >
          <a href="/#home" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border border-border shadow-sm transition-transform duration-500 group-hover:scale-105 shrink-0 bg-white">
              <img
                src={logoUrl}
                alt="Arabica"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-base md:text-lg tracking-tight text-foreground/90 leading-none">
                Arabica
              </span>
              <span className="text-[10px] md:text-xs font-semibold text-primary/80 tracking-wider uppercase mt-0.5">
                Coffee House & Restaurant
              </span>
            </div>
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-[13px] font-semibold text-foreground/75 tracking-wide transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              to="/cart"
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white border border-border shadow-soft transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:shadow-[0_4px_20px_oklch(0.58_0.2_42_/_20%)] group"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/70 transition-colors group-hover:text-primary" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 items-center justify-center rounded-full gradient-primary px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-black text-primary-foreground shadow-soft border border-white/50">
                  {count}
                </span>
              )}
            </Link>
            <a
              href="/#menu"
              className="hidden items-center justify-center rounded-full gradient-primary px-6 py-2.5 text-sm font-bold tracking-wide text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_24px_oklch(0.58_0.2_42_/_35%)] md:flex shadow-warm"
            >
              Order Now
            </a>
            <button
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white border border-border shadow-soft transition-all duration-300 hover:scale-105 hover:border-primary/40 lg:hidden group"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/70 transition-colors group-hover:text-primary" />
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-full bg-white border-l border-border p-6 shadow-elegant animate-fade-in flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-border shadow-sm shrink-0 bg-white">
                  <img
                    src={logoUrl}
                    alt="Arabica"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-base tracking-tight text-foreground/90 leading-none">
                    Arabica
                  </span>
                  <span className="text-[10px] font-semibold text-primary/80 tracking-wider uppercase mt-0.5">
                    Coffee House & Restaurant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-5 py-3.5 text-base font-semibold text-foreground/80 transition-all hover:bg-primary/8 hover:text-primary border border-transparent hover:border-primary/15"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <a
                href="/#menu"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-full gradient-primary px-5 py-4 font-bold tracking-wide text-primary-foreground shadow-warm hover:scale-[1.02] transition-transform"
              >
                Order Now
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
