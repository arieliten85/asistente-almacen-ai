"use client";

import { Product } from "@/types";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  productos: Product[];
}

export default function ProductTable({ productos }: Props) {
  const [search, setSearch] = useState("");

  const filtered = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-white">Inventario</h2>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">
                Producto
              </th>
              <th className="text-left text-xs text-gray-500 font-medium px-4 py-3">
                Categoría
              </th>
              <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">
                Precio
              </th>
              <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">
                Stock
              </th>
              <th className="text-center text-xs text-gray-500 font-medium px-4 py-3">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const bajo = p.stock < p.min_stock;
              return (
                <tr
                  key={p.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-200 font-medium">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {p.stock} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        bajo
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-green-500/15 text-green-400"
                      )}
                    >
                      {bajo ? "Bajo" : "OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-600">
            No se encontraron productos
          </div>
        )}
      </div>
    </div>
  );
}
