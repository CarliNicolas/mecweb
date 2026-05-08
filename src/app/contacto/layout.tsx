import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactate con Emprendimientos MEC S.A. en Mendoza. Tel., email y formulario de consulta para sistemas de climatización industrial.",
  openGraph: {
    title: "Contacto | Emprendimientos MEC S.A.",
    description: "Contactate con Emprendimientos MEC S.A. para consultas sobre climatización industrial en Mendoza.",
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
