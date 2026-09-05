"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ModelCard from "@/components/ModelCard";
import type { ProductModel } from "@/context/SiteContentContext";

interface ModelCatalogProps {
  models: ProductModel[];
  lineTitle: string;
}

const ALL = "__all__";

export default function ModelCatalog({ models, lineTitle }: ModelCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  // Categorías presentes (en orden de aparición), sólo si hay más de una.
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const m of models) {
      const c = m.category?.trim();
      if (c && !seen.includes(c)) seen.push(c);
    }
    return seen;
  }, [models]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (category !== ALL && (m.category?.trim() || "") !== category) return false;
      if (!q) return true;
      const hay =
        m.name.toLowerCase().includes(q) ||
        (m.shortDescription || "").toLowerCase().includes(q) ||
        (m.specs || []).some(
          (s) => s.value.toLowerCase().includes(q) || s.label.toLowerCase().includes(q),
        );
      return hay;
    });
  }, [models, category, q]);

  const chipBase =
    "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors";
  const chipOn = "bg-[var(--mecsa-primary)] text-white border-[var(--mecsa-primary)]";
  const chipOff =
    "bg-white text-[var(--mecsa-text-light)] border-gray-200 hover:border-[var(--mecsa-primary)]/40";

  return (
    <div>
      {/* Controles */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative max-w-md mx-auto w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-[var(--mecsa-primary)] focus:ring-1 focus:ring-[var(--mecsa-primary)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setCategory(ALL)}
              className={`${chipBase} ${category === ALL ? chipOn : chipOff}`}
            >
              Todos ({models.length})
            </button>
            {categories.map((c) => {
              const count = models.filter((m) => (m.category?.trim() || "") === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`${chipBase} ${category === c ? chipOn : chipOff}`}
                >
                  {c} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <p className="text-center text-[var(--mecsa-text-light)] py-8">
          No se encontraron productos{q ? ` para "${query}"` : ""}.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((model) => (
            <ModelCard key={model.id} model={model} lineTitle={lineTitle} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">
        Mostrando {filtered.length} de {models.length} productos
      </p>
    </div>
  );
}
