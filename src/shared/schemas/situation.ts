import { z } from "zod";

export const SituationQuestionSchema = z.object({
  id: z.string(),
  // v: z.number(),
  content: z.string(),
  createdAt: z.date(),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()),
  type: z.string(),
  updatedAt: z.date(),
});

export type SituationQuestion = z.infer<typeof SituationQuestionSchema>;
