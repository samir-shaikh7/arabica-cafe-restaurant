import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, User, MessageCircle, Navigation, Loader2 } from "lucide-react";
import { useCart, buildWhatsAppLink, type CheckoutDetails } from "@/lib/cart";
import { useSite } from "@/context/SiteContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

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
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutDrawer() {
  const { checkoutOpen, setCheckoutOpen, items, total } = useCart();
  const [locating, setLocating] = useState(false);
  const [locationLink, setLocationLink] = useState<string | undefined>();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      landmark: "",
      notes: "",
    },
  });

  const shareLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://maps.google.com/?q=${latitude},${longitude}`;
        setLocationLink(link);

        // Auto-fill the address field with the location link
        form.setValue("address", `📍 My Live Location: ${link}`, {
          shouldValidate: true,
          shouldDirty: true
        });

        setLocating(false);
        toast.success("Location added to address!");
      },
      (error) => {
        setLocating(false);
        let msg = "Could not get your location";
        if (error.code === 1) msg = "Location permission denied";
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };


  const { data: siteData } = useSite();

  const onSubmit = (values: CheckoutFormValues) => {
    const details: CheckoutDetails = {
      ...values,
      locationLink,
    };

    const link = buildWhatsAppLink(
      items,
      total,
      details,
      siteData.settings.whatsapp_number,
      "Arabica Coffee House & Restaurant"
    );
    window.open(link, "_blank");
    setCheckoutOpen(false);
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <Drawer open={checkoutOpen} onOpenChange={setCheckoutOpen}>
      <DrawerContent className="glass border-none max-h-[95vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-2xl font-bold">
              Checkout <span className="text-gradient-flame">Details</span>
            </DrawerTitle>
            <p className="text-sm text-foreground/60">
              Please provide your delivery information to complete the order.
            </p>
          </DrawerHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          placeholder="Enter your name"
                          className="glass border-none pl-10 focus-visible:ring-primary"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          className="glass border-none pl-10 focus-visible:ring-primary"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            field.onChange(val);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                        Delivery Address
                      </FormLabel>
                      <button
                        type="button"
                        onClick={shareLocation}
                        disabled={locating}
                        className="flex items-center gap-1.5 text-xs font-bold text-primary transition hover:opacity-80 disabled:opacity-50"
                      >
                        {locating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Navigation className="h-3 w-3" />
                        )}
                        {locationLink ? "Location Shared" : "Share Live Location"}
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-primary" />
                        <Textarea
                          placeholder="House/Flat No., Building, Street Name..."
                          className="glass border-none pl-10 min-h-[80px] focus-visible:ring-primary"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                        Landmark (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Near XYZ shop..."
                          className="glass border-none focus-visible:ring-primary"
                          {...field}
                        />
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
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                        Order Notes (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Extra hot, oat milk, less sugar..."
                          className="glass border-none focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 rounded-full gradient-primary text-primary-foreground font-bold text-lg btn-glow hover:scale-[1.01] active:scale-95 transition"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Place Order on WhatsApp
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" className="w-full mt-2 text-foreground/40 hover:text-foreground">
                    Go Back to Cart
                  </Button>
                </DrawerClose>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
