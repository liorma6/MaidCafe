import { Fragment } from "react";

const URL_PATTERN = /(https?:\/\/[^\s<>]+)/g;

function trimTrailingUrlPunctuation(url: string): string {
  return url.replace(/[),.;:!?]+$/g, "");
}

interface Props {
  text: string;
  className?: string;
}

export default function LinkifiedText({ text, className }: Props) {
  const parts = text.split(URL_PATTERN);

  return (
    <p className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        if (/^https?:\/\//.test(part)) {
          const href = trimTrailingUrlPunctuation(part);
          const trailing = part.slice(href.length);

          return (
            <Fragment key={index}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-pink-600 underline decoration-pink-300 underline-offset-2 transition hover:text-pink-800"
              >
                {href}
              </a>
              {trailing}
            </Fragment>
          );
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </p>
  );
}
