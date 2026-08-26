"use client";

import { useState } from "react";
import Image from "next/image";
import { isRemoteImage } from "@/lib/image-utils";

function frameClass(aspect: number | null): string {
  if (aspect === null) return "min-h-[140px]";
  if (aspect >= 1.15) return "aspect-[16/10] sm:col-span-2";
  if (aspect <= 0.85) return "aspect-[3/4]";
  return "aspect-square";
}

function coverFrameClass(aspect: number | null): string {
  if (aspect === null) return "aspect-[4/5]";
  if (aspect >= 1.15) return "aspect-[16/10]";
  if (aspect <= 0.85) return "aspect-[3/4]";
  return "aspect-square";
}

export function EventCoverImage({
  src,
  alt,
  onOpen,
}: {
  src: string;
  alt: string;
  onOpen: () => void;
}) {
  const [aspect, setAspect] = useState<number | null>(null);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-pink-200 bg-pink-50 transition hover:border-pink-400 hover:shadow-lg ${coverFrameClass(aspect)}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 672px"
        unoptimized={isRemoteImage(src)}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setAspect(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-pink-900/50 to-transparent py-3 text-center text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
        לחצו להגדלה 🔍
      </span>
    </button>
  );
}

export function EventAlbumCover({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [aspect, setAspect] = useState<number | null>(null);

  return (
    <div
      className={`relative w-full overflow-hidden bg-pink-50 ${coverFrameClass(aspect)}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-1 transition duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 640px) 50vw, 33vw"
        unoptimized={isRemoteImage(src)}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setAspect(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
    </div>
  );
}

interface GalleryProps {
  title: string;
  images: string[];
  lightboxImages: string[];
  onOpenLightbox: (index: number) => void;
}

export default function EventPhotoGallery({
  title,
  images,
  lightboxImages,
  onOpenLightbox,
}: GalleryProps) {
  const [aspects, setAspects] = useState<Record<string, number>>({});

  const setAspect = (src: string, ratio: number) => {
    setAspects((prev) => (prev[src] === ratio ? prev : { ...prev, [src]: ratio }));
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((src) => (
        <button
          key={src}
          type="button"
          onClick={() => onOpenLightbox(lightboxImages.indexOf(src))}
          className={`group relative w-full overflow-hidden rounded-xl border-2 border-pink-200 bg-pink-50 transition hover:border-pink-400 hover:shadow-md ${frameClass(aspects[src] ?? null)}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`תמונה מאירוע מייד קפה ${title}`}
            className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-[1.02]"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setAspect(src, img.naturalWidth / img.naturalHeight);
              }
            }}
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-pink-900/40 to-transparent py-2 text-center text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
            לחצו להגדלה 🔍
          </span>
        </button>
      ))}
    </div>
  );
}
