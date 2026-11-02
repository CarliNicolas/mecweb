// Almacenamiento del admin sobre Cloudflare Workers KV (binding MEC_STORAGE).
// Guarda los JSON editables (site-content, news, chat-config, cotizador-config)
// y las imágenes subidas desde el admin (prefijo "images/", content-type en metadata).
// Si no hay binding (p. ej. durante `next build`), las lecturas devuelven null
// y el que llama cae a los defaults del repo.

import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Tipos mínimos del binding KV que usamos (los tipos completos del runtime de
// Workers chocan con los de DOM/Node en el resto del proyecto).
interface ObjectMeta {
  contentType?: string;
}
interface KV {
  get(key: string, type: "text"): Promise<string | null>;
  getWithMetadata(key: string, type: "arrayBuffer"): Promise<{ value: ArrayBuffer | null; metadata: ObjectMeta | null }>;
  put(key: string, value: string | ArrayBuffer, options?: { metadata?: ObjectMeta }): Promise<void>;
}

async function store(): Promise<KV | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { MEC_STORAGE?: KV }).MEC_STORAGE ?? null;
  } catch {
    return null;
  }
}

export async function readJSON<T>(key: string): Promise<T | null> {
  const kv = await store();
  if (!kv) return null;
  const text = await kv.get(key, "text");
  return text ? (JSON.parse(text) as T) : null;
}

export async function writeJSON(key: string, data: unknown): Promise<void> {
  const kv = await store();
  if (!kv) throw new Error("Almacenamiento KV no disponible");
  await kv.put(key, JSON.stringify(data), { metadata: { contentType: "application/json" } });
}

export async function readObject(key: string): Promise<{ data: ArrayBuffer; contentType?: string } | null> {
  const kv = await store();
  if (!kv) return null;
  const { value, metadata } = await kv.getWithMetadata(key, "arrayBuffer");
  if (!value) return null;
  return { data: value, contentType: metadata?.contentType };
}

export async function writeObject(key: string, data: ArrayBuffer, contentType: string): Promise<void> {
  const kv = await store();
  if (!kv) throw new Error("Almacenamiento KV no disponible");
  await kv.put(key, data, { metadata: { contentType } });
}
