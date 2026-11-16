import Script from "next/script";

const GA_ID = "G-TSM3CLHD8N";

// Google Analytics for every visitor. No cookie banner (Fahim's choice, 2026-11-17).
// If a banner is needed later (UK/EU consent), see git history: commit "Add Google Analytics (GA4) loaded only after cookie consent".
export default function Analytics() {
  if (process.env.NODE_ENV !== "production") return null; // my laptop's test visits stay out of the numbers
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
