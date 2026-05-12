import fs from "fs/promises";
import path from "path";

const CONFIG_FILE = path.join(process.cwd(), "src/data/cotizador-config.json");

export async function getCotizadorConfig() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "cotizador-config.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
          next: { revalidate: 60 },
        });
        if (res.ok) return res.json();
      }
    } catch { /* fall through */ }
  }
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function saveCotizadorConfig(config: Record<string, unknown>) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "cotizador-config.json" });
    for (const blob of blobs) await del(blob.url);
    await put("cotizador-config.json", JSON.stringify(config), {
      access: "private",
      contentType: "application/json",
    });
    return;
  }
  const dir = path.dirname(CONFIG_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
