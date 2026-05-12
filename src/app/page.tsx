import type { Metadata } from "next";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import CompanyIntro from "@/components/CompanyIntro";
import Fabricantes from "@/components/Fabricantes";
import ProductsGrid from "@/components/ProductsGrid";
import SectorsGrid from "@/components/SectorsGrid";
import SocialIcons from "@/components/SocialIcons";
import ClimatizacionInfo from "@/components/ClimatizacionInfo";
import PhotoGallery from "@/components/PhotoGallery";
import NewsPreview from "@/components/NewsPreview";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Climatización Industrial Mendoza | Enfriadores Evaporativos y Ventilación",
  description: "Emprendimientos MEC S.A. — Fabricantes de sistemas de climatización industrial en Mendoza. Enfriadores evaporativos, ventilación, calefacción PIROMEC y automatización. Proyectos a medida.",
  keywords: [
    "climatización industrial Mendoza",
    "enfriadores evaporativos",
    "ventilación industrial Mendoza",
    "calefacción industrial",
    "enfriamiento evaporativo galpones",
    "MEC Mendoza climatización",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Emprendimientos MEC S.A. | Climatización Industrial Mendoza",
    description: "Fabricantes de sistemas de climatización industrial en Mendoza. Enfriadores evaporativos, ventilación, calefacción y automatización. Proyectos a medida.",
    images: [{ url: "/images/climatizacion-en-galpones-1155x770.jpg", width: 1155, height: 770, alt: "Climatización industrial en galpones — MEC S.A." }],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Add padding top for fixed header */}
      <div className="pt-20">
        <HeroCarousel />
        <CompanyIntro />
        <Fabricantes />
        <ProductsGrid />
        <SectorsGrid />
        <SocialIcons />
        <ClimatizacionInfo />
        <PhotoGallery />
        <NewsPreview />
        <Footer />
      </div>

      <WhatsAppButton />
    </main>
  );
}
