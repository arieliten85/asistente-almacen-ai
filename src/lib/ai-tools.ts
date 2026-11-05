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

// Herramienta 3: consultar ventas de un período
export const ventasDelPeriodo = tool({
  description:
    "Devuelve el total de ventas de los últimos N días. Usá esta herramienta cuando el usuario pregunte cuánto vendió hoy, esta semana o este mes.",
  parameters: z.object({
    dias: z.number().min(1).max(90).describe("Cantidad de días hacia atrás. 1 = hoy, 7 = esta semana, 30 = este mes."),
  }),
  execute: async ({ dias }) => {
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);

    const { data, error } = await supabase
      .from("sales")
      .select("*, product:products(name)")
      .gte("sold_at", desde.toISOString());

    if (error) return { error: error.message };

    const ventas = data ?? [];
    const totalFacturado = ventas.reduce((sum, v) => sum + Number(v.total), 0);

    // Agrupar por producto
    const porProducto: Record<string, { nombre: string; cantidad: number; total: number }> = {};
    // Supabase infiere el join product como array; casteamos a any
    ventas.forEach((v: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const nombre = v.product?.name ?? "Desconocido";
      if (!porProducto[nombre]) porProducto[nombre] = { nombre, cantidad: 0, total: 0 };
      porProducto[nombre].cantidad += Number(v.quantity);
      porProducto[nombre].total += Number(v.total);
    });

    const topProductos = Object.values(porProducto)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    return {
      periodo: `Últimos ${dias} día${dias === 1 ? "" : "s"}`,
      total_facturado: `$${totalFacturado.toFixed(0)}`,
      total_transacciones: ventas.length,
      top_productos: topProductos,
    };
  },
});

// Herramienta 4: listar productos por categoría
export const listarProductos = tool({
  description:
    "Lista todos los productos del almacén. Puede filtrarse por categoría. Usá esta herramienta cuando el usuario quiera ver el inventario o pregunte qué productos hay de una categoría.",
  parameters: z.object({
    categoria: z.string().optional().describe("Categoría a filtrar (opcional). Ej: lácteos, bebidas, almacén"),
  }),
  execute: async ({ categoria }) => {
    let query = supabase.from("products").select("*").order("category").order("name");

    if (categoria) query = query.ilike("category", `%${categoria}%`);

    const { data, error } = await query;

    if (error) return { error: error.message };

    return {
      total: data?.length ?? 0,
      productos: (data ?? []).map((p) => ({
        nombre: p.name,
        categoria: p.category,
        precio: `$${Number(p.price).toFixed(2)}`,
        stock: `${p.stock} ${p.unit}`,
        estado: p.stock < p.min_stock ? "⚠️ Bajo" : "✅ OK",
      })),
    };
  },
});

// Herramienta 5: producto más vendido
export const productoMasVendido = tool({
  description:
    "Devuelve el ranking de los productos más vendidos del último mes. Usá esta herramienta cuando el usuario pregunte qué se vende más o cuál es el producto estrella.",
  parameters: z.object({}),
  execute: async () => {
    const hace30 = new Date();
    hace30.setDate(hace30.getDate() - 30);

    const { data, error } = await supabase
      .from("sales")
      .select("quantity, total, product:products(name, category)")
      .gte("sold_at", hace30.toISOString());

    if (error) return { error: error.message };

    const porProducto: Record<string, { nombre: string; categoria: string; cantidad: number; total: number }> = {};
    // Supabase infiere joins como arrays; casteamos a any para acceder a las propiedades
    (data ?? []).forEach((v: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const nombre = v.product?.name ?? "Desconocido";
      if (!porProducto[nombre]) {
        porProducto[nombre] = { nombre, categoria: v.product?.category ?? "", cantidad: 0, total: 0 };
      }
      porProducto[nombre].cantidad += Number(v.quantity);
      porProducto[nombre].total += Number(v.total);
    });

    const ranking = Object.values(porProducto)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    return { ranking };
  },
});

export const tools = {
  buscarProducto,
  productosConPocoStock,
  ventasDelPeriodo,
  listarProductos,
  productoMasVendido,
};
