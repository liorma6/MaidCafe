import Image from "next/image";

interface Props {
  className?: string;
}

/** Maid head apron artwork — worn on top of event egg cards */
export default function EventHeadApron({ className = "" }: Props) {
  return (
    <div
      className={`event-head-apron pointer-events-none ${className}`.trim()}
      aria-hidden
    >
      <Image
        src="/images/event-head-apron.png"
        alt="איור מייד קפה על כרטיס אירוע קונספט"
        width={954}
        height={488}
        className="event-head-apron-img"
        unoptimized
      />
    </div>
  );
}
