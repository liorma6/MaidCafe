import TeamCard from "@/components/TeamCard";
import { readContent } from "@/lib/data";

export default async function TeamPage() {
  const content = await readContent();

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
        {content.team.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
