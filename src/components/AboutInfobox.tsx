import Image from "next/image";
import LinkifiedText from "@/components/LinkifiedText";
import type { AboutInfoSection } from "@/lib/types";
import { isRemoteImage } from "@/lib/image-utils";

interface Props {
  title: string;
  image: string;
  sections: AboutInfoSection[];
}

export default function AboutInfobox({ title, image, sections }: Props) {
  const visibleSections = sections.filter(
    (section) =>
      section.title.trim() ||
      section.items.some((item) => item.label.trim() || item.value.trim()),
  );

  if (!image && visibleSections.length === 0) return null;

  return (
    <aside className="about-infobox w-full shrink-0 lg:w-72">
      {image && (
        <div className="about-infobox-image relative mb-4 overflow-hidden rounded-2xl border-4 border-pink-200 bg-pink-50 shadow-md">
          <Image
            src={image}
            alt={`${title} - Unique Maid Cafe Israel | מייד קפה ישראל`}
            width={280}
            height={280}
            className="h-auto w-full object-cover"
            unoptimized={isRemoteImage(image)}
          />
        </div>
      )}

      {visibleSections.map((section, sectionIndex) => {
        const items = section.items.filter(
          (item) => item.label.trim() || item.value.trim(),
        );
        if (!section.title.trim() && items.length === 0) return null;

        return (
          <div
            key={`${section.title}-${sectionIndex}`}
            className="about-infobox-bubble mb-4 overflow-hidden rounded-2xl border-2 border-pink-200 bg-white/90 shadow-sm"
          >
            {section.title.trim() && (
              <h2 className="about-infobox-bubble-title border-b-2 border-pink-100 bg-pink-50 px-4 py-2.5 text-center text-sm font-bold text-pink-700">
                {section.title}
              </h2>
            )}
            {items.length > 0 && (
              <dl className="divide-y divide-pink-100">
                {items.map((item, itemIndex) => (
                  <div
                    key={`${item.label}-${itemIndex}`}
                    className="about-infobox-row grid grid-cols-[minmax(0,38%)_minmax(0,1fr)] gap-2 px-3 py-2.5 text-sm"
                  >
                    <dt className="font-bold text-pink-600">{item.label}</dt>
                    <dd className="text-pink-900/85">
                      <LinkifiedText
                        text={item.value}
                        className="preserve-lines whitespace-pre-wrap leading-snug"
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        );
      })}
    </aside>
  );
}
