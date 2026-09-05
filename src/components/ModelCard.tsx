"use client";

import { MessageCircle } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import type { ProductModel } from "@/context/SiteContentContext";

interface ModelCardProps {
  model: ProductModel;
  lineTitle: string;
}

export default function ModelCard({ model, lineTitle }: ModelCardProps) {
  const { content } = useSiteContent();
  const whatsappNumber = content.companyInfo?.whatsapp || "5492615173763";

  const available = model.available !== false;
  const specs = Array.isArray(model.specs) ? model.specs : [];

  const message = encodeURIComponent(
    `Hola MECSA, quería consultar disponibilidad del modelo "${model.name}" ` +
      `(línea ${lineTitle}). ¿Me pasan info y precio?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {model.image && (
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={model.image}
            alt={model.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg text-[var(--mecsa-text)]">
            {model.name}
          </h3>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
              available
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {available ? "Disponible" : "A pedido"}
          </span>
        </div>

        {model.shortDescription && (
          <p className="text-sm text-[var(--mecsa-text-light)] mt-2 leading-relaxed">
            {model.shortDescription}
          </p>
        )}

        {specs.length > 0 && (
          <dl className="mt-4 space-y-1.5 text-sm">
            {specs.map((spec, index) => (
              <div
                key={`${model.id}-spec-${index}`}
                className="flex justify-between gap-3 border-b border-gray-100 pb-1.5"
              >
                <dt className="text-[var(--mecsa-text-light)]">{spec.label}</dt>
                <dd className="text-[var(--mecsa-text)] font-medium text-right">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-lg font-medium hover:brightness-95 transition-all"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={2} />
          {available
            ? "Consultar disponibilidad"
            : "Consultar (a pedido)"}
        </a>
      </div>
    </div>
  );
}
