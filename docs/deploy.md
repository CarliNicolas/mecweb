# Deploy del sitio (Cloudflare Workers)

Desde nov-2026 el sitio corre en **Cloudflare Workers** (Worker `mecsa-web`) con
[OpenNext](https://opennext.js.org/cloudflare). Antes estaba en Vercel.

## Cómo se publica

- **Automático**: cada push a `main` dispara un build en Cloudflare (Workers Builds,
  conectado al repo `CarliNicolas/mecweb`). Comandos configurados en el panel:
  - build: `npx opennextjs-cloudflare build`
  - deploy: `npx opennextjs-cloudflare deploy`
  - otras ramas: `npx opennextjs-cloudflare upload` (versión de prueba, no toca producción)
- **Manual** (desde una PC): `bun run deploy`. Ojo: si existe `.env.local`, OpenNext
  mete sus valores en el bundle; renombrarlo antes del build.

## Dónde vive cada cosa

| Qué | Dónde |
| --- | --- |
| Código | este repo, rama `main` |
| Textos, noticias, configs e imágenes subidas desde `/admin` | Workers KV, binding `MEC_STORAGE` (ver `src/lib/storage.ts`) |
| Defaults (si KV no tiene la clave) | `src/data/*.json` |
| Dominios | `www.mecsa.com.ar` y `mecsa.com.ar` (redirige a www), custom domains del Worker |
| Chat / redactor IA | `src/lib/ai.ts`: Gemini si hay `GEMINI_API_KEY`, si no Workers AI (gratis) |
| Secretos | `wrangler secret put NOMBRE` (hoy: `JWT_SECRET`) |

La configuración del Worker está en `wrangler.jsonc`.
