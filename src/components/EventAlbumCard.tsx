import Link from "next/link";
import type { EventAlbum } from "@/lib/types";
import { EventAlbumCover } from "@/components/EventPhotoGallery";
import {
  getEventDisplayCover,
  getEventPhotoCount,
} from "@/lib/event-utils";

interface Props {
  event: EventAlbum;
}

export default function EventAlbumCard({ event }: Props) {
  const cover = getEventDisplayCover(event);
  const count = getEventPhotoCount(event);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block overflow-hidden rounded-xl border-2 border-pink-200 bg-white transition hover:border-pink-400 hover:shadow-lg"
    >
      {cover ? (
        <EventAlbumCover src={cover} alt={event.title} />
      ) : (
        <div className="flex aspect-[4/5] items-center justify-center bg-pink-50 text-4xl text-pink-200">
          📸
        </div>
      )}
      <div className="p-3">
        <h2 className="truncate font-bold text-pink-800 group-hover:text-pink-600">
          {event.title}
        </h2>
        <p className="mt-0.5 text-xs text-pink-400">
          {count > 0 ? `${count} פריטים` : "ריק"}
        </p>
      </div>
    </Link>
  );
}
