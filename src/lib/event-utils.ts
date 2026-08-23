import type { EventAlbum } from "@/lib/types";

export function getEventDisplayCover(event: EventAlbum): string | null {
  if (event.coverImage) return event.coverImage;
  if (event.images.length > 0) return event.images[0];
  return null;
}

export function getEventPhotoCount(event: EventAlbum): number {
  return event.images.length + event.videos.length + (event.coverImage ? 1 : 0);
}
