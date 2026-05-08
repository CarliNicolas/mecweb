import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

const products = {
  "enfriadores-evaporativos": {
    title: "Enfriadores Evaporativos",
    subtitle: "Climatización eficiente y sustentable",
    description: "Consuma hasta un 80% menos de energía eléctrica con nuestro sistema de enfriadores evaporativos. Diseñados para proporcionar aire fresco y limpio en espacios industriales y comerciales.",
    longDescription: `Los Enfriadores Evaporativos de MECSA son equipos de climatización altamente eficientes que utilizan el principio natural de evaporación del agua para enfriar el aire. Este sistema consume hasta un 80% menos de energía eléctrica en comparación con los sistemas de aire acondicionado tradicionales.\n\nNuestros enfriadores evaporativos son ideales para:\n- Naves industriales y galpones\n- Bodegas y viñedos\n- Fábricas y plantas de producción\n- Granjas avícolas y porcinas\n- Invernaderos y cultivos bajo cubierta`,
    features: ["Consumo energético reducido hasta un 80%", "Aire fresco y renovado constantemente", "Filtrado de partículas y polvo", "Mantenimiento simple y económico", "Fabricación 100% nacional", "Diseño personalizado según necesidades"],
    image: "/images/enfriador.jpeg",
    gallery: ["/images/gallery1.jpeg", "/images/gallery5.jpeg", "/images/gallery3.jpeg"],
  },
  "calefactores-radiantes": {
    title: "Calefactores Radiantes",
    subtitle: "Calefacción eficiente por radiación infrarroja",
    description: "Nuestros tubos radiantes PIROMEC son aparatos autónomos de combustión a gas natural o G.L.P de gran eficiencia energética.",
    longDescription: `Los Calefactores Radiantes PIROMEC son sistemas de calefacción por radiación infrarroja que calientan directamente los objetos y personas, sin necesidad de calentar el aire.\n\nSon ideales para:\n- Naves industriales de gran altura\n- Talleres mecánicos y automotrices\n- Depósitos y centros de distribución\n- Espacios semi-abiertos`,
    features: ["Combustión a gas natural o GLP", "Alta eficiencia energética", "Calentamiento instantáneo", "Sin movimiento de aire ni polvo", "Zonificación del calor", "Bajo costo de instalación"],
    image: "/images/gallery2.jpeg",
    gallery: ["/images/gallery2.jpeg", "/images/gallery4.jpeg", "/images/gallery8.jpeg"],
  },
  "ventilacion-industrial": {
    title: "Ventilación Industrial",
    subtitle: "Sistemas de ventilación a medida",
    description: "Sistemas de ventilación para usos comerciales, industriales y agrícolas; soluciones para cada necesidad.",
    longDescription: `MECSA ofrece soluciones integrales de ventilación industrial diseñadas para garantizar la renovación constante del aire, el control de temperatura y la eliminación de contaminantes.\n\nNuestros sistemas se adaptan a:\n- Industrias alimentarias\n- Plantas químicas y farmacéuticas\n- Talleres de pintura\n- Centros logísticos`,
    features: ["Extractores de aire industriales", "Sistemas de inyección de aire", "Conductos y difusores", "Ventiladores axiales y centrífugos", "Control automatizado", "Diseño según normativas vigentes"],
    image: "/images/ventilacion.jpeg",
    gallery: ["/images/gallery1.jpeg", "/images/gallery2.jpeg", "/images/gallery6.jpeg"],
  },
  "filtracion-de-aire": {
    title: "Filtración de Aire",
    subtitle: "Aire limpio para ambientes controlados",
    description: "Filtros absolutos, tratamiento de gases, equipos de flujo laminar, tratamiento y recolección de polvos, humedad, etc.",
    longDescription: `Los sistemas de filtración de aire de MECSA garantizan la calidad del aire en ambientes que requieren condiciones controladas.\n\nAplicaciones principales:\n- Laboratorios y hospitales\n- Industria farmacéutica\n- Industria electrónica\n- Salas de pintura`,
    features: ["Filtros HEPA y ULPA", "Cabinas de flujo laminar", "Colectores de polvo", "Scrubbers para gases", "Filtros de carbón activado", "Monitoreo de calidad de aire"],
    image: "/images/gallery3.jpeg",
    gallery: ["/images/gallery3.jpeg", "/images/gallery7.jpeg", "/images/gallery1.jpeg"],
  },
  "control-y-automatizacion": {
    title: "Control y Automatización",
    subtitle: "Soluciones inteligentes para climatización",
    description: "Disponemos de los mejores controles de monitoreo, automatización y control para la climatización de su empresa.",
    longDescription: `MECSA ofrece sistemas de control y automatización que permiten gestionar eficientemente todos los parámetros de climatización.\n\nCapacidades del sistema:\n- Monitoreo remoto 24/7\n- Control de temperatura y humedad\n- Gestión de horarios y zonas\n- Alarmas y notificaciones`,
    features: ["PLCs y controladores dedicados", "Interfaces táctiles HMI", "Sensores de temperatura y humedad", "Variadores de frecuencia", "Monitoreo remoto vía web", "Reportes y análisis de consumo"],
    image: "/images/gallery4.jpeg",
    gallery: ["/images/gallery4.jpeg", "/images/gallery6.jpeg", "/images/gallery8.jpeg"],
  },
};

type ProductSlug = keyof typeof products;

export function generateStaticParams() {
  return Object.keys(products).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products[slug as ProductSlug];

  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} | Emprendimientos MEC S.A.`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products[slug as ProductSlug];

  if (!product) notFound();

  return (
    <main className="min-h-screen">
      <Header />
      <ProductDetailClient product={product} slug={slug} allProducts={products} />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
