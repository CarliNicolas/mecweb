import defaultConfig from "@/data/chat-config.json";
import { readJSON, writeJSON } from "./storage";

export interface ChatConfig {
  empresa: { nombre: string; descripcion: string; direccion: string; telefono: string; email: string; web: string; };
  productos: { nombre: string; descripcion: string; }[];
  rubros: string[];
  instrucciones: string;
}

const KEY = "chat-config.json";

export async function getChatConfig(): Promise<ChatConfig> {
  try {
    const stored = await readJSON<ChatConfig>(KEY);
    if (stored) return stored;
  } catch { /* fall through */ }
  return defaultConfig as ChatConfig;
}

export async function saveChatConfig(config: ChatConfig): Promise<void> {
  await writeJSON(KEY, config);
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
