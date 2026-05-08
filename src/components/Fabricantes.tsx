"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Fabricantes() {
  const { content } = useSiteContent();
  const fab = content.fabricantes;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <FadeIn direction="left">
            <div className="relative">
              <img
                src={fab.image || "/images/ingenieros.png"}
                alt="Ingenieros de MECSA"
                className="w-full h-auto max-w-md mx-auto"
              />
            </div>
          </FadeIn>

          {/* Text Content */}
          <FadeIn direction="right" delay={0.2}>
            <div>
              <h2 className="mecsa-section-title mb-6">{fab.title || "Somos Fabricantes"}</h2>

              <p className="text-[var(--mecsa-text-light)] mb-6 leading-relaxed">
                <strong className="text-[var(--mecsa-text)]">
                  {fab.description1 || "Somos fabricantes en Mendoza (Argentina) de Enfriadores Evaporativos de Alta Eficiencia."}
                </strong>{" "}
                {fab.description2 || "Diseñamos el equipo y el sistema, según las características y necesidades del lugar donde serán finalmente instalados."}
              </p>

              <p className="text-[var(--mecsa-text-light)] mb-8 leading-relaxed">
                {fab.description3 || "Tomando aire del exterior el sistema no sólo baja la carga térmica del ambiente sino que también genera presión positiva dentro del mismo lo que garantiza que desde el exterior entra aire previamente filtrado pudiendo implementarse normas de polución ambiental en lo que a calidad de aires se refiere. Ofrecemos soluciones sustentables."}
              </p>

              <Link href={fab.buttonLink || "/#galeria"} className="mecsa-btn flex items-center gap-2 group inline-flex">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span>{fab.buttonText || "Ver Fotogalería"}</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
