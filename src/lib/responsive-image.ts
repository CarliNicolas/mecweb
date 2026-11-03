// Atributos src/srcSet/sizes para <img> comunes, con el mismo loader que
// next/image: las imágenes propias salen redimensionadas y en AVIF/WebP.
// URLs externas, GIF y SVG se dejan como están.

import imageLoader from "./image-loader";

const WIDTHS = [256, 384, 640, 828, 1200, 1920];

export function responsiveImage(src: string | undefined, sizes: string, maxWidth = 1920) {
  if (!src || /^https?:\/\//.test(src) || /\.(gif|svg)$/i.test(src)) {
    return { src, loading: "lazy" as const, decoding: "async" as const };
  }
  const widths = WIDTHS.filter((w) => w <= maxWidth);
  return {
    src: imageLoader({ src, width: widths[widths.length - 1] }),
    srcSet: widths.map((w) => `${imageLoader({ src, width: w })} ${w}w`).join(", "),
    sizes,
    loading: "lazy" as const,
    decoding: "async" as const,
  };
}
