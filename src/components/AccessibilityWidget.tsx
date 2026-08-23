"use client";

import { useEffect, useState } from "react";

const FONT_KEY = "a11y-large-font";
const CONTRAST_KEY = "a11y-high-contrast";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const font = localStorage.getItem(FONT_KEY) === "true";
    const contrast = localStorage.getItem(CONTRAST_KEY) === "true";
    setLargeFont(font);
    setHighContrast(contrast);
    document.documentElement.classList.toggle("a11y-large-font", font);
    document.documentElement.classList.toggle("a11y-high-contrast", contrast);
  }, []);

  const toggleFont = () => {
    const next = !largeFont;
    setLargeFont(next);
    localStorage.setItem(FONT_KEY, String(next));
    document.documentElement.classList.toggle("a11y-large-font", next);
  };

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem(CONTRAST_KEY, String(next));
    document.documentElement.classList.toggle("a11y-high-contrast", next);
  };

  return (
    <div className="fixed bottom-20 left-4 z-[90] flex flex-col items-start gap-2">
      {open && (
        <div
          role="menu"
          aria-label="תפריט נגישות"
          className="kawaii-card min-w-[200px] space-y-2 p-4 shadow-xl"
        >
          <p className="text-sm font-bold text-pink-700">נגישות</p>
          <button
            type="button"
            role="menuitem"
            onClick={toggleFont}
            className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
              largeFont
                ? "bg-pink-500 text-white"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
          >
            {largeFont ? "✓ " : ""}הגדלת פונט
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={toggleContrast}
            className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
              highContrast
                ? "bg-pink-500 text-white"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
          >
            {highContrast ? "✓ " : ""}קונטרסט גבוה
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-pink-300 bg-white text-pink-600 shadow-lg transition hover:scale-105 hover:bg-pink-50"
      >
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2zm-2 7c-1.1 0-2 .9-2 2v1H6v2h2v6h4v-6h2v-2h-2v-1c0-1.1-.9-2-2-2h-4zm8 0h-2v11h2V9z" />
        </svg>
      </button>
    </div>
  );
}
