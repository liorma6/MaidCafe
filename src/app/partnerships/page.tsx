import Image from "next/image";
import { getPartnerships } from "@/lib/db/partnerships";
import { isRemoteImage } from "@/lib/image-utils";

export const dynamic = "force-dynamic";

export default async function PartnershipsPage() {
  const partnerships = await getPartnerships();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title text-3xl font-bold text-pink-700">שת״פים</h1>
        <p className="mt-3 text-pink-500">
          העסקים והארגונים שאיתם אנחנו עובדים ביחד ♡
        </p>
      </div>

      {partnerships.length === 0 ? (
        <div className="kawaii-card p-12 text-center">
          <p className="text-4xl">🤝</p>
          <p className="mt-4 text-pink-500">שת״פים חדשים בדרך — עקבו אחרינו!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partnerships.map((partner) => (
            <article
              key={partner.id}
              className="kawaii-card flex flex-col items-center p-6 text-center"
            >
              {partner.image ? (
                <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-2xl border-2 border-pink-200 bg-white">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-contain p-2"
                    sizes="112px"
                    unoptimized={isRemoteImage(partner.image)}
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 text-3xl">
                  🤝
                </div>
              )}
              <h2 className="text-lg font-bold text-pink-700">{partner.name}</h2>
              {partner.description && (
                <p className="mt-2 text-sm leading-relaxed text-pink-800/70">
                  {partner.description}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
