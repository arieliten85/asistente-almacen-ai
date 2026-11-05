import { Package } from "lucide-react";
import NavLinks from "@/components/layout/NavLinks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Package size={14} className="text-white" />
            </div>
            <span className="whitespace-nowrap text-sm font-semibold text-white">
              Almacén IA
            </span>
          </div>
          <div className="h-5 w-px bg-gray-800" aria-hidden="true" />
          <NavLinks />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 p-6">{children}</main>
    </div>
  );
}
