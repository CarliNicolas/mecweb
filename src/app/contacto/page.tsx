"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FadeIn } from "@/components/ScrollAnimations";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactoPage() {
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
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            nombre: "",
            email: "",
            telefono: "",
            asunto: "",
            mensaje: "",
          });
        }, 3000);
      } else {
        alert(data.error || "Error al enviar el mensaje");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-[var(--mecsa-primary)] py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
                Contacto
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Contáctanos para obtener más información
                sobre nuestros servicios de climatización industrial.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <FadeIn direction="left">
                <div>
                  <h2 className="mecsa-section-title mb-8">
                    Información de Contacto
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--mecsa-text)] mb-1">
                          Dirección
                        </h3>
                        <p className="text-[var(--mecsa-text-light)]">
                          San Lorenzo 1052 (5519)
                          <br />
                          San José, Guaymallén
                          <br />
                          Mendoza, Argentina
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--mecsa-text)] mb-1">
                          Teléfono
                        </h3>
                        <p className="text-[var(--mecsa-text-light)]">
                          +54 261 555-5555
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--mecsa-text)] mb-1">
                          Email
                        </h3>
                        <p className="text-[var(--mecsa-text-light)]">
                          info@mecsa.com.ar
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.8!2d-68.83!3d-32.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDUzJzI0LjAiUyA2OMKwNDknNDguMCJX!5e0!3m2!1ses!2sar!4v1620000000000!5m2!1ses!2sar"
                      width="100%"
                      height="250"
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
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="mecsa-section-title mb-6">Envíanos un mensaje</h2>

                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-[var(--mecsa-text)] mb-2">
                        Mensaje enviado
                      </h3>
                      <p className="text-[var(--mecsa-text-light)]">
                        Nos pondremos en contacto contigo pronto.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="nombre"
                            className="block text-sm font-medium text-[var(--mecsa-text)] mb-2"
                          >
                            Nombre *
                          </label>
                          <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-[var(--mecsa-text)] mb-2"
                          >
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="telefono"
                            className="block text-sm font-medium text-[var(--mecsa-text)] mb-2"
                          >
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="+54 261 ..."
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="asunto"
                            className="block text-sm font-medium text-[var(--mecsa-text)] mb-2"
                          >
                            Asunto *
                          </label>
                          <select
                            id="asunto"
                            name="asunto"
                            value={formData.asunto}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none"
                          >
                            <option value="">Seleccionar...</option>
                            <option value="enfriadores">Enfriadores Evaporativos</option>
                            <option value="calefactores">Calefactores Radiantes</option>
                            <option value="ventilacion">Ventilación Industrial</option>
                            <option value="filtracion">Filtración de Aire</option>
                            <option value="control">Control y Automatización</option>
                            <option value="otro">Otro</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="mensaje"
                          className="block text-sm font-medium text-[var(--mecsa-text)] mb-2"
                        >
                          Mensaje *
                        </label>
                        <textarea
                          id="mensaje"
                          name="mensaje"
                          value={formData.mensaje}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent transition-all outline-none resize-none"
                          placeholder="Cuéntanos sobre tu proyecto..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mecsa-btn w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar mensaje
                          </>
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
