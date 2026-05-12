import type { Metadata } from "next";
import { Titillium_Web, Oxygen } from "next/font/google";
import "./globals.css";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import AvatarChat from "@/components/AvatarChat";

const titilliumWeb = Titillium_Web({
  variable: "--font-titillium",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600", "700"],
});

const oxygen = Oxygen({
  variable: "--font-oxygen",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mecweb.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/images/logo.gif",
    shortcut: "/images/logo.gif",
    apple: "/images/logo.gif",
  },
  title: {
    default: "Emprendimientos MEC S.A. | Climatización Industrial Mendoza",
    template: "%s | MEC S.A.",
  },
  description: "Diseñamos y fabricamos sistemas de climatización industrial en Mendoza, Argentina. Enfriadores evaporativos, ventilación industrial, calefacción PIROMEC, filtración de aire y automatización.",
  keywords: [
    "climatización industrial Mendoza",
    "enfriadores evaporativos Mendoza",
    "ventilación industrial Argentina",
    "calefactores radiantes PIROMEC",
    "filtración de aire industrial",
    "control automatización climatización",
    "MEC Emprendimientos Mendoza",
    "galpones refrigeración Mendoza",
    "enfriamiento evaporativo Argentina",
  ],
  authors: [{ name: "Emprendimientos MEC S.A." }],
  creator: "Emprendimientos MEC S.A.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Emprendimientos MEC S.A.",
    title: "Emprendimientos MEC S.A. | Climatización Industrial Mendoza",
    description: "Diseñamos y fabricamos sistemas de climatización industrial en Mendoza. Enfriadores evaporativos, ventilación, calefacción y automatización.",
    images: [{
      url: "/images/climatizacion-en-galpones-1155x770.jpg",
      width: 1155,
      height: 770,
      alt: "Sistemas de climatización industrial — Emprendimientos MEC S.A., Mendoza",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emprendimientos MEC S.A. | Climatización Industrial Mendoza",
    description: "Diseñamos y fabricamos sistemas de climatización industrial en Mendoza.",
    images: ["/images/climatizacion-en-galpones-1155x770.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Emprendimientos MEC S.A.",
    alternateName: ["MECSA", "MEC S.A."],
    description: "Diseñamos y fabricamos sistemas de climatización industrial en Mendoza, Argentina. Enfriadores evaporativos, ventilación, calefacción PIROMEC, filtración de aire y automatización.",
    url: SITE_URL,
    telephone: "+542615173763",
    email: "info@mecsa.com.ar",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Godoy Cruz 562",
      addressLocality: "San José, Guaymallén",
      addressRegion: "Mendoza",
      postalCode: "5521",
      addressCountry: "AR",
    },
    geo: { "@type": "GeoCoordinates", latitude: -32.89, longitude: -68.83 },
    image: `${SITE_URL}/images/climatizacion-en-galpones-1155x770.jpg`,
    logo: `${SITE_URL}/images/logo.gif`,
    sameAs: ["https://www.facebook.com/share/1AXfsJCuV6/?mibextid=wwXIfr"],
    areaServed: { "@type": "GeoRegion", name: "Mendoza, Argentina" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Sistemas de Climatización Industrial",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Enfriadores Evaporativos", url: `${SITE_URL}/productos/enfriadores-evaporativos` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Calefactores Radiantes PIROMEC", url: `${SITE_URL}/productos/calefactores-radiantes` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ventilación Industrial", url: `${SITE_URL}/productos/ventilacion-industrial` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Filtración de Aire", url: `${SITE_URL}/productos/filtracion-de-aire` } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Control y Automatización", url: `${SITE_URL}/productos/control-y-automatizacion` } },
      ],
    },
  };

  return (
    <html lang={locale}>
      <body className={`${titilliumWeb.variable} ${oxygen.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteContentProvider>
            {children}
            <AvatarChat />
          </SiteContentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
