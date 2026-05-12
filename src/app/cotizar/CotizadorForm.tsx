"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Flame, Wind, Filter, Settings, ChevronRight, ChevronLeft, MessageCircle, Check, Paperclip, X, Mail, Upload } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface FormData {
  product: string;
  spaceType: string;
  area: string;
  height: string;
  location: string;
  extra1: string;
  extra2: string;
  name: string;
  company: string;
}

export interface SpaceTypeItem  { key: string; label: string; emoji: string; }
export interface AreaItem        { key: string; label: string; }
export interface HeightItem      { key: string; label: string; }
export interface ExtraCfg        { label1: string; opts1: string[]; label2: string; opts2: string[]; }
export interface ProductItem     { key: string; title: string; desc: string; }

export interface CotizadorConfig {
  products:    ProductItem[];
  spaceTypes:  Record<string, SpaceTypeItem[]>;
  areas:       AreaItem[];
  heights:     HeightItem[];
  extraConfig: Record<string, ExtraCfg>;
}

// Icon map — driven by product key, not config (icons are code)
const ICON_MAP: Record<string, React.ElementType> = {
  enfriadores: Cloud,
  calefactores: Flame,
  ventilacion: Wind,
  filtracion: Filter,
  control: Settings,
};
const defaultIcon = Settings;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMessage(data: FormData, cfg: CotizadorConfig, fileNames?: string[]): string {
  const prod  = cfg.products.find((p) => p.key === data.product)?.title ?? data.product;
  const space = (cfg.spaceTypes[data.product] ?? []).find((s) => s.key === data.spaceType)?.label ?? "";
  const area  = cfg.areas.find((a) => a.key === data.area)?.label ?? "";
  const height = cfg.heights.find((h) => h.key === data.height)?.label ?? "";
  const extra = cfg.extraConfig[data.product];

  const lines = [
    `Hola MEC, quiero consultar sobre un proyecto:`,
    ``,
    `*Solucion:* ${prod}`,
    space         ? `*Tipo de espacio:* ${space}`             : "",
    area          ? `*Superficie:* ${area}`                   : "",
    height        ? `*Altura del techo:* ${height}`           : "",
    data.location ? `*Ubicacion:* ${data.location}`           : "",
    ``,
    data.extra1   ? `*${extra?.label1 ?? "Detalle"}:* ${data.extra1}` : "",
    data.extra2   ? `*${extra?.label2 ?? "Uso"}:* ${data.extra2}`     : "",
    ``,
    data.name    ? `*Nombre:* ${data.name}`    : "",
    data.company ? `*Empresa:* ${data.company}` : "",
    fileNames && fileNames.length > 0
      ? `*Archivos:* ${fileNames.join(", ")}`
      : "",
  ];

  return lines.filter(Boolean).join("\n");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`relative w-full text-left rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer
        ${selected
          ? "border-[var(--mecsa-primary)] bg-[var(--mecsa-primary)]/5 shadow-md"
          : "border-gray-200 bg-white hover:border-[var(--mecsa-primary)]/40 hover:shadow-sm"
        }`}>
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
              <span className={`text-xs font-medium hidden sm:block ${active ? "text-[var(--mecsa-primary)]" : "text-gray-400"}`}>{label}</span>
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

export default function CotizadorForm({ config }: { config: CotizadorConfig }) {
  const { content } = useSiteContent();
  const whatsappNumber = content.companyInfo?.whatsapp ?? "5492615173763";

  const [step, setStep] = useState<Step>(1);
  const [dir,  setDir]  = useState(1);
  const [data, setData] = useState<FormData>({
    product: "", spaceType: "", area: "", height: "",
    location: "", extra1: "", extra2: "", name: "", company: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const goTo = (next: Step) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = Array.from(incoming).filter(
      (f) => !files.some((e) => e.name === f.name && e.size === f.size)
    );
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));
  const fileNames = files.map((f) => f.name);

  const canNext1 = !!data.product;
  const canNext2 = !!(data.spaceType && data.area && data.height && data.location);

  const openWhatsApp = () => {
    const msg = buildMessage(data, config);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const openEmail = () => {
    const prod = config.products.find((p) => p.key === data.product)?.title ?? data.product;
    const subject = `Consulta de proyecto - ${prod}`;
    const body = buildMessage(data, config, fileNames);
    window.open(`mailto:info@mecsa.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  const extraCfg  = config.extraConfig[data.product] ?? null;
  const spaceOpts = config.spaceTypes[data.product]  ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <div ref={topRef} className="scroll-mt-24" />
      <ProgressBar step={step} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>

          {/* ── Step 1: Producto ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}>
              <h2 className="text-xl font-semibold text-[var(--mecsa-text)] mb-2">¿Qué solución necesitás?</h2>
              <p className="text-sm text-[var(--mecsa-text-light)] mb-5">Seleccioná el producto o servicio de tu interés.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {config.products.map(({ key, title, desc }) => {
                  const Icon = ICON_MAP[key] ?? defaultIcon;
                  return (
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
                  );
                })}
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
              <h2 className="text-xl font-semibold text-[var(--mecsa-text)] mb-1">Contanos sobre tu espacio</h2>
              <p className="text-sm text-[var(--mecsa-text-light)] mb-5">Cuanto más detalle, mejor podemos orientarte.</p>

              <div className="space-y-6">
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

                <div>
                  <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">Superficie aproximada</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {config.areas.map(({ key, label }) => (
                      <OptionCard key={key} selected={data.area === key} onClick={() => set("area", key)}>
                        <div className="text-center py-0.5">
                          <div className={`text-sm font-semibold ${data.area === key ? "text-[var(--mecsa-primary)]" : "text-[var(--mecsa-text)]"}`}>{label}</div>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">Altura del techo</label>
                  <div className="grid grid-cols-4 gap-2">
                    {config.heights.map(({ key, label }) => (
                      <OptionCard key={key} selected={data.height === key} onClick={() => set("height", key)}>
                        <div className="text-center py-0.5">
                          <div className={`text-xs font-semibold ${data.height === key ? "text-[var(--mecsa-primary)]" : "text-[var(--mecsa-text)]"}`}>{label}</div>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-[var(--mecsa-text)] mb-2">Ciudad / Provincia</label>
                  <input id="location" type="text" value={data.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Ej: Maipú, Mendoza"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--mecsa-primary)] outline-none transition-colors text-sm" />
                </div>

                {extraCfg && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">{extraCfg.label1}</label>
                      <div className="flex flex-wrap gap-2">
                        {extraCfg.opts1.map((opt) => (
                          <button key={opt} type="button" onClick={() => set("extra1", opt)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all
                              ${data.extra1 === opt
                                ? "bg-[var(--mecsa-primary)] border-[var(--mecsa-primary)] text-white"
                                : "border-gray-200 text-[var(--mecsa-text)] hover:border-[var(--mecsa-primary)]/50"}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-3">{extraCfg.label2}</label>
                      <div className="flex flex-wrap gap-2">
                        {extraCfg.opts2.map((opt) => (
                          <button key={opt} type="button" onClick={() => set("extra2", opt)}
                            className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all
                              ${data.extra2 === opt
                                ? "bg-[var(--mecsa-primary)] border-[var(--mecsa-primary)] text-white"
                                : "border-gray-200 text-[var(--mecsa-text)] hover:border-[var(--mecsa-primary)]/50"}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => goTo(1)} className="mecsa-btn-outline flex items-center gap-2">
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
              <h2 className="text-xl font-semibold text-[var(--mecsa-text)] mb-1">¡Casi listo!</h2>
              <p className="text-sm text-[var(--mecsa-text-light)] mb-5">
                Completá los datos opcionales y elegí cómo enviar tu consulta.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[var(--mecsa-text)] mb-2">
                    Tu nombre <span className="text-[var(--mecsa-text-light)] font-normal">(opcional)</span>
                  </label>
                  <input id="name" type="text" value={data.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="Ej: Juan García"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--mecsa-primary)] outline-none transition-colors text-sm" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-[var(--mecsa-text)] mb-2">
                    Empresa <span className="text-[var(--mecsa-text-light)] font-normal">(opcional)</span>
                  </label>
                  <input id="company" type="text" value={data.company} onChange={(e) => set("company", e.target.value)}
                    placeholder="Ej: Bodegas XYZ"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--mecsa-primary)] outline-none transition-colors text-sm" />
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--mecsa-text)] mb-2">
                    Planos, fotos o videos{" "}
                    <span className="text-[var(--mecsa-text-light)] font-normal">(opcional)</span>
                  </label>
                  <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf,.dwg,.dxf"
                    className="hidden" onChange={(e) => addFiles(e.target.files)} />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-[var(--mecsa-text-light)] hover:border-[var(--mecsa-primary)]/50 hover:text-[var(--mecsa-primary)] transition-colors">
                    <Upload className="w-4 h-4" />
                    Adjuntar archivos (imágenes, PDF, planos, videos)
                  </button>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-xs">
                          <Paperclip className="w-3.5 h-3.5 text-[var(--mecsa-primary)] flex-shrink-0" />
                          <span className="flex-1 truncate text-[var(--mecsa-text)]">{f.name}</span>
                          <span className="text-[var(--mecsa-text-light)] flex-shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                          <button type="button" onClick={() => removeFile(i)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0" aria-label="Quitar archivo">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {files.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠️</span>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>WhatsApp no admite adjuntos.</strong> Los archivos solo se envían por correo electrónico.
                        Usá el botón <strong>Enviar por Correo</strong> y adjuntalos desde tu cliente de correo.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message preview */}
              <div className="bg-[#dcf8c6]/40 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Así quedará tu mensaje</span>
                </div>
                <pre className="text-xs text-[var(--mecsa-text)] whitespace-pre-wrap leading-relaxed font-sans">
                  {buildMessage({ ...data, name: data.name || "Tu nombre" }, config)}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button type="button" onClick={() => goTo(2)} className="mecsa-btn-outline flex items-center gap-2 justify-center">
                  <ChevronLeft className="w-4 h-4" /> Volver
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={openEmail}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[var(--mecsa-primary)] hover:bg-[var(--mecsa-primary)]/90 text-white font-semibold rounded-sm transition-colors duration-300 text-sm uppercase tracking-wider">
                    <Mail className="w-4 h-4" /> Enviar por Correo
                  </button>
                  <button type="button" onClick={openWhatsApp}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1fba58] text-white font-semibold rounded-sm transition-colors duration-300 text-sm uppercase tracking-wider">
                    <MessageCircle className="w-4 h-4" /> Enviar por WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
