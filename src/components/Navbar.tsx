"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-pink-300 bg-white/95 shadow-md backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-4 md:flex-row md:justify-between">
        <Link href="/" className="flex items-center gap-3 transition hover:scale-105">
          <Image
            src="/images/logo.png"
            alt="לוגו Unique Maid Cafe - מייד קפה ישראלי"
            width={80}
            height={80}
            className="drop-shadow-md"
          />
          <div className="text-center md:text-right">
            <p className="text-xl font-bold text-pink-600">{SITE_NAME}</p>
            <p className="text-sm text-pink-400">Maid & Butler ♡</p>
          </div>
        </Link>

        <nav className="flex flex-wrap justify-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-pink-500 text-white shadow-lg"
                    : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
