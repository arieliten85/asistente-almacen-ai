import { Product } from "@/types";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
  alertas: Product[];
}

export default function StockAlerts({ alertas }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-sm font-medium text-white">Alertas de stock</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Productos por debajo del mínimo
        </p>
      </div>

      <div className="p-3 space-y-2">
        {alertas.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle size={28} className="text-green-500 mb-2" />
            <p className="text-sm text-gray-400">Todo en orden</p>
            <p className="text-xs text-gray-600">Stock OK en todos los productos</p>
          </div>
        ) : (
          alertas.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg"
            >
              <AlertTriangle size={16} className="text-amber-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-200 truncate">
                  {p.name}
                </p>
                <p className="text-xs text-gray-500">
                  {p.stock}/{p.min_stock} {p.unit} · faltan{" "}
                  <span className="text-amber-400">
                    {p.min_stock - p.stock}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
