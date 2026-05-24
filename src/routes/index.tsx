import { createFileRoute } from "@tanstack/react-router";

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
    <div className="bg-atmosphere min-h-screen text-foreground">
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



