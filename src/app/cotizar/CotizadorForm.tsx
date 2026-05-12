"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Flame, Wind, Filter, Settings, ChevronRight, ChevronLeft, MessageCircle, Check } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface FormData {
  product: string;
  spaceType: string;
  area: string;
  height: string;
  location: string;
  extra1: string; // varies per product
  extra2: string;
  name: string;
  company: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { key: "enfriadores", icon: Cloud,    title: "Enfriadores Evaporativos",  desc: "Climatización industrial eficiente"         },
  { key: "calefactores",icon: Flame,    title: "Calefactores Radiantes",     desc: "Calefacción PIROMEC por infrarrojos"        },
  { key: "ventilacion", icon: Wind,     title: "Ventilación Industrial",     desc: "Control de aire, temperatura y renovación" },
  { key: "filtracion",  icon: Filter,   title: "Filtración de Aire",         desc: "Ambientes controlados de alta exigencia"   },
  { key: "control",     icon: Settings, title: "Control y Automatización",   desc: "Gestión inteligente de sistemas"           },
];

const SPACE_TYPES: Record<string, { key: string; label: string; emoji: string }[]> = {
  enfriadores: [
    { key: "galpon",    label: "Galpón / Nave industrial", emoji: "🏭" },
    { key: "bodega",    label: "Bodega / Viñedo",          emoji: "🍷" },
    { key: "avicola",   label: "Granja avícola",           emoji: "🐔" },
    { key: "porcina",   label: "Granja porcina",           emoji: "🐷" },
    { key: "invernadero",label: "Invernadero",             emoji: "🌱" },
    { key: "comercial", label: "Local comercial",          emoji: "🏪" },
  ],
  calefactores: [
    { key: "deposito",    label: "Depósito / Nave",       emoji: "🏭" },
    { key: "taller",      label: "Taller mecánico",       emoji: "🔧" },
    { key: "semiabierto", label: "Espacio semi-abierto",  emoji: "🏗️" },
    { key: "otro",        label: "Otro",                  emoji: "📦" },
  ],
  ventilacion: [
    { key: "industrial",  label: "Industrial general",     emoji: "🏭" },
    { key: "alimentaria", label: "Industria alimentaria",  emoji: "🥩" },
    { key: "quimica",     label: "Química / Farmacéutica", emoji: "⚗️" },
    { key: "logistico",   label: "Centro logístico",       emoji: "📦" },
    { key: "comercial",   label: "Comercial",              emoji: "🏪" },
    { key: "otro",        label: "Otro",                   emoji: "🔧" },
  ],
  filtracion: [
    { key: "farmaceutica", label: "Farmacéutica",        emoji: "💊" },
    { key: "electronica",  label: "Electrónica",         emoji: "💻" },
    { key: "laboratorio",  label: "Laboratorio",         emoji: "🔬" },
    { key: "pintura",      label: "Taller de pintura",   emoji: "🎨" },
    { key: "otro",         label: "Otra industria",      emoji: "🏭" },
  ],
  control: [
    { key: "enfriadores", label: "Enfriadores evaporativos", emoji: "❄️" },
    { key: "ventilacion", label: "Ventilación industrial",   emoji: "💨" },
    { key: "calefaccion", label: "Calefacción",              emoji: "🔥" },
    { key: "varios",      label: "Varios sistemas",          emoji: "⚙️" },
    { key: "nuevo",       label: "Proyecto nuevo",           emoji: "✨" },
  ],
};

const AREAS = [
  { key: "hasta-100",    label: "Hasta 100 m²" },
  { key: "100-300",      label: "100 – 300 m²" },
  { key: "300-600",      label: "300 – 600 m²" },
  { key: "600-1000",     label: "600 – 1.000 m²" },
  { key: "1000-3000",    label: "1.000 – 3.000 m²" },
  { key: "mas-de-3000",  label: "Más de 3.000 m²" },
];

const HEIGHTS = [
  { key: "hasta-4",  label: "Hasta 4 m" },
  { key: "4-6",      label: "4 – 6 m" },
  { key: "6-10",     label: "6 – 10 m" },
  { key: "mas-10",   label: "+10 m" },
];

const EXTRA_CONFIG: Record<string, { label1: string; opts1: string[]; label2: string; opts2: string[] }> = {
  enfriadores: {
    label1: "Ventilación actual",
    opts1: ["Ninguna", "Básica (ventanas/puertas)", "Industrial existente"],
    label2: "Uso diario aproximado",
    opts2: ["4 hs", "8 hs", "12 hs", "16+ hs / continuo"],
  },
  calefactores: {
    label1: "Tipo de gas disponible",
    opts1: ["Gas natural (red)", "GLP (garrafa/tubo)", "No sé aún"],
    label2: "Uso diario aproximado",
    opts2: ["4 hs", "8 hs", "12 hs", "16+ hs / continuo"],
  },
  ventilacion: {
    label1: "Principal problema a resolver",
    opts1: ["Calor excesivo", "Polvo / partículas", "Humos y gases", "Humedad elevada", "Varios factores"],
    label2: "Urgencia del proyecto",
    opts2: ["Inmediata", "1 a 3 meses", "3 a 6 meses", "Sólo estoy cotizando"],
  },
  filtracion: {
    label1: "Nivel de filtración requerido",
    opts1: ["Básico (polvo grueso)", "Fino (HEPA)", "Ultrafino (ULPA)", "No sé, necesito asesoramiento"],
    label2: "Urgencia del proyecto",
    opts2: ["Inmediata", "1 a 3 meses", "3 a 6 meses", "Sólo estoy cotizando"],
  },
  control: {
    label1: "Objetivo principal",
    opts1: ["Monitoreo remoto 24/7", "Automatización de horarios", "Control de T° y humedad", "Todo integrado"],
    label2: "Urgencia del proyecto",
    opts2: ["Inmediata", "1 a 3 meses", "3 a 6 meses", "Sólo estoy cotizando"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const productLabel = (key: string) => PRODUCTS.find((p) => p.key === key)?.title ?? key;
const spaceLabel   = (product: string, key: string) =>
  (SPACE_TYPES[product] ?? []).find((s) => s.key === key)?.label ?? key;

function buildMessage(data: FormData): string {
  const prod = productLabel(data.product);
  const space = data.spaceType ? spaceLabel(data.product, data.spaceType) : "";
  const area  = AREAS.find((a) => a.key === data.area)?.label ?? "";
  const height = HEIGHTS.find((h) => h.key === data.height)?.label ?? "";
  const cfg = EXTRA_CONFIG[data.product];

  const lines = [
    `Hola MECSA 👋, quiero consultar sobre un proyecto:`,
    ``,
    `🔧 *Solución:* ${prod}`,
    space   ? `🏭 *Tipo de espacio:* ${space}`       : "",
    area    ? `📐 *Superficie:* ${area}`              : "",
    height  ? `📏 *Altura del techo:* ${height}`     : "",
    data.location ? `📍 *Ubicación:* ${data.location}` : "",
    data.extra1 ? `\n⚙️ *${cfg?.label1 ?? "Detalle"}:* ${data.extra1}` : "",
    data.extra2 ? `⏰ *${cfg?.label2 ?? "Uso"}:* ${data.extra2}` : "",
    ``,
    data.name    ? `👤 *Nombre:* ${data.name}`    : "",
    data.company ? `🏢 *Empresa:* ${data.company}` : "",
  ];

  return lines.filter(Boolean).join("\n");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionCard({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer
        ${selected
          ? "border-[var(--mecsa-primary)] bg-[var(--mecsa-primary)]/5 shadow-md"
          : "border-gray-200 bg-white hover:border-[var(--mecsa-primary)]/40 hover:shadow-sm"
        }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </span>
      )}
      {children}
    </button>
  );
}

function ProgressBar({ step }: { step: Step }) {
  const steps = ["Solución", "Tu espacio", "Contacto"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
        const active = step === n;
        return (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${active ? "bg-[var(--mecsa-primary)] text-white shadow-md" : done ? "bg-[var(--mecsa-primary)]/20 text-[var(--mecsa-primary)]" : "bg-gray-100 text-gray-400"}`}>
                {done ? <Check className="w-4 h-4" /> : n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? "text-[var(--mecsa-primary)]" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 transition-all ${done ? "bg-[var(--mecsa-primary)]/40" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function CotizadorForm() {
  const { content } = useSiteContent();
  const whatsappNumber = content.companyInfo?.whatsapp ?? "5492615173763";

  const [step, setStep]   = useState<Step>(1);
  const [dir,  setDir]    = useState(1);
  const [data, setData]   = useState<FormData>({
    product: "", spaceType: "", area: "", height: "",
    location: "", extra1: "", extra2: "", name: "", company: "",
  });

  const set = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const goTo = (next: Step) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const canNext1 = !!data.product;
  const canNext2 = !!(data.spaceType && data.area && data.height && data.location);
  const canSend  = !!(data.name);

  const openWhatsApp = () => {
    const msg = buildMessage(data);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const cfg = EXTRA_CONFIG[data.product] ?? null;
  const spaceOpts = SPACE_TYPES[data.product] ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar step={step} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {/* ── Step 1: Producto ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}>
              <h2 className="text-xl font-semibold text-[var(--mecsa-text)] mb-2">
                ¿Qué solución necesitás?
              </h2>
              <p className="text-sm text-[var(--mecsa-text-light)] mb-5">
                Seleccioná el producto o servicio de tu interés.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCTS.map(({ key, icon: Icon, title, desc }) => (
                  <OptionCard key={key} selected={data.product === key}
                    onClick={() => { set("product", key); set("spaceType", ""); set("extra1", ""); set("extra2", ""); }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0
                        ${data.product === key ? "bg-[var(--mecsa-primary)] text-white" : "bg-[var(--mecsa-bg)] text-[var(--mecsa-primary)]"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[var(--mecsa-text)]">{title}</div>
                        <div className="text-xs text-[var(--mecsa-text-light)] mt-0.5">{desc}</div>
                      </div>
                    </div>
                  </OptionCard>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button type="button" onClick={() => goTo(2)} disabled={!canNext1}
                  className="mecsa-btn flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  Continuar <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Datos técnicos ───────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2" custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}>
              <h2 className="text-xl font-semibold text-[var(--mecsa-text)] mb-1">
                Contanos sobre tu espacio
              </h2>
              <p className="text-sm text-[var(--mecsa-text-light)] mb-5">
                Cuanto más detalle, mejor podemos orientarte.
              </p>

              <div className="space-y-6">
                {/* Tipo de espacio */}
                {spaceOpts.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">
                      {data.product === "control" ? "¿Qué sistema tenés actualmente?" : "Tipo de espacio"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {spaceOpts.map(({ key, label, emoji }) => (
                        <OptionCard key={key} selected={data.spaceType === key} onClick={() => set("spaceType", key)}>
                          <div className="text-center py-1">
                            <div className="text-2xl mb-1">{emoji}</div>
                            <div className="text-xs font-medium text-[var(--mecsa-text)] leading-tight">{label}</div>
                          </div>
                        </OptionCard>
                      ))}
                    </div>
                  </div>
                )}

                {/* Superficie */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">
                    Superficie aproximada
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AREAS.map(({ key, label }) => (
                      <OptionCard key={key} selected={data.area === key} onClick={() => set("area", key)}>
                        <div className="text-center py-0.5">
                          <div className={`text-sm font-semibold ${data.area === key ? "text-[var(--mecsa-primary)]" : "text-[var(--mecsa-text)]"}`}>
                            {label}
                          </div>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                {/* Altura */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">
                    Altura del techo
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {HEIGHTS.map(({ key, label }) => (
                      <OptionCard key={key} selected={data.height === key} onClick={() => set("height", key)}>
                        <div className="text-center py-0.5">
                          <div className={`text-xs font-semibold ${data.height === key ? "text-[var(--mecsa-primary)]" : "text-[var(--mecsa-text)]"}`}>
                            {label}
                          </div>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                {/* Localidad */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-[var(--mecsa-text)] mb-2">
                    Ciudad / Provincia
                  </label>
                  <input id="location" type="text" value={data.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Ej: Maipú, Mendoza"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--mecsa-primary)] outline-none transition-colors text-sm"
                  />
                </div>

                {/* Extra fields */}
                {cfg && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">{cfg.label1}</label>
                      <div className="flex flex-wrap gap-2">
                        {cfg.opts1.map((opt) => (
                          <button key={opt} type="button" onClick={() => set("extra1", opt)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all
                              ${data.extra1 === opt
                                ? "bg-[var(--mecsa-primary)] border-[var(--mecsa-primary)] text-white"
                                : "border-gray-200 text-[var(--mecsa-text)] hover:border-[var(--mecsa-primary)]/50"
                              }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">{cfg.label2}</label>
                      <div className="flex flex-wrap gap-2">
                        {cfg.opts2.map((opt) => (
                          <button key={opt} type="button" onClick={() => set("extra2", opt)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all
                              ${data.extra2 === opt
                                ? "bg-[var(--mecsa-primary)] border-[var(--mecsa-primary)] text-white"
                                : "border-gray-200 text-[var(--mecsa-text)] hover:border-[var(--mecsa-primary)]/50"
                              }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => goTo(1)}
                  className="mecsa-btn-outline flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Volver
                </button>
                <button type="button" onClick={() => goTo(3)} disabled={!canNext2}
                  className="mecsa-btn flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  Continuar <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Contacto + Preview ───────────────────────────────── */}
          {step === 3 && (
            <motion.div key="step3" custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}>
              <h2 className="text-xl font-semibold text-[var(--mecsa-text)] mb-1">
                ¡Casi listo!
              </h2>
              <p className="text-sm text-[var(--mecsa-text-light)] mb-5">
                Dejá tu nombre y te abrimos WhatsApp con el resumen del proyecto listo para enviar.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[var(--mecsa-text)] mb-2">
                    Tu nombre *
                  </label>
                  <input id="name" type="text" value={data.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Ej: Juan García"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--mecsa-primary)] outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-[var(--mecsa-text)] mb-2">
                    Empresa <span className="text-[var(--mecsa-text-light)] font-normal">(opcional)</span>
                  </label>
                  <input id="company" type="text" value={data.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Ej: Bodegas XYZ"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--mecsa-primary)] outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Message preview */}
              <div className="bg-[#dcf8c6]/40 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                    Así quedará tu mensaje
                  </span>
                </div>
                <pre className="text-xs text-[var(--mecsa-text)] whitespace-pre-wrap leading-relaxed font-sans">
                  {buildMessage({ ...data, name: data.name || "Tu nombre" })}
                </pre>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => goTo(2)}
                  className="mecsa-btn-outline flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Volver
                </button>
                <button type="button" onClick={openWhatsApp} disabled={!canSend}
                  className="flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1fba58] text-white font-semibold rounded-sm transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4" />
                  Enviar por WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
