# Reglas del proyecto — Asistente Almacén IA

## Restricciones permanentes

- **No tocar ni modificar el proyecto de Supabase existente.** Solo crear recursos nuevos si fuera necesario. El proyecto activo es `oeusclkuhypcahiordcg`.
- Las API keys van exclusivamente en `.env.local`. Nunca en el código, nunca commiteadas.
- El nombre de la variable de Anthropic es `API_KEY_ANTROPICS` (así está configurada en Vercel y en local).
- La rama `simple` es la versión para mostrar en entrevistas. La rama `main` queda como estaba, sin tocar.
- RLS de Supabase está deshabilitado por decisión explícita (app interna, sin usuarios públicos).

## Stack

- Next.js App Router (Server Components por defecto)
- Vercel AI SDK (`ai` v4, `@ai-sdk/anthropic`) — `useChat` en cliente, `streamText` + `tool()` en servidor
- Claude claude-sonnet-4-5 vía Anthropic API
- Supabase Postgres con `@supabase/supabase-js` v2
- Tailwind CSS, Lucide React
- TypeScript strict

## Convenciones

- Preferir Server Components. Usar `"use client"` solo cuando hay estado, event handlers o APIs del browser.
- No agregar dependencias si Next.js, React o Web APIs resuelven el problema.
- Los comentarios van en español.
- Fechas y timestamps: usar UTC como referencia. Los datos del seed están en UTC. Para queries de "hoy" usar `Date.UTC()`, no `setHours(0,0,0,0)` local.
- Mantener la app simple y legible — es un proyecto de portfolio para un dev junior.

## Tablas en Supabase

- `products` — id, name, category, price, stock, min_stock, unit
- `sales` — id, product_id, quantity, total, sold_at

## Herramientas de IA disponibles

Todas definidas en `src/lib/ai-tools.ts` y registradas en `src/app/api/chat/route.ts`:

- `buscarProducto` — busca por nombre con ilike
- `productosConPocoStock` — filtra stock < min_stock
- `ventasDelPeriodo` — ventas de los últimos N días
- `listarProductos` — inventario completo, con filtro opcional por categoría
- `productoMasVendido` — ranking top 5 últimos 30 días

## Comandos

```bash
npm run dev      # desarrollo local
npm run build    # build de producción
npm run lint     # lint
```
