import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type ModelMessage,
} from "ai";

import { getEnv, requireEnv } from "@/lib/env";
import { buildSystemPrompt } from "@/lib/prompt";
import {
  chatGlobalPolicy,
  chatPerIpPolicy,
  checkRateLimit,
  getClientIp,
} from "@/lib/rate-limit";
import { chatRequestSchema, type ChatRequestMessage } from "@/lib/schemas";

export const maxDuration = 30;

const MAX_OUTPUT_TOKENS = 500;

function errorResponse(message: string, status: number, retryAfterSeconds?: number) {
  return Response.json(
    { error: message },
    {
      status,
      headers: retryAfterSeconds
        ? { "Retry-After": String(retryAfterSeconds) }
        : undefined,
    },
  );
}

/** The API requires the conversation to start with a user turn, which trimming history can break. */
function toModelMessages(messages: ChatRequestMessage[]): ModelMessage[] {
  const firstUserTurn = messages.findIndex((message) => message.role === "user");
  return messages.slice(firstUserTurn).map(({ role, text }) => ({ role, content: text }));
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("That message couldn't be processed.", 400);
  }

  if (!getEnv().GEMINI_API_KEY) {
    return errorResponse(
      "The chat assistant isn't set up yet. Please try again later.",
      503,
    );
  }

  try {
    const perIp = await checkRateLimit(chatPerIpPolicy, getClientIp(request));
    if (!perIp.allowed) {
      return errorResponse(
        "You've reached the hourly message limit. Please come back a bit later, or use the Contact page.",
        429,
        perIp.retryAfterSeconds,
      );
    }

    const global = await checkRateLimit(chatGlobalPolicy(), "all");
    if (!global.allowed) {
      return errorResponse(
        "The assistant has reached its daily limit. Please come back tomorrow, or use the Contact page.",
        429,
        global.retryAfterSeconds,
      );
    }
  } catch {
    return errorResponse(
      "The chat assistant is unavailable. Please try again later.",
      503,
    );
  }

  const google = createGoogleGenerativeAI({ apiKey: requireEnv("GEMINI_API_KEY") });

  const result = streamText({
    model: google(getEnv().GEMINI_MODEL),
    instructions: buildSystemPrompt(),
    messages: toModelMessages(parsed.data.messages),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    abortSignal: request.signal,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
