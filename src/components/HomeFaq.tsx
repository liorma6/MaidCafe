import LinkifiedText from "@/components/LinkifiedText";
import type { FaqItem } from "@/lib/types";

interface Props {
  items: FaqItem[];
}

export default function HomeFaq({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="home-faq" aria-labelledby="home-faq-title">
      <div className="mb-6 text-center">
        <p className="text-2xl" aria-hidden>
          💬
        </p>
        <h2
          id="home-faq-title"
          className="section-title mt-2 text-2xl font-bold text-pink-700"
        >
          שאלות ותשובות נפוצות
        </h2>
        <p className="mt-2 text-sm text-pink-500">
          כל מה שרציתם לדעת על Unique Maid Cafe ♡
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <details
            key={item.id}
            className="home-faq-item group overflow-hidden rounded-2xl border-2 border-pink-200 bg-white/90 shadow-sm transition hover:border-pink-300 hover:shadow-md"
            {...(index === 0 ? { open: true } : {})}
          >
            <summary className="cursor-pointer list-none bg-gradient-to-l from-pink-50 to-white px-5 py-4 text-base font-bold text-pink-700 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-2">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span>{item.question}</span>
                </span>
                <span
                  className="home-faq-chevron mt-1 shrink-0 text-lg text-pink-400 transition group-open:rotate-180"
                  aria-hidden
                >
                  ⌄
                </span>
              </span>
            </summary>
            <div className="border-t border-pink-100 px-5 py-4">
              <LinkifiedText
                text={item.answer}
                className="preserve-lines leading-relaxed whitespace-pre-wrap text-pink-800/85"
              />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
