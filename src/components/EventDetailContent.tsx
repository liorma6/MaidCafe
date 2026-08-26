"use client";

import { useMemo, useState } from "react";
import EventPhotoGallery, { EventCoverImage } from "@/components/EventPhotoGallery";
import ImageLightbox from "@/components/ImageLightbox";
import type { EventAlbum } from "@/lib/types";

interface Props {
  event: EventAlbum;
  formattedDate: string;
}

export default function EventDetailContent({ event, formattedDate }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxImages = useMemo(() => {
    if (event.coverImage && !event.images.includes(event.coverImage)) {
      return [event.coverImage, ...event.images];
    }
    return event.images.length > 0
      ? event.images
      : event.coverImage
        ? [event.coverImage]
        : [];
  }, [event.images, event.coverImage]);

  const hasMedia =
    event.images.length > 0 || event.videos.length > 0 || event.coverImage;

  const openLightbox = (index: number) => {
    if (index >= 0) setLightboxIndex(index);
  };

  const imageAlt = `מייד קפה באירוע ${event.title} - Unique Maid Cafe`;

  return (
    <>
      <header className="space-y-4">
        {event.coverImage && (
          <EventCoverImage
            src={event.coverImage}
            alt={imageAlt}
            onOpen={() => openLightbox(lightboxImages.indexOf(event.coverImage))}
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-pink-700 md:text-3xl">
            {event.title}
          </h1>
          <p className="mt-1 text-sm text-pink-400">{formattedDate}</p>
          {event.description && (
            <p className="preserve-lines mt-3 leading-relaxed text-pink-800/80">
              {event.description}
            </p>
          )}
        </div>
      </header>

      {event.videos.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-pink-700">
            סרטונים ({event.videos.length})
          </h2>
          <div className="grid gap-4">
            {event.videos.map((video) => (
              <div
                key={video}
                className="overflow-hidden rounded-2xl border-4 border-pink-200 bg-black"
              >
                <video
                  src={video}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {event.images.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-pink-700">
            תמונות ({event.images.length})
          </h2>
          <EventPhotoGallery
            title={event.title}
            images={event.images}
            lightboxImages={lightboxImages}
            onOpenLightbox={openLightbox}
          />
        </section>
      )}

      {!hasMedia && (
        <div className="kawaii-card p-8 text-center text-pink-400">
          אין תמונות או סרטונים באלבום זה עדיין
        </div>
      )}

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          alt={imageAlt}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
