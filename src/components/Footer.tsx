"use client";

import { Facebook, Twitter, Instagram } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

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
  const social = content.socialMedia as { facebook: string; twitter: string; instagram?: string };
  const footer = content.footer;
  const info = content.companyInfo;

  const socialLinks = [
    { href: social.facebook, Icon: Facebook, label: "Facebook" },
    { href: social.twitter, Icon: Twitter, label: "Twitter" },
    { href: social.instagram || "", Icon: Instagram, label: "Instagram" },
  ].filter((s) => isRealSocialUrl(s.href));

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-bg)] border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-6">
            {socialLinks.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-[var(--mecsa-text-light)] flex items-center justify-center text-[var(--mecsa-text-light)] hover:border-[var(--mecsa-primary)] hover:text-[var(--mecsa-primary)] transition-colors"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}

        <div className="text-center text-sm text-[var(--mecsa-text-light)]">
          <p>
            {footer.text || `Emprendimientos MEC S.A ® - ${info.address}`}
            {footer.designCredit && (
              <>
                {" "}- Diseño ©:{" "}
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
