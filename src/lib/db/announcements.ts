import type { Announcement } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  active: boolean;
};

function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    active: row.active,
  };
}

export async function getAnnouncements(activeOnly = false): Promise<Announcement[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as AnnouncementRow[]).map(mapAnnouncement);
}

export async function createAnnouncement(
  title: string,
  content: string,
): Promise<Announcement> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("announcements")
    .insert({ title, content, active: true })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAnnouncement(data as AnnouncementRow);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
