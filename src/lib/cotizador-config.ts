import defaultConfig from "@/data/cotizador-config.json";
import { readJSON, writeJSON } from "./storage";

const KEY = "cotizador-config.json";

type CotizadorConfig = typeof defaultConfig;

export async function getCotizadorConfig(): Promise<CotizadorConfig> {
  try {
    const stored = await readJSON<CotizadorConfig>(KEY);
    if (stored) return stored;
  } catch { /* fall through */ }
  return defaultConfig;
}

export async function saveCotizadorConfig(config: Record<string, unknown>) {
  await writeJSON(KEY, config);
}
