import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  DollarSign,
  PackageSearch,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface Suggestion {
  icon: LucideIcon;
  question: string;
}

// Preguntas predefinidas (hardcodeadas)
const SUGGESTIONS: Suggestion[] = [
  { icon: PackageSearch, question: "¿Qué productos tienen poco stock?" },
  { icon: DollarSign, question: "¿Cuánto vendimos hoy?" },
  { icon: Search, question: "Buscar yerba mate" },
  { icon: CalendarDays, question: "¿Cuáles fueron las ventas de esta semana?" },
  { icon: TrendingUp, question: "¿Qué se vende más?" },
];

interface Props {
  onSelect: (question: string) => void;
}

export default function ChatWelcome({ onSelect }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 text-center">
      {/* Logo con halo */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-blue-500/40 blur-xl" aria-hidden="true" />
        <Image
          src="/logo-comerzia.png"
          alt=""
          width={72}
          height={72}
          priority
          className="relative rounded-2xl ring-1 ring-blue-400/40"
        />
      </div>

      {/* Presentación */}
      <h2 className="text-3xl tracking-tight text-white">
        <span className="font-normal text-gray-300">¡Hola!</span>{" "}
        <span className="font-semibold">Soy Almi</span>
      </h2>
      <p className="mt-2 text-base text-gray-400">
        Tu asistente inteligente. ¿En qué puedo ayudarte hoy?
      </p>

      {/* Preguntas sugeridas: cada una mide lo que su texto, sin saltos de línea */}
      <div className="mt-7 flex max-w-4xl flex-wrap justify-center gap-3">
        {SUGGESTIONS.map(({ icon: Icon, question }) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="group flex items-center gap-2.5 rounded-xl border border-blue-500/25 bg-blue-950/40 px-4 py-2.5 text-sm text-gray-100 transition-colors hover:border-blue-400/60 hover:bg-blue-900/40 sm:whitespace-nowrap"
          >
            <Icon size={18} className="shrink-0 text-blue-400" />
            {question}
            <ChevronRight
              size={16}
              className="shrink-0 text-blue-400/70 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
