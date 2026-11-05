import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const productos = [
  // Almacén seco
  { name: "Yerba mate Rosamonte 500g", category: "almacén", price: 2200, stock: 45, min_stock: 20, unit: "u" },
  { name: "Yerba mate Cruz de Malta 500g", category: "almacén", price: 1950, stock: 8, min_stock: 15, unit: "u" },
  { name: "Fideos Matarazzo tallarín 500g", category: "almacén", price: 650, stock: 60, min_stock: 30, unit: "u" },
  { name: "Fideos Luchetti spaghetti 500g", category: "almacén", price: 720, stock: 42, min_stock: 25, unit: "u" },
  { name: "Arroz Gallo 1kg", category: "almacén", price: 1100, stock: 35, min_stock: 20, unit: "u" },
  { name: "Aceite Natura girasol 1.5L", category: "almacén", price: 2800, stock: 22, min_stock: 15, unit: "u" },
  { name: "Harina 000 Cañuelas 1kg", category: "almacén", price: 480, stock: 50, min_stock: 25, unit: "u" },
  { name: "Sal fina La Fronterita 1kg", category: "almacén", price: 350, stock: 30, min_stock: 10, unit: "u" },
  { name: "Azúcar Ledesma 1kg", category: "almacén", price: 950, stock: 40, min_stock: 20, unit: "u" },
  { name: "Café Nescafé clásico 170g", category: "almacén", price: 2400, stock: 15, min_stock: 10, unit: "u" },
  
  // Bebidas
  { name: "Coca-Cola 2.25L", category: "bebidas", price: 1800, stock: 48, min_stock: 24, unit: "u" },
  { name: "Pepsi 2.25L", category: "bebidas", price: 1700, stock: 36, min_stock: 18, unit: "u" },
  { name: "Sprite 2.25L", category: "bebidas", price: 1750, stock: 24, min_stock: 12, unit: "u" },
  { name: "Agua mineral Villavicencio 2L", category: "bebidas", price: 1200, stock: 60, min_stock: 30, unit: "u" },
  { name: "Jugo Tang naranja 25g", category: "bebidas", price: 350, stock: 5, min_stock: 20, unit: "u" },
  { name: "Cerveza Quilmes 1L", category: "bebidas", price: 1600, stock: 72, min_stock: 24, unit: "u" },
  
  // Lácteos
  { name: "Leche La Serenísima entera 1L", category: "lácteos", price: 850, stock: 35, min_stock: 20, unit: "u" },
  { name: "Leche descremada 1L", category: "lácteos", price: 900, stock: 18, min_stock: 15, unit: "u" },
  { name: "Manteca La Paulina 200g", category: "lácteos", price: 1450, stock: 20, min_stock: 12, unit: "u" },
  { name: "Queso cremoso Molfino 1kg", category: "lácteos", price: 5800, stock: 6, min_stock: 5, unit: "kg" },
  { name: "Yogur Danone natural 190g", category: "lácteos", price: 650, stock: 24, min_stock: 12, unit: "u" },
  
  // Panadería
  { name: "Pan de molde Lactal 500g", category: "panadería", price: 1100, stock: 12, min_stock: 8, unit: "u" },
  { name: "Galletitas Oreo 117g", category: "panadería", price: 950, stock: 30, min_stock: 15, unit: "u" },
  { name: "Galletitas Toddy 200g", category: "panadería", price: 850, stock: 25, min_stock: 12, unit: "u" },
  
  // Limpieza
  { name: "Lavandina Ayudín 1L", category: "limpieza", price: 680, stock: 28, min_stock: 10, unit: "u" },
  { name: "Detergente Magistral 500ml", category: "limpieza", price: 750, stock: 20, min_stock: 8, unit: "u" },
  { name: "Jabón en polvo Ala 1kg", category: "limpieza", price: 1800, stock: 3, min_stock: 10, unit: "u" },
];

// Generar ventas de los últimos 30 días
function generarVentas(productoIds: string[]) {
  const ventas = [];
  const hoy = new Date();

  for (let dia = 0; dia < 30; dia++) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - dia);

    // Entre 8 y 20 ventas por día
    const cantVentas = Math.floor(Math.random() * 13) + 8;

    for (let i = 0; i < cantVentas; i++) {
      const productoIdx = Math.floor(Math.random() * productoIds.length);
      const cantidad = Math.floor(Math.random() * 4) + 1;
      const producto = productos[productoIdx];

      // Hora aleatoria de 8am a 8pm
      fecha.setHours(
        Math.floor(Math.random() * 12) + 8,
        Math.floor(Math.random() * 60),
        0,
        0
      );

      ventas.push({
        product_id: productoIds[productoIdx],
        quantity: cantidad,
        total: cantidad * producto.price,
        sold_at: fecha.toISOString(),
      });
    }
  }

  return ventas;
}

async function seed() {
  console.log("🌱 Iniciando seed...\n");

  // Insertar productos
  console.log(`📦 Insertando ${productos.length} productos...`);
  const { data: productosInsertados, error: errProductos } = await supabase
    .from("products")
    .insert(productos)
    .select("id");

  if (errProductos) {
    console.error("❌ Error en productos:", errProductos.message);
    process.exit(1);
  }

  console.log(`✅ ${productosInsertados?.length} productos insertados\n`);

  // Generar y insertar ventas
  const ids = (productosInsertados || []).map((p) => p.id);
  const ventas = generarVentas(ids);

  console.log(`💰 Insertando ${ventas.length} ventas (30 días)...`);

  // Insertar en batches de 100
  for (let i = 0; i < ventas.length; i += 100) {
    const batch = ventas.slice(i, i + 100);
    const { error } = await supabase.from("sales").insert(batch);
    if (error) {
      console.error("❌ Error en ventas:", error.message);
      process.exit(1);
    }
  }

  console.log(`✅ ${ventas.length} ventas insertadas\n`);
  console.log("🎉 Seed completado exitosamente!");
}

seed();
