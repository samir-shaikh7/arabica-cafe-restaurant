import logo from "@/assets/logo.png";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export function Footer() {
  const { data: siteData } = useSite();
  const settings = siteData?.settings;
  const logoUrl = settings?.logo_url || logo;

  return (
    <footer
      style={{ background: "oklch(0.16 0.02 50)" }}
      className="py-14 relative overflow-hidden"
    >
      {/* Cinematic warm glow at top of dark footer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-overlay">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.68_0.14_80_/_30%)] to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[oklch(0.42_0.08_50_/_15%)] blur-[150px] animate-ambient-pulse" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/15 shadow-sm shrink-0 bg-white">
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
              <span className="text-[11px] font-semibold text-saffron tracking-widest uppercase mt-1">
                Coffee House & Restaurant
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/45 leading-relaxed">
            Premium coffee. Artisanal pastries. A modern luxury dining experience.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com/arabicacoffeehouse.kw" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md transition-transform hover:scale-110">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/ArabicaCoffeeHouseKuwait" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md transition-transform hover:scale-110">
              <Facebook className="h-5 w-5 fill-current" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-saffron">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/45">
            {["Home", "Menu", "Combos", "Gallery", "Reviews", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-saffron transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-saffron">We deliver to</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/45">
            {["Kuwait City", "Salmiya", "Farwaniya", "Hawally", "Jahra (Express)"].map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-saffron">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/45">
            <li>{settings?.address || "Northern Tower, Old Souk, Block 9, Salmiya, Kuwait"}</li>
            {settings?.call_number && <li>{settings.call_number}</li>}
            {settings?.support_email && <li>{settings.support_email}</li>}
            <li>Open {settings?.opening_hours || "10:00 AM - 12:00 AM"}</li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-6 max-w-7xl border-t border-white/6 px-4 pt-6 text-center text-xs text-white/25">
        © {new Date().getFullYear()} Arabica Coffee House & Restaurant
      </div>
    </footer>
  );
}
