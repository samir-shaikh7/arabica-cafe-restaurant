import coffeeCup from "@/assets/cup.gif";
import { Star, ArrowRight, Coffee, Truck, Users } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full pt-28 pb-12 lg:pt-32 lg:pb-16 flex justify-center section-hero overflow-hidden"
    >
      {/* Cinematic ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-overlay">
        <div className="absolute top-[10%] left-[10%] h-[600px] w-[600px] rounded-full bg-[oklch(0.93_0.025_75_/_40%)] blur-[100px] animate-ambient-drift opacity-60" />
        <div className="absolute bottom-[10%] right-[5%] h-[800px] w-[800px] rounded-full bg-[oklch(0.95_0.015_85_/_35%)] blur-[120px] animate-ambient-drift opacity-50" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="relative w-full max-w-7xl px-4 md:px-6 lg:px-8 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-start text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur-md border border-border/60 shadow-sm mb-4 sm:mb-6 animate-fade-in-up">
            <Star className="w-3.5 h-3.5 text-saffron fill-saffron" />
            <span className="text-xs sm:text-sm font-semibold text-foreground/80">
              New Arrival <span className="mx-1 text-foreground/40">·</span> <span className="text-saffron">Try Our Signature Coffee</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-display font-black leading-[1.1] text-foreground tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Best <span className="text-gradient-warm">Coffee</span><br/>
            House &<br/>
            Restaurant
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-foreground/60 max-w-md leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Experience the perfect blend of rich flavors, warm ambience and exceptional service. Every dish is crafted with passion, every cup made to perfection.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <a href="#menu" className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-warm hover:scale-105 hover:shadow-elegant transition-all duration-300">
              Order Now <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#menu" className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-md border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-secondary hover:border-primary/20 transition-all duration-300 shadow-sm">
              <Coffee className="w-4 h-4 text-saffron" /> View Menu
            </a>
          </div>

          <div className="mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2.5 bg-card/50 backdrop-blur-sm border border-border/40 p-3 rounded-2xl shadow-sm transition-transform hover:scale-105">
              <div className="bg-secondary p-2 rounded-xl text-saffron shrink-0"><Truck className="w-4 h-4"/></div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-semibold text-foreground/60">Fast Delivery</span>
                <span className="text-xs sm:text-sm font-bold text-foreground">30-40 min</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-card/50 backdrop-blur-sm border border-border/40 p-3 rounded-2xl shadow-sm transition-transform hover:scale-105">
              <div className="bg-secondary p-2 rounded-xl text-saffron shrink-0"><Star className="w-4 h-4 fill-saffron"/></div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-semibold text-foreground/60">Top Rated</span>
                <span className="text-xs sm:text-sm font-bold text-foreground">4.9 (1.2K+ Reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-card/50 backdrop-blur-sm border border-border/40 p-3 rounded-2xl shadow-sm transition-transform hover:scale-105">
              <div className="bg-secondary p-2 rounded-xl text-saffron shrink-0"><Users className="w-4 h-4"/></div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-semibold text-foreground/60">Happy Customers</span>
                <span className="text-xs sm:text-sm font-bold text-foreground">50K+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Visuals */}
        <div className="relative flex justify-center items-center lg:h-[500px] w-full mt-6 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          
          {/* Decorative Wireframe Circle */}
          <div className="absolute w-[80%] sm:w-[70%] lg:w-[90%] aspect-square rounded-full border-[1.5px] border-saffron/20 animate-ambient-drift pointer-events-none" style={{ animationDuration: '40s' }}>
            <div className="absolute top-[10%] left-[20%] w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-saffron shadow-[0_0_15px_oklch(0.72_0.12_80)]"></div>
            <div className="absolute top-[5%] right-[25%] w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-saffron shadow-[0_0_10px_oklch(0.72_0.12_80)]"></div>
            <div className="absolute bottom-[20%] right-[-2%] w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-saffron shadow-[0_0_20px_oklch(0.72_0.12_80)]"></div>
            <div className="absolute bottom-[10%] left-[10%] w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/60 shadow-[0_0_10px_oklch(0.42_0.08_50)]"></div>
          </div>

          <div className="relative w-full max-w-[320px] lg:max-w-[420px] z-10 flex flex-col items-center justify-center group p-3 sm:p-4">
            
            {/* Soft backdrop glow behind the GIF */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-saffron/20 to-primary/10 blur-[40px] sm:blur-[60px] -z-10 group-hover:blur-[70px] transition-all duration-700"></div>

            {/* Coffee Cup GIF */}
            <div className="relative rounded-full p-1.5 sm:p-2 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/30 shadow-elegant transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2">
              <img 
                src={coffeeCup} 
                alt="Premium Coffee Animation" 
                className="w-full h-auto max-w-[260px] sm:max-w-[280px] lg:max-w-[360px] aspect-square object-cover rounded-full shadow-inner animate-breathe" 
              />
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
