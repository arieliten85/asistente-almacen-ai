import Image from "next/image";
import NavLinks from "@/components/layout/NavLinks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      {/* Luces de fondo compartidas por todas las páginas */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-32 h-120 w-120 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-120 w-120 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-blue-500/20 bg-gray-950/80 backdrop-blur">
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-6">
          <Image
            src="/logo.png"
            alt="Almi"
            width={54}
            height={36}
            priority
          />
          <div className="h-5 w-px bg-blue-500/20" aria-hidden="true" />
          <NavLinks />
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-6xl flex-1 p-6">{children}</main>
    </div>
  );
}
