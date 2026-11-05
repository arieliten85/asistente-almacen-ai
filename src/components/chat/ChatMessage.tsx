"use client";

import { Message } from "ai";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

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
          "max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap",
          isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
        )}
      >
        {typeof message.content === "string" ? message.content : ""}
      </div>
    </div>
  );
}
