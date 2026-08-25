import Script from "next/script";

export default function UmamiAnalytics() {
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id="2d54d082-6293-40fb-a658-d687ba1beff7"
      strategy="afterInteractive"
    />
  );
}
