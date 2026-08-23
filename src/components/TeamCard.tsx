"use client";

import { useState } from "react";
import type { TeamMember } from "@/lib/types";
import Image from "next/image";
import TeamChibiModal from "./TeamChibiModal";
import { isRemoteImage } from "@/lib/image-utils";

interface Props {
  member: TeamMember;
}

export default function TeamCard({ member }: Props) {
  const [showChibi, setShowChibi] = useState(false);
  const isRemote = isRemoteImage(member.image);
  const hasChibi = Boolean(member.chibiImage);

  const handleClick = () => {
    if (hasChibi) setShowChibi(true);
  };

  return (
    <>
      <article className="team-heart-card group relative mx-auto w-full max-w-sm">
        <div className="heart-shape relative overflow-hidden bg-pink-50 p-6 pt-8">
          <div className="checkered-bg absolute inset-0 opacity-30" />

          <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <button
              type="button"
              onClick={handleClick}
              disabled={!hasChibi}
              className={`relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-pink-300 bg-white shadow-lg transition ${
                hasChibi
                  ? "cursor-pointer hover:scale-105 hover:border-pink-500 hover:shadow-xl active:scale-95"
                  : "cursor-default"
              }`}
              aria-label={
                hasChibi
                  ? `לחצו לצ'יבי של ${member.name}`
                  : `תמונה של ${member.name}`
              }
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="144px"
                unoptimized={isRemote}
              />
              {hasChibi && (
                <span className="absolute inset-x-0 bottom-0 bg-pink-500/80 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                  ♡ לחצו!
                </span>
              )}
            </button>

            <div className="flex-1 text-center sm:text-right">
              <p className="text-sm font-bold text-pink-500">{member.role}</p>
              <p className="mt-2 text-base font-semibold leading-snug text-pink-700 text-outline">
                {member.catchphrase}
              </p>
              {hasChibi && (
                <p className="mt-2 text-xs font-medium text-pink-400">
                  לחצו על התמונה לצ&apos;יבי ♡
                </p>
              )}
            </div>
          </div>

          <div className="ribbon-banner relative z-10 mx-auto -mb-2 mt-6 w-fit px-8 py-2">
            <p className="text-lg font-bold text-white">{member.name}</p>
          </div>
        </div>
      </article>

      <TeamChibiModal
        member={member}
        open={showChibi}
        onClose={() => setShowChibi(false)}
      />
    </>
  );
}
