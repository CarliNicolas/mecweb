import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noticias y Novedades",
  description: "Últimas noticias, proyectos y eventos de Emprendimientos MEC S.A. Novedades sobre climatización industrial en Mendoza.",
  keywords: [
    "noticias climatización industrial Mendoza",
    "proyectos enfriadores evaporativos",
    "novedades ventilación industrial",
    "MEC Mendoza noticias",
  ],
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Noticias y Novedades | Emprendimientos MEC S.A.",
    description: "Últimas noticias, proyectos y eventos de Emprendimientos MEC S.A.",
  },
};

export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
