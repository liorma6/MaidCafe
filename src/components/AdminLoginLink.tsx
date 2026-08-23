"use client";

import Link from "next/link";

export default function AdminLoginLink() {
  return (
    <Link
      href="/admin"
      className="text-[10px] text-pink-200 transition hover:text-pink-400"
    >
      כניסת מנהל
    </Link>
  );
}
