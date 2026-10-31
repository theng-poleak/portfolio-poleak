import { z } from "zod";

export const FEEDBACK_MAX_LENGTH = 2000;

export const feedbackSchema = z.object({
  message: z.string().trim().min(1, "Please enter a message.").max(FEEDBACK_MAX_LENGTH),
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.email("Please enter a valid email.").optional(),
  ),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
