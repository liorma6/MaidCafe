const FAQ_ITEMS = [
  {
    question: "האם אתם ה-מאיד קפה הראשון בארץ?",
    answer:
      "כן! יוניק מייד קפה (Unique Maid Cafe) מביא את החוויה היפנית המקורית היישר לישראל.",
  },
  {
    question: "איפה אפשר למצוא את מייד קפה ישראל?",
    answer:
      "אנחנו מקיימים אירועי פופ-אפ מתחלפים. עקבו אחרינו כדי לדעת מתי המייד קאפה הקרוב מגיע אליכם.",
  },
] as const;

export default function HomeFaq() {
  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      <h2
        id="home-faq-title"
        className="section-title mb-5 text-center text-2xl font-bold text-pink-700"
      >
        שאלות ותשובות נפוצות
      </h2>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="home-faq-item kawaii-card group overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-5 py-4 text-base font-bold text-pink-700 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{item.question}</span>
                <span
                  className="mt-0.5 shrink-0 text-pink-400 transition group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p className="border-t border-pink-100 px-5 pb-4 pt-3 leading-relaxed text-pink-800/80">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
