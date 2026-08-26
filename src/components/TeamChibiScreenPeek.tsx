"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { TeamMember } from "@/lib/types";
import { isRemoteImage } from "@/lib/image-utils";

interface PeekState {
  member: TeamMember;
  side: "left" | "right";
  key: number;
}

interface Props {
  peek: PeekState | null;
  onDone: () => void;
}

type Phase = "enter" | "idle" | "exit";

const ENTER_MS = 380;
const IDLE_MS = 900;
const EXIT_MS = 380;

export default function TeamChibiScreenPeek({ peek, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    if (!peek) return;

    setPhase("enter");

    const idleTimer = window.setTimeout(() => setPhase("idle"), ENTER_MS);
    const exitTimer = window.setTimeout(
      () => setPhase("exit"),
      ENTER_MS + IDLE_MS,
    );
    const doneTimer = window.setTimeout(
      () => onDone(),
      ENTER_MS + IDLE_MS + EXIT_MS,
    );

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [peek, onDone]);

  if (!peek || !peek.member.chibiImage) return null;

  const remote = isRemoteImage(peek.member.chibiImage);
  const sideClass =
    peek.side === "left" ? "chibi-screen-peek-left" : "chibi-screen-peek-right";

  return (
    <div
      key={peek.key}
      className={`chibi-screen-peek pointer-events-none fixed bottom-12 z-40 ${sideClass} chibi-screen-peek-${phase}`}
      aria-hidden
    >
      <div className="chibi-screen-peek-body relative h-44 w-44 sm:h-52 sm:w-52 md:h-60 md:w-60">
        <Image
          src={peek.member.chibiImage}
          alt={`Maid Cafe chibi character ${peek.member.name} - דמות chibi מצוות המייד קפה`}
          fill
          className="object-contain drop-shadow-2xl"
          sizes="240px"
          unoptimized={remote}
        />
      </div>
    </div>
  );
}
