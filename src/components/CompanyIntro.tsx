"use client";

import Image from "next/image";
import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function CompanyIntro() {
  const { content } = useSiteContent();
  const intro = content.companyIntro;

  return (
    <section id="empresa" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6">
                <span className="mecsa-heading-italic">{intro.title1 || "Conozca nuestra empresa."}</span>
                <br />
                <span className="text-[var(--mecsa-primary)] font-semibold">{intro.title2 || "Asesoramiento |"}</span>
                <br />
                <span className="mecsa-heading">{intro.title3 || "Climatización según sus necesidades."}</span>
              </h2>
              <p className="text-[var(--mecsa-text-light)] mb-6 leading-relaxed">
                {intro.description1 || "EMPRENDIMIENTOS MEC S.A. tiene como objetivo diseñar e implementar Sistemas de Climatización Industrial para proveer un ambiente confortable mediante el control simultáneo de la temperatura, la humedad, la limpieza y la distribución del aire en el ambiente, sin omitir el nivel acústico."}
              </p>
              <p className="text-[var(--mecsa-text-light)] leading-relaxed">
                {intro.description2 || "Esto se logra mediante la provisión de Enfriadores Evaporativos ventiladores/extractores de aire; sistemas de tratamiento de aire que permiten controlar distintos parámetros industriales en diferentes espacios de acuerdo a especificaciones predeterminadas."}
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="relative flex justify-center items-center">
              <svg className="absolute w-[400px] h-[400px] -right-4 top-1/2 -translate-y-1/2" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="180" stroke="#ae473d" strokeWidth="4" strokeDasharray="8 8" fill="none" opacity="0.6" />
                <path d="M 380 200 A 180 180 0 0 1 200 380" stroke="#ae473d" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 flex items-end gap-4">
                <div className="relative w-[260px] h-[260px] rounded-lg shadow-lg overflow-hidden">
                  {isExternal(intro.image1 || "") ? (
                    <img src={intro.image1} alt="Enfriador Evaporativo" className="w-full h-full object-cover" />
                  ) : (
                    <Image src={intro.image1 || "/images/enfriador.jpeg"} alt="Enfriador Evaporativo"
                      fill sizes="260px" className="object-cover" />
                  )}
                </div>
                <div className="relative w-[200px] h-[200px] rounded-lg shadow-lg overflow-hidden bg-white -mb-8">
                  {isExternal(intro.image2 || "") ? (
                    <img src={intro.image2} alt="Sistema de Ventilación" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Image src={intro.image2 || "/images/ventilacion.jpeg"} alt="Sistema de Ventilación"
                      fill sizes="200px" className="object-contain p-2" />
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
