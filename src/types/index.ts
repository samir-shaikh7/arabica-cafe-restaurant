/**
 * @file types/index.ts
 * @description Canonical domain type definitions for the entire application.
 *
 * RULES:
 * - All domain types live here. Never define domain types inside components.
 * - Never use `any`. Use `unknown` and narrow at runtime boundaries.
 * - Keep types flat and serializable (no class instances, no functions).
 */

// ─── Database / Domain Types ─────────────────────────────────────────────────

export interface ProductVariant {
  name: string;
  price: number;
}

/**
 * A normalized menu item suitable for display and cart operations.
 * The `image` field is always set (normalized from image_url OR image column).
 * The `image_url` alias is preserved for backward compatibility with components
 * that were written against the older field name.
 */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Primary image field — always populated (normalized from image_url or image). */
  image: string;
  /** Alias of `image`. Preserved for backward compatibility. */
  image_url: string;
  category: string;
  spice: number;
  veg: boolean;
  is_bestseller: boolean;
  is_featured: boolean;
  rating: number;
  variants: ProductVariant[];
}

/**
 * A normalized review record.
 * `name` / `author_name` are both set to the same value (normalized).
 * `text` / `content` are both set to the same value (normalized).
 */
export interface Review {
  id: string;
  name: string;
  /** Alias of `name`. Preserved for backward compatibility. */
  author_name: string;
  text: string;
  /** Alias of `text`. Preserved for backward compatibility. */
  content: string;
  rating: number;
  author_image: string;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  /** Primary image URL — normalized from image_url or image column. */
  image_url: string;
  /** Alias of `image_url`. Preserved for backward compatibility. */
  image: string;
  title: string;
  order_index: number;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  cta_text?: string;
  is_active: boolean;
}

export interface SiteSettings {
  whatsapp_number: string;
  call_number: string;
  support_email: string;
  logo_url: string;
  address?: string;
  opening_hours?: string;
  delivery_hours?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  restaurant_name?: string;
  about_heading?: string;
  about_description?: string;
  about_image_url?: string;
}

export interface SiteData {
  categories: Category[];
  menu: MenuItem[];
  reviews: Review[];
  promotions: Promotion[];
  gallery: GalleryItem[];
  settings: SiteSettings;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

/**
 * A line item in the shopping cart.
 * `cartId` is the stable identity key: `${productId}` for simple items,
 * `${productId}-${variantName}` for variant items.
 */
export interface CartItem extends MenuItem {
  qty: number;
  variant?: ProductVariant;
  /** Stable cart identity. Use this — never `id` — for qty/remove operations. */
  cartId: string;
}

export interface CheckoutDetails {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  notes?: string;
  locationLink?: string;
  paymentMethod?: string;
}
