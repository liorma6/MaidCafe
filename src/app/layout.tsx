import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteExtras from "@/components/SiteExtras";
import UmamiAnalytics from "@/components/UmamiAnalytics";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | מייד קפה ישראלי`,
  description: SITE_TAGLINE,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full`}>
      <body className="min-h-full antialiased">
        <UmamiAnalytics />
        <div className="page-wrapper flex min-h-full flex-col">
          <Navbar />
          <main className="main-content sakura-bg mx-auto w-full max-w-4xl flex-1 px-4 py-8">
            {children}
          </main>
          <Footer />
          <SiteExtras />
        </div>
      </body>
    </html>
  );
}
