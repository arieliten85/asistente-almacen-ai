"use client";

import { Message } from "ai";
import { Sparkles, User } from "lucide-react";
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
          "w-7 h-7 flex items-center justify-center shrink-0 mt-0.5",
          isUser ? "rounded-full bg-gray-700" : "rounded-lg bg-blue-600"
        )}
      >
        {isUser ? (
          <User size={14} className="text-gray-300" />
        ) : (
          <Sparkles size={14} className="text-white" />
        )}
      </div>

      {/* Burbuja */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3 text-sm",
          isUser
            ? "bg-blue-600 text-white whitespace-pre-wrap"
            : "bg-white text-gray-800 border border-gray-200"
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
                <div className="overflow-x-auto my-3 rounded-lg border border-gray-200">
                  <table className="w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-100">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="text-left px-4 py-2 text-gray-900 font-semibold whitespace-nowrap border-b border-gray-200">
                  {children}
                </th>
              ),
              tr: ({ children, ...props }) => (
                <tr className="bg-white even:bg-blue-50 hover:bg-blue-100 transition-colors" {...props}>
                  {children}
                </tr>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-gray-800 border-b border-gray-100 last:border-b-0">
                  {children}
                </td>
              ),
              // Párrafos y listas
              p: ({ children }) => <p className="mb-1 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="my-1 space-y-0.5 list-none">{children}</ul>,
              li: ({ children }) => <li className="flex gap-1.5 before:content-['→'] before:text-gray-500 before:shrink-0">{children}</li>,
              // Código inline
              code: ({ children }) => (
                <code className="bg-gray-100 rounded px-1 py-0.5 text-xs font-mono text-blue-700">
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
