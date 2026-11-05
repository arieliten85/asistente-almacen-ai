"use client";

import { Message } from "ai";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 items-start",
        isUser && "flex-row-reverse"
      )}
    >
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

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3 text-sm",
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-gray-800 text-gray-200 rounded-tl-sm"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-white">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-300">{children}</li>
              ),
              code: ({ children }) => (
                <code className="bg-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {typeof message.content === "string" ? message.content : ""}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
