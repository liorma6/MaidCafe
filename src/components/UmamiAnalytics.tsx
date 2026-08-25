import Script from "next/script";

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function UmamiAnalytics() {
  if (!umamiWebsiteId) return null;

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={umamiWebsiteId}
      strategy="afterInteractive"
    />
  );
}
