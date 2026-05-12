import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CotizadorForm from "./CotizadorForm";
import { getCotizadorConfig } from "@/lib/cotizador-config";
import defaultConfig from "@/data/cotizador-config.json";

export const metadata: Metadata = {
  title: "Cotizá tu Proyecto | MEC",
  description:
    "Completá el formulario con los datos de tu espacio y te enviamos un resumen detallado por WhatsApp para seguir conversando sobre tu proyecto de climatización industrial.",
};

export default async function CotizarPage() {
  const config = (await getCotizadorConfig()) ?? defaultConfig;

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-[var(--mecsa-bg)]">
        <div className="bg-[var(--mecsa-primary)] text-white py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-light mb-3">
              Cotizá tu Proyecto
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Completá los datos de tu espacio en 3 pasos y te preparamos un
              resumen para continuar la conversación por WhatsApp o correo.
            </p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
            <CotizadorForm config={config} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
