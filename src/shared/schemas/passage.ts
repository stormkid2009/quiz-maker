import { z } from "zod";

export const PassagesRelatedQuestionsSchema = z.object({
  id: z.string(),
  content: z.string(),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()),
  type: z.string(),
});

export type PassagesRelatedQuestions = z.infer<
  typeof PassagesRelatedQuestionsSchema
>;

export const PassageQuestionSchema = z.object({
  id: z.string(),
  // v: z.number(),
  createdAt: z.date(),
  passage: z.string(),
  relatedQuestions: z.array(PassagesRelatedQuestionsSchema),
  type: z.string(),
  updatedAt: z.date(),
});

export type PassageQuestion = z.infer<typeof PassageQuestionSchema>;
