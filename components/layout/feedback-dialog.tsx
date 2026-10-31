"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState, type ComponentProps, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FEEDBACK_MAX_LENGTH } from "@/lib/schemas";

type FeedbackDialogProps = Pick<ComponentProps<typeof Dialog>, "open" | "onOpenChange"> &
  Pick<ComponentProps<typeof DialogContent>, "onCloseAutoFocus">;

type FormStatus = "idle" | "sending" | "sent" | "error";

export function FeedbackDialog({
  open,
  onOpenChange,
  onCloseAutoFocus,
}: FeedbackDialogProps) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  function handleOpenChange(next: boolean) {
    if (!next && status === "sent") {
      setMessage("");
      setEmail("");
      setStatus("idle");
    }
    onOpenChange?.(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email }),
      });
      if (!response.ok) {
        const body: { error?: string } = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>Spotted a bug or have a suggestion?</DialogDescription>
        </DialogHeader>

        {status === "sent" ? (
          <div
            role="status"
            className="flex flex-col items-center gap-2 py-6 text-center"
          >
            <CheckCircle2 className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium">Thanks for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                required
                rows={4}
                maxLength={FEEDBACK_MAX_LENGTH}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="feedback-email">Email (optional)</Label>
              <Input
                id="feedback-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {status === "error" && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" disabled={status === "sending" || !message.trim()}>
              {status === "sending" && (
                <Loader2 className="animate-spin" aria-hidden="true" />
              )}
              Send feedback
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
