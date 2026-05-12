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

  // Duplicate for seamless loop
  const track = [...clientes, ...clientes];

  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <FadeIn>
          <div className="text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--mecsa-primary)] mb-3">
              Más de 26 años de experiencia
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[var(--mecsa-text)]" style={{ fontFamily: "var(--font-titillium)" }}>
              Empresas que <span className="text-[var(--mecsa-primary)] font-semibold">confían en nosotros</span>
            </h2>
          </div>
        </FadeIn>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

        <div className="flex overflow-hidden">
          <ul className="flex gap-4 animate-marquee whitespace-nowrap shrink-0">
            {track.map((name, i) => (
              <li key={i} className="inline-flex items-center gap-3 px-5 py-2.5 border border-[var(--mecsa-primary)]/20 rounded-sm bg-[var(--mecsa-bg)] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--mecsa-primary)] shrink-0" />
                <span className="text-sm font-medium text-[var(--mecsa-text)] tracking-wide" style={{ fontFamily: "var(--font-titillium)" }}>
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
