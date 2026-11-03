const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.preview.same-app.com"],
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
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ext.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "ugc.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "**.cloudinary.com", pathname: "/**" },
      // Allow any https image URL (for admin-entered URLs)
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = withNextIntl(nextConfig);

// Bindings de Cloudflare (R2, Images) disponibles en `next dev`
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
