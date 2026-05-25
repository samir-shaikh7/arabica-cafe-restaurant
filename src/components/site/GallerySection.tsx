import React from "react";
import { useSite } from "@/context/SiteContext";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SkeletonGallery } from "@/components/ui/skeleton";

export function GallerySection() {
  const { data: siteData, loading } = useSite();

  // SiteContext already filters is_active=true, so we just use gallery directly.
  // Sort by order_index as a safety measure.
  const galleryImages = [...(siteData.gallery || [])].sort(
    (a, b) => (a.order_index || 0) - (b.order_index || 0)
  );

  // Pass gallery count as dep so observer re-initializes after async data
  const revealRef = useScrollReveal([galleryImages.length]);

  console.log(`[GallerySection] gallery items: ${galleryImages.length}`);

  // Loading state — show skeleton grid
  if (loading) {
    return (
      <section id="gallery" className="scroll-mt-24 py-6 md:py-8 section-gallery">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 text-center">
            <div className="h-6 w-24 rounded-full bg-amber-100 animate-pulse mx-auto mb-3" />
            <div className="h-12 w-72 rounded-xl bg-foreground/5 animate-pulse mx-auto" />
          </div>
          <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`${i === 1 || i === 3 ? "row-span-2" : ""} ${i === 6 ? "col-span-2" : ""} h-full w-full`}
              >
                <SkeletonGallery />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No gallery images — hide section entirely
  if (galleryImages.length === 0) {
    console.log("[GallerySection] No active gallery images — section hidden.");
    return null;
  }

  return (
    <section id="gallery" ref={revealRef as React.RefObject<HTMLElement>} className="scroll-mt-24 py-6 md:py-8 section-gallery">

      <div className="mx-auto max-w-7xl px-4">
        <div className="reveal mb-6 text-center">
          <div className="mb-3 inline-block rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-xs uppercase tracking-widest text-amber-700 font-semibold">
            Gallery
          </div>
          <h2 className="text-4xl font-bold md:text-6xl text-white">
            A taste of our <span className="text-gradient-gold">world</span>
          </h2>
        </div>

        <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4 md:gap-4">
          {galleryImages.map((img, i) => {
            // Auto-span for visual variety based on index
            let spanClass = "";
            if (i === 0) spanClass = "row-span-2";
            else if (i === 2) spanClass = "row-span-2";
            else if (i === 5) spanClass = "col-span-2";

            // Support both image_url and image field (migration compatibility)
            const imgSrc = img.image_url || img.image || "";

            if (!imgSrc) {
              console.warn(`[GallerySection] Item ${img.id} has no image URL — skipping render.`);
              return null;
            }

            return (
              <figure
                key={img.id || i}
                className={`reveal group relative overflow-hidden rounded-2xl shadow-warm border border-amber-50 ${spanClass}`}
              >
                <img
                  src={imgSrc}
                  alt={img.title || "Gallery image"}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    // Hide broken images rather than show broken icon
                    const fig = (e.currentTarget as HTMLImageElement).closest("figure");
                    if (fig) (fig as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                {img.title && (
                  <figcaption className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-sm font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    {img.title}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

