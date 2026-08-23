import Image from "next/image";
import { readContent } from "@/lib/data";
import { SOCIAL_LINKS } from "@/lib/constants";

export default async function MerchPage() {
  const content = await readContent();
  const merch = content.merch.filter((m) => m.available);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title text-3xl font-bold text-pink-700">
          מכירת המרצ׳ שלנו
        </h1>
        <p className="mt-3 text-pink-500">
          מוצרים מתוקים מהמייד קפה שלנו! ♡
        </p>
      </div>

      {merch.length === 0 ? (
        <div className="kawaii-card p-12 text-center">
          <p className="text-4xl">🛍️</p>
          <p className="mt-4 text-pink-500">המרצ׳ בדרך — עקבו אחרינו!</p>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn mt-4 inline-block"
          >
            עקבו באינסטגרם
          </a>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {merch.map((item) => (
            <article key={item.id} className="kawaii-card overflow-hidden">
              {item.image ? (
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-pink-50 text-4xl">
                  🛍️
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-bold text-pink-700">{item.title}</h2>
                {item.description && (
                  <p className="mt-1 text-sm text-pink-800/70">{item.description}</p>
                )}
                {item.price && (
                  <p className="mt-2 text-lg font-bold text-pink-600">{item.price}</p>
                )}
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn mt-3 inline-block text-sm"
                >
                  לרכישה — פנו אלינו ♡
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
