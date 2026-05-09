"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations, useLocale } from "next-intl";

export default function Fabricantes() {
  const { content } = useSiteContent();
  const fab = content.fabricantes;
  const t = useTranslations("manufacturers");
  const locale = useLocale();
  const isEs = locale === "es";

  const title = isEs ? (fab.title || t("title")) : t("title");
  const desc1 = isEs ? (fab.description1 || t("description1")) : t("description1");
  const desc2 = isEs ? (fab.description2 || t("description2")) : t("description2");
  const desc3 = isEs ? (fab.description3 || t("description3")) : t("description3");
  const btnText = isEs ? (fab.buttonText || t("viewGallery")) : t("viewGallery");

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative">
              <img
                src={fab.image || "/images/ingenieros.png"}
                alt={title}
                className="w-full h-auto max-w-md mx-auto"
              />
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div>
              <h2 className="mecsa-section-title mb-6">{title}</h2>

              <p className="text-[var(--mecsa-text-light)] mb-6 leading-relaxed">
                <strong className="text-[var(--mecsa-text)]">{desc1}</strong>{" "}
                {desc2}
              </p>

              <p className="text-[var(--mecsa-text-light)] mb-8 leading-relaxed">
                {desc3}
              </p>

              <Link href={fab.buttonLink || "/#galeria"} className="mecsa-btn flex items-center gap-2 group inline-flex">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span>{btnText}</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
