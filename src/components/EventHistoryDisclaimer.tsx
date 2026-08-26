import { SOCIAL_LINKS } from "@/lib/constants";

export default function EventHistoryDisclaimer() {
  return (
    <p className="text-center text-xs leading-relaxed text-pink-400/90">
      היסטוריית המיזם: התמונות מההתנדבות בעבר פורסמו בתום לב; להסרה או טשטוש של
      תמונתך, פנה אלינו במייל:{" "}
      <a
        href={SOCIAL_LINKS.email}
        className="font-medium text-pink-500 underline decoration-pink-200 underline-offset-2 hover:text-pink-700"
      >
        uniquemaidcafe@gmail.com
      </a>{" "}
      ונטפל בכך מייד.
    </p>
  );
}
