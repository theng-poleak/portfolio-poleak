import { Resend } from "resend";

import { getEnv, isProduction } from "@/lib/env";
import { checkRateLimit, feedbackPerIpPolicy, getClientIp } from "@/lib/rate-limit";
import { feedbackSchema } from "@/lib/schemas";

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

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    const [issue] = parsed.error.issues;
    return errorResponse(issue?.message ?? "Invalid feedback.", 400);
  }

  try {
    const { allowed, retryAfterSeconds } = await checkRateLimit(
      feedbackPerIpPolicy,
      getClientIp(request),
    );
    if (!allowed) {
      return errorResponse(
        "You've sent a lot of feedback already. Please try again later.",
        429,
        retryAfterSeconds,
      );
    }
  } catch {
    return errorResponse("Feedback is unavailable right now.", 503);
  }

  const { message, email } = parsed.data;
  const { RESEND_API_KEY, FEEDBACK_TO_EMAIL, FEEDBACK_FROM_EMAIL } = getEnv();

  if (!RESEND_API_KEY || !FEEDBACK_TO_EMAIL) {
    if (isProduction()) {
      return errorResponse("Feedback is unavailable right now.", 503);
    }
    console.log("[feedback]", { message, email });
    return Response.json({ ok: true });
  }

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: FEEDBACK_FROM_EMAIL,
    to: FEEDBACK_TO_EMAIL,
    replyTo: email,
    subject: "New portfolio feedback",
    text: `${message}\n\nFrom: ${email ?? "anonymous"}`,
  });

  if (error) {
    return errorResponse("Your feedback couldn't be sent. Please try again.", 502);
  }
  return Response.json({ ok: true });
}
