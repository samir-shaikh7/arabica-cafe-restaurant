import logo from "@/assets/logo.png";

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full pt-20 md:pt-28 pb-4 md:pb-6 flex justify-center section-hero"
    >
      {/* Warm ambient glow behind logo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
      </div>

      <div
        className="relative w-full max-w-[1920px] px-4 md:px-6 lg:px-8 animate-fade-in flex justify-center items-center"
        style={{ animationDuration: "1s" }}
      >
        <div className="relative w-full max-w-lg group flex justify-center items-center py-10">
          <img
            src={logo}
            alt="Arabica Coffee House & Restaurant Logo"
            className="w-full h-auto max-h-[50vh] object-contain transition-transform duration-[2s] ease-out group-hover:scale-[1.05]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
