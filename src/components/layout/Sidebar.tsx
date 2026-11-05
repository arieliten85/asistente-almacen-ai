"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Package, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Panel",
    href: "/panel",
    icon: LayoutDashboard,
  },
  {
    label: "Asistente",
    href: "/chat",
    icon: MessageSquare,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Almacén IA</p>
            <p className="text-xs text-gray-500">Panel de gestión</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShoppingCart size={14} />
          <span>Almacén Don Carlos</span>
        </div>
      </div>
    </aside>
  );
}
