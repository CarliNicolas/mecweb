"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CotizadorConfig, SpaceTypeItem, ExtraCfg } from "@/app/cotizar/CotizadorForm";
import {
  LayoutDashboard, FileText, LogOut, Save, Phone, Mail, MapPin,
  MessageSquare, Facebook, Twitter, Instagram, AlertCircle, CheckCircle,
  Newspaper, Plus, Edit, Trash2, X, Calendar, User, Home, Building2,
  Package, Grid3X3, Thermometer, Images, PhoneCall, Eye, Clock, ChevronDown,
  Upload, Bot, Sparkles,
} from "lucide-react";

// ─── Image Upload Input ─────────────────────────────────────────────────────

function ImageInput({ value, onChange, placeholder, className }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) onChange(data.url);
      else alert(data.error || "Error al subir");
    } catch { alert("Error de conexión"); }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="flex gap-2">
      <input type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} className={className} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
        title="Subir imagen desde tu dispositivo"
        className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg text-xs font-medium text-gray-600 flex-shrink-0 transition-colors">
        <Upload className="w-3.5 h-3.5" />
        {uploading ? "Subiendo…" : "Subir"}
      </button>
    </div>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface HeroSlide { title: string; titleHighlight: string; subtitle: string; image: string; }
interface Product { id: string; title: string; description: string; icon: string; }
interface SectorItem { title: string; description: string; image: string; link: string; }
interface GalleryImage { src: string; alt: string; }
interface SiteContent {
  companyInfo: { phone: string; email: string; address: string; whatsapp: string; };
  socialMedia: { facebook: string; twitter: string; instagram: string; };
  heroSlides: HeroSlide[];
  companyIntro: { title1: string; title2: string; title3: string; description1: string; description2: string; image1: string; image2: string; };
  fabricantes: { title: string; description1: string; description2: string; description3: string; image: string; buttonText: string; buttonLink: string; };
  products: Product[];
  productsSection: { title: string; subtitle: string; };
  sectors: { title: string; subtitle: string; items: SectorItem[]; };
  climatizacion: { title: string; description1: string; description2: string; };
  gallery: { images: GalleryImage[]; buttonProjects: string; buttonNews: string; };
  contact: { title: string; subtitle: string; mapUrl: string; };
  footer: { text: string; designCredit: string; designUrl: string; };
  clientes: string[];
}
interface NewsArticle { slug: string; title: string; excerpt: string; content: string; image: string; date: string; category: string; author: string; }
interface HistoryEntry { timestamp: Date; section: string; description: string; }
interface ChatConfig {
  empresa: { nombre: string; descripcion: string; direccion: string; telefono: string; email: string; web: string; };
  productos: { nombre: string; descripcion: string; }[];
  rubros: string[];
  instrucciones: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "general", label: "General", icon: Phone },
  { id: "hero", label: "Hero / Carrusel", icon: Home },
  { id: "empresa", label: "La Empresa", icon: Building2 },
  { id: "fabricantes", label: "Fabricantes", icon: Package },
  { id: "productos", label: "Productos", icon: Grid3X3 },
  { id: "sectores", label: "Sectores", icon: Grid3X3 },
  { id: "climatizacion", label: "Climatización", icon: Thermometer },
  { id: "galeria", label: "Galería", icon: Images },
  { id: "contacto", label: "Contacto", icon: PhoneCall },
  { id: "social", label: "Redes / Footer", icon: Facebook },
  { id: "clientes", label: "Clientes", icon: Building2 },
  { id: "cotizador", label: "Cotizador", icon: FileText },
  { id: "chat-ia", label: "Chat IA", icon: Bot },
  { id: "noticias", label: "Noticias", icon: Newspaper },
  { id: "historial", label: "Historial", icon: Clock },
];

const SECTION_LABELS: Record<string, string> = {
  general: "Información general", hero: "Carrusel", empresa: "La Empresa",
  fabricantes: "Fabricantes", productos: "Productos", sectores: "Sectores",
  climatizacion: "Climatización", galeria: "Galería", contacto: "Contacto",
  social: "Redes / Footer", clientes: "Clientes", noticias: "Noticias", "chat-ia": "Chat IA",
};

const NEWS_CATEGORIES = ["Proyectos", "Empresa", "Eventos", "Técnico", "Formación"];
const PRODUCT_ICONS = ["Cloud", "Flame", "Wind", "Filter", "Settings", "Thermometer", "Zap", "Shield"];
const EMPTY_ARTICLE: NewsArticle = { slug: "", title: "", excerpt: "", content: "", image: "", date: new Date().toISOString().split("T")[0], category: "Proyectos", author: "Equipo MECSA" };

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatHistoryTime(date: Date): string {
  return date.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [content, setContentRaw] = useState<SiteContent | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [cotizador, setCotizador] = useState<CotizadorConfig | null>(null);
  const [cotizadorTab, setCotizadorTab] = useState("productos");
  const [chatConfig, setChatConfig] = useState<ChatConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // News editor
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [articleForm, setArticleForm] = useState<NewsArticle>(EMPTY_ARTICLE);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // AI writing assistant
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // ─── Wrapper that also records history ──────────────────────────────────

  const setContent = useCallback((
    updater: SiteContent | ((prev: SiteContent) => SiteContent),
    historyDesc?: string,
    section?: string
  ) => {
    setContentRaw((prev) => {
      if (!prev) return prev;
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next;
    });
    if (historyDesc && section) {
      setHistory((h) => [
        { timestamp: new Date(), section: SECTION_LABELS[section] || section, description: historyDesc },
        ...h.slice(0, 49), // keep last 50
      ]);
    }
  }, []);

  // ─── Auth & Data Loading ─────────────────────────────────────────────────

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { checkAuthAndLoad(); }, []);

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch("/api/admin/auth");
      if (!authRes.ok) { window.location.href = "/admin/login"; return; }
      await Promise.all([loadContent(), loadNews(), loadCotizador(), loadChatConfig()]);
    } catch { window.location.href = "/admin/login"; }
    finally { setIsLoading(false); }
  };

  const loadContent = async () => {
    const res = await fetch("/api/admin/site-content");
    if (res.ok) {
      const data = await res.json();
      if (!data.socialMedia.instagram) data.socialMedia.instagram = "";
      setContentRaw(data);
    }
  };

  const loadNews = async () => {
    const res = await fetch("/api/admin/news");
    if (res.ok) setNews(await res.json());
  };

  const loadCotizador = async () => {
    const res = await fetch("/api/admin/cotizador");
    if (res.ok) setCotizador(await res.json());
  };

  const loadChatConfig = async () => {
    const res = await fetch("/api/admin/chat-config");
    if (res.ok) setChatConfig(await res.json());
  };

  const handleSaveChatConfig = async () => {
    if (!chatConfig) return;
    setIsSaving(true); setSaveStatus("idle");
    try {
      const res = await fetch("/api/admin/chat-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatConfig),
      });
      if (res.ok) { setSaveStatus("success"); setSaveMessage("Configuración del chat guardada"); }
      else { setSaveStatus("error"); setSaveMessage("Error al guardar"); }
    } catch { setSaveStatus("error"); setSaveMessage("Error de conexión"); }
    finally { setIsSaving(false); setTimeout(() => setSaveStatus("idle"), 3000); }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true); setAiResult("");
    try {
      const res = await fetch("/api/admin/ai-write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, context: { title: articleForm.title, category: articleForm.category } }),
      });
      if (res.ok) setAiResult(await res.text());
      else alert("Error al generar texto");
    } catch { alert("Error de conexión"); }
    finally { setAiLoading(false); }
  };

  const handleSaveCotizador = async () => {
    if (!cotizador) return;
    setIsSaving(true); setSaveStatus("idle");
    try {
      const res = await fetch("/api/admin/cotizador", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cotizador),
      });
      if (res.ok) { setSaveStatus("success"); setSaveMessage("Cotizador guardado"); }
      else { setSaveStatus("error"); setSaveMessage("Error al guardar"); }
    } catch { setSaveStatus("error"); setSaveMessage("Error de conexión"); }
    finally { setIsSaving(false); setTimeout(() => setSaveStatus("idle"), 3000); }
  };

  // ─── Save ────────────────────────────────────────────────────────────────

  const handleSaveContent = async () => {
    if (!content) return;
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus("success");
        setSaveMessage("Guardado correctamente");
        setHistory((h) => [
          { timestamp: new Date(), section: SECTION_LABELS[activeTab] || activeTab, description: `✅ Cambios guardados en "${SECTION_LABELS[activeTab] || activeTab}"` },
          ...h.slice(0, 49),
        ]);
      } else {
        setSaveStatus("error");
        setSaveMessage(data.error || "Error al guardar");
      }
    } catch { setSaveStatus("error"); setSaveMessage("Error de conexión"); }
    finally { setIsSaving(false); setTimeout(() => setSaveStatus("idle"), 3000); }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  // ─── News CRUD ───────────────────────────────────────────────────────────

  const openNewArticle = () => { setEditingArticle(null); setArticleForm({ ...EMPTY_ARTICLE, date: new Date().toISOString().split("T")[0] }); setIsEditorOpen(true); };
  const openEditArticle = (a: NewsArticle) => { setEditingArticle(a); setArticleForm({ ...a }); setIsEditorOpen(true); };
  const closeEditor = () => { setIsEditorOpen(false); setEditingArticle(null); };

  const handleSaveArticle = async () => {
    if (!articleForm.title || !articleForm.excerpt || !articleForm.content) { alert("Completá Título, Extracto y Contenido."); return; }
    setIsSaving(true);
    try {
      const method = editingArticle ? "PUT" : "POST";
      const res = await fetch("/api/admin/news", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(articleForm) });
      if (res.ok) {
        setHistory((h) => [
          { timestamp: new Date(), section: "Noticias", description: `${editingArticle ? "✏️ Editada" : "➕ Creada"} noticia: "${articleForm.title}"` },
          ...h.slice(0, 49),
        ]);
        await loadNews(); closeEditor();
      } else { const d = await res.json(); alert(d.error || "Error al guardar"); }
    } catch { alert("Error de conexión"); }
    finally { setIsSaving(false); }
  };

  const handleDeleteArticle = async (slug: string) => {
    try {
      const article = news.find((n) => n.slug === slug);
      const res = await fetch(`/api/admin/news?slug=${slug}`, { method: "DELETE" });
      if (res.ok) {
        setHistory((h) => [
          { timestamp: new Date(), section: "Noticias", description: `🗑️ Eliminada noticia: "${article?.title || slug}"` },
          ...h.slice(0, 49),
        ]);
        await loadNews(); setDeleteConfirm(null);
      }
    } catch { alert("Error al eliminar"); }
  };

  // ─── Array mutations — using functional updater to avoid stale closures ──

  const addHeroSlide = () => {
    setContent(
      (prev) => ({ ...prev, heroSlides: [...prev.heroSlides, { title: "", titleHighlight: "", subtitle: "", image: "" }] }),
      "➕ Nuevo slide agregado", "hero"
    );
  };
  const removeHeroSlide = (i: number) => {
    setContent(
      (prev) => ({ ...prev, heroSlides: prev.heroSlides.filter((_, idx) => idx !== i) }),
      `🗑️ Slide ${i + 1} eliminado`, "hero"
    );
  };
  const updateHeroSlide = (i: number, field: keyof HeroSlide, value: string) => {
    setContent((prev) => {
      const slides = [...prev.heroSlides];
      slides[i] = { ...slides[i], [field]: value };
      return { ...prev, heroSlides: slides };
    });
  };

  const addProduct = () => {
    setContent(
      (prev) => ({ ...prev, products: [...prev.products, { id: `producto-${Date.now()}`, title: "", description: "", icon: "Cloud" }] }),
      "➕ Nuevo producto agregado", "productos"
    );
  };
  const removeProduct = (i: number) => {
    setContent(
      (prev) => ({ ...prev, products: prev.products.filter((_, idx) => idx !== i) }),
      `🗑️ Producto ${i + 1} eliminado`, "productos"
    );
  };
  const updateProduct = (i: number, field: keyof Product, value: string) => {
    setContent((prev) => {
      const products = [...prev.products];
      products[i] = { ...products[i], [field]: value };
      return { ...prev, products };
    });
  };

  const addSector = () => {
    setContent(
      (prev) => ({ ...prev, sectors: { ...prev.sectors, items: [...prev.sectors.items, { title: "", description: "", image: "", link: "" }] } }),
      "➕ Nuevo sector agregado", "sectores"
    );
  };
  const removeSector = (i: number) => {
    setContent(
      (prev) => ({ ...prev, sectors: { ...prev.sectors, items: prev.sectors.items.filter((_, idx) => idx !== i) } }),
      `🗑️ Sector ${i + 1} eliminado`, "sectores"
    );
  };
  const updateSector = (i: number, field: keyof SectorItem, value: string) => {
    setContent((prev) => {
      const items = [...prev.sectors.items];
      items[i] = { ...items[i], [field]: value };
      return { ...prev, sectors: { ...prev.sectors, items } };
    });
  };

  const addGalleryImage = () => {
    setContent(
      (prev) => ({ ...prev, gallery: { ...prev.gallery, images: [...prev.gallery.images, { src: "", alt: "" }] } }),
      "➕ Nueva imagen de galería agregada", "galeria"
    );
  };
  const removeGalleryImage = (i: number) => {
    setContent(
      (prev) => ({ ...prev, gallery: { ...prev.gallery, images: prev.gallery.images.filter((_, idx) => idx !== i) } }),
      `🗑️ Imagen ${i + 1} de galería eliminada`, "galeria"
    );
  };
  const updateGalleryImage = (i: number, field: keyof GalleryImage, value: string) => {
    setContent((prev) => {
      const images = [...prev.gallery.images];
      images[i] = { ...images[i], [field]: value };
      return { ...prev, gallery: { ...prev.gallery, images } };
    });
  };

  // ─── Style helpers ───────────────────────────────────────────────────────

  const IC = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent outline-none transition-all";
  const LC = "block text-sm font-medium text-gray-700 mb-1.5";
  const FC = "space-y-1.5";
  const CARD = "bg-white rounded-xl border border-gray-100 p-5";
  const ADDBTN = "flex items-center gap-2 px-3 py-2 bg-[var(--mecsa-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--mecsa-primary-dark)] transition-colors";

  // ─── Loading ─────────────────────────────────────────────────────────────

  if (isLoading) return (
    <div className="min-h-screen bg-[var(--mecsa-bg)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--mecsa-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--mecsa-text-light)]">Cargando panel...</p>
      </div>
    </div>
  );

  if (!content) return null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <img src="/images/logo.gif" alt="MEC" className="h-8 flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-semibold text-[var(--mecsa-text)] truncate">Panel Admin</span>}
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isHistory = tab.id === "historial";
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${
                  activeTab === tab.id ? "bg-[var(--mecsa-primary)] text-white font-medium" : "text-gray-600 hover:bg-gray-100"
                } ${isHistory ? "mt-2 border-t border-gray-100 pt-3" : ""}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="truncate flex-1 text-left">{tab.label}</span>
                )}
                {sidebarOpen && isHistory && history.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-[var(--mecsa-primary)] text-white"}`}>
                    {history.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-gray-100 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-all">
            <Eye className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Ver sitio</span>}
          </a>
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[var(--mecsa-text)]">{TABS.find((t) => t.id === activeTab)?.label}</h1>
              <p className="text-xs text-gray-400">Emprendimientos MEC S.A.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus !== "idle" && (
              <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${saveStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {saveStatus === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{saveMessage}</span>
              </div>
            )}
            {activeTab !== "noticias" && activeTab !== "historial" && (
              <button type="button"
                onClick={
                  activeTab === "cotizador" ? handleSaveCotizador :
                  activeTab === "chat-ia"   ? handleSaveChatConfig :
                  handleSaveContent
                }
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--mecsa-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--mecsa-primary-dark)] disabled:opacity-60 transition-colors">
                <Save className="w-4 h-4" />
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">

            {/* ── GENERAL ──────────────────────────────────────────── */}
            {activeTab === "general" && (
              <div className={CARD}>
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-[var(--mecsa-primary)]" /> Información de contacto</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {([
                    { label: "Teléfono", key: "phone", placeholder: "+54 261 555-5555" },
                    { label: "Email", key: "email", placeholder: "info@mecsa.com.ar" },
                    { label: "WhatsApp (solo números, sin + ni espacios)", key: "whatsapp", placeholder: "5492615555555" },
                    { label: "Dirección", key: "address", placeholder: "San Lorenzo 1052, Mendoza" },
                  ] as const).map(({ label, key, placeholder }) => (
                    <div key={key} className={FC}>
                      <label className={LC}>{label}</label>
                      <input type="text" value={content.companyInfo[key]} placeholder={placeholder}
                        onChange={(e) => setContent((prev) => ({ ...prev, companyInfo: { ...prev.companyInfo, [key]: e.target.value } }))}
                        className={IC} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── HERO ─────────────────────────────────────────────── */}
            {activeTab === "hero" && (<>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Slides del carrusel. Cada slide tiene título, palabra en rojo, subtítulo e imagen.</p>
                <button type="button" onClick={addHeroSlide} className={ADDBTN}>
                  <Plus className="w-4 h-4" /> Agregar slide
                </button>
              </div>
              {content.heroSlides.length === 0 && (
                <div className={`${CARD} text-center py-8 text-gray-400`}>No hay slides. Hacé clic en "Agregar slide".</div>
              )}
              {content.heroSlides.map((slide, i) => (
                <div key={i} className={CARD}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Slide {i + 1}</h3>
                    <button type="button" onClick={() => removeHeroSlide(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className={FC}>
                      <label className={LC}>Título (texto normal)</label>
                      <input type="text" value={slide.title} placeholder="Ventilación" className={IC}
                        onChange={(e) => updateHeroSlide(i, "title", e.target.value)} />
                    </div>
                    <div className={FC}>
                      <label className={LC}>Palabra destacada (en rojo)</label>
                      <input type="text" value={slide.titleHighlight} placeholder="Industrial" className={IC}
                        onChange={(e) => updateHeroSlide(i, "titleHighlight", e.target.value)} />
                    </div>
                    <div className={`${FC} md:col-span-2`}>
                      <label className={LC}>Subtítulo</label>
                      <input type="text" value={slide.subtitle} placeholder="Sistemas de Ventilación y Diseño de proyectos a medida." className={IC}
                        onChange={(e) => updateHeroSlide(i, "subtitle", e.target.value)} />
                    </div>
                    <div className={`${FC} md:col-span-2`}>
                      <label className={LC}>Imagen</label>
                      <ImageInput value={slide.image} placeholder="/images/hero1.jpeg" className={IC}
                        onChange={(v) => updateHeroSlide(i, "image", v)} />
                      {slide.image && <img src={slide.image} alt="" className="mt-2 h-28 w-full object-cover rounded-lg" />}
                    </div>
                  </div>
                </div>
              ))}
            </>)}

            {/* ── EMPRESA ──────────────────────────────────────────── */}
            {activeTab === "empresa" && (
              <div className={CARD + " space-y-4"}>
                <h2 className="font-semibold text-gray-800">Sección "Conozca nuestra empresa"</h2>
                {([
                  { label: "Título línea 1 (itálica)", key: "title1", placeholder: "Conozca nuestra empresa." },
                  { label: "Título línea 2 (negrita)", key: "title2", placeholder: "Asesoramiento |" },
                  { label: "Título línea 3", key: "title3", placeholder: "Climatización según sus necesidades." },
                ] as const).map(({ label, key, placeholder }) => (
                  <div key={key} className={FC}>
                    <label className={LC}>{label}</label>
                    <input type="text" value={content.companyIntro[key]} placeholder={placeholder} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, companyIntro: { ...prev.companyIntro, [key]: e.target.value } }))} />
                  </div>
                ))}
                {(["description1", "description2"] as const).map((key, idx) => (
                  <div key={key} className={FC}>
                    <label className={LC}>Descripción {idx + 1}</label>
                    <textarea value={content.companyIntro[key]} rows={4} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, companyIntro: { ...prev.companyIntro, [key]: e.target.value } }))} />
                  </div>
                ))}
                <div className="grid md:grid-cols-2 gap-4">
                  {(["image1", "image2"] as const).map((key, idx) => (
                    <div key={key} className={FC}>
                      <label className={LC}>Imagen {idx + 1}</label>
                      <ImageInput value={content.companyIntro[key]} placeholder="/images/enfriador.jpeg" className={IC}
                        onChange={(v) => setContent((prev) => ({ ...prev, companyIntro: { ...prev.companyIntro, [key]: v } }))} />
                      {content.companyIntro[key] && <img src={content.companyIntro[key]} alt="" className="mt-2 h-20 w-full object-cover rounded" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FABRICANTES ──────────────────────────────────────── */}
            {activeTab === "fabricantes" && (
              <div className={CARD + " space-y-4"}>
                <h2 className="font-semibold text-gray-800">Sección "Somos Fabricantes"</h2>
                <div className={FC}>
                  <label className={LC}>Título</label>
                  <input type="text" value={content.fabricantes.title} className={IC}
                    onChange={(e) => setContent((prev) => ({ ...prev, fabricantes: { ...prev.fabricantes, title: e.target.value } }))} />
                </div>
                {(["description1", "description2", "description3"] as const).map((key, idx) => (
                  <div key={key} className={FC}>
                    <label className={LC}>Descripción {idx + 1}{idx === 0 ? " (negrita)" : ""}</label>
                    <textarea value={content.fabricantes[key]} rows={3} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, fabricantes: { ...prev.fabricantes, [key]: e.target.value } }))} />
                  </div>
                ))}
                <div className={FC}>
                  <label className={LC}>Imagen</label>
                  <ImageInput value={content.fabricantes.image} placeholder="/images/ingenieros.png" className={IC}
                    onChange={(v) => setContent((prev) => ({ ...prev, fabricantes: { ...prev.fabricantes, image: v } }))} />
                  {content.fabricantes.image && <img src={content.fabricantes.image} alt="" className="mt-2 h-24 object-contain rounded" />}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={FC}>
                    <label className={LC}>Texto del botón</label>
                    <input type="text" value={content.fabricantes.buttonText} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, fabricantes: { ...prev.fabricantes, buttonText: e.target.value } }))} />
                  </div>
                  <div className={FC}>
                    <label className={LC}>Enlace del botón</label>
                    <input type="text" value={content.fabricantes.buttonLink} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, fabricantes: { ...prev.fabricantes, buttonLink: e.target.value } }))} />
                  </div>
                </div>
              </div>
            )}

            {/* ── PRODUCTOS ────────────────────────────────────────── */}
            {activeTab === "productos" && (<>
              <div className={CARD + " space-y-4"}>
                <h2 className="font-semibold text-gray-800">Títulos de la sección</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={FC}>
                    <label className={LC}>Etiqueta superior (pequeña)</label>
                    <input type="text"
                      value={(content.productsSection as { subtitle?: string })?.subtitle || ""}
                      placeholder="Nuestros Servicios"
                      className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, productsSection: { ...((prev as unknown as Record<string,unknown>).productsSection as object || {}), subtitle: e.target.value } as { title: string; subtitle: string } }))}
                    />
                  </div>
                  <div className={FC}>
                    <label className={LC}>Título principal</label>
                    <input type="text"
                      value={(content.productsSection as { title?: string })?.title || ""}
                      placeholder="Soluciones de Climatización"
                      className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, productsSection: { ...((prev as unknown as Record<string,unknown>).productsSection as object || {}), title: e.target.value } as { title: string; subtitle: string } }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Productos mostrados en la grilla de la página principal.</p>
                <button type="button" onClick={addProduct} className={ADDBTN}>
                  <Plus className="w-4 h-4" /> Agregar producto
                </button>
              </div>
              {content.products.length === 0 && (
                <div className={`${CARD} text-center py-8 text-gray-400`}>No hay productos. Hacé clic en "Agregar producto".</div>
              )}
              {content.products.map((product, i) => (
                <div key={i} className={CARD}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Producto {i + 1}{product.title ? ` — ${product.title}` : ""}</h3>
                    <button type="button" onClick={() => removeProduct(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className={FC}>
                      <label className={LC}>Título</label>
                      <input type="text" value={product.title} className={IC} onChange={(e) => updateProduct(i, "title", e.target.value)} />
                    </div>
                    <div className={FC}>
                      <label className={LC}>ID (slug para URL)</label>
                      <input type="text" value={product.id} placeholder="enfriadores-evaporativos" className={IC} onChange={(e) => updateProduct(i, "id", e.target.value)} />
                    </div>
                    <div className={FC}>
                      <label className={LC}>Ícono</label>
                      <select value={product.icon} className={IC} onChange={(e) => updateProduct(i, "icon", e.target.value)}>
                        {PRODUCT_ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                    </div>
                    <div className={`${FC} md:col-span-2`}>
                      <label className={LC}>Descripción</label>
                      <textarea value={product.description} rows={2} className={IC} onChange={(e) => updateProduct(i, "description", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </>)}

            {/* ── SECTORES ─────────────────────────────────────────── */}
            {activeTab === "sectores" && (<>
              <div className={CARD}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={FC}>
                    <label className={LC}>Título de sección</label>
                    <input type="text" value={content.sectors.title} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, sectors: { ...prev.sectors, title: e.target.value } }))} />
                  </div>
                  <div className={FC}>
                    <label className={LC}>Subtítulo</label>
                    <input type="text" value={content.sectors.subtitle} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, sectors: { ...prev.sectors, subtitle: e.target.value } }))} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Rubros gestionados (Industrial, Comercial, Particular...)</p>
                <button type="button" onClick={addSector} className={ADDBTN}>
                  <Plus className="w-4 h-4" /> Agregar sector
                </button>
              </div>
              {content.sectors.items.length === 0 && (
                <div className={`${CARD} text-center py-8 text-gray-400`}>No hay sectores. Hacé clic en "Agregar sector".</div>
              )}
              {content.sectors.items.map((sector, i) => (
                <div key={i} className={CARD}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Sector {i + 1}{sector.title ? ` — ${sector.title}` : ""}</h3>
                    <button type="button" onClick={() => removeSector(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className={FC}>
                      <label className={LC}>Título</label>
                      <input type="text" value={sector.title} placeholder="INDUSTRIAL" className={IC} onChange={(e) => updateSector(i, "title", e.target.value)} />
                    </div>
                    <div className={FC}>
                      <label className={LC}>Enlace</label>
                      <input type="text" value={sector.link} placeholder="/productos/enfriadores-evaporativos" className={IC} onChange={(e) => updateSector(i, "link", e.target.value)} />
                    </div>
                    <div className={`${FC} md:col-span-2`}>
                      <label className={LC}>Descripción</label>
                      <textarea value={sector.description} rows={2} className={IC} onChange={(e) => updateSector(i, "description", e.target.value)} />
                    </div>
                    <div className={`${FC} md:col-span-2`}>
                      <label className={LC}>Imagen</label>
                      <ImageInput value={sector.image} placeholder="/images/industrial.jpeg" className={IC} onChange={(v) => updateSector(i, "image", v)} />
                      {sector.image && <img src={sector.image} alt="" className="mt-2 h-20 w-full object-cover rounded" />}
                    </div>
                  </div>
                </div>
              ))}
            </>)}

            {/* ── CLIMATIZACIÓN ────────────────────────────────────── */}
            {activeTab === "climatizacion" && (
              <div className={CARD + " space-y-4"}>
                <h2 className="font-semibold text-gray-800">Sección "Climatización Evaporativa" (fondo rosado)</h2>
                <div className={FC}>
                  <label className={LC}>Título</label>
                  <input type="text" value={content.climatizacion.title} className={IC}
                    onChange={(e) => setContent((prev) => ({ ...prev, climatizacion: { ...prev.climatizacion, title: e.target.value } }))} />
                </div>
                {(["description1", "description2"] as const).map((key, idx) => (
                  <div key={key} className={FC}>
                    <label className={LC}>Descripción {idx + 1}</label>
                    <textarea value={content.climatizacion[key]} rows={4} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, climatizacion: { ...prev.climatizacion, [key]: e.target.value } }))} />
                  </div>
                ))}
              </div>
            )}

            {/* ── GALERÍA ──────────────────────────────────────────── */}
            {activeTab === "galeria" && (<>
              <div className={CARD}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={FC}>
                    <label className={LC}>Texto botón "Ver Proyectos"</label>
                    <input type="text" value={content.gallery.buttonProjects} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, gallery: { ...prev.gallery, buttonProjects: e.target.value } }))} />
                  </div>
                  <div className={FC}>
                    <label className={LC}>Texto botón "Ver Noticias"</label>
                    <input type="text" value={content.gallery.buttonNews} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, gallery: { ...prev.gallery, buttonNews: e.target.value } }))} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Imágenes de la fotogalería.</p>
                <button type="button" onClick={addGalleryImage} className={ADDBTN}>
                  <Plus className="w-4 h-4" /> Agregar imagen
                </button>
              </div>
              {content.gallery.images.length === 0 && (
                <div className={`${CARD} text-center py-8 text-gray-400`}>No hay imágenes. Hacé clic en "Agregar imagen".</div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {content.gallery.images.map((img, i) => (
                  <div key={i} className={CARD}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-600">Imagen {i + 1}</span>
                      <button type="button" onClick={() => removeGalleryImage(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <ImageInput value={img.src} placeholder="URL de imagen" className={IC + " mb-2"}
                      onChange={(v) => updateGalleryImage(i, "src", v)} />
                    <input type="text" placeholder="Texto alternativo (SEO)" value={img.alt} className={IC}
                      onChange={(e) => updateGalleryImage(i, "alt", e.target.value)} />
                    {img.src && <img src={img.src} alt={img.alt} className="mt-3 h-20 w-full object-cover rounded" />}
                  </div>
                ))}
              </div>
            </>)}

            {/* ── CONTACTO ─────────────────────────────────────────── */}
            {activeTab === "contacto" && (
              <div className={CARD + " space-y-4"}>
                <h2 className="font-semibold text-gray-800">Página de contacto</h2>
                <div className={FC}>
                  <label className={LC}>Título</label>
                  <input type="text" value={content.contact.title} className={IC}
                    onChange={(e) => setContent((prev) => ({ ...prev, contact: { ...prev.contact, title: e.target.value } }))} />
                </div>
                <div className={FC}>
                  <label className={LC}>Subtítulo / descripción</label>
                  <textarea value={content.contact.subtitle} rows={3} className={IC}
                    onChange={(e) => setContent((prev) => ({ ...prev, contact: { ...prev.contact, subtitle: e.target.value } }))} />
                </div>
                <div className={FC}>
                  <label className={LC}>URL del mapa (Google Maps Embed)</label>
                  <input type="text" value={content.contact.mapUrl} placeholder="https://www.google.com/maps/embed?pb=..." className={IC}
                    onChange={(e) => setContent((prev) => ({ ...prev, contact: { ...prev.contact, mapUrl: e.target.value } }))} />
                  <p className="text-xs text-gray-400 mt-1">En Google Maps → Compartir → Insertar mapa → copiá la URL del src del iframe</p>
                </div>
              </div>
            )}

            {/* ── SOCIAL / FOOTER ──────────────────────────────────── */}
            {activeTab === "social" && (<>
              <div className={CARD + " space-y-4"}>
                <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Facebook className="w-4 h-4" /> Redes sociales</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {([
                    { label: "Facebook (URL)", key: "facebook", placeholder: "https://facebook.com/mecsa" },
                    { label: "Twitter / X (URL)", key: "twitter", placeholder: "https://twitter.com/mecsa" },
                    { label: "Instagram (URL)", key: "instagram", placeholder: "https://instagram.com/mecsa" },
                  ] as const).map(({ label, key, placeholder }) => (
                    <div key={key} className={FC}>
                      <label className={LC}>{label}</label>
                      <input type="url" value={content.socialMedia[key] || ""} placeholder={placeholder} className={IC}
                        onChange={(e) => setContent((prev) => ({ ...prev, socialMedia: { ...prev.socialMedia, [key]: e.target.value } }))} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={CARD + " space-y-4"}>
                <h2 className="font-semibold text-gray-800">Pie de página (Footer)</h2>
                <div className={FC}>
                  <label className={LC}>Texto del footer</label>
                  <input type="text" value={content.footer.text} placeholder="Emprendimientos MEC S.A ®..." className={IC}
                    onChange={(e) => setContent((prev) => ({ ...prev, footer: { ...prev.footer, text: e.target.value } }))} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={FC}>
                    <label className={LC}>Crédito de diseño</label>
                    <input type="text" value={content.footer.designCredit} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, footer: { ...prev.footer, designCredit: e.target.value } }))} />
                  </div>
                  <div className={FC}>
                    <label className={LC}>URL del diseñador</label>
                    <input type="url" value={content.footer.designUrl} className={IC}
                      onChange={(e) => setContent((prev) => ({ ...prev, footer: { ...prev.footer, designUrl: e.target.value } }))} />
                  </div>
                </div>
              </div>
            </>)}

            {/* ── CLIENTES ─────────────────────────────────────────── */}
            {activeTab === "clientes" && (
              <div className="space-y-4">
                <div className={CARD}>
                  <p className="text-sm text-gray-500">Empresas que aparecen en el marquee de la página principal. El orden es el orden de desplazamiento.</p>
                </div>
                <div className={`${CARD} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700 text-sm">Lista de clientes</h3>
                    <button type="button" className={ADDBTN}
                      onClick={() => setContent((prev) => ({ ...prev, clientes: [...(prev.clientes ?? []), ""] }))}>
                      <Plus className="w-3.5 h-3.5" /> Agregar
                    </button>
                  </div>
                  {(content.clientes ?? []).map((cliente, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cliente}
                        placeholder="Nombre de la empresa"
                        className={`${IC} flex-1`}
                        onChange={(e) => setContent((prev) => {
                          const arr = [...(prev.clientes ?? [])];
                          arr[i] = e.target.value;
                          return { ...prev, clientes: arr };
                        })}
                      />
                      <button type="button"
                        onClick={() => setContent((prev) => ({ ...prev, clientes: (prev.clientes ?? []).filter((_, idx) => idx !== i) }))}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {!(content.clientes ?? []).length && (
                    <p className="text-xs text-gray-400 italic">Sin clientes. Hacé clic en Agregar.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── COTIZADOR ────────────────────────────────────────── */}
            {activeTab === "cotizador" && cotizador && (() => {
              const ctz = cotizador;
              const setCtz = setCotizador as React.Dispatch<React.SetStateAction<CotizadorConfig | null>>;
              const updateCtz = (fn: (prev: CotizadorConfig) => CotizadorConfig) =>
                setCtz((prev) => prev ? fn(prev) : prev);

              const SUB_TABS = [
                { id: "productos", label: "Productos" },
                { id: "espacios",  label: "Tipos de espacio" },
                { id: "areas",     label: "Superficies" },
                { id: "alturas",   label: "Alturas" },
                { id: "extra",     label: "Preguntas extra" },
              ];

              return (<>
                {/* Sub-tabs */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {SUB_TABS.map((st) => (
                    <button key={st.id} type="button" onClick={() => setCotizadorTab(st.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        cotizadorTab === st.id
                          ? "bg-[var(--mecsa-primary)] text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* ─ Productos ─ */}
                {cotizadorTab === "productos" && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">Nombre y descripción de cada producto en el cotizador.</p>
                    {ctz.products.map((prod, i) => (
                      <div key={prod.key} className={CARD}>
                        <p className="text-xs font-mono text-gray-400 mb-3">key: {prod.key}</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className={FC}>
                            <label className={LC}>Título</label>
                            <input type="text" value={prod.title} className={IC}
                              onChange={(e) => updateCtz((p) => {
                                const products = [...p.products];
                                products[i] = { ...products[i], title: e.target.value };
                                return { ...p, products };
                              })} />
                          </div>
                          <div className={FC}>
                            <label className={LC}>Descripción corta</label>
                            <input type="text" value={prod.desc} className={IC}
                              onChange={(e) => updateCtz((p) => {
                                const products = [...p.products];
                                products[i] = { ...products[i], desc: e.target.value };
                                return { ...p, products };
                              })} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─ Tipos de espacio ─ */}
                {cotizadorTab === "espacios" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Opciones de tipo de espacio para cada producto.</p>
                    {ctz.products.map((prod) => {
                      const items: SpaceTypeItem[] = ctz.spaceTypes[prod.key] ?? [];
                      return (
                        <div key={prod.key} className={CARD}>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-700 text-sm">{prod.title}</h3>
                            <button type="button" className={ADDBTN}
                              onClick={() => updateCtz((p) => ({
                                ...p,
                                spaceTypes: {
                                  ...p.spaceTypes,
                                  [prod.key]: [...(p.spaceTypes[prod.key] ?? []), { key: `nuevo-${Date.now()}`, label: "", emoji: "📦" }],
                                },
                              }))}>
                              <Plus className="w-3.5 h-3.5" /> Agregar
                            </button>
                          </div>
                          <div className="space-y-2">
                            {items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input type="text" value={item.emoji} placeholder="🏭"
                                  className={`${IC} w-16 text-center`}
                                  onChange={(e) => updateCtz((p) => {
                                    const arr = [...(p.spaceTypes[prod.key] ?? [])];
                                    arr[idx] = { ...arr[idx], emoji: e.target.value };
                                    return { ...p, spaceTypes: { ...p.spaceTypes, [prod.key]: arr } };
                                  })} />
                                <input type="text" value={item.label} placeholder="Nombre del espacio"
                                  className={`${IC} flex-1`}
                                  onChange={(e) => updateCtz((p) => {
                                    const arr = [...(p.spaceTypes[prod.key] ?? [])];
                                    arr[idx] = { ...arr[idx], label: e.target.value };
                                    return { ...p, spaceTypes: { ...p.spaceTypes, [prod.key]: arr } };
                                  })} />
                                <button type="button"
                                  onClick={() => updateCtz((p) => ({
                                    ...p,
                                    spaceTypes: { ...p.spaceTypes, [prod.key]: (p.spaceTypes[prod.key] ?? []).filter((_, i) => i !== idx) },
                                  }))}
                                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {items.length === 0 && <p className="text-xs text-gray-400 italic">Sin opciones. Hacé clic en Agregar.</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ─ Superficies ─ */}
                {cotizadorTab === "areas" && (
                  <div className={`${CARD} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-700">Rangos de superficie</h3>
                      <button type="button" className={ADDBTN}
                        onClick={() => updateCtz((p) => ({ ...p, areas: [...p.areas, { key: `area-${Date.now()}`, label: "" }] }))}>
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </div>
                    {ctz.areas.map((area, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={area.label} placeholder="Ej: 100 – 300 m²" className={`${IC} flex-1`}
                          onChange={(e) => updateCtz((p) => {
                            const areas = [...p.areas];
                            areas[i] = { ...areas[i], label: e.target.value };
                            return { ...p, areas };
                          })} />
                        <button type="button"
                          onClick={() => updateCtz((p) => ({ ...p, areas: p.areas.filter((_, idx) => idx !== i) }))}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─ Alturas ─ */}
                {cotizadorTab === "alturas" && (
                  <div className={`${CARD} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-700">Opciones de altura del techo</h3>
                      <button type="button" className={ADDBTN}
                        onClick={() => updateCtz((p) => ({ ...p, heights: [...p.heights, { key: `h-${Date.now()}`, label: "" }] }))}>
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </div>
                    {ctz.heights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={h.label} placeholder="Ej: 6 – 10 m" className={`${IC} flex-1`}
                          onChange={(e) => updateCtz((p) => {
                            const heights = [...p.heights];
                            heights[i] = { ...heights[i], label: e.target.value };
                            return { ...p, heights };
                          })} />
                        <button type="button"
                          onClick={() => updateCtz((p) => ({ ...p, heights: p.heights.filter((_, idx) => idx !== i) }))}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─ Preguntas extra ─ */}
                {cotizadorTab === "extra" && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Preguntas adicionales (chips) para cada producto en el paso 2.</p>
                    {ctz.products.map((prod) => {
                      const cfg: ExtraCfg = ctz.extraConfig[prod.key] ?? { label1: "", opts1: [], label2: "", opts2: [] };
                      const updateField = (field: keyof ExtraCfg, value: string | string[]) =>
                        updateCtz((p) => ({
                          ...p,
                          extraConfig: { ...p.extraConfig, [prod.key]: { ...cfg, [field]: value } },
                        }));

                      return (
                        <div key={prod.key} className={CARD}>
                          <h3 className="font-medium text-gray-700 text-sm mb-4">{prod.title}</h3>
                          <div className="space-y-4">
                            {(["1", "2"] as const).map((n) => {
                              const labelKey = `label${n}` as "label1" | "label2";
                              const optsKey  = `opts${n}`  as "opts1"  | "opts2";
                              return (
                                <div key={n}>
                                  <div className={FC}>
                                    <label className={LC}>Pregunta {n}</label>
                                    <input type="text" value={cfg[labelKey]} className={IC}
                                      placeholder={`Ej: Uso diario aproximado`}
                                      onChange={(e) => updateField(labelKey, e.target.value)} />
                                  </div>
                                  <div className="mt-2 space-y-1.5">
                                    <p className="text-xs text-gray-500 font-medium">Opciones:</p>
                                    {cfg[optsKey].map((opt, oi) => (
                                      <div key={oi} className="flex items-center gap-2">
                                        <input type="text" value={opt} className={`${IC} flex-1`}
                                          onChange={(e) => {
                                            const arr = [...cfg[optsKey]];
                                            arr[oi] = e.target.value;
                                            updateField(optsKey, arr);
                                          }} />
                                        <button type="button"
                                          onClick={() => updateField(optsKey, cfg[optsKey].filter((_, i) => i !== oi))}
                                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                    <button type="button"
                                      onClick={() => updateField(optsKey, [...cfg[optsKey], ""])}
                                      className="text-xs text-[var(--mecsa-primary)] hover:underline flex items-center gap-1 mt-1">
                                      <Plus className="w-3 h-3" /> Agregar opción
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>);
            })()}

            {/* ── CHAT IA ──────────────────────────────────────────── */}
            {activeTab === "chat-ia" && chatConfig && (() => {
              const cfg = chatConfig;
              const setCfg = setChatConfig as React.Dispatch<React.SetStateAction<ChatConfig | null>>;
              const upd = (fn: (prev: ChatConfig) => ChatConfig) => setCfg((prev) => prev ? fn(prev) : prev);
              return (
                <div className="space-y-4">
                  <div className={`${CARD} flex items-start gap-3`}>
                    <Bot className="w-5 h-5 text-[var(--mecsa-primary)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Configuración del asistente virtual</p>
                      <p className="text-xs text-gray-400 mt-0.5">Estos datos definen qué sabe el chat IA del sitio. Guardar aplica los cambios de inmediato.</p>
                    </div>
                  </div>

                  {/* Empresa */}
                  <div className={`${CARD} space-y-3`}>
                    <h3 className="font-medium text-gray-700 text-sm">Datos de la empresa</h3>
                    {(["nombre", "descripcion", "direccion", "telefono", "email", "web"] as const).map((field) => (
                      <div key={field} className={FC}>
                        <label className={LC + " capitalize"}>{field}</label>
                        <input type="text" value={cfg.empresa[field]} className={IC}
                          onChange={(e) => upd((p) => ({ ...p, empresa: { ...p.empresa, [field]: e.target.value } }))} />
                      </div>
                    ))}
                  </div>

                  {/* Productos */}
                  <div className={`${CARD} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-700 text-sm">Productos que conoce el chat</h3>
                      <button type="button" className={ADDBTN}
                        onClick={() => upd((p) => ({ ...p, productos: [...p.productos, { nombre: "", descripcion: "" }] }))}>
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </div>
                    {cfg.productos.map((prod, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="flex-1 grid md:grid-cols-2 gap-2">
                          <input type="text" value={prod.nombre} placeholder="Nombre del producto" className={IC}
                            onChange={(e) => upd((p) => { const arr = [...p.productos]; arr[i] = { ...arr[i], nombre: e.target.value }; return { ...p, productos: arr }; })} />
                          <input type="text" value={prod.descripcion} placeholder="Descripción breve" className={IC}
                            onChange={(e) => upd((p) => { const arr = [...p.productos]; arr[i] = { ...arr[i], descripcion: e.target.value }; return { ...p, productos: arr }; })} />
                        </div>
                        <button type="button" onClick={() => upd((p) => ({ ...p, productos: p.productos.filter((_, idx) => idx !== i) }))}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mt-0.5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Rubros */}
                  <div className={`${CARD} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-700 text-sm">Sectores / rubros atendidos</h3>
                      <button type="button" className={ADDBTN}
                        onClick={() => upd((p) => ({ ...p, rubros: [...p.rubros, ""] }))}>
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </div>
                    {cfg.rubros.map((rubro, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="text" value={rubro} placeholder="Ej: Industrial: Bodegas, Fábricas..." className={`${IC} flex-1`}
                          onChange={(e) => upd((p) => { const arr = [...p.rubros]; arr[i] = e.target.value; return { ...p, rubros: arr }; })} />
                        <button type="button" onClick={() => upd((p) => ({ ...p, rubros: p.rubros.filter((_, idx) => idx !== i) }))}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Instrucciones */}
                  <div className={`${CARD} space-y-3`}>
                    <h3 className="font-medium text-gray-700 text-sm">Instrucciones de comportamiento</h3>
                    <p className="text-xs text-gray-400">Una instrucción por línea. Define el tono, límites y cómo responde el asistente.</p>
                    <textarea value={cfg.instrucciones} rows={8} className={IC}
                      placeholder={"Responde en el mismo idioma que el usuario\nSé amigable y conciso\n..."}
                      onChange={(e) => upd((p) => ({ ...p, instrucciones: e.target.value }))} />
                  </div>
                </div>
              );
            })()}

            {/* ── NOTICIAS ─────────────────────────────────────────── */}
            {activeTab === "noticias" && (<>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{news.length} noticia{news.length !== 1 ? "s" : ""} publicada{news.length !== 1 ? "s" : ""}.</p>
                <button type="button" onClick={openNewArticle} className={ADDBTN}>
                  <Plus className="w-4 h-4" /> Nueva noticia
                </button>
              </div>
              {news.length === 0 ? (
                <div className={`${CARD} text-center py-12 text-gray-400`}>
                  <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No hay noticias. Creá la primera.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {news.map((article) => (
                    <div key={article.slug} className={`${CARD} flex items-center gap-4`}>
                      {article.image && <img src={article.image} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{article.title}</p>
                        <p className="text-sm text-gray-400">{article.date} · {article.category} · {article.author}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => openEditArticle(article)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button type="button" onClick={() => setDeleteConfirm(article.slug)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>)}

            {/* ── HISTORIAL ────────────────────────────────────────── */}
            {activeTab === "historial" && (
              <div className="space-y-3">
                <div className={CARD}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--mecsa-primary)]" /> Historial de modificaciones</h2>
                    {history.length > 0 && (
                      <button type="button" onClick={() => setHistory([])} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Limpiar historial</button>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Registro de acciones realizadas en esta sesión. Se borra al cerrar el navegador.</p>
                </div>
                {history.length === 0 ? (
                  <div className={`${CARD} text-center py-12 text-gray-400`}>
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Todavía no hay cambios registrados en esta sesión.</p>
                    <p className="text-sm mt-1">Las modificaciones aparecerán acá a medida que editás.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((entry, i) => (
                      <div key={i} className={`${CARD} flex items-start gap-4`}>
                        <div className="w-2 h-2 rounded-full bg-[var(--mecsa-primary)] mt-1.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">{entry.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-[var(--mecsa-bg)] text-[var(--mecsa-primary)] rounded-full font-medium">{entry.section}</span>
                            <span className="text-xs text-gray-400">{formatHistoryTime(entry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ── News Editor Modal ──────────────────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">{editingArticle ? "Editar noticia" : "Nueva noticia"}</h3>
              <button type="button" onClick={closeEditor} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className={FC}>
                <label className={LC}>Título *</label>
                <input type="text" value={articleForm.title} placeholder="Título de la noticia" className={IC} onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={FC}>
                  <label className={LC}>Categoría</label>
                  <select value={articleForm.category} className={IC} onChange={(e) => setArticleForm((p) => ({ ...p, category: e.target.value }))}>
                    {NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className={FC}>
                  <label className={LC}>Fecha</label>
                  <input type="date" value={articleForm.date} className={IC} onChange={(e) => setArticleForm((p) => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div className={FC}>
                <label className={LC}>Autor</label>
                <input type="text" value={articleForm.author} className={IC} onChange={(e) => setArticleForm((p) => ({ ...p, author: e.target.value }))} />
              </div>
              <div className={FC}>
                <label className={LC}>Imagen de portada</label>
                <ImageInput value={articleForm.image} placeholder="/images/gallery1.jpeg" className={IC}
                  onChange={(v) => setArticleForm((p) => ({ ...p, image: v }))} />
                {articleForm.image && <img src={articleForm.image} alt="" className="mt-2 h-24 w-full object-cover rounded-lg" />}
              </div>
              <div className={FC}>
                <label className={LC}>Extracto (resumen corto) *</label>
                <textarea value={articleForm.excerpt} rows={3} placeholder="Breve descripción que aparece en la lista de noticias..." className={IC} onChange={(e) => setArticleForm((p) => ({ ...p, excerpt: e.target.value }))} />
              </div>
              <div className={FC}>
                <label className={LC}>Contenido completo *</label>
                <textarea value={articleForm.content} rows={10} placeholder="Contenido completo del artículo. Podés usar **negrita** y saltos de línea." className={IC} onChange={(e) => setArticleForm((p) => ({ ...p, content: e.target.value }))} />
              </div>
              {/* AI Writing Assistant */}
              <div className="border-t pt-4 mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[var(--mecsa-primary)]" />
                  <span className="text-sm font-semibold text-gray-700">Asistente IA</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Gemini</span>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={2}
                  placeholder='Ej: "Redactá un artículo sobre la instalación de enfriadores en una bodega mendocina" o "Mejorá este título: ..."'
                  className={IC}
                />
                <button
                  type="button"
                  disabled={!aiPrompt.trim() || aiLoading}
                  onClick={handleAiGenerate}
                  className="mt-2 flex items-center gap-2 px-3 py-2 bg-[var(--mecsa-primary)] text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[var(--mecsa-primary-dark)] transition-colors"
                >
                  {aiLoading
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Sparkles className="w-4 h-4" />}
                  {aiLoading ? "Generando..." : "Generar con IA"}
                </button>
                {aiResult && (
                  <div className="mt-3">
                    <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-52 overflow-y-auto">
                      {aiResult}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button type="button"
                        onClick={() => setArticleForm((p) => ({ ...p, title: aiResult.split("\n")[0].replace(/^#+\s*/, "").replace(/\*\*/g, "").trim() }))}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                        → Como título
                      </button>
                      <button type="button"
                        onClick={() => setArticleForm((p) => ({ ...p, excerpt: aiResult.replace(/\*\*/g, "").substring(0, 250).trim() }))}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                        → Como extracto
                      </button>
                      <button type="button"
                        onClick={() => setArticleForm((p) => ({ ...p, content: aiResult }))}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                        → Reemplazar contenido
                      </button>
                      <button type="button"
                        onClick={() => setArticleForm((p) => ({ ...p, content: p.content ? p.content + "\n\n" + aiResult : aiResult }))}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                        → Agregar al contenido
                      </button>
                      <button type="button" onClick={() => setAiResult("")}
                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors ml-auto">
                        Limpiar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>{/* end p-5 space-y-4 */}
            <div className="p-5 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button type="button" onClick={closeEditor} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button type="button" onClick={handleSaveArticle} disabled={isSaving} className="px-4 py-2 bg-[var(--mecsa-primary)] text-white rounded-lg text-sm font-medium disabled:opacity-60 hover:bg-[var(--mecsa-primary-dark)]">
                {isSaving ? "Guardando..." : "Guardar noticia"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ───────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">¿Eliminar esta noticia?</h3>
            <p className="text-gray-500 text-sm mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button type="button" onClick={() => handleDeleteArticle(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
