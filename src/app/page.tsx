import AnnouncementCard from "@/components/AnnouncementCard";
import HomeLogo from "@/components/HomeLogo";
import HomeVisitorTracker from "@/components/HomeVisitorTracker";
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
      <HomeVisitorTracker />
      <section className="text-center">
        <h1 className="sr-only">Unique Maid Cafe - המייד קפה הראשון בישראל</h1>
        <HomeLogo />
        <p className="text-3xl font-bold text-pink-600 md:text-4xl">
          ברוכים הבאים ל-Unique Maid Cafe!
        </p>
        <p className="mt-3 text-lg text-pink-500">{SITE_TAGLINE}</p>
        <div className="mx-auto mt-6 max-w-2xl">
          <h2 className="text-xl font-bold text-pink-700 md:text-2xl">
            מייד קפה ישראלי — תרבות יפן, אנימה ואירועי קונספט
          </h2>
          <p className="mt-4 leading-relaxed text-pink-800/75">
            Unique Maid Cafe הוא המייד קפה הראשון בישראל שמביא את תרבות יפן ועולם
            האנימה לחוויה חיה ומתוקה. אנחנו מתמחים באירועי קונספט, פסטיבלים וכנסים —
            צוות מיידים ומלצרים בסגנון יפני, שירות kawaii ואווירה שאין שני לה. בין אם
            אתם מחפשים מייד קפה לאירוע מיוחד או חוויה יפנית ייחודית — אנחנו כאן
            בשבילכם! ♡
          </p>
          <p
            lang="en"
            dir="ltr"
            className="mt-4 text-sm leading-relaxed text-pink-600/80"
          >
            Unique Maid Cafe is the first Maid Cafe in Israel, bringing authentic
            Japanese maid cafe culture to Tel Aviv and across the country. Looking
            for a Maid Cafe in Israel for your next event, festival, or cosplay
            gathering? We&apos;re your kawaii pop-up team — ready to serve with
            heart! ♡
          </p>
        </div>
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
