import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { Link } from "@tanstack/react-router";

export function PromotionModal() {
  const { data: siteData } = useSite();
  const promotions = siteData?.promotions?.filter((p: any) => p.is_active) || [];
  
  // Show only if there's a promotion and we haven't closed it yet in this session
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (promotions.length > 0) {
      const hasSeen = sessionStorage.getItem("hasSeenPromotion");
      if (!hasSeen) {
        // Small delay so it doesn't pop up instantly
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [promotions]);

  if (!isOpen || promotions.length === 0) return null;

  const promo = promotions[0]; // Show the first active one

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenPromotion", "true");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in" 
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg bg-atmosphere rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col z-10">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/15 text-white backdrop-blur-md transition-colors hover:bg-foreground/30"
        >
          <X className="h-5 w-5" />
        </button>

        {promo.image_url && (
          <div className="relative h-64 w-full bg-muted shrink-0">
            <img 
              src={promo.image_url} 
              alt={promo.title} 
              className="h-full w-full object-cover"
            />
            {/* Elegant fade to background */}
            <div className="absolute inset-0 bg-gradient-to-t from-atmosphere to-transparent" />
          </div>
        )}

        <div className={`p-8 text-center flex flex-col ${promo.image_url ? "-mt-8 relative z-10" : ""}`}>
          <h2 className="text-3xl font-black text-foreground mb-3">{promo.title}</h2>
          {promo.subtitle && (
            <p className="text-foreground/65 text-lg mb-8 font-medium">
              {promo.subtitle}
            </p>
          )}

          {promo.cta_text && (
            <div className="mt-auto">
              <Link
                to="/"
                hash="menu"
                onClick={handleClose}
                className="inline-flex w-full items-center justify-center rounded-full gradient-primary px-8 py-4 text-lg font-bold text-white shadow-warm transition-transform hover:scale-[1.02] active:scale-95"
              >
                {promo.cta_text}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
