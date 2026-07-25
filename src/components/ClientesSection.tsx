"use client";

import { FadeIn } from "./ScrollAnimations";
import { useSiteContent } from "@/context/SiteContentContext";

const FALLBACK = [
  "Arcor", "Unilever", "Drean Mabe", "Plastiandino", "BolsaFilm",
  "Carin", "Zummy", "Mansur", "Oscar David", "Peñaflor",
  "Carnes La Cuyana", "Fundación Instituto Leloir", "Lácteos Maitia",
  "Finca Rocío", "Marata", "Agrinet", "Proemio",
];

export default function ClientesSection() {
  const { content } = useSiteContent();
  const clientes = content.clientes?.length ? content.clientes : FALLBACK;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-[var(--mecsa-primary)] mb-3">
              Más de 26 años de experiencia
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--mecsa-text)]" style={{ fontFamily: "var(--font-titillium)" }}>
              Empresas que <span className="text-[var(--mecsa-primary)] font-semibold">confían en nosotros</span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {clientes.map((name) => (
              <li
                key={name}
                className="flex items-center justify-center min-h-[64px] px-4 py-3 border border-[var(--mecsa-primary)]/15 bg-[var(--mecsa-bg)] rounded-sm text-center transition-colors hover:border-[var(--mecsa-primary)]/40"
              >
                <span
                  className="text-sm md:text-[0.9375rem] font-semibold text-[var(--mecsa-text)] leading-tight"
                  style={{ fontFamily: "var(--font-titillium)", letterSpacing: "0.02em" }}
                >
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
