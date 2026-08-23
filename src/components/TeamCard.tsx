"use client";

import type { TeamMember } from "@/lib/types";
import Image from "next/image";
import { isRemoteImage } from "@/lib/image-utils";

interface Props {
  member: TeamMember;
  peekSide?: "left" | "right";
}

export default function TeamCard({ member, peekSide = "left" }: Props) {
  const isRemote = isRemoteImage(member.image);
  const hasChibi = Boolean(member.chibiImage);
  const chibiRemote = hasChibi && isRemoteImage(member.chibiImage);

  return (
    <article className="team-heart-card group relative mx-auto w-full max-w-sm overflow-visible">
      {hasChibi && (
        <div
          className={`chibi-peek pointer-events-none absolute -bottom-6 z-0 ${
            peekSide === "left" ? "-left-10 sm:-left-14" : "-right-10 sm:-right-14"
          }`}
          aria-hidden
        >
          <div className="relative h-28 w-28 sm:h-36 sm:w-36">
            <Image
              src={member.chibiImage}
              alt=""
              fill
              className="chibi-peek-img object-contain drop-shadow-lg"
              sizes="144px"
              unoptimized={chibiRemote}
            />
          </div>
        </div>
      )}

      <div className="heart-shape relative overflow-hidden bg-pink-50 p-6 pt-8">
        <div className="checkered-bg absolute inset-0 opacity-30" />

        <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-pink-300 bg-white shadow-lg transition group-hover:scale-105 group-hover:border-pink-400">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="144px"
              unoptimized={isRemote}
            />
          </div>

          <div className="flex-1 text-center sm:text-right">
            <p className="text-sm font-bold text-pink-500">{member.role}</p>
            <p className="mt-2 text-base font-semibold leading-snug text-pink-700 text-outline">
              {member.catchphrase}
            </p>
          </div>
        </div>

        <div className="ribbon-banner relative z-10 mx-auto -mb-2 mt-6 w-fit px-8 py-2">
          <p className="text-lg font-bold text-white">{member.name}</p>
        </div>
      </div>
    </article>
  );
}
