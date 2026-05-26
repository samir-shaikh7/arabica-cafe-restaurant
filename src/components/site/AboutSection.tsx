import chef from "@/assets/gallery-chef.jpg";
import { memo } from "react";
import { useSite } from "@/context/SiteContext";
import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const STATS = [
  { v: "15+", l: "Years of mastery" },
  { v: "100K+", l: "Coffees brewed" },
  { v: "100%", l: "Premium Roasts" },
  { v: "5★", l: "Cafe Experience" },
];

export const AboutSection = memo(function AboutSection() {
  const revealRef = useScrollReveal();
  const { data: siteData } = useSite();
  const { settings } = siteData;
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
          <div className="overflow-hidden rounded-3xl shadow-elegant border border-border">
            <img src={settings?.about_image_url || chef} alt="Arabica Coffee House & Restaurant" className="h-full w-full object-cover" loading="lazy" />
          </div>
          {/* Floating accent badge */}
          <div className="absolute -bottom-4 -right-4 rounded-2xl bg-card/90 backdrop-blur-md shadow-elegant border border-border px-4 py-3 animate-float flex items-center gap-3">
            <Star className="h-8 w-8 text-saffron fill-saffron" />
            <div>
              <div className="text-2xl font-black text-gradient-flame leading-none mb-0.5">50K+</div>
              <div className="text-xs text-foreground/60 font-semibold font-medium">Happy customers</div>
            </div>
          </div>
        </div>

        <div className="reveal">
          <div className="mb-3 inline-block rounded-full bg-secondary border border-border px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            About Arabica
          </div>
          <h2 className="text-4xl font-bold md:text-5xl text-foreground" dangerouslySetInnerHTML={{ __html: settings?.about_heading || 'Where <span className="text-gradient-flame">coffee culture</span><br />meets the <span className="text-gradient-gold">modern table</span>' }}>
          </h2>
          <div className="mt-5 text-foreground/75 leading-relaxed text-lg whitespace-pre-wrap">
            {settings?.about_description || "Arabica isn't just a coffee house - it's a craft. Every coffee bean, every artisan pastry, every signature dish is chosen with care. Our baristas perfect the brew, craft the finest lattes, and serve a luxury cafe experience.\n\nFrom the finest single-origin roasts to elegant atmospheres to our exceptional service promise - we obsess over every detail so you get the ultimate coffeehouse experience."}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-card border border-border/60 px-4 py-5 shadow-sm hover:border-primary/20 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-3xl font-bold text-gradient-flame group-hover:scale-105 transition-transform inline-block">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-foreground/60 font-semibold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
