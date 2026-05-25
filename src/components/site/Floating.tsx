import { memo } from "react";
import { MessageCircle, Phone, MapPin, ShoppingBag, Home, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useSite } from "@/context/SiteContext";
import { Link } from "@tanstack/react-router";

export const FloatingButtons = memo(function FloatingButtons() {
  const { data: siteData } = useSite();
  const whatsapp = siteData?.settings?.whatsapp_number || "";
  const phone = siteData?.settings?.call_number || "";

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 md:bottom-6">
      <a
        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-800 border border-red-500/50 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-glow transition-transform hover:scale-110 active:scale-95"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6 drop-shadow-sm" />
      </a>
      <a
        href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 border border-red-900/50 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:border-red-500/50 active:scale-95"
        aria-label="Call"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href="/#contact"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 border border-red-900/50 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:border-red-500/50 active:scale-95"
        aria-label="Location"
      >
        <MapPin className="h-5 w-5" />
      </a>
    </div>
  );
});

export const MobileBottomNav = memo(function MobileBottomNav() {
  const { count, setOpen, total } = useCart();

  if (count === 0) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-fade-in">
        <div className="glass flex items-center justify-around border-t border-border/40 px-2 py-2 backdrop-blur-2xl">
          {[
            { href: "/#home", icon: Home, label: "Home" },
            { href: "/#menu", icon: UtensilsCrossed, label: "Menu" },
            { href: "/#contact", icon: Phone, label: "Contact" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-foreground/70 transition-colors hover:text-primary active:text-primary"
            >
              <l.icon className="h-5 w-5" />
              <span className="text-[10px] font-bold">{l.label}</span>
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-fade-in">
      <Link
        to="/cart"
        className="mx-3 mb-3 flex w-[calc(100%-1.5rem)] items-center justify-between rounded-full bg-gradient-to-r from-red-700 to-red-950 border border-red-500/50 px-6 py-4 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] animate-glow active:scale-[0.98] transition-transform"
      >
        <span className="flex items-center gap-2.5 font-bold">
          <ShoppingBag className="h-5 w-5" /> {count} item{count > 1 ? "s" : ""} · KD {Number(total || 0).toFixed(3)}
        </span>
        <span className="text-sm font-black">View Cart →</span>
      </Link>
      <div className="glass flex items-center justify-around border-t border-border/40 px-2 py-2 backdrop-blur-2xl">
        {[
          { href: "/#home", icon: Home, label: "Home" },
          { href: "/#menu", icon: UtensilsCrossed, label: "Menu" },
          { href: "/#contact", icon: Phone, label: "Contact" },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-foreground/70 transition-colors hover:text-primary active:text-primary"
          >
            <l.icon className="h-5 w-5" />
            <span className="text-[10px] font-bold">{l.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
});

export const OfferTicker = memo(function OfferTicker() {
  const { data: siteData } = useSite();
  const promotions = siteData?.promotions?.filter((p: any) => p.is_active) || [];
  
  // Create a dynamic list of offers from promotions
  const offers = promotions.length > 0 
    ? promotions.map((p: any) => `${p.title}${p.subtitle ? ` - ${p.subtitle}` : ""}`)
    : ["Welcome to Arabica Coffee House", "Premium coffee & modern dining"];

  return (
    <div className="relative overflow-hidden border-y border-border/20 bg-card/30 py-3 backdrop-blur-sm select-none">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap text-sm font-bold text-foreground/90">
        {offers.map((o, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="text-gradient-gold">{o}</span>
            <span className="text-primary/30">•</span>
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {offers.map((o, i) => (
          <span key={`dup-${i}`} className="flex items-center gap-3">
            <span className="text-gradient-gold">{o}</span>
            <span className="text-primary/30">•</span>
          </span>
        ))}
      </div>
    </div>
  );
});

