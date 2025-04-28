import { z } from "zod";
import {BaseQuestionSchema , QuestionTypes } from "@/shared/schemas/base-question";


export const MultiMCQQuestionSchema = BaseQuestionSchema.extend({
  type:z.literal(QuestionTypes.MULTI_MCQ),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()).length(2),
});

// Infer type for Multi-MCQ question
export type MultiMCQuestion = z.infer<typeof MultiMCQQuestionSchema>;
