import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");

export async function GET() {
  try {
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    // Return default content if file doesn't exist
    return NextResponse.json({
      companyInfo: {
        phone: "+54 261 555-5555",
        email: "info@mecsa.com.ar",
        address: "San Lorenzo 1052 (5519) San José, Guaymallén, Mendoza",
        whatsapp: "5492615555555",
      },
      socialMedia: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
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
    });
  }
}
