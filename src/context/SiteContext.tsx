import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;        // normalized field (from image_url OR image)
  image_url: string;    // keep original too for compatibility
  category: string;
  spice: number;
  veg: boolean;
  is_bestseller: boolean;
  is_featured: boolean;
  rating: number;
}

export interface Review {
  id: string;
  name: string;         // normalized (from author_name OR name)
  author_name: string;  // keep original
  text: string;         // normalized (from content OR text)
  content: string;      // keep original
  rating: number;
  author_image: string;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  image_url: string;    // normalized
  image: string;        // keep original fallback
  title: string;
  order_index: number;
  is_active: boolean;
}

export interface SiteData {
  categories: any[];
  menu: MenuItem[];
  reviews: Review[];
  promotions: any[];
  gallery: GalleryItem[];
  settings: SiteSettings;
}

interface SiteContextType {
  data: SiteData;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

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

// ─── Safe fetch helper — never throws, returns [] or null on error ──────────
async function safeQuery(
  label: string,
  queryPromise: any
): Promise<any> {
  try {
    const { data, error } = await queryPromise;
    if (error) {
      console.warn(`[SiteContext] ${label} fetch error:`, error.message);
      return null;
    }
    console.log(`[SiteContext] ${label} fetched:`, Array.isArray(data) ? `${(data as any[]).length} rows` : data);
    return data;
  } catch (err: any) {
    console.warn(`[SiteContext] ${label} exception:`, err?.message ?? err);
    return null;
  }
}

// ─── Field normalizers (migration compatibility) ─────────────────────────────
function normalizeMenuItem(raw: any): MenuItem {
  const imageUrl = raw.image_url || raw.image || "";
  const isBestseller = raw.is_bestseller ?? raw.bestseller ?? false;
  const isFeatured = raw.is_featured ?? raw.featured ?? false;
  const spice = raw.spice_level ?? raw.spice ?? 1;

  const item: MenuItem = {
    id: raw.id,
    name: raw.name ?? "",
    description: raw.description ?? "",
    price: Number(raw.price) || 0,
    image: imageUrl,
    image_url: imageUrl,
    category: raw.category || raw.section_id || raw.category_id || "",
    spice: Number(spice) || 1,
    veg: raw.veg ?? raw.is_veg ?? false,
    is_bestseller: Boolean(isBestseller),
    is_featured: Boolean(isFeatured),
    rating: Number(raw.rating) || 4.5,
  };

  console.log(`[SiteContext] Menu item "${item.name}": is_bestseller=${item.is_bestseller}, image="${item.image}", category="${item.category}"`);
  return item;
}

function normalizeReview(raw: any): Review {
  // Support both old schema (name, text) and new schema (author_name, content)
  const name = raw.author_name || raw.name || "Guest";
  const text = raw.content || raw.text || "";
  const isActive = raw.is_active ?? raw.active ?? true;

  const review: Review = {
    id: raw.id,
    name,
    author_name: name,
    text,
    content: text,
    rating: Math.min(5, Math.max(1, Number(raw.rating) || 5)),
    author_image: raw.author_image || raw.avatar || "",
    is_active: Boolean(isActive),
  };

  console.log(`[SiteContext] Review "${review.name}": is_active=${review.is_active}, rating=${review.rating}, text="${review.text.substring(0, 40)}..."`);
  return review;
}

function normalizeGalleryItem(raw: any): GalleryItem {
  // Support both image_url and image field names
  const imageUrl = raw.image_url || raw.image || "";
  // is_active: if column doesn't exist it'll be undefined → default to true (show image)
  const isActive = raw.is_active !== undefined ? Boolean(raw.is_active) : true;

  const item: GalleryItem = {
    id: raw.id,
    image_url: imageUrl,
    image: imageUrl,
    title: raw.title || raw.caption || "",
    order_index: Number(raw.order_index) || 0,
    is_active: isActive,
  };

  console.log(`[SiteContext] Gallery "${item.title || item.id}": is_active=${item.is_active}, image="${item.image_url.substring(0, 60)}..."`);
  return item;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTick, setFetchTick] = useState(0);

  useEffect(() => {
    const fetchSiteData = async () => {
      setLoading(true);
      setError(null);
      console.log("[SiteContext] Starting full data fetch...");

      // ── Fetch all tables in parallel — each is isolated so one failure ──
      // ── doesn't block others. ───────────────────────────────────────────
      // Note: categories fetch tries with is_active=true first; if that
      // column doesn't exist in the schema, we fall back to fetching all.
      const categoriesActiveRes = supabase.from("categories_site2").select("*").eq("is_active", true).order("order_index", { ascending: true });
      const categoriesAllRes = supabase.from("categories_site2").select("*").order("order_index", { ascending: true });

      const [
        settingsRaw,
        categoriesActiveRaw,
        menuRaw,
        reviewsRaw,
        promotionsRaw,
        galleryRaw,
        categoriesAllRaw,
      ] = await Promise.all([
        safeQuery("settings", supabase.from("settings_site2").select("*").eq("id", "main_config").maybeSingle()),
        safeQuery("categories(active)", categoriesActiveRes),
        safeQuery("menu", supabase.from("menu_items_site2").select("*").eq("is_available", true).order("name", { ascending: true })),
        safeQuery("reviews", supabase.from("reviews_site2").select("*").order("created_at", { ascending: false })),
        safeQuery("promotions", supabase.from("promotions_site2").select("*").eq("is_active", true)),
        safeQuery("gallery", supabase.from("gallery_site2").select("*").order("order_index", { ascending: true })),
        safeQuery("categories(all)", categoriesAllRes),
      ]);

      // Use active categories if available, fall back to all categories
      const categoriesRaw = (categoriesActiveRaw && categoriesActiveRaw.length > 0)
        ? categoriesActiveRaw
        : (categoriesAllRaw || []);

      // ── Map menu items ────────────────────────────────────────────────────
      const menu = (menuRaw || []).map(normalizeMenuItem);
      const bestsellers = menu.filter((m: any) => m.is_bestseller);
      console.log(`[SiteContext] Menu: ${menu.length} items total, ${bestsellers.length} bestsellers`);

      // ── Map reviews ───────────────────────────────────────────────────────
      // Filter active reviews HERE after normalization (don't double-filter in component)
      const allReviews = (reviewsRaw || []).map(normalizeReview);
      const activeReviews = allReviews.filter((r: any) => r.is_active);
      console.log(`[SiteContext] Reviews: ${allReviews.length} total, ${activeReviews.length} active`);

      // ── Map gallery ───────────────────────────────────────────────────────
      const allGallery = (galleryRaw || []).map(normalizeGalleryItem);
      const activeGallery = allGallery.filter((g: any) => g.is_active);
      console.log(`[SiteContext] Gallery: ${allGallery.length} total, ${activeGallery.length} active`);

      // ── Map categories ───────────────────────────────────────────────────
      const categories = categoriesRaw || [];
      console.log(`[SiteContext] Categories: ${categories.length} active`);

      // ── Map settings ──────────────────────────────────────────────────────
      const settings: SiteSettings = settingsRaw
        ? {
            whatsapp_number: (settingsRaw as any).whatsapp_number || "",
            call_number: (settingsRaw as any).call_number || "",
            support_email: (settingsRaw as any).support_email || "",
            logo_url: (settingsRaw as any).logo_url || "",
            address: (settingsRaw as any).address || "",
            opening_hours: (settingsRaw as any).opening_hours || "",
            delivery_hours: (settingsRaw as any).delivery_hours || "",
            instagram_url: (settingsRaw as any).instagram_url || "",
            facebook_url: (settingsRaw as any).facebook_url || "",
            tiktok_url: (settingsRaw as any).tiktok_url || "",
            restaurant_name: (settingsRaw as any).restaurant_name || (settingsRaw as any).name || "",
          }
        : DEFAULT_SETTINGS;
      console.log("[SiteContext] Settings:", settings);

      const siteData: SiteData = {
        categories,
        menu,
        reviews: activeReviews,
        promotions: (promotionsRaw as any[]) || [],
        gallery: activeGallery,
        settings,
      };

      console.log("[SiteContext] ✅ Data fetch complete:", {
        categories: categories.length,
        menu: menu.length,
        reviews: activeReviews.length,
        promotions: ((promotionsRaw as any[]) || []).length,
        gallery: activeGallery.length,
      });

      setData(siteData);
      setLoading(false);
    };

    fetchSiteData();
  }, [fetchTick]);

  const refresh = () => {
    console.log("[SiteContext] Manual refresh triggered");
    setFetchTick((t) => t + 1);
  };

  return (
    <SiteContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
}
