"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent-accepted";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="הודעת עוגיות"
      className="fixed inset-x-0 bottom-0 z-[100] border-t-4 border-pink-300 bg-white/95 p-4 shadow-lg backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm leading-relaxed text-pink-800 sm:text-right">
          אתר זה משתמש בעוגיות (Cookies) כדי לשפר את חווית הגלישה. בהמשך הגלישה באתר הנך
          מסכים ל{" "}
          <Link href="/privacy" className="font-semibold text-pink-600 underline">
            מדיניות הפרטיות
          </Link>{" "}
          שלנו.
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="admin-btn shrink-0 whitespace-nowrap text-sm"
        >
          הבנתי
        </button>
      </div>
    </div>
  );
}
