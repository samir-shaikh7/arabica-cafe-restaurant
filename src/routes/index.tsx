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
import { useEffect } from "react";
import { useSite } from "@/context/SiteContext";

export const Route = createFileRoute("/")({
  component: Index,
});


function Index() {
  const { loading } = useSite();

  useEffect(() => {
    if (!loading && window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // Wait for DOM to stabilize
    }
  }, [loading]);
  return (
    <div className="bg-atmosphere min-h-screen text-foreground relative">
      <div className="bg-noise" />
      <Navbar />
      <main>
        <Hero />
        <OfferTicker />
        <MenuSection />
        <BestSellers />
        <AboutSection />
        <ReviewsSection />
        <GallerySection />
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
