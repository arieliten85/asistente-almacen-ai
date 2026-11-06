"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, RotateCcw } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatWelcome from "./ChatWelcome";
import { cn } from "@/lib/utils";

export default function ChatWindow() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setMessages,
    setInput,
    stop,
  } = useChat({ api: "/api/chat" });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  // Corta la respuesta en curso y vuelve a la pantalla inicial
  function handleReset() {
    stop();
    setMessages([]);
    setInput("");
  }

  return (
    <div className="surface h-full rounded-2xl flex flex-col overflow-hidden">
      {/* Barra superior: solo con conversación iniciada */}
      {!isEmpty && (
        <div className="relative flex justify-end border-b border-blue-500/20 px-4 py-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <RotateCcw size={14} />
            Nueva conversación
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
        {isEmpty ? (
          <ChatWelcome onSelect={(q) => append({ role: "user", content: q })} />
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <Loader2 size={16} className="text-gray-500 animate-spin" />
            </div>
          </div>
        )}

        {!isEmpty && <div ref={bottomRef} />}
      </div>

      {/* Input */}
      <div className="relative p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
           
          <div className="relative flex-1">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Preguntá algo sobre tu negocio..."
              disabled={isLoading}
              className="h-14 w-full rounded-full bg-field pl-6 pr-20 text-base text-gray-900 caret-blue-600 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70"
            />
            <span className="absolute right-15 top-1/2 h-6 w-px -translate-y-1/2 bg-gray-400" aria-hidden="true" />
            <button
              type="submit"
              aria-label="Enviar"
              disabled={isLoading || !input.trim()}
              className={cn(
                "absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors",
                isLoading || !input.trim()
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              )}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
