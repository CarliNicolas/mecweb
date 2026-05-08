"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1.5 text-[var(--mecsa-text)] hover:text-[var(--mecsa-primary)] transition-colors px-2 py-1"
        disabled={isPending}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{currentLocale}</span>
      </button>

      <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="bg-white shadow-lg rounded-md py-2 min-w-[120px] border border-gray-100">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => switchLocale(locale)}
              disabled={isPending}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                locale === currentLocale
                  ? "bg-[var(--mecsa-bg)] text-[var(--mecsa-primary)] font-medium"
                  : "text-[var(--mecsa-text)] hover:bg-[var(--mecsa-bg)]"
              }`}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
