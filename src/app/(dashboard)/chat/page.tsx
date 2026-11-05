import { Suspense } from "react";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6 pb-0">
        <h1 className="text-xl font-semibold text-white">Asistente IA</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Preguntá sobre stock, ventas o cualquier producto del almacén
        </p>
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <Suspense
          fallback={
            <div className="h-full bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
          }
        >
          <ChatWindow />
        </Suspense>
      </div>
    </div>
  );
}
