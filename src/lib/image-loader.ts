// Loader de next/image para Cloudflare.
// El optimizador de OpenNext solo puede leer archivos estáticos (public/), no rutas
// dinámicas: las imágenes subidas desde el admin (/api/images/..., guardadas en KV)
// se sirven directo, sin optimizar (ya llevan cache inmutable de un año).
// El resto pasa por /_next/image como siempre.

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/api/images/")) return `${src}?w=${width}`;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
