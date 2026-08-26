import Image from "next/image";
import type { Partnership } from "@/lib/types";
import { isRemoteImage } from "@/lib/image-utils";
import { normalizeExternalUrl } from "@/lib/url-utils";

interface Props {
  partner: Partnership;
}

export default function PartnershipCard({ partner }: Props) {
  const isRemote = isRemoteImage(partner.image);
  const href = normalizeExternalUrl(partner.url);

  const content = (
    <div className="partnership-badge relative overflow-hidden bg-pink-50 px-5 pb-6 pt-7">
      <div className="checkered-bg absolute inset-0 opacity-25" />

      <div className="relative z-10 mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-pink-300 shadow-lg transition duration-300 group-hover:scale-105 group-hover:border-pink-400 sm:h-48 sm:w-48">
        {partner.image ? (
          <Image
            src={partner.image}
            alt={partner.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 176px, 192px"
            unoptimized={isRemote}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-pink-100/60">
            <span className="text-5xl" aria-hidden>
              🤝
            </span>
          </div>
        )}
      </div>

      <div className="ribbon-banner relative z-10 mx-auto -mt-4 w-fit max-w-full px-7 py-2.5 shadow-md">
        <h2 className="text-center text-base font-bold leading-snug text-white sm:text-lg">
          {partner.name}
        </h2>
      </div>

      {partner.description ? (
        <p className="preserve-lines relative z-10 mt-5 text-center text-sm leading-relaxed text-pink-800/75">
          {partner.description}
        </p>
      ) : (
        <p className="relative z-10 mt-5 text-center text-sm text-pink-400/80">
          שותף מכובד ♡
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="partnership-card group mx-auto block w-full max-w-sm transition hover:scale-[1.02]"
        aria-label={`${partner.name} — מעבר לאתר השותף`}
      >
        {content}
      </a>
    );
  }

  return (
    <article className="partnership-card group mx-auto w-full max-w-sm transition hover:scale-[1.02]">
      {content}
    </article>
  );
}
