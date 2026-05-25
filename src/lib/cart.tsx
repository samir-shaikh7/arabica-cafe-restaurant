import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  veg?: boolean;
  spice?: number;
  rating?: number;
  badge?: string;
};

export type CartLine = MenuItem & { qty: number };

type CartCtx = {
  items: CartLine[];
  add: (m: MenuItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export const WHATSAPP_NUMBER = "919765985426"; // TODO: replace with real number
export const CURRENCY = "KD ";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem("cart-items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const add = (m: MenuItem) => {
    // Fast response feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast.success(`Added ${m.name} to cart`, { duration: 1500 });
    
    setItems((prev) => {
      const found = prev.find((p) => p.id === m.id);
      if (found) return prev.map((p) => (p.id === m.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...m, qty: 1 }];
    });
  };

  const remove = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    setItems((p) => p.filter((i) => i.id !== id));
  };
  
  const setQty = (id: string, qty: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    setItems((p) =>
      qty <= 0 ? p.filter((i) => i.id !== id) : p.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  };
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <Ctx.Provider
      value={{
        items,
        add,
        remove,
        setQty,
        clear,
        total,
        count,
        open,
        setOpen,
        checkoutOpen,
        setCheckoutOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}


export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

export type CheckoutDetails = {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  notes?: string;
  locationLink?: string;
};

export function buildWhatsAppLink(
  items: CartLine[], 
  total: number, 
  details?: CheckoutDetails, 
  whatsappNumber?: string,
  siteName?: string,
  deliveryFee: number = 0
) {
  const itemLines = items
    .map((i) => `*${i.qty}x* ${i.name} - KD ${Number(i.price * i.qty || 0).toFixed(3)}`)
    .join("%0A");

  const finalNum = whatsappNumber || WHATSAPP_NUMBER;
  const cleanNum = finalNum.replace(/\+/g, "").replace(/\s/g, "");
  const orderHeader = siteName ? siteName.toUpperCase() : "ARABICA COFFEE HOUSE";

  let msg = `*NEW ORDER FROM ${orderHeader}*%0A`;
  msg += `==========================%0A%0A`;

  if (details) {
    msg += `*Customer Details*%0A`;
    msg += `👤 Name: ${details.name}%0A`;
    msg += `📞 Phone: ${details.phone}%0A`;
    msg += `📍 Address: ${details.address}%0A`;
    if (details.landmark) msg += `🏢 Landmark: ${details.landmark}%0A`;
    if (details.locationLink) msg += `🌍 Live Location: ${details.locationLink}%0A`;
    if (details.notes) msg += `%0A*Note:* _${details.notes}_%0A`;
    msg += `%0A`;
  }

  msg += `*Order Summary*%0A`;
  msg += `${itemLines}%0A%0A`;
  
  if (deliveryFee > 0) {
    msg += `Subtotal: KD ${Number(total - deliveryFee || 0).toFixed(3)}%0A`;
    msg += `Delivery: KD ${Number(deliveryFee).toFixed(3)}%0A`;
  }
  
  msg += `*Total Amount: KD ${Number(total || 0).toFixed(3)}*%0A%0A`;
  msg += `==========================%0A`;
  msg += `_Please confirm my order._`;

  return `https://wa.me/${cleanNum}?text=${msg}`;
}

