"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { TeamMember } from "@/lib/types";
import { isRemoteImage } from "@/lib/image-utils";

interface Props {
  member: TeamMember;
  open: boolean;
  onClose: () => void;
}

function speakCatchphrase(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "he-IL";
  utterance.rate = 0.92;
  utterance.pitch = 1.15;
  window.speechSynthesis.speak(utterance);
}

export default function TeamChibiModal({ member, open, onClose }: Props) {
  const handleClose = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open && member.chibiImage) {
      speakCatchphrase(member.catchphrase);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, [open, member.catchphrase, member.chibiImage]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open || !member.chibiImage) return null;

  const remote = isRemoteImage(member.chibiImage);

  return (
    <div
      className="chibi-overlay fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} — צ'יבי`}
      onClick={handleClose}
    >
      <div
        className="chibi-popup relative max-w-md text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute -left-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-pink-300 bg-white text-lg font-bold text-pink-600 shadow-lg transition hover:scale-110 hover:bg-pink-50"
          aria-label="סגירה"
        >
          ×
        </button>

        <div className="relative mx-auto h-[min(70vh,420px)] w-[min(85vw,360px)]">
          <Image
            src={member.chibiImage}
            alt={`${member.name} chibi`}
            fill
            className="chibi-bounce object-contain drop-shadow-2xl"
            sizes="360px"
            priority
            unoptimized={remote}
          />
        </div>

        <div className="mt-4 rounded-2xl border-4 border-pink-300 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-sm">
          <p className="text-lg font-bold text-pink-700">{member.name}</p>
          <p className="mt-2 text-base font-semibold leading-relaxed text-pink-600">
            {member.catchphrase}
          </p>
          <p className="mt-2 text-xs text-pink-400">♡ לחצו בחוץ לסגירה</p>
        </div>
      </div>
    </div>
  );
}
