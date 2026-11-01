import "server-only";

import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  GEMINI_API_KEY: optionalString,
  GEMINI_MODEL: optionalString.transform((value) => value ?? "gemini-3.5-flash-lite"),
  UPSTASH_REDIS_REST_URL: optionalString,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
  CHAT_DAILY_LIMIT: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number().int().positive().default(200),
  ),
  RESEND_API_KEY: optionalString,
  FEEDBACK_TO_EMAIL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.email().optional(),
  ),
  FEEDBACK_FROM_EMAIL: optionalString.transform(
    (value) => value ?? "Portfolio Feedback <onboarding@resend.dev>",
  ),
});

type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

/** Parses the environment once. All variables are optional at this level. */
export function getEnv(): Env {
  cached ??= envSchema.parse(process.env);
  return cached;
}

/** Reads a variable that a feature cannot work without, at the point of use. */
export function requireEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = getEnv()[key];
  if (value === undefined || value === null) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value as NonNullable<Env[K]>;
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}
