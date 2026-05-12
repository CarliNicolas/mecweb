"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
interface HeroSlide {
  title: string;
  titleHighlight: string;
  subtitle: string;
  image: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface SectorItem {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface GalleryImage {
  src: string;
  alt: string;
}

export interface SiteContent {
  companyInfo: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  heroSlides: HeroSlide[];
  companyIntro: {
    title1: string;
    title2: string;
    title3: string;
    description1: string;
    description2: string;
    image1: string;
    image2: string;
  };
  fabricantes: {
    title: string;
    description1: string;
    description2: string;
    description3: string;
    image: string;
    buttonText: string;
    buttonLink: string;
  };
  products: Product[];
  productsSection: {
    title: string;
    subtitle: string;
  };
  sectors: {
    title: string;
    subtitle: string;
    items: SectorItem[];
  };
  climatizacion: {
    title: string;
    description1: string;
    description2: string;
  };
  gallery: {
    images: GalleryImage[];
    buttonProjects: string;
    buttonNews: string;
  };
  contact: {
    title: string;
    subtitle: string;
    mapUrl: string;
  };
  footer: {
    text: string;
    designCredit: string;
    designUrl: string;
  };
  clientes: string[];
}

const defaultContent: SiteContent = {
  companyInfo: {
    phone: "+54 261 555-5555",
    email: "info@mecsa.com.ar",
    address: "San Lorenzo 1052 (5519) San José, Guaymallén, Mendoza",
    whatsapp: "5492615555555",
  },
  socialMedia: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "",
  },
  heroSlides: [
    {
      title: "Ventilación",
      titleHighlight: "Industrial",
      subtitle: "Sistemas de Ventilación y Diseño de proyectos a medida.",
      image: "/images/hero1.jpeg",
    },
    {
      title: "Climatización",
      titleHighlight: "Industrial",
      subtitle: "Sistemas de Climatización y Diseño de proyectos a medida.",
      image: "/images/hero2.jpeg",
    },
    {
      title: "Filtración de",
      titleHighlight: "Aire",
      subtitle: "Sistemas de Filtración de Aire y Diseño de proyectos a medida.",
      image: "/images/hero3.jpeg",
    },
  ],
  companyIntro: {
    title1: "Conozca nuestra empresa.",
    title2: "Proyectos a medida.",
    title3: "Climatización según sus necesidades.",
    description1: "EMPRENDIMIENTOS MEC S.A. tiene como objetivo diseñar e implementar Sistemas de Climatización Industrial para proveer un ambiente confortable mediante el control simultáneo de la temperatura, la humedad, la limpieza y la distribución del aire en el ambiente, sin omitir el nivel acústico.",
    description2: "Esto se logra mediante la provisión de Enfriadores Evaporativos ventiladores/extractores de aire; sistemas de tratamiento de aire que permiten controlar distintos parámetros industriales (temperatura, humedad, cantidad de partículas, nivel sonoro y carga eléctrica entre otros factores) en diferentes espacios de acuerdo a especificaciones predeterminadas.",
    image1: "/images/enfriador.jpeg",
    image2: "/images/ventilacion.jpeg",
  },
  fabricantes: {
    title: "Somos Fabricantes",
    description1: "Somos fabricantes en Mendoza (Argentina) de Enfriadores Evaporativos de Alta Eficiencia.",
    description2: "Diseñamos el equipo y el sistema, según las características y necesidades del lugar donde serán finalmente instalados.",
    description3: "Tomando aire del exterior el sistema no sólo baja la carga térmica del ambiente sino que también genera presión positiva dentro del mismo lo que garantiza que desde el exterior entra aire previamente filtrado pudiendo implementarse normas de polución ambiental en lo que a calidad de aires se refiere. Ofrecemos soluciones sustentables.",
    image: "/images/ingenieros.png",
    buttonText: "Ver Fotogalería",
    buttonLink: "/#galeria",
  },
  products: [],
  productsSection: {
    title: "Soluciones de Climatización",
    subtitle: "Nuestros Servicios",
  },
  sectors: {
    title: "Rubros Gestionados",
    subtitle: "En cuáles áreas te podemos ayudar ?",
    items: [],
  },
  climatizacion: {
    title: "Que es la Climatización Evaporativa ?",
    description1: "",
    description2: "",
  },
  gallery: {
    images: [],
    buttonProjects: "Ver Proyectos",
    buttonNews: "Ver Noticias",
  },
  contact: {
    title: "Contacto",
    subtitle: "",
    mapUrl: "",
  },
  footer: {
    text: "",
    designCredit: "",
    designUrl: "",
  },
  clientes: [
    "Arcor", "Unilever", "Drean Mabe", "Plastiandino", "BolsaFilm",
    "Carin", "Zummy", "Mansur", "Oscar David", "Peñaflor",
    "Carnes La Cuyana", "Fundación Instituto Leloir", "Lácteos Maitia",
    "Finca Rocío", "Marata", "Agrinet", "Proemio",
  ],
};

interface SiteContentContextType {
  content: SiteContent;
  isLoading: boolean;
  refetch: () => void;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: defaultContent,
  isLoading: true,
  refetch: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/site-content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (error) {
      console.error("Error fetching site content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, isLoading, refetch: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
