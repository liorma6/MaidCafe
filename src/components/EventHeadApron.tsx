interface Props {
  className?: string;
}

/** Maid-style head apron — sits on top of event egg cards */
export default function EventHeadApron({ className = "" }: Props) {
  return (
    <div
      className={`event-head-apron pointer-events-none ${className}`.trim()}
      aria-hidden
    >
      <svg
        viewBox="0 0 120 44"
        className="event-head-apron-svg"
        role="presentation"
      >
        {/* Bow — left loop */}
        <path
          d="M60 10 C52 3 38 4 36 12 C34 18 44 20 48 15 L52 12 Z"
          fill="#ff85c1"
          stroke="#ff69b4"
          strokeWidth="0.8"
        />
        {/* Bow — right loop */}
        <path
          d="M60 10 C68 3 82 4 84 12 C86 18 76 20 72 15 L68 12 Z"
          fill="#ff85c1"
          stroke="#ff69b4"
          strokeWidth="0.8"
        />
        {/* Bow tails */}
        <path
          d="M52 14 L46 26 L54 22 Z"
          fill="#ffc0d9"
          stroke="#ff69b4"
          strokeWidth="0.6"
        />
        <path
          d="M68 14 L74 26 L66 22 Z"
          fill="#ffc0d9"
          stroke="#ff69b4"
          strokeWidth="0.6"
        />
        {/* Bow knot */}
        <ellipse cx="60" cy="12" rx="4.5" ry="3.5" fill="#ff69b4" />

        {/* White frill band */}
        <path
          d="M12 18 H108 V26 C108 30 104 32 100 29 C96 33 92 29 88 32 C84 29 80 33 76 30 C72 33 68 29 64 32 C60 29 56 33 52 30 C48 33 44 29 40 32 C36 29 32 33 28 30 C24 33 20 29 16 32 C12 30 12 26 12 22 Z"
          fill="#ffffff"
          stroke="#ffb8d0"
          strokeWidth="1.2"
        />

        {/* Lace scallops along bottom of band */}
        <path
          d="M16 30 Q20 34 24 30 Q28 34 32 30 Q36 34 40 30 Q44 34 48 30 Q52 34 56 30 Q60 34 64 30 Q68 34 72 30 Q76 34 80 30 Q84 34 88 30 Q92 34 96 30 Q100 34 104 30"
          fill="none"
          stroke="#ffd6e7"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Tiny lace dots */}
        <circle cx="24" cy="24" r="1.2" fill="#ffe0ec" />
        <circle cx="40" cy="24" r="1.2" fill="#ffe0ec" />
        <circle cx="56" cy="24" r="1.2" fill="#ffe0ec" />
        <circle cx="72" cy="24" r="1.2" fill="#ffe0ec" />
        <circle cx="88" cy="24" r="1.2" fill="#ffe0ec" />
      </svg>
    </div>
  );
}
