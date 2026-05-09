"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FadeIn } from "@/components/ScrollAnimations";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations } from "next-intl";

export default function ContactoPage() {
  const { content } = useSiteContent();
  const t = useTranslations("contact");
  const info = content.companyInfo;
  const contact = content.contact as { title?: string; subtitle?: string; mapUrl?: string };

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
        }, 3000);
      } else {
        alert(data.error || "Error al enviar el mensaje");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const mapUrl = contact.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.8!2d-68.83!3d-32.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDUzJzI0LjAiUyA2OMKwNDknNDguMCJX!5e0!3m2!1ses!2sar!4v1620000000000!5m2!1ses!2sar";

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="bg-[var(--mecsa-primary)] py-12 sm:py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3 sm:mb-4">
                {contact.title || t("title")}
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                {contact.subtitle || t("subtitle")}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-10 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

              {/* Contact Information */}
              <FadeIn direction="left">
                <div>
                  <h2 className="mecsa-section-title mb-6 sm:mb-8">{t("infoTitle")}</h2>

                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--mecsa-text)] mb-1">{t("address")}</h3>
                        <p className="text-[var(--mecsa-text-light)]">{info.address || "Godoy Cruz 562, San José, Guaymallén, Mendoza"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--mecsa-text)] mb-1">{t("phone")}</h3>
                        <a href={`tel:${info.phone}`} className="text-[var(--mecsa-text-light)] hover:text-[var(--mecsa-primary)] transition-colors">
                          {info.phone || "+54 261 517-3763"}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--mecsa-text)] mb-1">{t("email")}</h3>
                        <a href={`mailto:${info.email}`} className="text-[var(--mecsa-text-light)] hover:text-[var(--mecsa-primary)] transition-colors break-all">
                          {info.email || "info@mecsa.com.ar"}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación de MECSA"
                    />
                  </div>
                </div>
              </FadeIn>

              {/* Contact Form */}
              <FadeIn direction="right" delay={0.2}>
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                  <h2 className="mecsa-section-title mb-5 sm:mb-6">{t("formTitle")}</h2>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[var(--mecsa-text)] mb-2">{t("success")}</h3>
                      <p className="text-[var(--mecsa-text-light)]">{t("successMessage")}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="nombre" className="block text-sm font-medium text-[var(--mecsa-text)] mb-2">{t("name")} *</label>
                          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none text-sm"
                            placeholder={t("namePlaceholder")} />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-[var(--mecsa-text)] mb-2">{t("email")} *</label>
                          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none text-sm"
                            placeholder={t("emailPlaceholder")} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="telefono" className="block text-sm font-medium text-[var(--mecsa-text)] mb-2">{t("phone")}</label>
                          <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none text-sm"
                            placeholder={t("phonePlaceholder")} />
                        </div>
                        <div>
                          <label htmlFor="asunto" className="block text-sm font-medium text-[var(--mecsa-text)] mb-2">{t("subject")} *</label>
                          <select id="asunto" name="asunto" value={formData.asunto} onChange={handleChange} required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none text-sm">
                            <option value="">{t("selectSubject")}</option>
                            <option value="enfriadores">Enfriadores Evaporativos</option>
                            <option value="calefactores">Calefactores Radiantes</option>
                            <option value="ventilacion">Ventilación Industrial</option>
                            <option value="filtracion">Filtración de Aire</option>
                            <option value="control">Control y Automatización</option>
                            <option value="otro">{t("other")}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="mensaje" className="block text-sm font-medium text-[var(--mecsa-text)] mb-2">{t("message")} *</label>
                        <textarea id="mensaje" name="mensaje" value={formData.mensaje} onChange={handleChange} required rows={5}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none resize-none text-sm"
                          placeholder={t("messagePlaceholder")} />
                      </div>

                      <button type="submit" disabled={isSubmitting}
                        className="mecsa-btn w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? (
                          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("sending")}</>
                        ) : (
                          <><Send className="w-4 h-4" />{t("send")}</>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <WhatsAppButton />
    </main>
  );
}
