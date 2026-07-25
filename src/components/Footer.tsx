"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations } from "next-intl";

function isRealSocialUrl(url: string): boolean {
  if (!url) return false;
  try {
    const { pathname } = new URL(url);
    return pathname.replace(/\/$/, "").length > 0;
  } catch {
    return false;
  }
}

export default function Footer() {
  const { content } = useSiteContent();
  const t = useTranslations("footer");
  const social = content.socialMedia as { facebook: string; twitter: string; instagram?: string };
  const footer = content.footer;
  const info = content.companyInfo;

  const socialLinks = [
    { href: social.facebook, Icon: Facebook, label: "Facebook" },
    { href: social.twitter, Icon: Twitter, label: "Twitter" },
    { href: social.instagram || "", Icon: Instagram, label: "Instagram" },
  ].filter((s) => isRealSocialUrl(s.href));

  const phoneHref = `tel:${(info.phone || "").replace(/\s/g, "")}`;
  const emailHref = `mailto:${info.email || "info@mecsa.com.ar"}`;

  return (
    <footer className="bg-[var(--mecsa-bg)] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3 mb-10">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--mecsa-primary)] mb-4">
              Emprendimientos MEC S.A.
            </h3>
            <ul className="space-y-3 text-sm text-[var(--mecsa-text)]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[var(--mecsa-primary)]" strokeWidth={2} />
                <span>{info.address || "Godoy Cruz 562, San José, Guaymallén, Mendoza"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-[var(--mecsa-primary)]" strokeWidth={2} />
                <span>Lunes a viernes · 8:00 – 17:00 h</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--mecsa-primary)] mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={phoneHref} className="flex items-center gap-2.5 text-[var(--mecsa-text)] hover:text-[var(--mecsa-primary)] transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-[var(--mecsa-primary)]" strokeWidth={2} />
                  <span>{info.phone || "+54 261 517-3763"}</span>
                </a>
              </li>
              <li>
                <a href={emailHref} className="flex items-center gap-2.5 text-[var(--mecsa-text)] hover:text-[var(--mecsa-primary)] transition-colors break-all">
                  <Mail className="w-4 h-4 shrink-0 text-[var(--mecsa-primary)]" strokeWidth={2} />
                  <span>{info.email || "info@mecsa.com.ar"}</span>
                </a>
              </li>
              {socialLinks.length > 0 && (
                <li className="flex gap-3 pt-2">
                  {socialLinks.map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-[var(--mecsa-text-light)]/40 flex items-center justify-center text-[var(--mecsa-text-light)] hover:border-[var(--mecsa-primary)] hover:text-[var(--mecsa-primary)] transition-colors"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--mecsa-primary)] mb-4">
              Navegación
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/#empresa", label: "La Empresa" },
                { href: "/#productos", label: "Productos" },
                { href: "/#galeria", label: "Proyectos" },
                { href: "/noticias", label: "Noticias" },
                { href: "/contacto", label: "Contacto" },
                { href: "/cotizar", label: "Cotizá tu Proyecto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--mecsa-text)] hover:text-[var(--mecsa-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 text-center text-xs text-[var(--mecsa-text-light)]">
          <p>
            © {new Date().getFullYear()} {footer.text || `Emprendimientos MEC S.A ® - ${info.address}`}
            {footer.designCredit && (
              <>
                {" "}· {t("design")} ©:{" "}
                <a
                  href={footer.designUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--mecsa-primary)] hover:underline"
                >
                  {footer.designCredit}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
