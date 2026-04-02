// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "i18n";
import LenisProvider from "@/app/globals/components/lenis/LenisProvider";
import Nav from "@/app/globals/components/nav/Nav";
import "@/app/globals/styles/globals.css";
import localFont from "next/font/local";
import GsapGlobalEffects from "@/app/globals/components/gsap/GsapGlobalEffects";
import ScrollToTopOnRouteChange from "../globals/components/lenis/ScrollToTopOnRouteChange";
import Footer from "../globals/components/footer/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Marker",
  description: "Marker branding, marketing y web",
};

const myFont = localFont({
  src: [
    {
      path: "../../fonts/Aeonik-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../fonts/Aeonik-Medium.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "../../fonts/Aeonik-Light.woff2",
      weight: "300",
      style: "normal"
    }
  ],
  variable: '--font-primary' // para usar como variable CSS si quieres
});

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../messages/${locale}.json`).catch(
    () => null
  ))?.default;

  if (!messages) {
    notFound();
  }

  return (
    <html lang={locale} className={myFont.variable}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LenisProvider>
            <Nav />
            <GsapGlobalEffects />
            <ScrollToTopOnRouteChange />
            {children}
            <Toaster richColors position="bottom-right" />
            <Footer />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
