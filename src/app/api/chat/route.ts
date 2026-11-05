import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { tools } from "@/lib/ai-tools";

const anthropic = createAnthropic({
  apiKey: process.env.API_KEY_ANTROPICS,
});

const SYSTEM_PROMPT = `Sos el asistente de un almacén argentino. Ayudás al dueño a consultar productos y stock.

REGLAS:
- Respondé siempre en español argentino, de forma clara y directa.
- Nunca inventes datos. Usá las herramientas para obtener información real.
- Cuando el usuario pregunte sobre un producto o el stock, usá las herramientas disponibles.

HERRAMIENTAS:
- buscarProducto: para buscar un producto por nombre
- productosConPocoStock: para ver qué hay que reponer`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: SYSTEM_PROMPT,
    messages,
    tools,
    maxSteps: 2,
  });

  return result.toDataStreamResponse();
}
