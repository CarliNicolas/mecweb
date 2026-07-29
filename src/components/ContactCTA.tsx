"use client";

import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { FadeIn } from "./ScrollAnimations";

export default function ContactCTA() {
  const { content } = useSiteContent();
  const info = content.companyInfo;
  const whatsappNumber = info.whatsapp || "5492615173763";
  const whatsappMessage = encodeURIComponent(
    "Hola MEC, quisiera consultarles por un proyecto de climatización."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const phoneHref = `tel:${(info.phone || "").replace(/\s/g, "")}`;

  return (
    <section id="contacto-cta" className="scroll-mt-24 py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-primary)] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn direction="left">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-white/80 mb-4">
                Hablemos de tu proyecto
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-5" style={{ fontFamily: "var(--font-titillium)" }}>
                Contanos qué necesitás.<br />
                <span className="font-semibold">Te respondemos en 24 h.</span>
              </h2>
              <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-lg">
                Cada proyecto se diseña a la medida. Un ingeniero revisa tu caso, evalúa el sistema que mejor se adapta y arma una propuesta sin compromiso.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <div className="grid gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white text-[var(--mecsa-text)] px-6 py-5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shrink-0">
                  <MessageCircle className="w-6 h-6" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs uppercase tracking-widest text-[var(--mecsa-text-light)]">WhatsApp</div>
                  <div className="font-semibold text-base group-hover:text-[var(--mecsa-primary)] transition-colors">
                    Escribinos ahora
                  </div>
                </div>
              </a>

              <a
                href={phoneHref}
                className="flex items-center gap-4 bg-white/10 border border-white/25 hover:bg-white/15 px-6 py-5 rounded-lg transition-colors"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 shrink-0">
                  <Phone className="w-5 h-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs uppercase tracking-widest text-white/70">Teléfono</div>
                  <div className="font-semibold text-base">{info.phone || "+54 261 517-3763"}</div>
                </div>
              </a>

              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-sm">
                <div className="flex items-start gap-2.5 text-white/85">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
                  <span>{info.address || "Godoy Cruz 562, San José, Guaymallén, Mendoza"}</span>
                </div>
                <div className="flex items-start gap-2.5 text-white/85">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
                  <span>Lunes a viernes<br />8:00 – 17:00 h</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
