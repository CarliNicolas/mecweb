"use client";

import { Facebook, Twitter } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function SocialIcons() {
  const { content } = useSiteContent();
  const social = content.socialMedia;

  return (
    <div className="flex justify-center gap-4 py-8 bg-white">
      <a
        href={social.facebook || "https://facebook.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border-2 border-[var(--mecsa-text-light)] flex items-center justify-center text-[var(--mecsa-text-light)] hover:border-[var(--mecsa-primary)] hover:text-[var(--mecsa-primary)] transition-colors"
        aria-label="Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>
      <a
        href={social.twitter || "https://twitter.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border-2 border-[var(--mecsa-text-light)] flex items-center justify-center text-[var(--mecsa-text-light)] hover:border-[var(--mecsa-primary)] hover:text-[var(--mecsa-primary)] transition-colors"
        aria-label="Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href="https://plus.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border-2 border-[var(--mecsa-text-light)] flex items-center justify-center text-[var(--mecsa-text-light)] hover:border-[var(--mecsa-primary)] hover:text-[var(--mecsa-primary)] transition-colors"
        aria-label="Google Plus"
      >
        <span className="font-bold text-lg">G+</span>
      </a>
    </div>
  );
}
