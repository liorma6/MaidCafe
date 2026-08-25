"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  glyph: string;
  angle: number;
  distance: number;
  size: number;
};

const SPARKLE_GLYPHS = ["✨", "♡", "★", "☆", "💖", "✦"];

function burstFromPoint(
  x: number,
  y: number,
  count: number,
): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i + Math.random(),
    x,
    y,
    glyph: SPARKLE_GLYPHS[i % SPARKLE_GLYPHS.length],
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6,
    distance: 36 + Math.random() * 72,
    size: 0.85 + Math.random() * 0.55,
  }));
}

export default function HomeLogo() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [glow, setGlow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const lastBurstRef = useRef(0);

  const playMagicSound = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.0001, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.14, now + i * 0.07 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.42);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.45);
      });
    } catch {
      // Audio unavailable
    }
  }, []);

  const triggerBurst = useCallback(
    (clientX: number, clientY: number) => {
      const now = Date.now();
      if (now - lastBurstRef.current < 180) return;
      lastBurstRef.current = now;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const batch = burstFromPoint(x, y, reducedMotion ? 6 : 16);

      setSparkles((prev) => [...prev, ...batch]);
      setGlow(true);
      playMagicSound();

      window.setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => !batch.some((b) => b.id === s.id)));
      }, 950);

      window.setTimeout(() => setGlow(false), 420);
    },
    [playMagicSound],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    triggerBurst(event.clientX, event.clientY);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <div
      ref={containerRef}
      className={`hero-sparkle home-logo-trigger relative mx-auto mb-6 w-fit select-none transition hover:scale-105 active:scale-95 ${glow ? "home-logo-glow" : ""}`}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Unique Maid Cafe — לחצו לנצנוץ קסום"
    >
      <Image
        src="/images/logo.png"
        alt="Unique Maid Cafe"
        width={220}
        height={220}
        className="pointer-events-none mx-auto drop-shadow-xl"
        priority
        draggable={false}
      />

      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          aria-hidden
          className="logo-sparkle-particle pointer-events-none absolute"
          style={
            {
              left: sparkle.x,
              top: sparkle.y,
              fontSize: `${sparkle.size}rem`,
              "--sparkle-x": `${Math.cos(sparkle.angle) * sparkle.distance}px`,
              "--sparkle-y": `${Math.sin(sparkle.angle) * sparkle.distance}px`,
            } as React.CSSProperties
          }
        >
          {sparkle.glyph}
        </span>
      ))}
    </div>
  );
}
