import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  User,
  Navigation,
  Banknote,
  Wallet,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { useCart, buildWhatsAppLink, type CheckoutDetails } from "@/lib/cart";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useSite } from "@/context/SiteContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[\+0-9\s]+$/, "Please enter a valid phone number")
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  address: z.string().min(5, "Please provide a complete delivery address"),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "gcash", "link"]).default("cash"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const MIN_ORDER_AMOUNT = 5.000;
const FREE_DELIVERY_THRESHOLD = 15.000;
const DELIVERY_FEE = 0.500;

function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const { data: siteData } = useSite();
  const [step, setStep] = useState<1 | 2>(1); // 1: Cart, 2: Checkout Details
  const [isLocating, setIsLocating] = useState(false);
  const navigate = useNavigate();

  const subtotal = total || 0;
  const isDeliveryFree = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isDeliveryFree ? 0 : DELIVERY_FEE;
  const finalTotal = subtotal + deliveryFee;
  const minOrderNotMet = subtotal < MIN_ORDER_AMOUNT;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      landmark: "",
      notes: "",
      paymentMethod: "cash",
    },
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.display_name) {
            form.setValue("address", data.display_name);
          } else {
            alert("Could not fetch address details.");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          alert("Error finding your location.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Please enable location services to use this feature.");
        setIsLocating(false);
      }
    );
  };

  const onSubmit = (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const details: CheckoutDetails = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      landmark: data.landmark,
      notes: data.notes + ` (Payment: ${data.paymentMethod.toUpperCase()})`,
    };

    const link = buildWhatsAppLink(
      items,
      finalTotal,
      details,
      siteData?.settings?.whatsapp_number,
      siteData?.settings?.restaurant_name,
      deliveryFee
    );

    window.open(link, "_blank");
    toast.success("Redirecting to WhatsApp to complete your order!");
    clear();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-atmosphere text-foreground flex flex-col relative">
      <div className="bg-noise" />
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
              <div className="h-24 w-24 rounded-full bg-card shadow-soft flex items-center justify-center mb-6">
                <ShoppingBag className="h-10 w-10 text-primary/50" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Your cart is empty
              </h1>
              <p className="text-foreground/55 max-w-md mb-8">
                Looks like you haven't added anything to your cart yet. Browse our
                menu to find something delicious.
              </p>
              <Link
                to="/"
                className="rounded-full gradient-primary px-8 py-3.5 font-bold tracking-wide text-primary-foreground shadow-warm hover:scale-105 transition-transform"
              >
                Explore Menu
              </Link>
            </div>
          ) : (
            <div className="animate-fade-in">
              <button
                onClick={() => (step === 2 ? setStep(1) : navigate({ to: "/" }))}
                className="flex items-center gap-2 text-sm font-semibold text-foreground/55 hover:text-primary mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 2 ? "Back to Cart" : "Continue Shopping"}
              </button>

              <h1 className="text-3xl md:text-4xl font-bold mb-8">
                {step === 1 ? "Your Shopping Cart" : "Complete your Order"}
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Form / Items */}
                <div className="lg:col-span-8 space-y-6">
                  {step === 1 ? (
                    <div className="space-y-4">
                      {items.map((i) => (
                        <div
                          key={i.id}
                          className="flex items-center gap-4 p-4 bg-card rounded-3xl shadow-soft border border-border/50 animate-fade-in"
                        >
                          <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden bg-muted">
                            <img
                              src={i.image || ""}
                              alt={i.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <h3 className="font-bold text-base sm:text-lg text-foreground truncate">
                              {i.name}
                            </h3>
                            <div className="mt-1 font-black text-gradient-warm text-sm sm:text-base">
                              KD {Number((i.price || 0) * i.qty).toFixed(3)}
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <div className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1">
                                <button
                                  onClick={() => setQty(i.id, i.qty - 1)}
                                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-4 text-center font-bold text-sm">
                                  {i.qty}
                                </span>
                                <button
                                  onClick={() => setQty(i.id, i.qty + 1)}
                                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-muted hover:bg-primary/15 hover:text-primary transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => remove(i.id)}
                            className="p-3 text-foreground/35 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors self-start sm:self-center"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <div className="pt-2">
                        <button
                          onClick={clear}
                          className="text-sm font-semibold text-foreground/45 hover:text-red-500 transition-colors uppercase tracking-wider"
                        >
                          Clear All Items
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* 1. Personal Details */}
                        <div className="bg-card rounded-3xl shadow-soft border border-border/50 p-6 sm:p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                            <h2 className="text-xl font-bold">Personal Details</h2>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-2">Full Name</div>
                                  <FormControl>
                                    <div className="relative">
                                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
                                      <Input placeholder="Enter your name" className="glass h-12 pl-12 rounded-2xl border-none shadow-inner" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-2">Phone Number</div>
                                  <FormControl>
                                    <div className="relative">
                                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
                                      <Input type="tel" placeholder="e.g. 9876543210" className="glass h-12 pl-12 rounded-2xl border-none shadow-inner" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* 2. Delivery Location */}
                        <div className="bg-card rounded-3xl shadow-soft border border-border/50 p-6 sm:p-8">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                              <h2 className="text-xl font-bold">Delivery Location</h2>
                            </div>
                            <button
                              type="button"
                              onClick={handleGetLocation}
                              disabled={isLocating}
                              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-colors w-fit self-start sm:self-auto"
                            >
                              <Navigation className="h-4 w-4" />
                              {isLocating ? "Locating..." : "Use Live Location"}
                            </button>
                          </div>
                          <div className="space-y-5">
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-2">Complete Address</div>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-primary/50" />
                                      <Textarea placeholder="Street name, Building, Floor/Unit No." className="glass min-h-[100px] pl-12 pt-4 rounded-2xl border-none shadow-inner resize-none" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <FormField
                                control={form.control}
                                name="landmark"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-2">Landmark (Optional)</div>
                                    <FormControl>
                                      <Input placeholder="e.g. Near Blue Gate" className="glass h-12 rounded-2xl border-none shadow-inner px-4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                  <FormItem>
                                    <div className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-2">Order Notes</div>
                                    <FormControl>
                                      <Input placeholder="e.g. Extra sauce" className="glass h-12 rounded-2xl border-none shadow-inner px-4" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3. Payment Method */}
                        <div className="bg-card rounded-3xl shadow-soft border border-border/50 p-6 sm:p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                            <h2 className="text-xl font-bold">Select Payment Method</h2>
                          </div>

                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <label
                                      className={`relative flex flex-col items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${field.value === "cash"
                                          ? "border-primary bg-primary/4 shadow-sm"
                                          : "border-border/50 hover:border-primary/20"
                                        }`}
                                    >
                                      <input type="radio" value="cash" className="sr-only" checked={field.value === "cash"} onChange={field.onChange} />
                                      {field.value === "cash" && <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-primary" />}
                                      <div className={`h-12 w-12 rounded-full mb-3 flex items-center justify-center ${field.value === "cash" ? "bg-primary text-white" : "bg-muted text-foreground/55"}`}>
                                        <Banknote className="h-6 w-6" />
                                      </div>
                                      <span className="font-bold text-sm text-center">Cash on Delivery</span>
                                      <span className="text-[10px] text-foreground/45 font-semibold uppercase tracking-wider mt-1">Safe & Simple</span>
                                    </label>

                                    <label
                                      className={`relative flex flex-col items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${field.value === "gcash"
                                          ? "border-primary bg-primary/4 shadow-sm"
                                          : "border-border/50 hover:border-primary/20"
                                        }`}
                                    >
                                      <input type="radio" value="gcash" className="sr-only" checked={field.value === "gcash"} onChange={field.onChange} />
                                      {field.value === "gcash" && <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-primary" />}
                                      <div className={`h-12 w-12 rounded-full mb-3 flex items-center justify-center ${field.value === "gcash" ? "bg-primary text-white" : "bg-muted text-foreground/55"}`}>
                                        <Wallet className="h-6 w-6" />
                                      </div>
                                      <span className="font-bold text-sm text-center">G-Cash</span>
                                      <span className="text-[10px] text-foreground/45 font-semibold uppercase tracking-wider mt-1">Quick & Easy</span>
                                    </label>

                                    <label
                                      className={`relative flex flex-col items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${field.value === "link"
                                          ? "border-primary bg-primary/4 shadow-sm"
                                          : "border-border/50 hover:border-primary/20"
                                        }`}
                                    >
                                      <input type="radio" value="link" className="sr-only" checked={field.value === "link"} onChange={field.onChange} />
                                      {field.value === "link" && <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-primary" />}
                                      <div className={`h-12 w-12 rounded-full mb-3 flex items-center justify-center ${field.value === "link" ? "bg-primary text-white" : "bg-muted text-foreground/55"}`}>
                                        <CreditCard className="h-6 w-6" />
                                      </div>
                                      <span className="font-bold text-sm text-center">Payment Link</span>
                                      <span className="text-[10px] text-foreground/45 font-semibold uppercase tracking-wider mt-1">Secure Pay</span>
                                    </label>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  )}
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-4">
                  <div className="bg-card rounded-[2rem] shadow-elegant border border-border/50 p-6 sm:p-8 sticky top-28">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6">Order summary</h2>

                    <div className="space-y-4 text-sm font-semibold text-foreground/65 mb-6">
                      <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span className="text-foreground">KD {subtotal.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Delivery</span>
                        {isDeliveryFree ? (
                          <span className="text-green-600 uppercase tracking-wider text-xs font-bold bg-green-50 px-2 py-1 rounded-md">Free</span>
                        ) : (
                          <span className="text-foreground">KD {deliveryFee.toFixed(3)}</span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-border/50 pt-5 pb-5">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-black text-primary">KD {finalTotal.toFixed(3)}</span>
                      </div>
                    </div>

                    {minOrderNotMet ? (
                      <div className="mb-6 rounded-full bg-red-50 border border-red-100 py-3 text-center text-[13px] font-bold text-red-500">
                        Minimum order amount is KD {MIN_ORDER_AMOUNT.toFixed(3)}.
                      </div>
                    ) : !isDeliveryFree ? (
                      <div className="mb-6 rounded-full bg-secondary border border-border py-3 text-center text-[13px] font-bold text-primary">
                        Add KD {(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(3)} more for <span className="underline decoration-2 underline-offset-2">free delivery</span>.
                      </div>
                    ) : null}

                    {step === 1 ? (
                      <button
                        onClick={() => setStep(2)}
                        disabled={minOrderNotMet}
                        className={`w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold text-white transition-all ${minOrderNotMet
                            ? "bg-foreground/25 cursor-not-allowed"
                            : "gradient-primary shadow-warm hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                      >
                        Checkout Now <ArrowRight className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        form="checkout-form"
                        disabled={minOrderNotMet}
                        className={`w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold text-white transition-all ${minOrderNotMet
                            ? "bg-foreground/25 cursor-not-allowed"
                            : "gradient-primary shadow-warm hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                      >
                        <MessageCircle className="h-5 w-5" /> Order on WhatsApp
                      </button>
                    )}

                    <div className="mt-6 text-center text-[10px] uppercase tracking-widest font-bold text-foreground/35">
                      Secure WhatsApp Ordering
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
