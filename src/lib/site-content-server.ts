// Server-only helper to read site content (file + Vercel Blob merge).
// Used by API routes and by server components (e.g. product detail page).

import "server-only";
import fs from "fs/promises";
import path from "path";
import { mergeSiteContent } from "./site-content-merge";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");

export async function getSiteContent(): Promise<Record<string, unknown> | null> {
  let fileData: Record<string, unknown> | null = null;
  try {
    fileData = JSON.parse(await fs.readFile(CONTENT_FILE, "utf-8"));
  } catch {
    /* file may not exist */
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "site-content.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
          cache: "no-store",
        });
        if (res.ok) {
          const blobData = await res.json();
          return mergeSiteContent(fileData, blobData);
        }
      }
    } catch {
      /* fall through to file */
    }
  }
  return fileData;
}
