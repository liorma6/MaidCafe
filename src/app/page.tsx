import AnnouncementCard from "@/components/AnnouncementCard";
import HomeLogo from "@/components/HomeLogo";
import Link from "next/link";
import { getAnnouncements } from "@/lib/db/announcements";
import { sortAnnouncements } from "@/lib/sort-utils";
import { SITE_TAGLINE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const announcements = sortAnnouncements(await getAnnouncements(true));
  const categories = [
    ...new Set(announcements.map((a) => a.category.trim() || "כללי")),
  ];

  return (
    <div className="space-y-10">
      <section className="text-center">
        <HomeLogo />
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
          <div className="space-y-8">
            {categories.map((category) => {
              const items = announcements.filter(
                (a) => (a.category.trim() || "כללי") === category,
              );
              return (
                <div key={category} className="space-y-4">
                  {categories.length > 1 && (
                    <h3 className="text-center text-lg font-bold text-pink-600">
                      {category}
                    </h3>
                  )}
                  {items.map((a) => (
                    <AnnouncementCard key={a.id} announcement={a} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/about" className="kawaii-card p-6 text-center transition hover:scale-105">
          <p className="text-3xl">✨</p>
          <h3 className="mt-2 font-bold text-pink-700">מי אנחנו</h3>
          <p className="mt-1 text-sm text-pink-500">למשקיעים ושותפים</p>
        </Link>
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
