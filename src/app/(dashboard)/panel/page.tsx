import { supabase } from "@/lib/supabase";
import { Package, DollarSign, AlertTriangle } from "lucide-react";

export default async function PanelPage() {
  // Traemos los datos del almacén desde Supabase
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const { data: productos } = await supabase.from("products").select("*");
  const { data: ventasHoy } = await supabase
    .from("sales")
    .select("total")
    .gte("sold_at", hoy.toISOString());

  const listaProductos = productos ?? [];
  const totalVentasHoy = (ventasHoy ?? []).reduce(
    (sum, v) => sum + Number(v.total),
    0
  );
  const alertasStock = listaProductos.filter((p) => p.stock < p.min_stock);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-white">Panel del almacén</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-blue-400" />
            <span className="text-xs text-gray-500">Productos</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {listaProductos.length}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-green-400" />
            <span className="text-xs text-gray-500">Ventas hoy</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            ${totalVentasHoy.toFixed(0)}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <span className="text-xs text-gray-500">Alertas stock</span>
          </div>
          <p className="text-2xl font-semibold text-white">
            {alertasStock.length}
          </p>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {alertasStock.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-medium text-white mb-3">
            Productos con poco stock
          </h2>
          <ul className="space-y-2">
            {alertasStock.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-300">{p.name}</span>
                <span className="text-amber-400">
                  {p.stock} / {p.min_stock} {p.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
