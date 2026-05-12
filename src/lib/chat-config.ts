import { put, head } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";
import defaultConfig from "@/data/chat-config.json";

export interface ChatConfig {
  empresa: { nombre: string; descripcion: string; direccion: string; telefono: string; email: string; web: string; };
  productos: { nombre: string; descripcion: string; }[];
  rubros: string[];
  instrucciones: string;
}

const BLOB_KEY = "chat-config.json";
const LOCAL_PATH = path.join(process.cwd(), "src/data/chat-config.json");

export async function getChatConfig(): Promise<ChatConfig> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await head(BLOB_KEY);
      const res = await fetch(blob.url);
      return await res.json();
    } catch { /* fall through */ }
  }
  try {
    const data = await fs.readFile(LOCAL_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultConfig as ChatConfig;
  }
}

export async function saveChatConfig(config: ChatConfig): Promise<void> {
  const body = JSON.stringify(config, null, 2);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(BLOB_KEY, body, { access: "public", contentType: "application/json", addRandomSuffix: false });
    return;
  }
  await fs.writeFile(LOCAL_PATH, body, "utf-8");
}

export function buildSystemPrompt(cfg: ChatConfig): string {
  const productos = cfg.productos.map((p, i) => `${i + 1}. ${p.nombre}: ${p.descripcion}`).join("\n");
  const rubros = cfg.rubros.map((r) => `- ${r}`).join("\n");
  return `Eres el asistente virtual de ${cfg.empresa.nombre}, ${cfg.empresa.descripcion}.

EMPRESA:
- Dirección: ${cfg.empresa.direccion}
- Teléfono: ${cfg.empresa.telefono}
- Email: ${cfg.empresa.email}
- Web: ${cfg.empresa.web}

PRODUCTOS:
${productos}

RUBROS ATENDIDOS:
${rubros}

INSTRUCCIONES:
${cfg.instrucciones}`;
}
