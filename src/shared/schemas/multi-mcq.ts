import { z } from "zod";
import {
  BaseQuestionSchema,
  QuestionTypes,
} from "@/shared/schemas/base-question";

/**
 * Zod schema and TypeScript type for multi-answer MCQ questions.
 *
 * Extends BaseQuestionSchema to include:
 *   - type: literal indicating a multi-MCQ question.
 *   - options: array of possible answer strings.
 *   - rightAnswer: array with exactly two correct answer keys.
 *
 * @constant {import("zod").ZodObject}
 */
export const MultiMCQQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionTypes.MULTI_MCQ),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()).length(2),
});

/**
 * Type inferred from MultiMCQQuestionSchema.
 *
 * Represents a multi-answer multiple-choice question.
 */
export type MultiMCQuestion = z.infer<typeof MultiMCQQuestionSchema>;
