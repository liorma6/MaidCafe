import type { EventAlbum } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase";

type EventRow = {
  id: string;
  title: string;
  date: string;
  description: string | null;
  cover_image: string | null;
};

type EventImageRow = {
  id: string;
  event_id: string;
  url: string;
  sort_order: number;
};

function mapEvent(
  event: EventRow,
  images: string[],
): EventAlbum {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    description: event.description || "",
    coverImage: event.cover_image || "",
    images,
  };
}

async function fetchEventsWithImages(): Promise<{
  events: EventRow[];
  imagesByEvent: Map<string, string[]>;
}> {
  const supabase = getSupabaseAdmin();
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (eventsError) throw new Error(eventsError.message);
  if (!events?.length) return { events: [], imagesByEvent: new Map() };

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

  return { events: events as EventRow[], imagesByEvent };
}

export async function getEvents(): Promise<EventAlbum[]> {
  const { events, imagesByEvent } = await fetchEventsWithImages();
  return events.map((event) =>
    mapEvent(event, imagesByEvent.get(event.id) || []),
  );
}

export async function getEventById(id: string): Promise<EventAlbum | null> {
  const supabase = getSupabaseAdmin();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) return null;

  const { data: images, error: imagesError } = await supabase
    .from("event_images")
    .select("*")
    .eq("event_id", id)
    .order("sort_order", { ascending: true });

  if (imagesError) throw new Error(imagesError.message);

  const gallery = ((images || []) as EventImageRow[]).map((img) => img.url);
  return mapEvent(event as EventRow, gallery);
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
      cover_image: "",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapEvent(data as EventRow, []);
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

  const { error } = await supabase.from("events").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  const event = await getEventById(id);
  if (!event) throw new Error("אירוע לא נמצא");
  return event;
}

export async function updateEventCover(
  id: string,
  coverImage: string,
): Promise<EventAlbum> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("events")
    .update({ cover_image: coverImage })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const event = await getEventById(id);
  if (!event) throw new Error("אירוע לא נמצא");
  return event;
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

  const event = await getEventById(eventId);
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
