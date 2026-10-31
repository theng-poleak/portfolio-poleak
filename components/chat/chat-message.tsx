import { Markdown } from "@/components/markdown";

type ChatMessageProps = {
  role: "user" | "assistant";
  text: string;
};

export function ChatMessage({ role, text }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-3xl bg-secondary px-4 py-2.5 leading-7 wrap-anywhere whitespace-pre-wrap text-secondary-foreground">
          <span className="sr-only">You said: </span>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div>
      <span className="sr-only">Assistant said: </span>
      <Markdown source={text} />
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div role="status" aria-label="Thinking" className="flex h-7 items-center gap-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="size-2 animate-pulse rounded-full bg-muted-foreground"
        />
      ))}
    </div>
  );
}
