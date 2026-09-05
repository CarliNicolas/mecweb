"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { StaggerChildren, StaggerItem } from "./ScrollAnimations";
import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";
import { renderInline } from "@/lib/inline-markdown";
import { useTranslations, useLocale } from "next-intl";

const DEFAULT_IMAGE_BY_ID: Record<string, string> = {
  "enfriadores-evaporativos": "/images/enfriador.jpeg",
  "calefactores-radiantes": "/images/gallery2.jpeg",
  "ventilacion-industrial": "/images/ventilacion.jpeg",
  "filtracion-de-aire": "/images/gallery3.jpeg",
  "control-y-automatizacion": "/images/gallery4.jpeg",
};

const esDefaultProducts = [
  { id: "enfriadores-evaporativos", title: "Enfriadores Evaporativos", description: "Consuma hasta un 80% menos de energía eléctrica con nuestro sistema de enfriadores evaporativos de alta eficiencia.", image: "/images/enfriador.jpeg" },
  { id: "calefactores-radiantes", title: "Calefactores Radiantes", description: "Nuestros tubos radiantes PIROMEC son aparatos autónomos de combustión a gas natural o G.L.P de gran eficiencia.", image: "/images/gallery2.jpeg" },
  { id: "ventilacion-industrial", title: "Ventilación Industrial", description: "Sistemas de ventilación para usos comerciales, industriales y agrícolas; soluciones para cada necesidad.", image: "/images/ventilacion.jpeg" },
  { id: "filtracion-de-aire", title: "Filtración de Aire", description: "Filtros absolutos, tratamiento de gases, equipos de flujo laminar, recolección de polvos y humedad.", image: "/images/gallery3.jpeg" },
  { id: "control-y-automatizacion", title: "Control y Automatización", description: "Los mejores controles de monitoreo, automatización y control para la climatización de su empresa.", image: "/images/gallery4.jpeg" },
];

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function ProductsGrid() {
  const { content } = useSiteContent();
  const t = useTranslations("products");
  const locale = useLocale();
  const isEs = locale === "es";

  const sectionTitle = isEs ? (content.productsSection?.title || t("solutionsTitle")) : t("solutionsTitle");
  const sectionSubtitle = isEs ? (content.productsSection?.subtitle || t("ourServices")) : t("ourServices");

  const translatedProducts = [
    { id: "enfriadores-evaporativos", title: t("evaporativeCoolers"), description: t("evaporativeCoolersDesc"), image: "/images/enfriador.jpeg" },
    { id: "calefactores-radiantes", title: t("radiantHeaters"), description: t("radiantHeatersDesc"), image: "/images/gallery2.jpeg" },
    { id: "ventilacion-industrial", title: t("industrialVentilation"), description: t("industrialVentilationDesc"), image: "/images/ventilacion.jpeg" },
    { id: "filtracion-de-aire", title: t("airFiltration"), description: t("airFiltrationDesc"), image: "/images/gallery3.jpeg" },
    { id: "control-y-automatizacion", title: t("controlAutomation"), description: t("controlAutomationDesc"), image: "/images/gallery4.jpeg" },
  ];

  // Líneas desactivadas desde el admin (hidden) no se muestran en el sitio.
  const hiddenIds = new Set(
    content.products.filter((p) => (p as { hidden?: boolean }).hidden).map((p) => p.id),
  );
  const products = (isEs
    ? (content.products.length > 0 ? content.products : esDefaultProducts)
    : translatedProducts
  ).filter((p) => !hiddenIds.has(p.id));

  return (
    <section id="productos" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-bg)]">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[var(--mecsa-primary)]/20 text-[var(--mecsa-primary)] text-xs font-bold tracking-widest uppercase rounded-full mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--mecsa-primary)] inline-block" />
              {sectionSubtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[var(--mecsa-text)]" style={{ fontFamily: "var(--font-titillium)" }}>
              {sectionTitle}
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren
          className={`grid gap-5 ${
            products.length <= 3 ? "sm:grid-cols-2 lg:grid-cols-3" :
            products.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" :
            "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          }`}
          staggerDelay={0.08}
        >
          {products.map((product) => {
            type ProductWithImage = typeof product & { image?: string };
            const p = product as ProductWithImage;
            const productImage = p.image || DEFAULT_IMAGE_BY_ID[product.id] || "/images/gallery1.jpeg";

            return (
              <StaggerItem key={product.id}>
                <article className="group relative flex flex-col h-full rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    {isExternal(productImage) ? (
                      <img
                        src={productImage}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={productImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-semibold text-base mb-2 leading-snug text-[var(--mecsa-text)]"
                      style={{ fontFamily: "var(--font-titillium)" }}>
                      {product.title}
                    </h3>
                    <p className="text-sm leading-relaxed flex-1 mb-5 text-[var(--mecsa-text-light)]">
                      {renderInline(product.description)}
                    </p>
                    <Link
                      href={`/productos/${product.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold w-fit text-[var(--mecsa-primary)] border-b border-[var(--mecsa-primary)]/30 pb-0.5 hover:border-[var(--mecsa-primary)] transition-colors duration-200"
                    >
                      <span>{t("viewMore")}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
