import type { Announcement } from "@/lib/types";
import LinkifiedText from "@/components/LinkifiedText";

interface Props {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: Props) {
  const date = new Date(announcement.createdAt).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="kawaii-card relative overflow-hidden p-6">
      <div className="absolute -left-4 -top-4 text-4xl opacity-20">♡</div>
      <div className="absolute -bottom-2 -right-2 text-3xl opacity-20">☆</div>
      <p className="mb-1 text-xs font-medium text-pink-400">{date}</p>
      <h3 className="mb-3 text-xl font-bold text-pink-700">
        {announcement.title}
      </h3>
      <LinkifiedText
        text={announcement.content}
        className="leading-relaxed text-pink-900/80 whitespace-pre-wrap"
      />
    </article>
  );
}
