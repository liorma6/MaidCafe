"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error(
        "חסרה הגדרת Supabase בדפדפן (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)",
      );
    }
    browserClient = createClient(url, anonKey);
  }
  return browserClient;
}
