"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations } from "next-intl";

export default function WhatsAppButton() {
  const { content } = useSiteContent();
  const t = useTranslations("whatsapp");
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = content.companyInfo.whatsapp || "5492615555555";
  const message = t("message");

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-2 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg p-3 text-sm text-gray-700 whitespace-nowrap">
          {t("tooltip")}
          <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-2 h-2 bg-white" />
        </div>
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />

        {/* Pulse animation */}
        <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-30" />
      </a>
    </div>
  );
}
