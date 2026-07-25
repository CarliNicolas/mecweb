"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const currentLocale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: "company", name: t("company"), href: "/#empresa" },
    { key: "products", name: t("products"), href: "/#productos" },
    { key: "news", name: t("news"), href: "/noticias" },
    { key: "contact", name: t("contact"), href: "/contacto" },
  ];

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMobile}>
            <img src="/images/logo.gif" alt="MEC S.A Logo" className="h-8 sm:h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className="mecsa-nav-item">
                <span className="mecsa-nav-bullet" />
                <span>{item.name}</span>
              </Link>
            ))}
            <LanguageSwitcher currentLocale={currentLocale} />
            <Link
              href="/cotizar"
              className="ml-2 px-4 py-2 bg-[var(--mecsa-primary)] hover:bg-[var(--mecsa-primary)]/90 text-white text-sm font-semibold rounded-sm transition-colors duration-200 whitespace-nowrap"
            >
              Cotizá tu Proyecto
            </Link>
          </nav>

          {/* Mobile: cotizar CTA + lang + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/cotizar"
              className="min-h-11 inline-flex items-center px-3 bg-[var(--mecsa-primary)] text-white text-xs font-semibold rounded-sm whitespace-nowrap"
              onClick={closeMobile}
            >
              Cotizá
            </Link>
            <div className="min-h-11 flex items-center">
              <LanguageSwitcher currentLocale={currentLocale} />
            </div>
            <button
              type="button"
              className="w-11 h-11 flex items-center justify-center text-[var(--mecsa-text)] rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 pb-4">
            <nav className="flex flex-col pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-[var(--mecsa-text)] hover:text-[var(--mecsa-primary)] hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={closeMobile}
                >
                  <span className="mecsa-nav-bullet" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 pb-1">
                <Link
                  href="/cotizar"
                  className="block text-center px-4 py-3 bg-[var(--mecsa-primary)] text-white text-sm font-semibold rounded-sm transition-colors duration-200"
                  onClick={closeMobile}
                >
                  Cotizá tu Proyecto
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
