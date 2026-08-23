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

        {/* White frill band — wraps onto the egg top */}
        <path
          d="M10 20 H110 V28 C110 33 105 35 100 32 C95 36 90 32 85 35 C80 32 75 36 70 33 C65 36 60 32 55 35 C50 32 45 36 40 33 C35 36 30 32 25 35 C20 32 15 36 10 33 C10 33 10 28 10 24 Z"
          fill="#ffffff"
          stroke="#ff85c1"
          strokeWidth="1.4"
        />

        {/* Band shadow where it meets the egg */}
        <path
          d="M14 32 Q60 38 106 32"
          fill="none"
          stroke="rgba(255, 105, 180, 0.35)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Lace scallops along bottom of band */}
        <path
          d="M14 33 Q18 37 22 33 Q26 37 30 33 Q34 37 38 33 Q42 37 46 33 Q50 37 54 33 Q58 37 62 33 Q66 37 70 33 Q74 37 78 33 Q82 37 86 33 Q90 37 94 33 Q98 37 102 33 Q106 37 110 33"
          fill="none"
          stroke="#ffd6e7"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Tiny lace dots */}
        <circle cx="24" cy="26" r="1.2" fill="#ffe0ec" />
        <circle cx="40" cy="26" r="1.2" fill="#ffe0ec" />
        <circle cx="56" cy="26" r="1.2" fill="#ffe0ec" />
        <circle cx="72" cy="26" r="1.2" fill="#ffe0ec" />
        <circle cx="88" cy="26" r="1.2" fill="#ffe0ec" />
      </svg>
    </div>
  );
}
