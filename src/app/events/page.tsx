import Image from "next/image";
import { readContent } from "@/lib/data";

export default async function EventsPage() {
  const content = await readContent();
  const events = content.events;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title text-3xl font-bold text-pink-700">
          אירועים שהיו
        </h1>
        <p className="mt-3 text-pink-500">
          רגעים מתוקים מהפופ-אפים והאירועים שלנו ♡
        </p>
      </div>

      {events.length === 0 ? (
        <div className="kawaii-card p-12 text-center">
          <p className="text-4xl">📸</p>
          <p className="mt-4 text-pink-500">עדיין אין תמונות — בקרוב!</p>
        </div>
      ) : (
        events.map((event) => (
          <section key={event.id} className="kawaii-card p-6">
            <h2 className="text-xl font-bold text-pink-700">{event.title}</h2>
            <p className="text-sm text-pink-400">
              {new Date(event.date).toLocaleDateString("he-IL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {event.description && (
              <p className="mt-2 text-pink-800/70">{event.description}</p>
            )}
            {event.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
