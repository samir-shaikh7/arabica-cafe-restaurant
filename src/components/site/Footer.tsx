import logo from "@/assets/logo.png";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export function Footer() {
  const { data: siteData } = useSite();
  const settings = siteData?.settings;
  const logoUrl = settings?.logo_url || logo;

  return (
    <footer
      style={{ background: "oklch(0.22 0.05 38)" }}
      className="py-14 relative overflow-hidden"
    >
      {/* Subtle warm glow at top of dark footer */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-amber-600/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/20 shadow-sm shrink-0 bg-white">
              <img
                src={logoUrl}
                alt="Arabica"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-xl tracking-tight text-white leading-none">
                Arabica
              </span>
              <span className="text-[11px] font-semibold text-amber-400 tracking-widest uppercase mt-1">
                Coffee House & Restaurant
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/50 leading-relaxed">
            Premium coffee. Artisanal pastries. A modern luxury dining experience.
          </p>
          <div className="mt-5 flex gap-3">
            {settings?.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 border border-white/10 text-white/60 transition hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 border border-white/10 text-white/60 transition hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings?.tiktok_url && (
              <a href={settings.tiktok_url} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 border border-white/10 text-white/60 transition hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30">
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-amber-400">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/50">
            {["Home", "Menu", "Combos", "Gallery", "Reviews", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-amber-400 transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-amber-400">We deliver to</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/50">
            {["Kuwait City", "Salmiya", "Farwaniya", "Hawally", "Jahra (Express)"].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-amber-400">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/50">
            <li>Kuwait City, Kuwait</li>
            {settings?.call_number && <li>{settings.call_number}</li>}
            {settings?.support_email && <li>{settings.support_email}</li>}
            <li>Open 10:00 AM - 12:00 AM</li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-6 max-w-7xl border-t border-white/8 px-4 pt-6 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Arabica Coffee House & Restaurant. Crafted with passion & elegance.
      </div>
    </footer>
  );
}
