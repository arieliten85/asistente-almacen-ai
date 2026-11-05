import Link from "next/link";
import { Package } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Almacén IA</span>
        </div>
        <Link
          href="/panel"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Panel
        </Link>
        <Link
          href="/chat"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Asistente
        </Link>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
