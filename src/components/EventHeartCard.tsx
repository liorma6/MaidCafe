import Link from "next/link";
import Image from "next/image";
import EventHeadApron from "@/components/EventHeadApron";
import type { EventAlbum } from "@/lib/types";
import { formatEventDateRange } from "@/lib/date-utils";
import { getEventDisplayCover } from "@/lib/event-utils";
import { isRemoteImage } from "@/lib/image-utils";

interface Props {
  event: EventAlbum;
}

export default function EventHeartCard({ event }: Props) {
  const cover = getEventDisplayCover(event);
  const dateLabel = formatEventDateRange(event.date, event.endDate);

  return (
    <Link
      href={`/events/${event.id}`}
      className="event-heart-card group mx-auto block w-full max-w-sm transition hover:scale-[1.02]"
    >
      <div className="event-heart-card-shell">
        <EventHeadApron />

        <div className="heart-shape relative aspect-[1/1.05] w-full overflow-hidden bg-pink-50">
          <div className="checkered-bg absolute inset-0 opacity-25" />

          {cover ? (
            <Image
              src={cover}
              alt={event.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 320px"
              unoptimized={isRemoteImage(cover)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl text-pink-200">
              ♡
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pink-950/75 via-pink-900/35 to-transparent px-4 pb-14 pt-20">
            <p className="text-center text-xs font-semibold text-white/95 sm:text-sm">
              {dateLabel}
            </p>
          </div>

          <div className="ribbon-banner absolute inset-x-0 bottom-3 z-10 mx-auto w-[88%] px-4 py-2">
            <p className="line-clamp-2 text-center text-sm font-bold leading-snug text-white sm:text-base">
              {event.title}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
