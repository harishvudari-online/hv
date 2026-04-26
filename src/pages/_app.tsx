import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Harish Vudari"
        defaultTitle="Harish Vudari | Senior UI Engineer"
        description="Senior UI Engineer with 10+ years of experience in Angular and React.js, delivering scalable web applications."
        canonical="https://harishvudari.online"
        openGraph={{
          type: "website",
          locale: "en_IN",
          url: "https://harishvudari.online",
          siteName: "Harish Vudari Portfolio",
          title: "Harish Vudari | Senior UI Engineer",
          description:
            "Angular and React specialist from Hyderabad, open to remote global opportunities."
        }}
        twitter={{
          cardType: "summary_large_image"
        }}
      />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
