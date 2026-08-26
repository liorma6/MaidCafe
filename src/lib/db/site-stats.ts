import { getSupabaseAdmin } from "@/lib/supabase";

export type SiteStats = {
  totalViews: number;
  dailyViews: number;
};

export async function incrementUniqueVisitor(ipHash: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("increment_all_views", {
    visitor_ip_hash: ipHash,
  });
  if (error) throw new Error(error.message);
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_stats")
    .select("views, daily_views, daily_date")
    .eq("id", "main")
    .single();

  if (error) throw new Error(error.message);

  const today = todayIsoDate();
  const dailyDate = data.daily_date as string | null;

  return {
    totalViews: (data.views as number) ?? 0,
    dailyViews:
      dailyDate === today ? ((data.daily_views as number) ?? 0) : 0,
  };
}
