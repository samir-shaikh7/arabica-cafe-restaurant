/**
 * @file context/SiteContext.tsx
 * @description Global data provider for the public-facing site.
 *
 * Architecture decisions:
 * - Single `Promise.all` fetch on mount — prevents N×M queries across route changes.
 * - `safeQuery` isolates each query so one table failure never blocks others.
 * - Normalizer functions at the bottom handle schema migration transparently.
 * - `refresh()` allows admin panel changes to propagate without a full reload.
 * - All types are imported from `@/types` — no inline `any`.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type {
  SiteData,
  SiteSettings,
  MenuItem,
  Review,
  GalleryItem,
  Category,
  Promotion,
} from "@/types";

// ─── Context Definition ───────────────────────────────────────────────────────

interface SiteContextValue {
  data: SiteData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SiteContext = createContext<SiteContextValue | undefined>(undefined);

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp_number: "",
  call_number: "",
  support_email: "",
  logo_url: "",
  address: "",
  opening_hours: "",
  delivery_hours: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  restaurant_name: "",
};

const DEFAULT_DATA: SiteData = {
  categories: [],
  menu: [],
  reviews: [],
  promotions: [],
  gallery: [],
  settings: DEFAULT_SETTINGS,
};

// ─── Safe fetch helper ────────────────────────────────────────────────────────

/**
 * Wraps a Supabase query promise. Never throws. Returns `null` on any error
 * and logs a warning so failures are visible in the browser console without
 * crashing the application.
 */
async function safeQuery<T>(
  label: string,
  queryPromise: PromiseLike<{ data: T | null; error: { message: string } | null }>
): Promise<T | null> {
  try {
    const { data, error } = await queryPromise;
    if (error) {
      console.warn(`[SiteContext] Query "${label}" failed:`, error.message);
      return null;
    }
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[SiteContext] Query "${label}" threw:`, message);
    return null;
  }
}

// ─── Field normalizers (schema migration compatibility) ───────────────────────

/**
 * Normalizes a raw Supabase row into a `MenuItem`.
 * Handles legacy column names (e.g. `spice_level` → `spice`, `bestseller` → `is_bestseller`).
 */
function normalizeMenuItem(raw: Record<string, unknown>): MenuItem {
  const imageUrl = String(raw.image_url ?? raw.image ?? "");
  const isBestseller = Boolean(raw.is_bestseller ?? raw.bestseller ?? false);
  const isFeatured = Boolean(raw.is_featured ?? raw.featured ?? false);
  const spice = Number(raw.spice_level ?? raw.spice ?? 1) || 1;

  const rawVariants = raw.variants;
  const variants = Array.isArray(rawVariants)
    ? rawVariants.map((v: unknown) => ({
        name: String((v as Record<string, unknown>).name ?? ""),
        price: Number((v as Record<string, unknown>).price) || 0,
      }))
    : [];

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    description: String(raw.description ?? ""),
    price: Number(raw.price) || 0,
    image: imageUrl,
    image_url: imageUrl,
    category: String(raw.category ?? raw.section_id ?? raw.category_id ?? ""),
    spice,
    veg: Boolean(raw.veg ?? raw.is_veg ?? false),
    is_bestseller: isBestseller,
    is_featured: isFeatured,
    rating: Math.min(5, Math.max(0, Number(raw.rating) || 4.5)),
    variants,
  };
}

/**
 * Normalizes a raw Supabase row into a `Review`.
 * Handles both old schema (name, text) and current schema (author_name, content).
 */
function normalizeReview(raw: Record<string, unknown>): Review {
  const name = String(raw.author_name ?? raw.name ?? "Guest");
  const text = String(raw.content ?? raw.text ?? "");
  const isActive = raw.is_active !== undefined ? Boolean(raw.is_active) : true;

  return {
    id: String(raw.id ?? ""),
    name,
    author_name: name,
    text,
    content: text,
    rating: Math.min(5, Math.max(1, Number(raw.rating) || 5)),
    author_image: String(raw.author_image ?? raw.avatar ?? ""),
    is_active: isActive,
  };
}

/**
 * Normalizes a raw Supabase row into a `GalleryItem`.
 * Defaults `is_active` to `true` when the column is absent from the schema.
 */
function normalizeGalleryItem(raw: Record<string, unknown>): GalleryItem {
  const imageUrl = String(raw.image_url ?? raw.image ?? "");
  const isActive = raw.is_active !== undefined ? Boolean(raw.is_active) : true;

  return {
    id: String(raw.id ?? ""),
    image_url: imageUrl,
    image: imageUrl,
    title: String(raw.title ?? raw.caption ?? ""),
    order_index: Number(raw.order_index) || 0,
    is_active: isActive,
  };
}

/** Normalizes a raw Supabase row into a `Category`. */
function normalizeCategory(raw: Record<string, unknown>): Category {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    icon: String(raw.icon ?? ""),
    order_index: Number(raw.order_index) || 0,
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
  };
}

/** Normalizes a raw Supabase row into a `Promotion`. */
function normalizePromotion(raw: Record<string, unknown>): Promotion {
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? ""),
    subtitle: raw.subtitle ? String(raw.subtitle) : undefined,
    image_url: raw.image_url ? String(raw.image_url) : undefined,
    cta_text: raw.cta_text ? String(raw.cta_text) : undefined,
    is_active: Boolean(raw.is_active ?? false),
  };
}

/** Normalizes settings row into a `SiteSettings` object. */
function normalizeSettings(raw: Record<string, unknown>): SiteSettings {
  return {
    whatsapp_number: String(raw.whatsapp_number ?? ""),
    call_number: String(raw.call_number ?? ""),
    support_email: String(raw.support_email ?? ""),
    logo_url: String(raw.logo_url ?? ""),
    address: String(raw.address ?? ""),
    opening_hours: String(raw.opening_hours ?? ""),
    delivery_hours: String(raw.delivery_hours ?? ""),
    instagram_url: String(raw.instagram_url ?? ""),
    facebook_url: String(raw.facebook_url ?? ""),
    tiktok_url: String(raw.tiktok_url ?? ""),
    restaurant_name: String(raw.restaurant_name ?? raw.name ?? ""),
    about_heading: String(raw.about_heading ?? ""),
    about_description: String(raw.about_description ?? ""),
    about_image_url: String(raw.about_image_url ?? ""),
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // A monotonic counter used to trigger a re-fetch without changing the effect's
  // core dependency. Increment via `refresh()`.
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    let cancelled = false; // prevents stale state updates if the component unmounts mid-fetch

    const fetchSiteData = async () => {
      setLoading(true);
      setError(null);

      // Fetch all tables in parallel — each query is isolated so one failure
      // never blocks the others from succeeding.
      const [
        settingsRaw,
        menuRaw,
        reviewsRaw,
        promotionsRaw,
        galleryRaw,
        categoriesRaw,
      ] = await Promise.all([
        safeQuery(
          "settings",
          supabase.from("settings_site2").select("*").eq("id", "main_config").maybeSingle()
        ),
        safeQuery(
          "menu",
          supabase
            .from("menu_items_site2")
            .select("id, name, description, price, image_url, category, spice_level, veg, is_bestseller, is_featured, rating, variants")
            .eq("is_available", true)
            .order("name", { ascending: true })
            .limit(500)
        ),
        safeQuery(
          "reviews",
          supabase
            .from("reviews_site2")
            .select("id, author_name, content, rating, author_image, is_active")
            .order("created_at", { ascending: false })
            .limit(20)
        ),
        safeQuery(
          "promotions",
          supabase
            .from("promotions_site2")
            .select("*")
            .eq("is_active", true)
            .limit(5)
        ),
        safeQuery(
          "gallery",
          supabase
            .from("gallery_site2")
            .select("id, image_url, title, order_index, is_active")
            .order("order_index", { ascending: true })
            .limit(50)
        ),
        safeQuery(
          "categories",
          supabase
            .from("categories_site2")
            .select("id, name, icon, order_index, is_active")
            .order("order_index", { ascending: true })
            .limit(100)
        ),
      ]);

      // Guard against state updates after unmount (e.g. StrictMode double-invoke)
      if (cancelled) return;

      const menu = (menuRaw ?? []).map((r) => normalizeMenuItem(r as Record<string, unknown>));
      const allReviews = (reviewsRaw ?? []).map((r) => normalizeReview(r as Record<string, unknown>));
      const allGallery = (galleryRaw ?? []).map((r) => normalizeGalleryItem(r as Record<string, unknown>));
      const categories = (categoriesRaw ?? [])
        .map((r) => normalizeCategory(r as Record<string, unknown>))
        .filter((c) => c.is_active);
      const promotions = (promotionsRaw ?? []).map((r) => normalizePromotion(r as Record<string, unknown>));

      const siteData: SiteData = {
        categories,
        menu,
        reviews: allReviews.filter((r) => r.is_active),
        promotions,
        gallery: allGallery.filter((g) => g.is_active),
        settings: settingsRaw
          ? normalizeSettings(settingsRaw as Record<string, unknown>)
          : DEFAULT_SETTINGS,
      };

      setData(siteData);
      setLoading(false);
    };

    fetchSiteData();

    return () => {
      cancelled = true;
    };
  }, [fetchTick]);

  const refresh = () => setFetchTick((t) => t + 1);

  return (
    <SiteContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Provides access to the global site data context.
 * Must be used inside `<SiteProvider>`.
 */
export function useSite(): SiteContextValue {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}

// Re-export types consumed by admin pages and components (single import source)
export type { SiteSettings, MenuItem, Review, GalleryItem, Category, Promotion, SiteData };
