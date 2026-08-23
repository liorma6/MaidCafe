import Link from "next/link";
import { notFound } from "next/navigation";
import EventDetailContent from "@/components/EventDetailContent";
import { getEventById } from "@/lib/db/events";
import { formatEventDateRange } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  const formattedDate = formatEventDateRange(event.date, event.endDate);

  return (
    <div className="space-y-8">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-sm font-semibold text-pink-500 hover:text-pink-700"
      >
        → חזרה לאלבומים
      </Link>

      <EventDetailContent event={event} formattedDate={formattedDate} />
    </div>
  );
}
