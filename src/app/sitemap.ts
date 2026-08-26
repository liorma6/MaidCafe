import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/db/events";
import { SITE_URL } from "@/lib/constants";

const STATIC_ROUTES = [
  "",
  "/about",
  "/events",
  "/team",
  "/partnerships",
  "/join",
  "/merch",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  let eventEntries: MetadataRoute.Sitemap = [];
  try {
    const events = await getEvents();
    eventEntries = events.map((event) => ({
      url: `${SITE_URL}/events/${event.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Events unavailable during build — static routes still published.
  }

  return [...staticEntries, ...eventEntries];
}
