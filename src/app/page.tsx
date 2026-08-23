import Image from "next/image";
import Link from "next/link";
import AnnouncementCard from "@/components/AnnouncementCard";
import { getAnnouncements } from "@/lib/db/announcements";
import { SITE_TAGLINE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const announcements = await getAnnouncements(true);

  return (
    <div className="space-y-10">
      <section className="text-center">
        <div className="hero-sparkle mx-auto mb-6 w-fit">
          <Image
            src="/images/logo.png"
            alt="Unique Maid Cafe"
            width={220}
            height={220}
            className="mx-auto drop-shadow-xl"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-pink-600 md:text-4xl">
          ברוכים הבאים ל-Unique Maid Cafe!
        </h1>
        <p className="mt-3 text-lg text-pink-500">{SITE_TAGLINE}</p>
        <p className="mx-auto mt-4 max-w-xl text-pink-800/70">
          מייד קפה ישראלי בקונספט יפני — אנחנו מגיעים לאירועים, פסטיבלים וכנסים
          עם חוויה מתוקה, kawaii ומלאה בקסם! ♡
        </p>
      </section>

      <section>
        <h2 className="section-title mb-6 text-center text-2xl font-bold text-pink-700">
          הודעות חשובות
        </h2>
        {announcements.length === 0 ? (
          <p className="text-center text-pink-400">אין הודעות כרגע — בקרוב!</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/events" className="kawaii-card p-6 text-center transition hover:scale-105">
          <p className="text-3xl">📸</p>
          <h3 className="mt-2 font-bold text-pink-700">אירועים שהיו</h3>
          <p className="mt-1 text-sm text-pink-500">גלו את הרגעים המתוקים שלנו</p>
        </Link>
        <Link href="/team" className="kawaii-card p-6 text-center transition hover:scale-105">
          <p className="text-3xl">♡</p>
          <h3 className="mt-2 font-bold text-pink-700">הצוות שלנו</h3>
          <p className="mt-1 text-sm text-pink-500">הכירו את המיידים והבאטלרים</p>
        </Link>
        <Link href="/merch" className="kawaii-card p-6 text-center transition hover:scale-105">
          <p className="text-3xl">🛍️</p>
          <h3 className="mt-2 font-bold text-pink-700">המרצ׳ שלנו</h3>
          <p className="mt-1 text-sm text-pink-500">מוצרים מתוקים לקחת הביתה</p>
        </Link>
      </section>
    </div>
  );
}
