"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("nav");
  const currentLocale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { key: "home", name: t("home"), href: "/" },
    {
      key: "company",
      name: t("company"),
      href: "/#empresa",
      dropdown: [
        { name: t("aboutUs"), href: "/#empresa" },
        { name: t("sectors"), href: "/#rubros" },
        { name: t("methodology"), href: "/#empresa" },
      ],
    },
    { key: "products", name: t("products"), href: "/#productos" },
    {
      key: "services",
      name: t("services"),
      href: "/#productos",
      dropdown: [
        { name: t("industrialClimate"), href: "/productos/enfriadores-evaporativos" },
        { name: t("commercialClimate"), href: "/productos/ventilacion-industrial" },
      ],
    },
    {
      key: "news",
      name: t("news"),
      href: "/noticias",
      dropdown: [
        { name: t("photoGallery"), href: "/#galeria" },
        { name: t("latestNews"), href: "/noticias" },
      ],
    },
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
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="relative group"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.key)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link href={item.href} className="mecsa-nav-item">
                  <span className="mecsa-nav-bullet" />
                  <span>{item.name}</span>
                  {item.dropdown && <ChevronDown className="w-3 h-3 ml-0.5" />}
                </Link>

                {item.dropdown && openDropdown === item.key && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-white shadow-lg rounded-md py-2 min-w-[200px] border border-gray-100">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-[var(--mecsa-text)] hover:bg-[var(--mecsa-bg)] hover:text-[var(--mecsa-primary)] transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <LanguageSwitcher currentLocale={currentLocale} />
            <Link
              href="/cotizar"
              className="ml-2 px-4 py-2 bg-[var(--mecsa-primary)] hover:bg-[var(--mecsa-primary)]/90 text-white text-sm font-semibold rounded-sm transition-colors duration-200 whitespace-nowrap"
            >
              Cotizá tu Proyecto
            </Link>
          </nav>

          {/* Mobile: lang + hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            <LanguageSwitcher currentLocale={currentLocale} />
            <button
              type="button"
              className="p-2 text-[var(--mecsa-text)] rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
                <div key={item.key}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-[var(--mecsa-text)] hover:text-[var(--mecsa-primary)] hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeMobile}
                  >
                    <span className="mecsa-nav-bullet" />
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-5 pb-1 space-y-0.5">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-[var(--mecsa-text-light)] hover:text-[var(--mecsa-primary)] hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={closeMobile}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
