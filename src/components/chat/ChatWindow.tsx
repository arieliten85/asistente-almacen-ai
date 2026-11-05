"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "¿Qué productos tienen poco stock?",
  "¿Cuánto vendimos hoy?",
  "Buscar yerba mate",
  "¿Cuáles fueron las ventas de esta semana?",
];

export default function ChatWindow() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: "/api/chat" });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="h-full bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4">
              <Bot size={24} className="text-blue-400" />
            </div>
            <h2 className="text-base font-medium text-white mb-1">
              Asistente del almacén
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Consultá stock, ventas y productos en lenguaje natural.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    handleInputChange({ target: { value: s } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg px-3 py-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-gray-800 rounded-xl px-4 py-3">
              <Loader2 size={16} className="text-gray-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Preguntá algo sobre el almacén..."
            disabled={isLoading}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
              isLoading || !input.trim()
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            )}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
