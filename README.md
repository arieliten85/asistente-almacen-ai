# Comerzia

> Gestión inteligente para tu negocio.

App de gestión para comercios minoristas argentinos con asistente de inteligencia artificial integrado. El dueño puede consultar stock, productos y ventas desde un panel estático o preguntarle directamente al chat en lenguaje natural.

## Demo

- **Panel** — muestra productos totales, ventas del día y alertas de stock bajo
- **Chat** — asistente conversacional que entiende preguntas como _"¿qué hay que reponer?"_ o _"¿cuánto vendimos esta semana?"_

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 App Router |
| IA | Claude claude-sonnet-4-5 vía Anthropic API |
| AI SDK | Vercel AI SDK v4 (`useChat`, `streamText`, `tool`) |
| Base de datos | Supabase (Postgres) |
| Estilos | Tailwind CSS |
| Lenguaje | TypeScript |

## Cómo funciona el chat

El usuario escribe una pregunta → el SDK la envía a `/api/chat` → Claude decide qué herramienta usar → la herramienta consulta Supabase → Claude interpreta el resultado y responde en streaming.

Claude puede encadenar hasta 3 herramientas por mensaje. No hay lógica de routing manual: Claude lee la descripción de cada herramienta y elige sola.

**Herramientas disponibles:**

- `buscarProducto` — busca un producto por nombre
- `productosConPocoStock` — lista productos que necesitan reposición
- `ventasDelPeriodo` — ventas de los últimos N días
- `listarProductos` — inventario completo o filtrado por categoría
- `productoMasVendido` — ranking de los 5 más vendidos (últimos 30 días)

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/arieliten85/asistente-almacen-ai.git
cd asistente-almacen-ai

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Completar los valores en .env.local

# 4. Correr en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Crear un archivo `.env.local` en la raíz con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
API_KEY_ANTROPICS=<api-key-de-anthropic>
```

- Las variables `NEXT_PUBLIC_*` son seguras para el cliente (Supabase no requiere secret key con RLS deshabilitado en esta app).
- `API_KEY_ANTROPICS` solo se usa en el servidor (Route Handler). Nunca se expone al browser.

## Estructura

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx        # Navbar compartido
│   │   ├── panel/page.tsx    # Panel con stat cards (Server Component)
│   │   └── chat/page.tsx     # Página del chat
│   └── api/chat/route.ts     # Route Handler — conecta Claude con Supabase
├── components/
│   ├── chat/                 # ChatWindow y ChatMessage
│   └── layout/               # NavLinks
└── lib/
    ├── ai-tools.ts           # Las 5 herramientas de IA
    └── supabase.ts           # Cliente de Supabase
```

## Ramas

- `main` — versión original completa
- `simple` — versión simplificada, optimizada para legibilidad

## Autor

Ariel — [GitHub](https://github.com/arieliten85)
