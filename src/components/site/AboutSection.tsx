import chef from "@/assets/gallery-chef.jpg";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const STATS = [
  { v: "15+", l: "Years of mastery" },
  { v: "100K+", l: "Coffees brewed" },
  { v: "100%", l: "Premium Roasts" },
  { v: "5★", l: "Cafe Experience" },
];

export function AboutSection() {
  const revealRef = useScrollReveal();
  return (
    <section
      id="about"
      ref={revealRef}
      className="relative scroll-mt-24 py-6 md:py-8 section-about overflow-hidden"
    >
      {/* Warm decorative accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute bottom-10 left-0 h-64 w-64 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center">
        <div className="reveal relative">
          {/* Warm glow behind image */}
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-amber-200/40 to-orange-100/30 blur-2xl" />
          <div className="overflow-hidden rounded-3xl shadow-elegant border border-amber-100">
            <img src={chef} alt="Arabica Coffee House & Restaurant" className="h-full w-full object-cover" loading="lazy" />
          </div>
          {/* Floating accent badge */}
          <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white shadow-warm border border-amber-100 px-4 py-3 animate-float flex items-center gap-3">
            <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
            <div>
              <div className="text-2xl font-black text-gradient-warm leading-none mb-0.5">50K+</div>
              <div className="text-xs text-foreground/60 font-medium">Happy customers</div>
            </div>
          </div>
        </div>

        <div className="reveal">
          <div className="mb-3 inline-block rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-xs uppercase tracking-widest text-amber-700 font-semibold">
            About Arabica
          </div>
          <h2 className="text-4xl font-bold md:text-5xl text-foreground">
            Where <span className="text-gradient-flame">coffee culture</span>
            <br />meets the <span className="text-gradient-gold">modern table</span>
          </h2>
          <p className="mt-5 text-foreground/65 leading-relaxed">
            Arabica isn't just a coffee house — it's a craft. Every coffee bean, every artisan pastry, 
            every signature dish is chosen with care. Our baristas perfect the brew, craft the finest 
            lattes, and serve a luxury cafe experience.
          </p>
          <p className="mt-3 text-foreground/55 leading-relaxed">
            From the finest single-origin roasts to elegant atmospheres to our exceptional service 
            promise — we obsess over every detail so you get the ultimate coffeehouse experience.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-white border border-amber-100 px-4 py-5 shadow-soft hover:shadow-warm transition-shadow duration-300 group"
              >
                <div className="text-3xl font-bold text-gradient-warm group-hover:scale-105 transition-transform inline-block">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-foreground/55">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
