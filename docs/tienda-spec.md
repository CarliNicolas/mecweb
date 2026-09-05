# Especificación — Catálogo de productos MECSA

> Catálogo web de productos MECSA con fichas por modelo y consulta de
> disponibilidad por WhatsApp. **Sin carrito, sin checkout, sin pagos, sin base
> de datos.** Reutiliza la arquitectura ya existente del sitio (JSON + Vercel
> Blob + panel admin).

Fecha: 2026-09-05 · Proyecto: `mecsa-final` (Next.js, deploy en Vercel/Netlify)

---

## 1. Objetivo

El cliente navega el catálogo, entra a una **línea de producto** (ej. Enfriadores
Evaporativos), ve los **modelos concretos** de esa línea, y en cada modelo puede
tocar **"Consultar disponibilidad por WhatsApp"** — se abre WhatsApp con un
mensaje pre-armado con el nombre del modelo.

No hay precios visibles, ni stock, ni compra online. La conversión es la consulta
por WhatsApp (o teléfono).

## 2. Qué ya existe (no rehacer)

- 5 **líneas de producto** en `src/data/site-content.json` → clave `products[]`
  (enfriadores-evaporativos, calefactores-radiantes, ventilacion-industrial,
  filtracion-de-aire, control-y-automatizacion).
- Páginas de detalle de línea en `src/app/productos/[slug]/`.
- Componente `WhatsAppButton` y patrón deep-link `https://wa.me/${whatsapp}?text=`
  (ver `src/components/ContactCTA.tsx`).
- Número WhatsApp oficial: `companyInfo.whatsapp = "5492615173763"`
  (+54 9 261 517-3763). **Se usa este, ya cargado.**
- Panel admin editando `site-content.json` vía `src/app/api/admin/site-content/`.
- Subida de imágenes vía `src/app/api/admin/upload/` (Vercel Blob o `public/uploads`).

## 3. Qué se agrega

### 3.1 Modelo de datos

Cada línea de `products[]` gana un array `models[]`. Se guarda en el mismo
`site-content.json` (mismo mecanismo JSON + Blob, sin DB nueva).

```jsonc
// dentro de products[i]
{
  "id": "enfriadores-evaporativos",
  "title": "Enfriadores Evaporativos",
  // ...campos actuales...
  "models": [
    {
      "id": "eva-5000",                    // slug único dentro de la línea
      "name": "Enfriador EVA-5000",
      "shortDescription": "Caudal 5.000 m³/h, para naves de hasta 60 m².",
      "image": "/images/eva-5000.jpeg",     // sube por el admin (upload)
      "gallery": [],                          // opcional
      "specs": [                              // ficha técnica (label/value)
        { "label": "Caudal de aire", "value": "5.000 m³/h" },
        { "label": "Potencia", "value": "0,75 kW" },
        { "label": "Cobertura", "value": "hasta 60 m²" }
      ],
      "available": true                      // true = "Consultar disponibilidad",
                                             // false = "Sin stock / a pedido"
    }
  ]
}
```

Reglas:
- Sin campo `price`. Sin campo `stock` numérico. `available` es sólo un flag para
  el texto/estilo del botón.
- `id` de modelo único dentro de su línea.

### 3.2 Frontend

**Página de línea** (`/productos/[slug]`): debajo de la descripción actual,
grilla de tarjetas de modelo. Cada tarjeta:
- foto (`image`), `name`, `shortDescription`
- ficha `specs` (lista label/value)
- botón **"Consultar disponibilidad por WhatsApp"**

**Botón WhatsApp** (reutiliza patrón de `ContactCTA`):
```
https://wa.me/5492615173763?text=<encodeURIComponent(mensaje)>
```
Mensaje pre-armado:
> Hola MECSA, quería consultar disponibilidad del modelo **{name}**
> (línea {title}). ¿Me pasan info y precio?

Si `available === false`, el botón dice "Consultar (a pedido)" — mismo link,
sólo cambia la etiqueta.

**(Opcional, Fase 2)** página de detalle por modelo `/productos/[slug]/[modelo]`
con galería completa. En Fase 1 alcanza con las tarjetas en la página de línea.

### 3.3 Panel admin

Extender el editor de `site-content.json` (`src/app/admin/page.tsx`) para gestionar
`models[]` dentro de cada línea:
- agregar / editar / borrar modelo
- campos: name, shortDescription, image (usa `upload`), specs (agregar filas), available (toggle)
- reordenar (nice-to-have)

Persistencia: el mismo `PUT` a `/api/admin/site-content` que ya existe (merge +
JSON/Blob). No se toca la lógica de guardado.

## 4. Fuera de alcance (explícito)

- Carrito, checkout, pasarela de pago.
- Base de datos (Supabase/Postgres). Si en el futuro se quiere venta online con
  stock real, se migra a Supabase — no ahora.
- Sincronización con proveedores externos (eso es otro proyecto, `ml-auto`).
- Cuentas de usuario / login de clientes.

## 5. Plan de fases

**Fase 1 — MVP catálogo**
1. Agregar `models[]` al schema y cargar 1–2 modelos de ejemplo por línea en
   `site-content.json`.
2. Componente `<ModelCard>` con botón WhatsApp (reusa deep-link de ContactCTA).
3. Renderizar grilla de modelos en `/productos/[slug]`.
4. Verificar en preview: link WhatsApp abre con mensaje correcto.

**Fase 2 — Admin**
5. UI en `/admin` para CRUD de modelos + subida de imagen.

**Fase 3 (opcional)**
6. Página de detalle por modelo con galería.
7. Buscador / filtro de modelos por línea.

## 6. Datos pendientes del cliente (MECSA)

- Lista real de modelos por línea (nombre + specs + foto). Sin esto, Fase 1 va con
  datos de ejemplo (placeholder) y luego se cargan por el admin.
