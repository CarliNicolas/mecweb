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
