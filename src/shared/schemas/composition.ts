import { z } from "zod";

export const CompositionQuestionSchema = z.object({
  id: z.string(),
  answer: z.string(),
  content: z.string(),
  createdAt: z.date(),
  elements: z.array(z.string()),
  type: z.string(),
  updatedAt: z.date(),
});

export type CompositionQuestion = z.infer<typeof CompositionQuestionSchema>;
