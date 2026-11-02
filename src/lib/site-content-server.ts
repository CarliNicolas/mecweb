// Server-only helper to read site content (repo defaults + R2 merge).
// Used by API routes and by server components (e.g. product detail page).

import "server-only";
import fileData from "@/data/site-content.json";
import { mergeSiteContent } from "./site-content-merge";
import { readJSON, writeJSON } from "./storage";

const KEY = "site-content.json";

export async function getStoredSiteContent(): Promise<Record<string, unknown> | null> {
  try {
    return await readJSON<Record<string, unknown>>(KEY);
  } catch {
    return null;
  }
}

export async function getSiteContent(): Promise<Record<string, unknown> | null> {
  const defaults = fileData as Record<string, unknown>;
  const stored = await getStoredSiteContent();
  if (stored) return mergeSiteContent(defaults, stored) ?? defaults;
  return defaults;
}

export async function saveSiteContent(content: Record<string, unknown>): Promise<void> {
  await writeJSON(KEY, content);
}
