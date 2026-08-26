import type { AboutInfoSection, AboutPage } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";

type AboutRow = {
  id: string;
  title: string;
  content: string;
  image: string;
  info_sections: unknown;
  updated_at: string;
};

function parseInfoSections(raw: unknown): AboutInfoSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((section): section is Record<string, unknown> =>
      Boolean(section && typeof section === "object"),
    )
    .map((section) => ({
      title: String(section.title ?? ""),
      items: Array.isArray(section.items)
        ? section.items
            .filter((item): item is Record<string, unknown> =>
              Boolean(item && typeof item === "object"),
            )
            .map((item) => ({
              label: String(item.label ?? ""),
              value: String(item.value ?? ""),
            }))
        : [],
    }));
}

function mapAbout(row: AboutRow): AboutPage {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    image: row.image ?? "",
    infoSections: parseInfoSections(row.info_sections),
    updatedAt: row.updated_at,
  };
}

export async function getAboutPage(): Promise<AboutPage> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("about_page")
    .select("*")
    .eq("id", "main")
    .single();

  if (error) throw new Error(error.message);
  return mapAbout(data as AboutRow);
}

export async function updateAboutPage(input: {
  title: string;
  content: string;
  image?: string;
  infoSections?: AboutInfoSection[];
}): Promise<AboutPage> {
  const supabase = getSupabaseAdmin();
  const payload: Record<string, unknown> = {
    title: input.title,
    content: input.content,
    updated_at: new Date().toISOString(),
  };

  if (input.image !== undefined) {
    payload.image = input.image;
  }

  if (input.infoSections !== undefined) {
    payload.info_sections = input.infoSections;
  }

  const { data, error } = await supabase
    .from("about_page")
    .update(payload)
    .eq("id", "main")
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAbout(data as AboutRow);
}
