import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getStorageBucket,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "./env";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminClient;
}

export function getPublicStorageUrl(path: string): string {
  const supabase = getSupabaseAdmin();
  const { data } = supabase.storage.from(getStorageBucket()).getPublicUrl(path);
  return data.publicUrl;
}
