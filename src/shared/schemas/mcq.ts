import { z } from "zod"
import {BaseQuestionSchema,QuestionTypes} from '@/shared/schemas/base-question';

export const MCQQuestionSchema = BaseQuestionSchema.extend({
  
  type: z.literal(QuestionTypes.MCQ),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()).length(1),  // exactly one correct answer
})


// Infer type for MCQ question
export type MCQQuestion = z.infer<typeof MCQQuestionSchema>;
