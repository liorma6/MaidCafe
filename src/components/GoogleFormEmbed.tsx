import { GOOGLE_FORM_EMBED_URL, GOOGLE_FORM_URL } from "@/lib/constants";

export default function GoogleFormEmbed() {
  return (
    <div className="kawaii-card mx-auto max-w-3xl overflow-hidden p-4">
      <iframe
        src={GOOGLE_FORM_EMBED_URL}
        width="100%"
        height="1200"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="טופס הצטרפות לצוות Unique Maid Cafe"
        className="min-h-[800px] w-full rounded-xl"
      >
        טוען…
      </iframe>
      <p className="mt-4 text-center text-sm text-pink-500">
        הטופס לא נטען?{" "}
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pink-600 underline hover:text-pink-700"
        >
          פתחו אותו בחלון חדש
        </a>
      </p>
    </div>
  );
}
