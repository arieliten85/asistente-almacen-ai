import { tool } from "ai";
import { z } from "zod";
import { supabase } from "./supabase";

export const productosConPocoStock = tool({
  description:
    "Devuelve los productos cuyo stock actual está por debajo del mínimo requerido. Usá esta herramienta cuando el usuario pregunte sobre faltantes, alertas de stock, qué hay que reponer, o qué está a punto de agotarse.",
  parameters: z.object({}),
  execute: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("stock", { ascending: true });

    if (error) return { error: error.message };

    const alertas = (data || []).filter((p) => p.stock < p.min_stock);

    if (alertas.length === 0) {
      return { message: "Todos los productos tienen stock suficiente." };
    }

    return {
      alertas: alertas.map((p) => ({
        nombre: p.name,
        categoria: p.category,
        stock_actual: p.stock,
        stock_minimo: p.min_stock,
        unidad: p.unit,
        faltante: p.min_stock - p.stock,
      })),
    };
  },
});

export const ventasDelPeriodo = tool({
  description:
    "Devuelve el total de ventas y los productos más vendidos en un período de días. Usá esta herramienta para preguntas sobre facturación, ganancias, ventas del día, de la semana o del mes.",
  parameters: z.object({
    dias: z
      .number()
      .min(1)
      .max(90)
      .describe(
        "Cantidad de días hacia atrás. 1 = hoy, 7 = última semana, 30 = último mes."
      ),
  }),
  execute: async ({ dias }) => {
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);

    const { data, error } = await supabase
      .from("sales")
      .select("*, product:products(name, category)")
      .gte("sold_at", desde.toISOString())
      .order("sold_at", { ascending: false });

    if (error) return { error: error.message };

    const ventas = data || [];
    const totalFacturado = ventas.reduce((sum, v) => sum + Number(v.total), 0);

    const porProducto: Record<string, { nombre: string; cantidad: number; total: number }> = {};
    ventas.forEach((v) => {
      const nombre = v.product?.name || "Desconocido";
      if (!porProducto[nombre]) {
        porProducto[nombre] = { nombre, cantidad: 0, total: 0 };
      }
      porProducto[nombre].cantidad += Number(v.quantity);
      porProducto[nombre].total += Number(v.total);
    });

    const topProductos = Object.values(porProducto)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    return {
      periodo: `Últimos ${dias} día${dias === 1 ? "" : "s"}`,
      total_facturado: totalFacturado,
      total_transacciones: ventas.length,
      top_productos: topProductos,
    };
  },
});

export const buscarProducto = tool({
  description:
    "Busca un producto por nombre o categoría y devuelve su precio, stock y datos actuales.",
  parameters: z.object({
    query: z.string().describe("Nombre o parte del nombre del producto"),
  }),
  execute: async ({ query }) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(5);

    if (error) return { error: error.message };

    if (!data || data.length === 0) {
      return { message: `No se encontró ningún producto con "${query}".` };
    }

    return {
      productos: data.map((p) => ({
        nombre: p.name,
        categoria: p.category,
        precio: `$${Number(p.price).toFixed(2)}`,
        stock: `${p.stock} ${p.unit}`,
        stock_minimo: p.min_stock,
        estado_stock: p.stock < p.min_stock ? "⚠️ Bajo" : "✅ OK",
      })),
    };
  },
});

export const listarProductos = tool({
  description:
    "Lista todos los productos del almacén con stock y precio. Usá esta herramienta cuando el usuario quiera ver el inventario completo.",
  parameters: z.object({
    categoria: z
      .string()
      .optional()
      .describe("Filtrar por categoría (opcional). Ej: 'lácteos', 'bebidas'"),
  }),
  execute: async ({ categoria }) => {
    let query = supabase.from("products").select("*").order("category").order("name");

    if (categoria) {
      query = query.ilike("category", `%${categoria}%`);
    }

    const { data, error } = await query;

    if (error) return { error: error.message };

    return {
      total: data?.length || 0,
      productos: (data || []).map((p) => ({
        nombre: p.name,
        categoria: p.category,
        precio: `$${Number(p.price).toFixed(2)}`,
        stock: `${p.stock} ${p.unit}`,
        estado: p.stock < p.min_stock ? "⚠️ Bajo" : "✅ OK",
      })),
    };
  },
});

export const tools = {
  productosConPocoStock,
  ventasDelPeriodo,
  buscarProducto,
  listarProductos,
};
