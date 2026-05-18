"use client";

import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations, useLocale } from "next-intl";
import { renderInline, resolveDescriptions } from "@/lib/inline-markdown";

export default function ClimatizacionInfo() {
  const { content } = useSiteContent();
  const clim = content.climatizacion;
  const t = useTranslations("evaporative");
  const locale = useLocale();
  const isEs = locale === "es";

  const title = isEs ? (clim.title || t("title")) : t("title");
  const descriptions = isEs
    ? (() => {
        const resolved = resolveDescriptions(clim, ["description1", "description2"]);
        return resolved.length > 0 ? resolved : [t("description1"), t("description2")];
      })()
    : [t("description1"), t("description2")];

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

              {descriptions.map((desc, i) => (
                <p
                  key={`desc-${i}`}
                  className={`text-white/90 leading-relaxed ${
                    i < descriptions.length - 1 ? "mb-6" : ""
                  }`}
                >
                  {renderInline(desc)}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
