"use client";

import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations, useLocale } from "next-intl";

export default function ClimatizacionInfo() {
  const { content } = useSiteContent();
  const clim = content.climatizacion;
  const t = useTranslations("evaporative");
  const locale = useLocale();
  const isEs = locale === "es";

  const title = isEs ? (clim.title || t("title")) : t("title");
  const desc1 = isEs ? (clim.description1 || t("description1")) : t("description1");
  const desc2 = isEs ? (clim.description2 || t("description2")) : t("description2");

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#c9a9a2]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/QCw_DKN9jrU"
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-5 sm:mb-6">
                {title}
              </h2>

              <p className="text-white/90 mb-6 leading-relaxed">
                {desc1}
              </p>

              <p className="text-white/90 leading-relaxed">
                {desc2}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
