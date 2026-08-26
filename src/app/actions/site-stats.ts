"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { incrementUniqueVisitor } from "@/lib/db/site-stats";

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
