"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeIn, StaggerChildren, StaggerItem } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";

const defaultSectors = [
  { title: "INDUSTRIAL", description: "Bodegas, Fábricas, Galpones, Metalúrgicas, Mineras, Petroleras, Siderúrgicas, Frigoríficos, entre otros.", image: "/images/industrial.jpeg", link: "/productos/enfriadores-evaporativos" },
  { title: "COMERCIAL", description: "Locales comerciales, Hipermercados Edificios, Hoteles, Restaurantes, Clubes, Hospitales, Camping, entre otros...", image: "/images/comercial.jpeg", link: "/productos/ventilacion-industrial" },
  { title: "PARTICULAR", description: "Ofrecemos servicios de climatización integral para pequeños negocios y particulares (Hogar)...", image: "/images/particular.jpeg", link: "/contacto" },
];

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function SectorsGrid() {
  const { content } = useSiteContent();
  const sectorsData = content.sectors;
  const sectors = sectorsData.items.length > 0 ? sectorsData.items : defaultSectors;

  return (
    <section id="rubros" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="mecsa-section-title mb-4">{sectorsData.title || "Rubros Gestionados"}</h2>
            <p className="text-[var(--mecsa-text-light)]">{sectorsData.subtitle || "En cuáles áreas te podemos ayudar ?"}</p>
          </div>
        </FadeIn>
        <StaggerChildren className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {sectors.map((sector) => (
            <StaggerItem key={sector.title}>
              <Link href={sector.link}
                className="block bg-[var(--mecsa-bg)] rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <p className="text-[var(--mecsa-text-light)] mb-8 leading-relaxed min-h-[80px] group-hover:text-[var(--mecsa-text)] transition-colors">
                  {sector.description}
                </p>
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-transparent group-hover:ring-[var(--mecsa-primary)] transition-all">
                  {isExternal(sector.image) ? (
                    <img src={sector.image} alt={sector.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Image src={sector.image} alt={sector.title} fill sizes="128px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <h3 className="text-[var(--mecsa-primary)] font-semibold tracking-wider text-sm group-hover:text-[var(--mecsa-primary-dark)] transition-colors">
                  {sector.title}
                </h3>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
