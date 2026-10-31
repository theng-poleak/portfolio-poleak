"use client";

import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CHAT_HISTORY_LIMIT, type ChatRequestMessage } from "@/lib/schemas";

export function getMessageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

function toRequestMessages(messages: UIMessage[]): ChatRequestMessage[] {
  return messages
    .flatMap((message): ChatRequestMessage[] => {
      const text = getMessageText(message).trim();
      const { role } = message;
      return text && role !== "system" ? [{ role, text }] : [];
    })
    .slice(-CHAT_HISTORY_LIMIT);
}

function createChat() {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { messages: toRequestMessages(messages) },
      }),
    }),
  });
}

type ChatSession = {
  chat: Chat<UIMessage>;
  resetChat: () => void;
};

const ChatSessionContext = createContext<ChatSession | null>(null);

/** Keeps the conversation in client state across page navigation. */
export function ChatSessionProvider({ children }: { children: ReactNode }) {
  const [chat, setChat] = useState(createChat);

  const resetChat = useCallback(() => {
    setChat((current) => {
      void current.stop();
      return createChat();
    });
  }, []);

  const value = useMemo(() => ({ chat, resetChat }), [chat, resetChat]);

  return <ChatSessionContext value={value}>{children}</ChatSessionContext>;
}

export function useChatSession(): ChatSession {
  const session = useContext(ChatSessionContext);
  if (!session) {
    throw new Error("useChatSession must be used inside ChatSessionProvider");
  }
  return session;
}
