import Image from "next/image";
import type { Partnership } from "@/lib/types";
import { isRemoteImage } from "@/lib/image-utils";

interface Props {
  partner: Partnership;
}

export default function PartnershipCard({ partner }: Props) {
  const isRemote = isRemoteImage(partner.image);

  return (
    <article className="partnership-card group mx-auto w-full max-w-sm transition hover:scale-[1.02]">
      <div className="partnership-badge relative overflow-hidden bg-pink-50 px-6 pb-7 pt-9">
        <div className="checkered-bg absolute inset-0 opacity-25" />

        <div className="relative z-10 mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-pink-300 bg-white shadow-lg ring-4 ring-pink-100/80 transition duration-300 group-hover:scale-105 group-hover:border-pink-400">
          {partner.image ? (
            <Image
              src={partner.image}
              alt={partner.name}
              fill
              className="object-contain p-4"
              sizes="144px"
              unoptimized={isRemote}
            />
          ) : (
            <span className="text-5xl" aria-hidden>
              🤝
            </span>
          )}
        </div>

        <div className="ribbon-banner relative z-10 mx-auto -mt-5 w-fit max-w-full px-7 py-2.5 shadow-md">
          <h2 className="text-center text-base font-bold leading-snug text-white sm:text-lg">
            {partner.name}
          </h2>
        </div>

        {partner.description ? (
          <p className="relative z-10 mt-5 text-center text-sm leading-relaxed text-pink-800/75">
            {partner.description}
          </p>
        ) : (
          <p className="relative z-10 mt-5 text-center text-sm text-pink-400/80">
            שותף מכובד ♡
          </p>
        )}
      </div>
    </article>
  );
}
