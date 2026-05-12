import type { MetadataRoute } from "next";
import fs from "fs/promises";
import path from "path";
import { newsArticles } from "@/data/news";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mecweb.vercel.app";

const PRODUCT_SLUGS = [
  "enfriadores-evaporativos",
  "calefactores-radiantes",
  "ventilacion-industrial",
  "filtracion-de-aire",
  "control-y-automatizacion",
];

async function getNewsSlugs(): Promise<{ slug: string; date: string }[]> {
  try {
    const file = path.join(process.cwd(), "src/data/news-admin.json");
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch {
    return newsArticles;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNewsSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/cotizar`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/noticias`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  ];

  const productPages: MetadataRoute.Sitemap = PRODUCT_SLUGS.map((slug) => ({
    url: `${BASE}/productos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const newsPages: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${BASE}/noticias/${article.slug}`,
    lastModified: article.date ? new Date(article.date) : new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...newsPages];
}
