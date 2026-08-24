import LinkifiedText from "@/components/LinkifiedText";
import { getAboutPage } from "@/lib/db/about";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="section-title text-3xl font-bold text-pink-700">
          {about.title}
        </h1>
        <p className="mt-3 text-pink-500">
          למשקיעים, שותפים וכל מי שמתעניין בקיומנו ♡
        </p>
      </div>

      <article className="kawaii-card p-8">
        {about.content.trim() ? (
          <LinkifiedText
            text={about.content}
            className="leading-relaxed text-pink-900/85 whitespace-pre-wrap text-base"
          />
        ) : (
          <p className="text-center text-pink-400">תוכן בדרך — עקבו אחרינו!</p>
        )}
      </article>
    </div>
  );
}
