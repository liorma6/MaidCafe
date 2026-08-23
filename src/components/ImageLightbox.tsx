"use client";

import { useCallback, useEffect } from "react";
import { isRemoteImage } from "@/lib/image-utils";

interface Props {
  images: string[];
  currentIndex: number;
  alt: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  alt,
  onClose,
  onNavigate,
}: Props) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;
  const src = images[currentIndex];

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [currentIndex, hasPrev, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [currentIndex, hasNext, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="תצוגת תמונה מוגדלת"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-pink-700 shadow-lg hover:bg-white"
        aria-label="סגירה"
      >
        ×
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-4 text-2xl text-pink-700 shadow-lg hover:bg-white sm:right-4"
          aria-label="תמונה קודמת"
        >
          ›
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-4 text-2xl text-pink-700 shadow-lg hover:bg-white sm:left-4"
          aria-label="תמונה הבאה"
        >
          ‹
        </button>
      )}

      <div
        className="flex max-h-[min(90vh,900px)] max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[min(85vh,820px)] max-w-[min(92vw,960px)] object-contain"
          decoding="async"
        />
        {images.length > 1 && (
          <p className="mt-3 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-pink-700">
            {currentIndex + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
