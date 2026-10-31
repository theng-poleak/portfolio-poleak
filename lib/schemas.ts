import { z } from "zod";

export const CHAT_MESSAGE_MAX_LENGTH = 500;
export const CHAT_HISTORY_LIMIT = 10;
const CHAT_REPLY_MAX_LENGTH = 6000;

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({
          role: z.literal("user"),
          text: z.string().trim().min(1).max(CHAT_MESSAGE_MAX_LENGTH),
        }),
        z.object({
          role: z.literal("assistant"),
          text: z.string().trim().min(1).max(CHAT_REPLY_MAX_LENGTH),
        }),
      ]),
    )
    .min(1)
    .max(CHAT_HISTORY_LIMIT)
    .refine((messages) => messages.at(-1)?.role === "user", {
      message: "The last message must come from the user.",
    }),
});

export type ChatRequestMessage = z.infer<typeof chatRequestSchema>["messages"][number];

export const FEEDBACK_MAX_LENGTH = 2000;

export const feedbackSchema = z.object({
  message: z.string().trim().min(1, "Please enter a message.").max(FEEDBACK_MAX_LENGTH),
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.email("Please enter a valid email.").optional(),
  ),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
