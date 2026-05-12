import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

const products = {
  "enfriadores-evaporativos": {
    title: "Sistemas de Climatización de Alta Eficiencia Energética",
    subtitle: "Climatización eficiente y sustentable",
    description: "Los Enfriadores Evaporativos de Emprendimientos MEC S.A. representan la vanguardia en climatización industrial y comercial. Basados en el principio termodinámico natural de la evaporación del agua, nuestros sistemas están diseñados para suministrar un flujo constante de aire fresco y purificado, garantizando entornos de trabajo óptimos.",
    longDescription: `Los Enfriadores Evaporativos de Emprendimientos MEC S.A. representan la vanguardia en climatización industrial y comercial. Basados en el principio termodinámico natural de la evaporación del agua, nuestros sistemas están diseñados para suministrar un flujo constante de aire fresco y purificado, garantizando entornos de trabajo óptimos.\n\nA diferencia de los métodos de refrigeración tradicionales, nuestra tecnología permite una reducción de hasta el 80% en el consumo de energía eléctrica, consolidándose como la solución de mayor eficiencia energética y menor impacto ambiental en el mercado actual.\n\nÁmbitos de Aplicación y Versatilidad\nNuestras soluciones de enfriamiento evaporativo están diseñadas para ofrecer un rendimiento óptimo en diversos entornos de alta exigencia.`,
    features: [
      "Sector Industrial y Logístico: Optimización térmica en naves industriales, galpones, fábricas y plantas de producción.",
      "Industria Vitivinícola: Control ambiental especializado para bodegas y áreas críticas en viñedos.",
      "Sector Agropecuario: Climatización de granjas avícolas y porcinas, garantizando el bienestar animal.",
      "Horticultura de Precisión: Regulación de temperatura y humedad en invernaderos y cultivos bajo cubierta.",
    ],
    image: "/images/enfriador.jpeg",
    gallery: ["/images/gallery1.jpeg", "/images/gallery5.jpeg", "/images/gallery3.jpeg"],
  },
  "calefactores-radiantes": {
    title: "Sistemas de Calefacción por Radiación Infrarroja PIROMEC",
    subtitle: "Calefacción eficiente por radiación infrarroja",
    description: "Los tubos radiantes PIROMEC representan una solución avanzada en calefacción industrial de alta eficiencia. Basados en la tecnología de radiación infrarroja, estos sistemas emiten calor de manera directa hacia las superficies, objetos y personas, eliminando la necesidad de calentar el aire circundante.",
    longDescription: `Los tubos radiantes PIROMEC representan una solución avanzada en calefacción industrial de alta eficiencia. Basados en la tecnología de radiación infrarroja, estos sistemas emiten calor de manera directa hacia las superficies, objetos y personas, eliminando la necesidad de calentar el aire circundante. Este principio físico asegura un confort térmico inmediato y una optimización energética superior en grandes volúmenes.\n\nVersatilidad de Aplicación:`,
    features: [
      "Logística e Industria: Depósitos, centros de distribución y naves industriales de gran altura.",
      "Servicios y Talleres: Talleres mecánicos y automotrices.",
      "Entornos Exigentes: Espacios semi-abiertos y áreas con alta renovación de aire.",
    ],
    image: "/images/gallery2.jpeg",
    gallery: ["/images/gallery2.jpeg", "/images/gallery4.jpeg", "/images/gallery8.jpeg"],
  },
  "ventilacion-industrial": {
    title: "Sistemas de Ventilación EMPRENDIMIENTOS MEC S.A.",
    subtitle: "Versatilidad y Control Ambiental",
    description: "Ofrecemos ingeniería en ventilación para los sectores más exigentes del mercado, asegurando ambientes libres de impurezas y térmicamente estables.",
    longDescription: `Ofrecemos ingeniería en ventilación para los sectores más exigentes del mercado, asegurando ambientes libres de impurezas y térmicamente estables.\n\nCaracterísticas Destacadas:`,
    features: [
      "Variedad Tecnológica: Extractores, inyectores, ventiladores axiales y centrífugos.",
      "Distribución Eficiente: Red de conductos y difusores a medida.",
      "Inteligencia Operativa: Sistemas de control automatizado para una gestión simplificada.",
      "Garantía Técnica: Proyectos desarrollados bajo normas internacionales de calidad de aire.",
    ],
    image: "/images/ventilacion.jpeg",
    gallery: ["/images/gallery1.jpeg", "/images/gallery2.jpeg", "/images/gallery6.jpeg"],
  },
  "filtracion-de-aire": {
    title: "Sistemas de Filtración Avanzada EMPRENDIMIENTOS MEC S.A.",
    subtitle: "Excelencia en Calidad de Aire",
    description: "Soluciones integrales para la eliminación de partículas, gases y control de humedad en industrias de alta exigencia.",
    longDescription: `Excelencia en Calidad de Aire: Soluciones integrales para la eliminación de partículas, gases y control de humedad en industrias de alta exigencia.\n\nAtributos Principales:`,
    features: [
      "Filtración Absoluta: Tecnología HEPA/ULPA y filtros de carbón activado.",
      "Equipamiento Especializado: Cabinas de flujo laminar y colectores de polvo.",
      "Tratamiento Químico: Scrubbers para lavado de gases.",
      "Control de Precisión: Monitoreo constante de parámetros ambientales y humedad.",
      "Garantía de Proceso: Seguridad operativa para laboratorios, farmacéuticas y electrónica.",
    ],
    image: "/images/gallery3.jpeg",
    gallery: ["/images/gallery3.jpeg", "/images/gallery7.jpeg", "/images/gallery1.jpeg"],
  },
  "control-y-automatizacion": {
    title: "EMPRENDIMIENTOS MEC S.A.: Control Total sobre su Ambiente Industrial",
    subtitle: "Automatización y gestión inteligente",
    description: "Automatizamos sus sistemas de climatización para ofrecer una gestión eficiente, remota y segura.",
    longDescription: `Transformación Digital: Automatizamos sus sistemas de climatización para ofrecer una gestión eficiente, remota y segura.\n\nAtributos Clave:`,
    features: [
      "Control de Precisión: Regulación automática de temperatura, humedad y presión.",
      "Eficiencia Energética: Optimización de recursos mediante variadores de frecuencia y gestión de horarios.",
      "Visualización en Tiempo Real: Monitoreo remoto 24/7 e interfaces HMI de última generación.",
      "Inteligencia de Datos: Reportes de consumo y métricas de desempeño para la toma de decisiones.",
    ],
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
