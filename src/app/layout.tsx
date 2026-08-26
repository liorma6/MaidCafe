import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Rubik } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteExtras from "@/components/SiteExtras";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/constants";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "מאיד קפה",
    "מייד קאפה",
    "יוניק מייד קפה",
    "מייד קפה ישראל",
    "Maid Cafe Israel",
    "Unique Maid Cafe",
    "Maid Cafe",
    "The first Maid Cafe in Israel",
    "Cosplay",
    "Japanese culture",
    "Events",
    "Tel Aviv",
    "מייד קפה",
    "ישראל",
    "בית קפה יפני",
    "אנימה",
    "kawaii",
    "פופ-אפ",
    "אירועים",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 220,
        height: 220,
        alt: "Unique Maid Cafe Israel - The first Maid Cafe in Israel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/logo.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "yldZvG9Gil5Ps1BXsxAg204OXW4ReExQ6623zz7QQpE",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full`}>
      <body className="min-h-full antialiased">
        <div className="page-wrapper flex min-h-full flex-col">
          <Navbar />
          <main className="main-content sakura-bg mx-auto w-full max-w-4xl flex-1 px-4 py-8">
            {children}
          </main>
          <Footer />
          <SiteExtras />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
