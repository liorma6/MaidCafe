import { createHash } from "crypto";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

export type SiteStats = {
  totalViews: number;
  dailyViews: number;
};

const BOT_USER_AGENT_PATTERN =
  /bot|crawler|spider|headless|vercelbot|facebookexternalhit|googlebot|bingbot|slurp|duckduckbot|yandexbot|baiduspider|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|applebot|semrush|ahrefs|petalbot|bytespider|gptbot|claudebot|anthropic|curl|wget|python-requests|scrapy|httpclient|java\/|libwww|go-http-client/i;

function isBotUserAgent(userAgent: string): boolean {
  return BOT_USER_AGENT_PATTERN.test(userAgent);
}

function getClientIp(headerStore: Headers): string {
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const clientIp = forwarded.split(",")[0]?.trim();
    if (clientIp) return clientIp;
  }

  const realIp = headerStore.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export async function recordUniqueHomeVisitor(): Promise<void> {
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "";

  if (isBotUserAgent(userAgent)) return;

  const ipHash = hashIp(getClientIp(headerStore));
  await incrementUniqueVisitor(ipHash);
}

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
