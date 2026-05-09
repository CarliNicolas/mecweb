import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");

export async function GET() {
  try {
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "No se pudo leer el contenido" }, { status: 500 });
  }
}
