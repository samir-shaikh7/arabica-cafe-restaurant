import { createFileRoute } from "@tanstack/react-router";
import bannerImg from "@/assets/banner.png";

import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { MenuSection } from "@/components/site/MenuSection";
import { BestSellers } from "@/components/site/BestSellers";
import { GallerySection } from "@/components/site/GallerySection";
import { AboutSection } from "@/components/site/AboutSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { FloatingButtons, MobileBottomNav, OfferTicker } from "@/components/site/Floating";
import { PromotionModal } from "@/components/site/PromotionModal";

export const Route = createFileRoute("/")({
  component: Index,
});


function Index() {
  return (
    <div className="min-h-screen text-foreground relative z-0 overflow-hidden bg-red-950">
      {/* Blurred and Red-Tinted Background Banner */}
      <div 
        className="pointer-events-none fixed inset-0 z-[-2] opacity-70 mix-blend-luminosity"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'rotate(90deg) scale(1.5)',
          filter: 'blur(16px) sepia(100%) hue-rotate(320deg) saturate(400%) contrast(1.2)',
        }}
      />
      {/* Strong Red Blending Overlays */}
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-red-600/50 mix-blend-multiply" />
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-gradient-to-b from-red-900/60 via-red-950/80 to-black/90 mix-blend-overlay" />
      
      <Navbar />
      <main>
        <Hero />
        <OfferTicker />
        <MenuSection />
        <BestSellers />
        <GallerySection />
        <AboutSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingButtons />
      <MobileBottomNav />
      <PromotionModal />
      {/* spacer so mobile bottom nav doesn't cover content */}
      <div className="h-24 md:hidden" aria-hidden />
    </div>
  );
}
