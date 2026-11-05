# Arquitectura — Asistente Almacén IA

App de gestión para un almacén argentino con asistente de IA integrado. Permite consultar stock, productos y ventas tanto desde un panel estático como desde un chat en lenguaje natural.

## Flujo de datos

### Panel (`/panel`)
```
Supabase (Postgres)
  └─► panel/page.tsx  (Server Component, se ejecuta en el servidor)
        └─► Muestra stat cards + alertas de stock directamente en el HTML
```

### Chat (`/chat`)
```
Usuario escribe mensaje
  └─► ChatWindow.tsx (Client Component, "use client")
        └─► useChat() de Vercel AI SDK  →  POST /api/chat
              └─► route.ts (Route Handler)
                    └─► streamText() con Claude claude-sonnet-4-5
                          └─► Claude decide qué herramienta usar
                                └─► tool.execute() consulta Supabase
                                      └─► Claude interpreta el resultado
                                            └─► Respuesta en streaming al cliente
```

Claude puede encadenar hasta 3 herramientas por mensaje (`maxSteps: 3`).

## Carpetas

```
src/
├── app/
│   ├── (dashboard)/          # Grupo de rutas con layout compartido (Navbar)
│   │   ├── layout.tsx        # Navbar simple: Panel | Asistente
│   │   ├── panel/page.tsx    # Server Component — 3 stat cards + alertas de stock
│   │   └── chat/page.tsx     # Renderiza ChatWindow
│   ├── api/
│   │   └── chat/route.ts     # Route Handler — conecta Claude con las herramientas
│   ├── layout.tsx            # Root layout (fuente, metadata)
│   └── page.tsx              # Redirect a /panel
│
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx    # Lógica del chat (useChat, sugerencias, input)
│   │   └── ChatMessage.tsx   # Renderiza un mensaje individual
│   └── layout/
│       └── NavLinks.tsx      # Links del navbar (Client Component por usePathname)
│
├── lib/
│   ├── ai-tools.ts           # Las 5 herramientas que Claude puede usar
│   ├── supabase.ts           # Cliente de Supabase
│   └── utils.ts              # cn() helper para Tailwind
│
└── types/
    └── index.ts              # Tipos TypeScript del dominio (Product, Sale)
```

## Decisiones clave

**¿Por qué Server Components en el panel?**
Las consultas a Supabase se hacen en el servidor, el HTML llega listo al browser. No hay estado client-side, no hay loading spinners, no hay JavaScript extra.

**¿Por qué `useChat` en el chat?**
El chat necesita estado local (historial de mensajes, input controlado) y streaming en tiempo real. Eso requiere el browser → `"use client"`.

**¿Cómo sabe Claude qué herramienta usar?**
No hay lógica de routing manual. Claude lee el `description` de cada herramienta y decide solo en base al mensaje del usuario. Vercel AI SDK maneja el loop de tool-calling automáticamente.

**¿Por qué `maxSteps: 3`?**
Permite que Claude llame una herramienta, lea el resultado, y decida si necesita otra consulta antes de responder. Con `maxSteps: 1` Claude respondería sin poder encadenar consultas.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=              # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Publishable key (safe en cliente)
API_KEY_ANTROPICS=                     # API key de Anthropic (solo servidor)
```

`API_KEY_ANTROPICS` no lleva el prefijo `NEXT_PUBLIC_` porque solo se usa en Route Handlers (servidor). Nunca se expone al browser.
