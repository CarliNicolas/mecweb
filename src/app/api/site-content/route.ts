import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");
const BLOB_KEY = "site-content";
const BLOB_STORE = "site-data";

const DEFAULT_CONTENT = {
  companyInfo: {
    phone: "+54 261 517-3763",
    email: "info@mecsa.com.ar",
    address: "Godoy Cruz 562, San José, Guaymallén, Mendoza",
    whatsapp: "5492615173763",
  },
  socialMedia: {
    facebook: "https://www.facebook.com/share/1AXfsJCuV6/?mibextid=wwXIfr",
    twitter: "",
    instagram: "",
  },
  heroSlides: [],
  companyIntro: {},
  fabricantes: {},
  products: [],
  sectors: { title: "", subtitle: "", items: [] },
  climatizacion: {},
  gallery: { images: [] },
  contact: {},
  footer: {},
};

export async function GET() {
  try {
    const store = getStore(BLOB_STORE);
    const content = await store.get(BLOB_KEY, { type: "json" });
    if (content) return NextResponse.json(content);
  } catch {
    // Blobs not available, fall through to file
  }
  try {
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(DEFAULT_CONTENT);
  }
}
