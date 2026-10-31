"use client";

import { useChat } from "@ai-sdk/react";
import { SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatError } from "@/components/chat/chat-error";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage, ThinkingIndicator } from "@/components/chat/chat-message";
import { getMessageText, useChatSession } from "@/components/chat/chat-session";
import { TypingGreeting } from "@/components/chat/typing-greeting";
import { Button } from "@/components/ui/button";

const SUGGESTED_QUESTIONS = [
  "Who are you?",
  "What are you working on now?",
  "What do you focus on?",
  "Are you available for freelance work?",
];

const STICK_TO_BOTTOM_THRESHOLD = 48;

export function ChatView({ greetings }: { greetings: string[] }) {
  const { chat, resetChat } = useChatSession();
  const { messages, sendMessage, regenerate, stop, status, error } = useChat({ chat });
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);

  const isEmpty = messages.length === 0;
  const busy = status === "submitted" || status === "streaming";
  const lastMessage = messages.at(-1);
  const isThinking =
    busy && (lastMessage?.role !== "assistant" || !getMessageText(lastMessage));

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller && stickToBottom.current) {
      scroller.scrollTop = scroller.scrollHeight;
    }
  }, [messages, status, error]);

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const distance = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    stickToBottom.current = distance < STICK_TO_BOTTOM_THRESHOLD;
  }

  function send(text: string) {
    stickToBottom.current = true;
    setInput("");
    void sendMessage({ text: text.trim() });
    inputRef.current?.focus();
  }

  function handleNewChat() {
    resetChat();
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex h-full flex-col">
      {isEmpty ? (
        <div className="flex flex-1 flex-col justify-end px-4 pb-6 text-center">
          <TypingGreeting greetings={greetings} />
        </div>
      ) : (
        <>
          <h1 className="sr-only">Chat</h1>
          <div className="flex h-12 shrink-0 items-center justify-end px-3">
            <Button type="button" variant="ghost" size="sm" onClick={handleNewChat}>
              <SquarePen aria-hidden="true" />
              New chat
            </Button>
          </div>
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <div
              role="log"
              aria-label="Conversation"
              aria-live="polite"
              className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-2 pb-6"
            >
              {messages.map((message) =>
                message.role === "system" ? null : (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    text={getMessageText(message)}
                  />
                ),
              )}
              {isThinking && <ThinkingIndicator />}
              {error && <ChatError error={error} onRetry={() => void regenerate()} />}
            </div>
          </div>
        </>
      )}

      <div className="mx-auto w-full max-w-3xl shrink-0 px-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={() => send(input)}
          onStop={() => void stop()}
          busy={busy}
          inputRef={inputRef}
        />
      </div>

      {isEmpty ? (
        <div className="flex-1 px-4 pt-4">
          <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
            {SUGGESTED_QUESTIONS.map((question) => (
              <li key={question}>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto rounded-full px-4 py-2 font-normal whitespace-normal"
                  onClick={() => send(question)}
                >
                  {question}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="shrink-0 px-4 py-2 text-center text-xs text-muted-foreground">
          AI answers can be wrong. Check the other pages for the details.
        </p>
      )}
    </div>
  );
}
