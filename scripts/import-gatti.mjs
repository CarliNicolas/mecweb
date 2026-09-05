// Importa productos industriales/comerciales de la tienda de Gatti (gattisa.com.ar)
// como modelos de la línea "ventilacion-industrial" en site-content.json.
// Descarga las imágenes a public/images/gatti/ y las referencia localmente.
//
// Uso: bun run scripts/import-gatti.mjs
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://gattisa.com.ar";
const PAGES = [`${BASE}/tienda/`, `${BASE}/tienda/page/2/`, `${BASE}/tienda/page/3/`, `${BASE}/tienda/page/4/`];
const OUT_IMG_DIR = "public/images/gatti";
const CONTENT_FILE = "src/data/site-content.json";

const EXCL = /ba[nñ]o|cocina|jab[oó]n|dispensador|secamano|inodoro|difusor|rejilla|art[ií]culos para ba|dosificador|repuesto/i;
const INCL = /industrial|comercial|axial|centr[ií]fug|circulador|colector de humo|cortina de aire|conducto|tubular|helicoidal|inyector|pared|venteurope|vent europe|alta temperatura|cielorra|campanita|dimmer|carcasa|avicola|av[ií]cola|de pie/i;

function decode(s) {
  return s
    .replace(/&#8211;/g, "–").replace(/&#8217;/g, "'").replace(/&amp;/g, "&")
    .replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&ntilde;/g, "ñ")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function parseCards(html) {
  const cards = [];
  // Cada card tiene un bloque tpproduct__thumb con el anchor (href + aria-label) y la <img src>.
  const re = /tpproduct__thumb[\s\S]*?<a[^>]*href="(https:\/\/gattisa\.com\.ar\/producto\/[^"]+)"[^>]*aria-label="([^"]*)"[\s\S]*?<img[^>]*\ssrc="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    cards.push({ href: m[1], name: decode(m[2]), img: m[3] });
  }
  return cards;
}

function slugFromHref(href) {
  return decodeURIComponent(href.replace(/\/$/, "").split("/").pop());
}

function categoryFromName(name) {
  const s = name.toLowerCase();
  if (/cortina de aire/.test(s)) return "Cortinas de aire";
  if (/axial/.test(s)) return "Extractores axiales";
  if (/centr[ií]fug/.test(s)) return "Extractores centrífugos";
  if (/circulador|ventilador/.test(s)) return "Ventiladores y circuladores";
  if (/conducto/.test(s)) return "Extractores de conducto";
  return "Otros extractores industriales";
}

function specsFromName(name) {
  const specs = [];
  const dia = name.match(/(\d{2,4})\s*(?:mm|cm)\b/i) || name.match(/(\d{2,4})\s*Ø/i) || name.match(/Ø\s*(\d{2,4})/i);
  if (dia) specs.push({ label: "Diámetro", value: dia[0].replace(/\s+/g, " ").trim() });
  const rpm = name.match(/([\d.]+)\s*rpm/i);
  if (rpm) specs.push({ label: "Velocidad", value: `${rpm[1]} RPM` });
  const hp = name.match(/([\d,.]+)\s*hp/i);
  if (hp) specs.push({ label: "Potencia", value: `${hp[1]} HP` });
  const ph = name.match(/(trif[aá]sic[oa]|monof[aá]sic[oa])/i);
  if (ph) specs.push({ label: "Alimentación", value: ph[1] });
  return specs;
}

async function main() {
  await fs.mkdir(OUT_IMG_DIR, { recursive: true });

  const all = [];
  for (const url of PAGES) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();
    all.push(...parseCards(html));
    console.log(`  ${url} → ${parseCards(html).length} cards`);
  }

  // dedupe por href
  const byHref = new Map();
  for (const c of all) if (!byHref.has(c.href)) byHref.set(c.href, c);
  const unique = [...byHref.values()];

  const kept = unique.filter((c) => !EXCL.test(c.name) && INCL.test(c.name));
  console.log(`\nTotal cards: ${all.length} | únicos: ${unique.length} | industriales: ${kept.length}\n`);

  const models = [];
  for (const c of kept) {
    const slug = slugFromHref(c.href);
    const ext = (c.img.split("?")[0].match(/\.(webp|jpe?g|png)$/i)?.[1] || "jpg").toLowerCase();
    const filename = `${slug}.${ext}`;
    const localPath = path.join(OUT_IMG_DIR, filename);
    try {
      const imgRes = await fetch(c.img, { headers: { "User-Agent": "Mozilla/5.0", Referer: BASE } });
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      await fs.writeFile(localPath, buf);
      models.push({
        id: slug,
        name: c.name,
        image: `/images/gatti/${filename}`,
        specs: specsFromName(c.name),
        category: categoryFromName(c.name),
        available: true,
        visible: true,
      });
      process.stdout.write(".");
    } catch (e) {
      console.log(`\n  ⚠ no se pudo bajar ${c.img}: ${e.message}`);
      models.push({ id: slug, name: c.name, specs: specsFromName(c.name), category: categoryFromName(c.name), available: true, visible: true });
    }
  }
  console.log(`\n\nModelos armados: ${models.length}`);

  const content = JSON.parse(await fs.readFile(CONTENT_FILE, "utf-8"));
  const vent = content.products.find((p) => p.id === "ventilacion-industrial");
  if (!vent) throw new Error("No encontré la línea ventilacion-industrial");
  vent.models = models;

  // Limpio los modelos de ejemplo (placeholders) que había cargado en enfriadores.
  const enf = content.products.find((p) => p.id === "enfriadores-evaporativos");
  if (enf) delete enf.models;

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2) + "\n", "utf-8");
  console.log(`✅ Escrito en ${CONTENT_FILE}. Modelos en ventilación: ${vent.models.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
