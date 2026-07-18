/**
 * @file lib/cart.tsx
 * @description Cart state management via React Context.
 *
 * Design decisions:
 * - CartItem and all domain types are imported from `@/types` — no duplication.
 * - Cart state is persisted to localStorage with graceful parse failure handling.
 * - `cartId` is the canonical key for all cart operations (`${id}` or `${id}-${variantName}`).
 *   Components must ALWAYS use `cartId`, never `id`, to correctly handle variants.
 * - `total` and `count` are derived via `useMemo` — never stored as state.
 * - WhatsApp message builder is a pure function — easy to test in isolation.
 */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { MenuItem, CartItem, CheckoutDetails, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const CART_STORAGE_KEY = "arabica-cart-v1";
const DEFAULT_WHATSAPP_NUMBER = "919765985426";

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  add: (item: MenuItem, variant?: ProductVariant) => void;
  remove: (cartId: string) => void;
  setQty: (cartId: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Reads the initial cart state from localStorage. Returns an empty array on
 * any parse failure (e.g. corrupted data from a prior schema change).
 */
function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage may be full or blocked (e.g. private browsing in Safari).
      // Silently ignore — the cart still works in-memory for the session.
    }
  }, [items]);

  const add = useCallback((menuItem: MenuItem, variant?: ProductVariant) => {
    setItems((prev) => {
      const cartId = variant ? `${menuItem.id}-${variant.name}` : menuItem.id;
      const existing = prev.find((p) => p.cartId === cartId);
      if (existing) {
        return prev.map((p) =>
          p.cartId === cartId ? { ...p, qty: p.qty + 1 } : p
        );
      }
      const newItem: CartItem = { ...menuItem, qty: 1, variant, cartId };
      return [...prev, newItem];
    });
  }, []);

  const remove = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const setQty = useCallback((cartId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.cartId !== cartId)
        : prev.map((i) => (i.cartId === cartId ? { ...i, qty } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.variant ? item.variant.price : item.price) * item.qty,
        0
      ),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
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
    }),
    [items, add, remove, setQty, clear, total, count, open, checkoutOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// ─── WhatsApp link builder (pure function) ────────────────────────────────────

/**
 * Constructs a WhatsApp deep-link URL with a pre-filled order message.
 * This is a pure function with no side effects — straightforward to test.
 */
export function buildWhatsAppLink(
  items: CartItem[],
  total: number,
  details?: CheckoutDetails,
  whatsappNumber?: string,
  siteName?: string,
  deliveryFee: number = 0
): string {
  const itemLines = items
    .map((i) => {
      const price = i.variant ? i.variant.price : i.price;
      const variantLabel = i.variant ? ` (${i.variant.name})` : "";
      return `*${i.qty}x* ${i.name}${variantLabel} - ${formatPrice(price * i.qty)}`;
    })
    .join("%0A");

  const cleanNumber = (whatsappNumber ?? DEFAULT_WHATSAPP_NUMBER)
    .replace(/\+/g, "")
    .replace(/\s/g, "");

  const orderHeader = siteName
    ? siteName.toUpperCase()
    : "ARABICA COFFEE HOUSE";

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
    msg += `Subtotal: ${formatPrice(total - deliveryFee)}%0A`;
    msg += `Delivery: ${formatPrice(deliveryFee)}%0A`;
  }

  msg += `*Total Amount: ${formatPrice(total)}*%0A%0A`;
  msg += `==========================%0A`;
  msg += `_Please confirm my order._`;

  return `https://wa.me/${cleanNumber}?text=${msg}`;
}
