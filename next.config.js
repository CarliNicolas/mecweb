const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV !== "production";

// Política de contenido: solo se cargan recursos de este sitio y de los servicios
// que usa (Google Analytics, YouTube, Google Maps, Cloudflare Insights).
// 'unsafe-inline' en scripts es necesario para el runtime inline de Next.js.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://cloudflareinsights.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.preview.same-app.com"],
  poweredByHeader: false,
  async headers() {
    return [
      // Todo el sitio salvo las imágenes subidas (esas llevan su propia CSP abajo)
      { source: "/((?!api/images/).*)", headers: securityHeaders },
      // Archivos subidos desde el admin: nunca se ejecutan ni se embeben como página
      {
        source: "/api/images/:path*",
        headers: [
          ...securityHeaders.filter((h) => h.key !== "Content-Security-Policy"),
          { key: "Content-Security-Policy", value: "default-src 'none'; sandbox" },
        ],
      },
      // Assets estáticos de public/: cache largo en el navegador
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
    ];
  },
  // El dominio sin www redirige al principal (como hacía Vercel)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "mecsa.com.ar" }],
        destination: "https://www.mecsa.com.ar/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Solo imágenes propias: las URLs externas se muestran con <img> común.
    // Sin remotePatterns, /_next/image no sirve de proxy para imágenes ajenas.
    remotePatterns: [],
  },
};

module.exports = withNextIntl(nextConfig);

// Bindings de Cloudflare (R2, Images) disponibles en `next dev`
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
