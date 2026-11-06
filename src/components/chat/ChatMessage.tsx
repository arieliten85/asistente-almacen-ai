"use client";

import { Message } from "ai";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";
  const content = typeof message.content === "string" ? message.content : "";

  return (
    <div className={cn("flex gap-3 items-start", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          isUser ? "bg-gray-700" : "bg-blue-600"
        )}
      >
        {isUser ? (
          <User size={14} className="text-gray-300" />
        ) : (
          <Bot size={14} className="text-white" />
        )}
      </div>

      {/* Burbuja */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3 text-sm",
          isUser
            ? "bg-blue-600 text-white whitespace-pre-wrap"
            : "bg-gray-800 text-gray-200"
        )}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Tablas
              table: ({ children }) => (
                <div className="overflow-x-auto my-2">
                  <table className="w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b border-gray-600">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="text-left px-3 py-1.5 text-gray-400 font-medium whitespace-nowrap">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-1.5 border-b border-gray-700/50 text-gray-300">
                  {children}
                </td>
              ),
              // Párrafos y listas
              p: ({ children }) => <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="my-1 space-y-0.5 list-none">{children}</ul>,
              li: ({ children }) => <li className="flex gap-1.5 before:content-['→'] before:text-gray-500 before:shrink-0">{children}</li>,
              // Código inline
              code: ({ children }) => (
                <code className="bg-gray-700/60 rounded px-1 py-0.5 text-xs font-mono text-blue-300">
                  {children}
                </code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
