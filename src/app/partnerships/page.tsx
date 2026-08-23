import PartnershipCard from "@/components/PartnershipCard";
import { getPartnerships } from "@/lib/db/partnerships";

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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {partnerships.map((partner) => (
            <PartnershipCard key={partner.id} partner={partner} />
          ))}
        </div>
      )}
    </div>
  );
}
