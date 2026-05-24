import banner from "@/assets/banner.png";

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full pt-20 md:pt-28 pb-4 md:pb-6 flex justify-center section-hero"
    >
      {/* Warm ambient glow behind banner */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div
        className="relative w-full max-w-[1920px] px-0 md:px-6 lg:px-8 animate-fade-in"
        style={{ animationDuration: "1s" }}
      >
        <div className="relative w-full rounded-none md:rounded-[2rem] overflow-hidden shadow-elegant md:border border-amber-200/60 group bg-white">
          <img
            src={banner}
            alt="Arabica Coffee House & Restaurant"
            className="w-full h-auto max-h-[80vh] object-contain md:object-cover xl:object-contain object-center transition-transform duration-[2s] ease-out group-hover:scale-[1.01]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
