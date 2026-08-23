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

export default function TeamChibiScreenPeek({ peek, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!peek) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, 3600);

    return () => window.clearTimeout(timer);
  }, [peek, onDone]);

  if (!peek || !peek.member.chibiImage) return null;

  const remote = isRemoteImage(peek.member.chibiImage);

  return (
    <div
      key={peek.key}
      className={`chibi-screen-peek pointer-events-none fixed bottom-12 z-40 ${
        peek.side === "left" ? "left-0 chibi-screen-peek-left" : "right-0 chibi-screen-peek-right"
      } ${visible ? "chibi-screen-peek-active" : ""}`}
      aria-hidden
    >
      <div className="relative h-44 w-44 sm:h-52 sm:w-52 md:h-60 md:w-60">
        <Image
          src={peek.member.chibiImage}
          alt=""
          fill
          className="object-contain drop-shadow-2xl"
          sizes="240px"
          unoptimized={remote}
        />
      </div>
    </div>
  );
}
