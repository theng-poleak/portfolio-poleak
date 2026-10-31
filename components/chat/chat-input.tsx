"use client";

import { ArrowUp, Square } from "lucide-react";
import type { FormEvent, KeyboardEvent, RefObject } from "react";

import { Button } from "@/components/ui/button";
import { CHAT_MESSAGE_MAX_LENGTH } from "@/lib/schemas";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  busy: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  busy,
  inputRef,
}: ChatInputProps) {
  const canSend = value.trim().length > 0 && !busy;
  const remaining = CHAT_MESSAGE_MAX_LENGTH - value.length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSend) onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (canSend) onSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 rounded-3xl border border-input bg-card p-2 pl-4 shadow-xs transition-colors focus-within:border-ring"
    >
      <textarea
        ref={inputRef}
        rows={1}
        value={value}
        maxLength={CHAT_MESSAGE_MAX_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything"
        aria-label="Message"
        className="field-sizing-content max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-base outline-none placeholder:text-muted-foreground"
      />
      {remaining <= 50 && (
        <span
          aria-live="polite"
          className="self-center text-xs text-muted-foreground tabular-nums"
        >
          {remaining}
        </span>
      )}
      {busy ? (
        <Button
          type="button"
          size="icon"
          aria-label="Stop generating"
          className="shrink-0 rounded-full"
          onClick={onStop}
        >
          <Square className="fill-current" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={!canSend}
          className="shrink-0 rounded-full"
        >
          <ArrowUp />
        </Button>
      )}
    </form>
  );
}
