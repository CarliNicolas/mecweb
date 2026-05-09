"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentLocale, setCurrentLocale] = useState("es");
  const { content } = useSiteContent();
  const navItems = content.navigation ?? [];

  useEffect(() => {
    // Get locale from cookie
    const localeCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];
    if (localeCookie) {
      setCurrentLocale(localeCookie);
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo.gif"
              alt="MEC S.A Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => item.dropdown?.length > 0 && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link href={item.href} className="mecsa-nav-item">
                  <span className="mecsa-nav-bullet" />
                  <span>{item.name}</span>
                  {item.dropdown?.length > 0 && <ChevronDown className="w-3 h-3 ml-0.5" />}
                </Link>

                {/* Dropdown */}
                {item.dropdown?.length > 0 && openDropdown === item.name && (
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

            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={currentLocale} />
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher currentLocale={currentLocale} />
            <button
              type="button"
              className="p-2 text-[var(--mecsa-text)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="mecsa-nav-item py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mecsa-nav-bullet" />
                    <span>{item.name}</span>
                  </Link>
                  {item.dropdown?.length > 0 && (
                    <div className="pl-6 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-1 text-sm text-[var(--mecsa-text-light)] hover:text-[var(--mecsa-primary)]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
