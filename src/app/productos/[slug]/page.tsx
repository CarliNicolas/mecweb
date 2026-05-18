import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/site-content-server";

export const dynamic = "force-dynamic";

interface ProductData {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  features?: string[];
  image?: string;
  gallery?: string[];
  icon?: string;
}

interface DetailProduct {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  gallery: string[];
}

// Fallback content for products that exist in admin but don't yet have
// detail-page fields filled in. Keeps the page renderable even if the
// admin hasn't migrated yet.
const FALLBACK_KEYWORDS: Record<string, string[]> = {
  "enfriadores-evaporativos": [
    "enfriadores evaporativos Mendoza",
    "climatización evaporativa industrial",
    "enfriamiento galpones bodegas",
    "enfriadores industriales Argentina",
  ],
  "calefactores-radiantes": [
    "calefactores radiantes industriales",
    "tubos radiantes PIROMEC",
    "calefacción infrarroja galpones",
    "calefacción industrial Mendoza",
  ],
  "ventilacion-industrial": [
    "ventilación industrial Mendoza",
    "extractores industriales",
    "ventiladores axiales centrífugos",
    "renovación de aire industrial",
  ],
  "filtracion-de-aire": [
    "filtración de aire industrial",
    "filtros HEPA industriales",
    "calidad de aire Mendoza",
    "filtración farmacéutica electrónica",
  ],
  "control-y-automatizacion": [
    "automatización climatización industrial",
    "control remoto temperatura humedad",
    "monitoreo industrial 24/7",
    "SCADA climatización Mendoza",
  ],
};

function toDetailProduct(p: ProductData): DetailProduct {
  return {
    title: p.title || "",
    subtitle: p.subtitle || "",
    description: p.description || "",
    longDescription: p.longDescription || p.description || "",
    features: Array.isArray(p.features) ? p.features : [],
    image: p.image || "/images/enfriador.jpeg",
    gallery: Array.isArray(p.gallery) && p.gallery.length > 0
      ? p.gallery
      : (p.image ? [p.image] : []),
  };
}

async function loadProducts(): Promise<Record<string, DetailProduct>> {
  const content = await getSiteContent();
  const rawProducts = (content as { products?: ProductData[] } | null)?.products || [];
  const map: Record<string, DetailProduct> = {};
  for (const p of rawProducts) {
    if (!p.id) continue;
    map[p.id] = toDetailProduct(p);
  }
  return map;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await loadProducts();
  const product = products[slug];

  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    keywords: FALLBACK_KEYWORDS[slug] ?? [],
    alternates: { canonical: `/productos/${slug}` },
    openGraph: {
      title: `${product.title} | MEC S.A.`,
      description: product.description,
      images: [{ url: product.image, alt: product.title }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await loadProducts();
  const product = products[slug];

  if (!product) notFound();

  return (
    <main className="min-h-screen">
      <Header />
      <ProductDetailClient product={product} slug={slug} allProducts={products} />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
