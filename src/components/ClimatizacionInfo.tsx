"use client";

import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";

export default function ClimatizacionInfo() {
  const { content } = useSiteContent();
  const clim = content.climatizacion;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#c9a9a2]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* YouTube Video */}
          <FadeIn direction="left">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/QCw_DKN9jrU"
                title="Climatización evaporativa - ¿Cómo funciona un enfriador evaporativo?"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </FadeIn>

          {/* Text Content */}
          <FadeIn direction="right" delay={0.2}>
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
                {clim.title || "Que es la Climatización Evaporativa ?"}
              </h2>

              <p className="text-white/90 mb-6 leading-relaxed">
                {clim.description1 || "Te mostramos cómo funciona y cuáles son los beneficios de la climatización evaporativa. Contamos con los mejores equipos y sistemas para equipar tu empresa y optimizar todos los procesos de climatización."}
              </p>

              <p className="text-white/90 leading-relaxed">
                {clim.description2 || "Diseñamos y fabricamos equipos de climatización a la medida de sus necesidades, garantizando un producto de excelente calidad con certificados de garantía y personal altamente calificado. Somos una de las empresas líderes en el mercado de climatización industrial."}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
