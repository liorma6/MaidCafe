import AboutInfobox from "@/components/AboutInfobox";
import LinkifiedText from "@/components/LinkifiedText";
import { getAboutPage } from "@/lib/db/about";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="text-center">
        <h1 className="section-title text-3xl font-bold text-pink-700">
          {about.title}
        </h1>
        <p className="mt-3 text-pink-500">
          למשקיעים, שותפים וכל מי שמתעניין בקיומנו ♡
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(220px,280px)]">
        <article className="kawaii-card order-2 min-w-0 p-8 lg:order-1">
          {about.content.trim() ? (
            <LinkifiedText
              text={about.content}
              className="preserve-lines text-base leading-relaxed whitespace-pre-wrap text-pink-900/85"
            />
          ) : (
            <p className="text-center text-pink-400">תוכן בדרך — עקבו אחרינו!</p>
          )}
        </article>

        <div className="order-1 lg:order-2">
          <AboutInfobox
            title={about.title}
            image={about.image}
            sections={about.infoSections}
          />
        </div>
      </div>
    </div>
  );
}
