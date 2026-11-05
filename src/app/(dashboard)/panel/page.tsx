import { Suspense } from "react";
import { io } from "next/cache";
import { supabase } from "@/lib/supabase";
import { Product, Sale } from "@/types";
import ProductTable from "@/components/panel/ProductTable";
import StockAlerts from "@/components/panel/StockAlerts";
import SalesSummary from "@/components/panel/SalesSummary";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";

async function getPanelData() {
  await io();
  const hoy = new Date();
  const inicioDia = new Date(hoy);
  inicioDia.setHours(0, 0, 0, 0);
  const hace30 = new Date(hoy);
  hace30.setDate(hace30.getDate() - 30);

  const [productosRes, ventasHoyRes, ventasMesRes] = await Promise.all([
    supabase.from("products").select("*").order("category").order("name"),
    supabase
      .from("sales")
      .select("total")
      .gte("sold_at", inicioDia.toISOString()),
    supabase
      .from("sales")
      .select("total, sold_at, product:products(name, category)")
      .gte("sold_at", hace30.toISOString())
      .order("sold_at", { ascending: false }),
  ]);

  const productos: Product[] = productosRes.data || [];
  const alertas = productos.filter((p) => p.stock < p.min_stock);
  const ventasHoy = (ventasHoyRes.data || []).reduce(
    (sum, v) => sum + Number(v.total),
    0
  );
  const ventasMes = (ventasMesRes.data || []).reduce(
    (sum, v) => sum + Number(v.total),
    0
  );

  return {
    productos,
    alertas,
    ventasHoy,
    ventasMes,
    ultimasVentas: ventasMesRes.data || [],
  };
}

async function PanelContent() {
  const { productos, alertas, ventasHoy, ventasMes, ultimasVentas } =
    await getPanelData();

  const stats = [
    {
      label: "Productos",
      value: productos.length,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Ventas hoy",
      value: `$${ventasHoy.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Ventas (30 días)",
      value: `$${ventasMes.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Alertas stock",
      value: alertas.length,
      icon: AlertTriangle,
      color: alertas.length > 0 ? "text-amber-400" : "text-gray-400",
      bg: alertas.length > 0 ? "bg-amber-500/10" : "bg-gray-500/10",
    },
  ];

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">{stat.label}</span>
                <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon size={16} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de productos */}
        <div className="lg:col-span-2">
          <ProductTable productos={productos} />
        </div>

        {/* Alertas de stock */}
        <div>
          <StockAlerts alertas={alertas} />
        </div>
      </div>
    </>
  );
}

function PanelSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-[106px] bg-gray-900 border border-gray-800 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}

export default function PanelPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Panel de control</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Resumen general del almacén
        </p>
      </div>

      <Suspense fallback={<PanelSkeleton />}>
        <PanelContent />
      </Suspense>
    </div>
  );
}
