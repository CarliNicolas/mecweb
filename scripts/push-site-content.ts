import { put, list, del } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

async function push() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN no está configurado en .env.local");
    process.exit(1);
  }

  const filePath = path.join(import.meta.dir, "../src/data/site-content.json");
  const raw = await fs.readFile(filePath, "utf-8");
  JSON.parse(raw); // validate JSON

  const { blobs } = await list({ prefix: "site-content.json" });
  for (const blob of blobs) await del(blob.url);

  await put("site-content.json", raw, {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  console.log("✅ site-content.json subido a Vercel Blob");
}

push().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
