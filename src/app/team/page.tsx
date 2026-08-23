import TeamCard from "@/components/TeamCard";
import { getTeamMembers } from "@/lib/db/team";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const team = await getTeamMembers();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="section-title text-3xl font-bold text-pink-700">
          מידע על הצוות
        </h1>
        <p className="mt-3 text-pink-500">
          הכירו את המיידים והבאטלרים המתוקים שלנו! ♡
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {team.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
