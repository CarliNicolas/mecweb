"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations, useLocale } from "next-intl";
import { renderInline, resolveDescriptions } from "@/lib/inline-markdown";

const YOUTUBE_ID = "QCw_DKN9jrU";

export default function ClimatizacionInfo() {
  const { content } = useSiteContent();
  const clim = content.climatizacion;
  const t = useTranslations("evaporative");
  const locale = useLocale();
  const isEs = locale === "es";
  const [videoLoaded, setVideoLoaded] = useState(false);

  const title = isEs ? (clim.title || t("title")) : t("title");
  const descriptions = isEs
    ? (() => {
        const resolved = resolveDescriptions(clim, ["description1", "description2"]);
        return resolved.length > 0 ? resolved : [t("description1"), t("description2")];
      })()
    : [t("description1"), t("description2")];

  const thumbnail = `https://img.youtube.com/vi/${YOUTUBE_ID}/hqdefault.jpg`;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#c9a9a2]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
              {videoLoaded ? (
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setVideoLoaded(true)}
                  className="group absolute inset-0 w-full h-full flex items-center justify-center focus-visible:outline-2 focus-visible:outline-white"
                  aria-label={`Reproducir video: ${title}`}
                >
                  <img
                    src={thumbnail}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
                  <span className="relative z-10 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--mecsa-primary)] text-white shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 md:w-9 md:h-9 fill-white ml-1" strokeWidth={0} />
                  </span>
                </button>
              )}
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
