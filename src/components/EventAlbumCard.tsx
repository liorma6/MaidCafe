import EventHeartCard from "@/components/EventHeartCard";
import type { EventAlbum } from "@/lib/types";

interface Props {
  event: EventAlbum;
}

/** @deprecated Use EventHeartCard — kept for imports */
export default function EventAlbumCard({ event }: Props) {
  return <EventHeartCard event={event} />;
}
