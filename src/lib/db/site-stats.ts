import { getSupabaseAdmin } from "@/lib/supabase";

export async function incrementSiteViews(): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("increment_site_views");
  if (error) throw new Error(error.message);
}

export async function getSiteViews(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_stats")
    .select("views")
    .eq("id", "main")
    .single();

  if (error) throw new Error(error.message);
  return (data.views as number) ?? 0;
}
