import Link from "next/link";
import Image from "next/image";
import type { EventAlbum } from "@/lib/types";
import {
  getEventDisplayCover,
  getEventPhotoCount,
} from "@/lib/event-utils";
import { isRemoteImage } from "@/lib/image-utils";

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
      <div className="relative aspect-square overflow-hidden bg-pink-50">
        {cover ? (
          <Image
            src={cover}
            alt={event.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
            unoptimized={isRemoteImage(cover)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-pink-200">
            📸
          </div>
        )}
      </div>
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
