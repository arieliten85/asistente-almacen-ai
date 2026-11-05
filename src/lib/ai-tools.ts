import { tool } from "ai";
import { z } from "zod";
import { supabase } from "./supabase";

// Herramienta 1: buscar un producto por nombre
export const buscarProducto = tool({
  description:
    "Busca un producto por nombre y devuelve su precio, stock y estado actual.",
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
      return { mensaje: `No se encontró ningún producto con "${query}".` };
    }

    return {
      productos: data.map((p) => ({
        nombre: p.name,
        categoria: p.category,
        precio: `$${Number(p.price).toFixed(2)}`,
        stock: `${p.stock} ${p.unit}`,
        estado: p.stock < p.min_stock ? "⚠️ Stock bajo" : "✅ OK",
      })),
    };
  },
});

// Herramienta 2: ver qué productos tienen poco stock
export const productosConPocoStock = tool({
  description:
    "Devuelve los productos que tienen stock por debajo del mínimo requerido. Usá esta herramienta cuando el usuario pregunte qué hay que reponer o qué está por agotarse.",
  parameters: z.object({}),
  execute: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("stock", { ascending: true });

    if (error) return { error: error.message };

    const alertas = (data ?? []).filter((p) => p.stock < p.min_stock);

    if (alertas.length === 0) {
      return { mensaje: "Todos los productos tienen stock suficiente." };
    }

    return {
      alertas: alertas.map((p) => ({
        nombre: p.name,
        stock_actual: p.stock,
        stock_minimo: p.min_stock,
        unidad: p.unit,
        faltante: p.min_stock - p.stock,
      })),
    };
  },
});

export const tools = {
  buscarProducto,
  productosConPocoStock,
};
