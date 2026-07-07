export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

// Default news articles - used as fallback
export const newsArticles: NewsArticle[] = [
  {
    slug: "nuevo-salon-de-ventas",
    title: "Inauguramos nuestro nuevo salón de ventas",
    excerpt: "Lo invitamos a conocer nuestro nuevo salón de ventas, donde podrá ver en persona las distintas alternativas de climatización para su proyecto.",
    content: `Tenemos el agrado de invitarlo a vivir la experiencia de nuestro nuevo salón de ventas.

Allí usted va a poder ver, conocer y comparar las distintas alternativas de climatización que ofrecemos, no solo para elegir la mejor maquinaria para su sistema o requerimiento, sino también la que mejor se acomode al presupuesto que tenga pensado invertir en cada proyecto.

**¿Qué va a encontrar en el salón?**
- Equipos en exhibición de nuestras principales líneas: enfriadores evaporativos, ventilación industrial y calefactores radiantes.
- Asesoramiento personalizado para evaluar la solución que mejor se adapta a su empresa.
- Análisis presupuestario adaptado a cada proyecto.

Lo esperamos para mostrarle, en persona, por qué cada proyecto de MEC es único y hecho a la medida de cada cliente.`,
    image: "/images/placeholder-salon-ventas.jpg",
    date: "2026-06-10",
    category: "Empresa",
    author: "Equipo Comercial MECSA",
  },
  {
    slug: "nuevo-proyecto-climatizacion-bodega-mendoza",
    title: "Nuevo proyecto de climatización en bodega de Mendoza",
    excerpt: "Completamos la instalación de un sistema integral de enfriamiento evaporativo para una de las bodegas más importantes de la región.",
    content: `Nos complace anunciar la finalización exitosa de un ambicioso proyecto de climatización en una de las bodegas más prestigiosas de Mendoza.

El proyecto incluyó la instalación de 12 enfriadores evaporativos de alta eficiencia, diseñados específicamente para mantener las condiciones óptimas de temperatura y humedad requeridas para la elaboración y conservación del vino.

**Características del proyecto:**
- Superficie climatizada: 8,500 m²
- Consumo energético reducido en un 75%
- Control automatizado de temperatura y humedad
- Sistema de monitoreo remoto 24/7

Este proyecto representa un hito importante en nuestro compromiso con la sustentabilidad y la eficiencia energética en la industria vitivinícola argentina.`,
    image: "/images/gallery1.jpeg",
    date: "2024-12-15",
    category: "Proyectos",
    author: "Equipo MECSA",
  },
  {
    slug: "participacion-expo-industrial-2024",
    title: "MECSA presente en Expo Industrial 2024",
    excerpt: "Participamos de la feria industrial más importante del país presentando nuestras últimas innovaciones en climatización sustentable.",
    content: `Del 10 al 14 de noviembre participamos de Expo Industrial 2024, la feria industrial más importante de Argentina, donde presentamos nuestras últimas innovaciones en sistemas de climatización.

Nuestro stand fue visitado por cientos de profesionales interesados en conocer las ventajas de la climatización evaporativa frente a los sistemas tradicionales.

**Productos presentados:**
- Nueva línea de enfriadores evaporativos compactos
- Sistema de control inteligente con IoT
- Soluciones para agricultura bajo cubierta
- Calefactores radiantes de última generación

Agradecemos a todos los visitantes por su interés y a nuestro equipo comercial por representar a MECSA con profesionalismo.`,
    image: "/images/gallery5.jpeg",
    date: "2024-11-14",
    category: "Eventos",
    author: "Equipo Comercial",
  },
  {
    slug: "eficiencia-energetica-industria-alimentaria",
    title: "Eficiencia energética en la industria alimentaria",
    excerpt: "Cómo los sistemas de climatización evaporativa pueden reducir hasta un 80% el consumo energético en plantas de procesamiento de alimentos.",
    content: `La industria alimentaria enfrenta desafíos importantes en términos de mantener condiciones óptimas de temperatura mientras reduce su huella de carbono y costos operativos.

Los sistemas de climatización evaporativa representan una solución ideal para este sector, ofreciendo:

**Ventajas para la industria alimentaria:**
- Reducción de hasta 80% en consumo eléctrico
- Aire fresco y renovado constantemente
- Control de humedad para conservación de productos
- Cumplimiento de normativas sanitarias
- Ambiente de trabajo más confortable

En MECSA contamos con amplia experiencia en proyectos para frigoríficos, plantas de procesamiento y centros de distribución alimentaria.

Contáctenos para una evaluación gratuita de sus necesidades de climatización.`,
    image: "/images/gallery3.jpeg",
    date: "2024-10-22",
    category: "Técnico",
    author: "Ing. Carlos Rodríguez",
  },
  {
    slug: "capacitacion-tecnicos-instaladores",
    title: "Programa de capacitación para técnicos instaladores",
    excerpt: "Lanzamos un nuevo programa de formación para técnicos especializados en instalación y mantenimiento de sistemas de climatización.",
    content: `MECSA lanza su programa de capacitación profesional dirigido a técnicos e instaladores que deseen especializarse en sistemas de climatización industrial.

El programa incluye módulos teóricos y prácticos que cubren todos los aspectos de la instalación, puesta en marcha y mantenimiento de nuestros equipos.

**Contenido del programa:**
- Fundamentos de climatización evaporativa
- Instalación de enfriadores y conductos
- Sistemas de control y automatización
- Mantenimiento preventivo y correctivo
- Diagnóstico y resolución de fallas

Los participantes que completen el programa recibirán certificación oficial de MECSA y serán incluidos en nuestra red de instaladores autorizados.

Para más información, contáctenos a través del formulario de contacto.`,
    image: "/images/gallery4.jpeg",
    date: "2024-09-15",
    category: "Formación",
    author: "Departamento Técnico",
  },
];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getRecentNews(count: number = 3): NewsArticle[] {
  return newsArticles.slice(0, count);
}

export function getNewsByCategory(category: string): NewsArticle[] {
  return newsArticles.filter((article) => article.category === category);
}
