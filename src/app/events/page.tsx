import EventHeartCard from "@/components/EventHeartCard";
import { getEvents } from "@/lib/db/events";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-8">
      <div className="text-center pb-14 sm:pb-16">
        <h1 className="section-title text-3xl font-bold text-pink-700">
          אירועים שהיו
        </h1>
        <p className="mt-3 text-pink-500">
          האלבומים שלנו — לחצו על אירוע לצפייה בכל התמונות ♡
        </p>
      </div>

      {events.length === 0 ? (
        <div className="kawaii-card p-12 text-center">
          <p className="text-4xl">📸</p>
          <p className="mt-4 text-pink-500">עדיין אין אלבומים — בקרוב!</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventHeartCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
