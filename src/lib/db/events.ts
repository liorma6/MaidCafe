import type { EventAlbum } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";

type EventRow = {
  id: string;
  title: string;
  date: string;
  description: string | null;
};

type EventImageRow = {
  id: string;
  event_id: string;
  url: string;
  sort_order: number;
};

export async function getEvents(): Promise<EventAlbum[]> {
  const supabase = getSupabaseAdmin();
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (eventsError) throw new Error(eventsError.message);
  if (!events?.length) return [];

  const eventIds = events.map((event) => event.id);
  const { data: images, error: imagesError } = await supabase
    .from("event_images")
    .select("*")
    .in("event_id", eventIds)
    .order("sort_order", { ascending: true });

  if (imagesError) throw new Error(imagesError.message);

  const imagesByEvent = new Map<string, string[]>();
  for (const image of (images || []) as EventImageRow[]) {
    const list = imagesByEvent.get(image.event_id) || [];
    list.push(image.url);
    imagesByEvent.set(image.event_id, list);
  }

  return (events as EventRow[]).map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    description: event.description || "",
    images: imagesByEvent.get(event.id) || [],
  }));
}

export async function createEvent(input: {
  title: string;
  date: string;
  description?: string;
}): Promise<EventAlbum> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: input.title,
      date: input.date,
      description: input.description || "",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  const event = data as EventRow;
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    description: event.description || "",
    images: [],
  };
}

export async function updateEvent(
  id: string,
  input: { title?: string; date?: string; description?: string },
): Promise<EventAlbum> {
  const supabase = getSupabaseAdmin();
  const updates: Partial<EventRow> = {};
  if (input.title) updates.title = input.title;
  if (input.date) updates.date = input.date;
  if (input.description !== undefined) updates.description = input.description;

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  const events = await getEvents();
  return events.find((event) => event.id === id) || {
    id: data.id,
    title: data.title,
    date: data.date,
    description: data.description || "",
    images: [],
  };
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addEventImage(
  eventId: string,
  url: string,
): Promise<EventAlbum> {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: countError } = await supabase
    .from("event_images")
    .select("sort_order")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (countError) throw new Error(countError.message);

  const nextOrder =
    existing && existing.length > 0 ? (existing[0].sort_order as number) + 1 : 0;

  const { error } = await supabase.from("event_images").insert({
    event_id: eventId,
    url,
    sort_order: nextOrder,
  });

  if (error) throw new Error(error.message);

  const events = await getEvents();
  const event = events.find((item) => item.id === eventId);
  if (!event) throw new Error("אירוע לא נמצא");
  return event;
}

export async function removeEventImage(
  eventId: string,
  url: string,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("event_images")
    .delete()
    .eq("event_id", eventId)
    .eq("url", url);

  if (error) throw new Error(error.message);
}
