"use client";

import Image from "next/image";
import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations, useLocale } from "next-intl";

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function CompanyIntro() {
  const { content } = useSiteContent();
  const intro = content.companyIntro;
  const t = useTranslations("company");
  const locale = useLocale();
  const isEs = locale === "es";

  const title1 = isEs ? (intro.title1 || t("title1")) : t("title1");
  const title2 = isEs ? (intro.title2 || t("title2")) : t("title2");
  const title3 = isEs ? (intro.title3 || t("title3")) : t("title3");
  const description1 = isEs ? (intro.description1 || t("description1")) : t("description1");
  const description2 = isEs ? (intro.description2 || t("description2")) : t("description2");

  return (
    <section id="empresa" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <FadeIn direction="left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-5 sm:mb-6">
                <span className="mecsa-heading-italic">{title1}</span>
                <br />
                <span className="text-[var(--mecsa-primary)] font-semibold">{title2}</span>
                <br />
                <span className="mecsa-heading">{title3}</span>
              </h2>
              <p className="text-[var(--mecsa-text-light)] mb-5 leading-relaxed text-sm sm:text-base">
                {description1}
              </p>
              <p className="text-[var(--mecsa-text-light)] leading-relaxed text-sm sm:text-base">
                {description2}
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="relative flex justify-center items-center">
              <svg className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] -right-4 top-1/2 -translate-y-1/2 hidden sm:block" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="180" stroke="#ae473d" strokeWidth="4" strokeDasharray="8 8" fill="none" opacity="0.6" />
                <path d="M 380 200 A 180 180 0 0 1 200 380" stroke="#ae473d" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
              <div className="relative z-10 flex items-end gap-3 sm:gap-4">
                <div className="relative w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] rounded-lg shadow-lg overflow-hidden">
                  {isExternal(intro.image1 || "") ? (
                    <img src={intro.image1} alt="Enfriador Evaporativo" className="w-full h-full object-cover" />
                  ) : (
                    <Image src={intro.image1 || "/images/enfriador.jpeg"} alt="Enfriador Evaporativo"
                      fill sizes="(max-width: 640px) 180px, 260px" className="object-cover" />
                  )}
                </div>
                <div className="relative w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] rounded-lg shadow-lg overflow-hidden bg-white -mb-6 sm:-mb-8">
                  {isExternal(intro.image2 || "") ? (
                    <img src={intro.image2} alt="Sistema de Ventilación" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Image src={intro.image2 || "/images/ventilacion.jpeg"} alt="Sistema de Ventilación"
                      fill sizes="(max-width: 640px) 140px, 200px" className="object-contain p-2" />
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
