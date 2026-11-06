import { Suspense } from "react";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    // Alto fijo al viewport: 57px del header + 48px del padding de main
    <div className="h-[calc(100dvh-105px)]">
      <h1 className="sr-only">Asistente IA</h1>
      <Suspense
        fallback={
          <div className="surface h-full rounded-2xl animate-pulse" />
        }
      >
        <ChatWindow />
      </Suspense>
    </div>
  );
}
