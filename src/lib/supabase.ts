/**
 * @file lib/supabase.ts
 * @description Singleton Supabase client.
 *
 * Validates environment variables at module initialization so that misconfigured
 * deployments fail loudly at startup rather than silently at query time.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // In development, throw immediately so the engineer knows what's wrong.
  // In production, log a warning — the app will load but data will not fetch.
  const msg =
    "[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file.";
  if (import.meta.env.DEV) {
    throw new Error(msg);
  } else {
    console.error(msg);
  }
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);
