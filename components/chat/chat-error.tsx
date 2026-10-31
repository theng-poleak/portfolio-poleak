import { APICallError } from "ai";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

const GENERIC_ERROR = "Something went wrong while answering. Please try again.";

function describeError(error: Error) {
  if (!APICallError.isInstance(error)) {
    return { message: GENERIC_ERROR, canRetry: true };
  }

  let message = GENERIC_ERROR;
  try {
    const body: { error?: string } = JSON.parse(error.responseBody ?? "{}");
    message = body.error ?? GENERIC_ERROR;
  } catch {
    message = GENERIC_ERROR;
  }
  return { message, canRetry: error.statusCode !== 429 };
}

type ChatErrorProps = {
  error: Error;
  onRetry: () => void;
};

export function ChatError({ error, onRetry }: ChatErrorProps) {
  const { message, canRetry } = describeError(error);

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm"
    >
      <p>{message}</p>
      {canRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  );
}
