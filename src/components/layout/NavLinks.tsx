"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles } from "lucide-react";

const LINKS = [
  { href: "/panel", label: "Panel", icon: LayoutDashboard },
  { href: "/chat", label: "Asistente", icon: Sparkles },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isActive
                ? "bg-blue-500/15 text-white ring-1 ring-blue-500/30"
                : "text-gray-400 hover:bg-blue-500/10 hover:text-white"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
