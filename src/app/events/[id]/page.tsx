import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db/events";
import { formatEventDateRange } from "@/lib/date-utils";
import { isRemoteImage } from "@/lib/image-utils";

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

      <header className="space-y-4">
        {event.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border-4 border-pink-200">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              unoptimized={isRemoteImage(event.coverImage)}
            />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-pink-700 md:text-3xl">
            {event.title}
          </h1>
          <p className="mt-1 text-sm text-pink-400">{formattedDate}</p>
          {event.description && (
            <p className="mt-3 leading-relaxed text-pink-800/80">
              {event.description}
            </p>
          )}
        </div>
      </header>

      {event.images.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-bold text-pink-700">
            תמונות ({event.images.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {event.images.map((img) => (
              <div
                key={img}
                className="relative aspect-square overflow-hidden rounded-xl border-2 border-pink-200"
              >
                <Image
                  src={img}
                  alt={event.title}
                  fill
                  className="object-cover transition hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  unoptimized={isRemoteImage(img)}
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        !event.coverImage && (
          <div className="kawaii-card p-8 text-center text-pink-400">
            אין תמונות באלבום זה עדיין
          </div>
        )
      )}
    </div>
  );
}
