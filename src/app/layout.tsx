import type { Metadata } from "next";
import { Titillium_Web, Oxygen } from "next/font/google";
import "./globals.css";
import { SiteContentProvider } from "@/context/SiteContentContext";

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

export const metadata: Metadata = {
  icons: {
    icon: "/images/logo.gif",
    shortcut: "/images/logo.gif",
    apple: "/images/logo.gif",
  },
  title: {
    default: "Emprendimientos MEC S.A. | Climatización Industrial Mendoza",
    template: "%s | Emprendimientos MEC S.A.",
  },
  description: "Diseñamos e implementamos sistemas de climatización industrial en Mendoza, Argentina. Enfriadores evaporativos, ventilación industrial, calefacción y automatización.",
  keywords: ["climatización industrial", "enfriadores evaporativos", "ventilación industrial", "Mendoza", "MECSA", "calefacción industrial"],
  authors: [{ name: "Emprendimientos MEC S.A." }],
  creator: "Emprendimientos MEC S.A.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://mecsa.com.ar",
    siteName: "Emprendimientos MEC S.A.",
    title: "Emprendimientos MEC S.A. | Climatización Industrial Mendoza",
    description: "Diseñamos e implementamos sistemas de climatización industrial en Mendoza, Argentina.",
    images: [{ url: "/images/hero1.jpeg", width: 1200, height: 630, alt: "Emprendimientos MEC S.A." }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${titilliumWeb.variable} ${oxygen.variable} antialiased`}>
        <SiteContentProvider>
          {children}
        </SiteContentProvider>
      </body>
    </html>
  );
}
