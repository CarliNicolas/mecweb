import Link from "next/link";
import { Home, ArrowLeft, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--mecsa-bg)] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/" className="mb-12">
        <img src="/images/logo.gif" alt="MEC S.A." className="h-14 w-auto" />
      </Link>

      {/* 404 visual */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <span className="text-[180px] font-bold leading-none text-[var(--mecsa-primary)] opacity-10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-[var(--mecsa-primary)] flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-[var(--mecsa-primary)]">!</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-light text-[var(--mecsa-text)] mb-3"
          style={{ fontFamily: "var(--font-titillium)" }}>
          Página no encontrada
        </h1>
        <p className="text-[var(--mecsa-text-light)] max-w-md mx-auto leading-relaxed">
          La página que buscás no existe o fue movida. Usá la navegación para encontrar lo que necesitás.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link href="/"
          className="mecsa-btn flex items-center gap-2 justify-center">
          <Home className="w-4 h-4" />
          Ir al inicio
        </Link>
        <Link href="/contacto"
          className="mecsa-btn-outline flex items-center gap-2 justify-center">
          <Phone className="w-4 h-4" />
          Contactanos
        </Link>
      </div>

      {/* Quick links */}
      <div className="text-center">
        <p className="text-sm text-[var(--mecsa-text-light)] mb-4">O navegá a alguna de estas secciones:</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { href: "/#productos", label: "Productos" },
            { href: "/#empresa", label: "La Empresa" },
            { href: "/noticias", label: "Noticias" },
            { href: "/#galeria", label: "Galería" },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[var(--mecsa-text)] hover:border-[var(--mecsa-primary)] hover:text-[var(--mecsa-primary)] transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
