"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, ArrowUp } from "lucide-react";
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

  const socialLinks = [
    { href: social.facebook, Icon: Facebook, label: "Facebook" },
    { href: social.twitter, Icon: Twitter, label: "Twitter" },
    { href: social.instagram || "", Icon: Instagram, label: "Instagram" },
  ].filter((s) => isRealSocialUrl(s.href));

  return (
    <footer className="bg-[var(--mecsa-bg)] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--mecsa-primary)] mb-2">
              Emprendimientos MEC S.A.
            </p>
            <p className="text-sm text-[var(--mecsa-text-light)] mb-4 max-w-md">
              Fabricantes de sistemas de climatización industrial en Mendoza. Proyectos a medida desde hace más de 26 años.
            </p>
            <a
              href="#contacto-cta"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--mecsa-primary)] hover:underline"
            >
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Ver contacto y horarios</span>
            </a>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {[
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
          </nav>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <p className="text-xs text-[var(--mecsa-text-light)]">
            © {new Date().getFullYear()} Emprendimientos MEC S.A. ®
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
          {socialLinks.length > 0 && (
            <div className="flex gap-2.5">
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
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
