"use client";

import { useCallback, useState } from "react";
import TeamCard from "@/components/TeamCard";
import TeamChibiScreenPeek from "@/components/TeamChibiScreenPeek";
import type { TeamMember } from "@/lib/types";

interface Props {
  team: TeamMember[];
}

export default function TeamPageClient({ team }: Props) {
  const [peek, setPeek] = useState<{
    member: TeamMember;
    side: "left" | "right";
    key: number;
  } | null>(null);

  const handlePeek = useCallback((member: TeamMember, side: "left" | "right") => {
    if (!member.chibiImage) return;
    setPeek((prev) => ({
      member,
      side,
      key: (prev?.key ?? 0) + 1,
    }));
  }, []);

  const handleDone = useCallback(() => {
    setPeek(null);
  }, []);

  return (
    <>
      <TeamChibiScreenPeek peek={peek} onDone={handleDone} />

      <div className="grid gap-8 sm:grid-cols-2">
        {team.map((member, index) => (
          <TeamCard
            key={member.id}
            member={member}
            peekSide={index % 2 === 0 ? "left" : "right"}
            onPeek={handlePeek}
          />
        ))}
      </div>
    </>
  );
}
