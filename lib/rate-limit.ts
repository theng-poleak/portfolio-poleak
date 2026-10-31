import "server-only";

import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getEnv, isProduction } from "@/lib/env";

type RateLimitPolicy = {
  prefix: string;
  limit: number;
  window: Duration;
  windowMs: number;
  algorithm: "sliding" | "fixed";
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export const chatPerIpPolicy: RateLimitPolicy = {
  prefix: "ratelimit:chat:ip",
  limit: 10,
  window: "1 h",
  windowMs: HOUR_MS,
  algorithm: "sliding",
};

export function chatGlobalPolicy(): RateLimitPolicy {
  return {
    prefix: "ratelimit:chat:global",
    limit: getEnv().CHAT_DAILY_LIMIT,
    window: "1 d",
    windowMs: DAY_MS,
    algorithm: "fixed",
  };
}

export const feedbackPerIpPolicy: RateLimitPolicy = {
  prefix: "ratelimit:feedback:ip",
  limit: 5,
  window: "1 h",
  windowMs: HOUR_MS,
  algorithm: "sliding",
};

const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(policy: RateLimitPolicy): Ratelimit | undefined {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = getEnv();
  if (!url || !token) return undefined;

  let limiter = upstashLimiters.get(policy.prefix);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      prefix: policy.prefix,
      limiter:
        policy.algorithm === "sliding"
          ? Ratelimit.slidingWindow(policy.limit, policy.window)
          : Ratelimit.fixedWindow(policy.limit, policy.window),
    });
    upstashLimiters.set(policy.prefix, limiter);
  }
  return limiter;
}

const memoryWindows = new Map<string, { count: number; resetAt: number }>();

function checkMemoryLimit(policy: RateLimitPolicy, identifier: string): RateLimitResult {
  const key = `${policy.prefix}:${identifier}`;
  const now = Date.now();
  const current = memoryWindows.get(key);
  const window =
    current && current.resetAt > now
      ? current
      : { count: 0, resetAt: now + policy.windowMs };

  window.count += 1;
  memoryWindows.set(key, window);

  return {
    allowed: window.count <= policy.limit,
    retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000),
  };
}

/** Throws in production when Upstash is not configured, so routes fail closed. */
export async function checkRateLimit(
  policy: RateLimitPolicy,
  identifier: string,
): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(policy);

  if (limiter) {
    const { success, reset } = await limiter.limit(identifier);
    return {
      allowed: success,
      retryAfterSeconds: Math.max(Math.ceil((reset - Date.now()) / 1000), 1),
    };
  }

  if (isProduction()) {
    throw new Error("Rate limiting requires the Upstash environment variables");
  }
  return checkMemoryLimit(policy, identifier);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
