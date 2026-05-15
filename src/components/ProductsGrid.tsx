"use client";

import Link from "next/link";
import {
  Cloud, Flame, Wind, Filter, Settings, Thermometer,
  Zap, Shield, Droplets, Fan, ArrowRight, LucideIcon,
} from "lucide-react";
import { StaggerChildren, StaggerItem } from "./ScrollAnimations";
import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";
import { renderInline } from "@/lib/inline-markdown";
import { useTranslations, useLocale } from "next-intl";

const iconMap: Record<string, LucideIcon> = {
  Cloud, Flame, Wind, Filter, Settings,
  Thermometer, Zap, Shield, Droplets, Fan,
};

const CARD_STYLES = [
  {
    bg: "bg-gradient-to-br from-[#ac493f] to-[#7a2f28]",
    icon: "bg-white/20 text-white",
    text: "text-white",
    sub: "text-white/75",
    link: "text-white border-white/40 hover:border-white",
    badge: "text-white/30",
    line: "bg-white/40",
    featured: true,
  },
  {
    bg: "bg-white border border-gray-100",
    icon: "bg-[var(--mecsa-bg)] text-[var(--mecsa-primary)]",
    text: "text-[var(--mecsa-text)]",
    sub: "text-[var(--mecsa-text-light)]",
    link: "text-[var(--mecsa-primary)] border-[var(--mecsa-primary)]/30 hover:border-[var(--mecsa-primary)]",
    badge: "text-gray-200",
    line: "bg-[var(--mecsa-primary)]",
    featured: false,
  },
];

const esDefaultProducts = [
  { id: "enfriadores-evaporativos", icon: "Cloud", title: "Enfriadores Evaporativos", description: "Consuma hasta un 80% menos de energía eléctrica con nuestro sistema de enfriadores evaporativos de alta eficiencia." },
  { id: "calefactores-radiantes", icon: "Flame", title: "Calefactores Radiantes", description: "Nuestros tubos radiantes PIROMEC son aparatos autónomos de combustión a gas natural o G.L.P de gran eficiencia." },
  { id: "ventilacion-industrial", icon: "Wind", title: "Ventilación Industrial", description: "Sistemas de ventilación para usos comerciales, industriales y agrícolas; soluciones para cada necesidad." },
  { id: "filtracion-de-aire", icon: "Filter", title: "Filtración de Aire", description: "Filtros absolutos, tratamiento de gases, equipos de flujo laminar, recolección de polvos y humedad." },
  { id: "control-y-automatizacion", icon: "Settings", title: "Control y Automatización", description: "Los mejores controles de monitoreo, automatización y control para la climatización de su empresa." },
];

export default function ProductsGrid() {
  const { content } = useSiteContent();
  const t = useTranslations("products");
  const locale = useLocale();
  const isEs = locale === "es";

  const sectionTitle = isEs ? (content.productsSection?.title || t("solutionsTitle")) : t("solutionsTitle");
  const sectionSubtitle = isEs ? (content.productsSection?.subtitle || t("ourServices")) : t("ourServices");

  const translatedProducts = [
    { id: "enfriadores-evaporativos", icon: "Cloud", title: t("evaporativeCoolers"), description: t("evaporativeCoolersDesc") },
    { id: "calefactores-radiantes", icon: "Flame", title: t("radiantHeaters"), description: t("radiantHeatersDesc") },
    { id: "ventilacion-industrial", icon: "Wind", title: t("industrialVentilation"), description: t("industrialVentilationDesc") },
    { id: "filtracion-de-aire", icon: "Filter", title: t("airFiltration"), description: t("airFiltrationDesc") },
    { id: "control-y-automatizacion", icon: "Settings", title: t("controlAutomation"), description: t("controlAutomationDesc") },
  ];

  const products = isEs
    ? (content.products.length > 0 ? content.products : esDefaultProducts)
    : translatedProducts;

  return (
    <section id="productos" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-bg)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--mecsa-primary)] opacity-[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[var(--mecsa-primary)] opacity-[0.04] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <FadeIn>
          <div className="text-center mb-14">
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
          {products.map((product, index) => {
            const IconComponent = iconMap[product.icon] || Cloud;
            const style = index === 0 ? CARD_STYLES[0] : CARD_STYLES[1];

            return (
              <StaggerItem key={product.id}>
                <div className={`group relative flex flex-col h-full rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ${style.bg}`}>
                  <span className={`absolute top-4 right-5 text-5xl font-black leading-none select-none ${style.badge} transition-opacity`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={`relative z-10 w-14 h-14 rounded-2xl ${style.icon} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className={`relative z-10 font-semibold text-base mb-3 leading-snug ${style.text}`}
                    style={{ fontFamily: "var(--font-titillium)" }}>
                    {product.title}
                  </h3>
                  <p className={`relative z-10 text-sm leading-relaxed flex-1 mb-6 ${style.sub}`}>
                    {renderInline(product.description)}
                  </p>
                  <Link
                    href={`/productos/${product.id}`}
                    className={`relative z-10 inline-flex items-center gap-2 text-sm font-semibold border-b pb-0.5 w-fit transition-all duration-200 ${style.link}`}
                  >
                    <span>{t("viewMore")}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${style.line} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
