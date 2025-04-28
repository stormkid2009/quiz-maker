import { z } from "zod";
import {BaseQuestionSchema,QuestionTypes } from "@/shared/schemas/base-question";


export const OpenEndedQuestionSchema = BaseQuestionSchema.extend({
  type:z.literal(QuestionTypes.OPEN_ENDED),
  elements: z.array(z.string()),
  answer: z.string(),
});

// Infer type for Open-Ended question
export type OpenEndedQuestion = z.infer<typeof OpenEndedQuestionSchema>;
