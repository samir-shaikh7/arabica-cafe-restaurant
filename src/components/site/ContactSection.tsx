import { Phone, Clock, MapPin, MessageCircle } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function ContactSection() {
  const { data: siteData } = useSite();
  const { settings } = siteData;
  const revealRef = useScrollReveal();

  const contactCards = [
    {
      icon: MapPin,
      title: "Our Cafe",
      text: "Kuwait City, Kuwait",
    },
    {
      icon: Phone,
      title: "Call us",
      text: settings.call_number || "Number not provided",
    },
    {
      icon: Clock,
      title: "Open daily",
      text: "10:00 AM - 12:00 AM",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      text: "Order instantly via WhatsApp",
    },
  ];

  const waNumber = settings.whatsapp_number?.replace(/\D/g, "") || "";
  const callNumber = settings.call_number?.replace(/\s/g, "") || "";

  return (
    <section id="contact" ref={revealRef} className="scroll-mt-24 py-6 md:py-8 section-contact relative overflow-hidden">

      {/* Warm blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="reveal mb-6 text-center">
          <div className="mb-3 inline-block rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-xs uppercase tracking-widest text-amber-700 font-semibold">
            Visit · Order · Connect
          </div>
          <h2 className="text-4xl font-bold md:text-6xl text-foreground">
            Hungry? <span className="text-gradient-flame">Reach out.</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="reveal space-y-4">
            {contactCards.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl bg-white border border-amber-100 p-5 shadow-soft hover:shadow-warm transition-shadow duration-300 group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-warm group-hover:scale-105 transition-transform">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{c.title}</div>
                  <div className="text-sm text-foreground/60 mt-0.5">{c.text}</div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm hover:scale-105 hover:shadow-elegant transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp Now
              </a>
              <a
                href={`tel:${callNumber}`}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-6 py-3 font-semibold text-foreground/80 shadow-soft hover:border-primary/30 hover:text-primary hover:shadow-warm transition-all duration-300 group"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
            </div>
          </div>

          <div className="reveal overflow-hidden rounded-3xl shadow-elegant border border-amber-100">
            <iframe
              title="Map"
              src="https://www.google.com/maps?q=Arabica+Coffee+House&output=embed"
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
