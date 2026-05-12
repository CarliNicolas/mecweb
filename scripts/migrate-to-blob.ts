import { put, list, del } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const ROOT = path.join(import.meta.dir, "..");

async function uploadJson(blobKey: string, filePath: string, label: string) {
  const raw = await fs.readFile(filePath, "utf-8");
  const content = JSON.parse(raw);

  // Borrar versión anterior si existe
  const { blobs } = await list({ prefix: blobKey });
  for (const blob of blobs) await del(blob.url);

  await put(blobKey, JSON.stringify(content), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  console.log(`✅ ${label} subido a Blob`);
}

async function migrate() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN no está configurado en .env.local");
    process.exit(1);
  }

  const siteContentPath = path.join(ROOT, "backup-site-content.json");
  const newsPath = path.join(ROOT, "backup-news.json");

  // Verificar que los backups existen
  for (const [label, p] of [["backup-site-content.json", siteContentPath], ["backup-news.json", newsPath]] as const) {
    try {
      await fs.access(p);
    } catch {
      console.error(`❌ No se encontró ${label} en la raíz del proyecto`);
      console.error(`   Descargalo primero desde tu sitio live con:`);
      console.error(`   Invoke-WebRequest "https://TU-SITIO.vercel.app/api/site-content" -OutFile "backup-site-content.json"`);
      console.error(`   Invoke-WebRequest "https://TU-SITIO.vercel.app/api/news" -OutFile "backup-news.json"`);
      process.exit(1);
    }
  }

  console.log("🚀 Iniciando migración a Vercel Blob...\n");

  await uploadJson("site-content.json", siteContentPath, "Contenido del sitio");
  await uploadJson("news.json", newsPath, "Noticias");

  console.log("\n✅ Migración completada. Podés verificar en el admin que todo esté bien.");
}

migrate().catch((err) => {
  console.error("❌ Error durante la migración:", err);
  process.exit(1);
});
