import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");
const BLOB_KEY = "site-content";
const BLOB_STORE = "site-data";

const DEFAULT_CONTENT = {
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
    if (process.env.NETLIFY) {
      try {
        const store = getStore(BLOB_STORE);
        const content = await store.get(BLOB_KEY, { type: "json" });
        if (content) return NextResponse.json(content);
      } catch {
        // fall through to file
      }
    }
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(DEFAULT_CONTENT);
  }
}
