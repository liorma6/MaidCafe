import type { Announcement } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getNextSortOrder } from "@/lib/db/reorder";

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  active: boolean;
  pinned: boolean;
  category: string | null;
  sort_order: number;
};

function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    active: row.active,
    pinned: row.pinned,
    category: row.category || "",
    sortOrder: row.sort_order,
  };
}

export async function getAnnouncements(activeOnly = false): Promise<Announcement[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as AnnouncementRow[]).map(mapAnnouncement);
}

export async function createAnnouncement(input: {
  title: string;
  content: string;
  category?: string;
  pinned?: boolean;
}): Promise<Announcement> {
  const supabase = getSupabaseAdmin();
  const sortOrder = await getNextSortOrder("announcements");

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title: input.title,
      content: input.content,
      category: input.category || "",
      pinned: input.pinned ?? false,
      sort_order: sortOrder,
      active: true,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapAnnouncement(data as AnnouncementRow);
}

export async function updateAnnouncement(
  id: string,
  input: {
    title?: string;
    content?: string;
    category?: string;
    pinned?: boolean;
    active?: boolean;
  },
): Promise<Announcement> {
  const supabase = getSupabaseAdmin();
  const updates: Record<string, unknown> = {};
  if (input.title !== undefined) updates.title = input.title;
  if (input.content !== undefined) updates.content = input.content;
  if (input.category !== undefined) updates.category = input.category;
  if (input.pinned !== undefined) updates.pinned = input.pinned;
  if (input.active !== undefined) updates.active = input.active;

  const { data, error } = await supabase
    .from("announcements")
    .update(updates)
    .eq("id", id)
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
