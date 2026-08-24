import type { AboutPage } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";

type AboutRow = {
  id: string;
  title: string;
  content: string;
  updated_at: string;
};

function mapAbout(row: AboutRow): AboutPage {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
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
}): Promise<AboutPage> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("about_page")
    .update({
      title: input.title,
      content: input.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "main")
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAbout(data as AboutRow);
}
