import Link from "next/link";
import Image from "next/image";
import type { EventAlbum } from "@/lib/types";
import { formatEventDateRange } from "@/lib/date-utils";
import { getEventDisplayCover } from "@/lib/event-utils";
import { isRemoteImage } from "@/lib/image-utils";
import EventHeartFrame from "@/components/EventHeartFrame";

interface Props {
  event: EventAlbum;
}

export default function EventHeartCard({ event }: Props) {
  const cover = getEventDisplayCover(event);
  const dateLabel = formatEventDateRange(event.date, event.endDate);

  return (
    <Link
      href={`/events/${event.id}`}
      className="event-heart-card group mx-auto block w-full max-w-md transition hover:scale-[1.02]"
    >
      <EventHeartFrame className="relative">
        <div className="checkered-bg absolute inset-0 opacity-25" />

        {cover ? (
          <Image
            src={cover}
            alt={event.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 380px"
            unoptimized={isRemoteImage(cover)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl text-pink-200">
            ♡
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-pink-950/40 to-transparent" />
      </EventHeartFrame>

      <div className="mt-3 px-1 text-center">
        <p className="text-xs font-semibold text-pink-500 sm:text-sm">{dateLabel}</p>
        <div className="ribbon-banner mx-auto mt-2 max-w-[92%] px-4 py-2.5">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
            {event.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
