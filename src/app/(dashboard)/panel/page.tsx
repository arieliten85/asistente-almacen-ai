import { Suspense } from "react";
import { io } from "next/cache";
import { supabase } from "@/lib/supabase";
import {
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const CRITICAL_STOCK_RATIO = 1 / 3;

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "America/Argentina/Buenos_Aires",
});

export default function PanelPage() {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <PanelContent />
    </Suspense>
  );
}

async function PanelContent() {
  // La fecha debe calcularse por request, no durante el prerender
  await io();

  // Traemos los datos del almacén desde Supabase
  // Usamos medianoche UTC para que coincida con cómo se guardaron los datos del seed
  const ahora = new Date();
  const hoyUTC = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate()));

  const { data: productos } = await supabase.from("products").select("*");
  const { data: ventasHoy } = await supabase
    .from("sales")
    .select("total")
    .gte("sold_at", hoyUTC.toISOString());

  const listaProductos = productos ?? [];
  const listaVentas = ventasHoy ?? [];
  const totalVentasHoy = listaVentas.reduce(
    (sum, v) => sum + Number(v.total),
    0
  );
  const alertasStock = listaProductos
    .filter((p) => p.stock < p.min_stock)
    .sort((a, b) => a.stock / a.min_stock - b.stock / b.min_stock);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Panel del almacén
        </h1>
        <p className="mt-1 text-sm text-gray-400 first-letter:uppercase">
          {dateFormatter.format(ahora)}
        </p>
      </header>

      <section
        aria-label="Resumen"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Ventas de hoy"
          value={currencyFormatter.format(totalVentasHoy)}
          detail={`${listaVentas.length} ${listaVentas.length === 1 ? "operación" : "operaciones"}`}
          icon={DollarSign}
          iconClassName="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          label="Productos"
          value={String(listaProductos.length)}
          detail="En el catálogo"
          icon={Package}
          iconClassName="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          label="Alertas de stock"
          value={String(alertasStock.length)}
          detail={alertasStock.length > 0 ? "Para reponer" : "Todo en orden"}
          icon={AlertTriangle}
          iconClassName="bg-amber-500/10 text-amber-400"
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60">
        <div className="border-b border-gray-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Productos con poco stock
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Ordenados del más urgente al menos urgente
          </p>
        </div>

        {alertasStock.length === 0 ? (
          <div className="flex items-center gap-2 px-5 py-8 text-sm text-gray-400">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Todos los productos tienen stock suficiente.
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {alertasStock.map((p) => {
              const ratio = Math.max(p.stock / p.min_stock, 0);
              const isCritical = ratio < CRITICAL_STOCK_RATIO;

              return (
                <li
                  key={p.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-5 py-3.5 sm:grid-cols-[1fr_10rem_6rem_4.5rem]"
                >
                  <span className="truncate text-sm font-medium text-gray-200">
                    {p.name}
                  </span>
                  <div
                    className="order-last col-span-2 h-1.5 overflow-hidden rounded-full bg-gray-800 sm:order-none sm:col-span-1"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full rounded-full ${isCritical ? "bg-red-500" : "bg-amber-500"}`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                  <span className="text-right text-sm tabular-nums text-gray-400">
                    {p.stock} / {p.min_stock} {p.unit}
                  </span>
                  <span
                    className={`hidden justify-self-end rounded-md px-2 py-0.5 text-xs font-medium sm:inline-block ${
                      isCritical
                        ? "bg-red-500/10 text-red-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {isCritical ? "Crítico" : "Bajo"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando panel"
      className="animate-pulse space-y-8"
    >
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-md bg-gray-800" />
        <div className="h-4 w-40 rounded-md bg-gray-800/60" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-33 rounded-xl bg-gray-900" />
        ))}
      </div>
      <div className="h-56 rounded-xl bg-gray-900" />
    </div>
  );
}
