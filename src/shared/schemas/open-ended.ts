/**
 * Zod schema and TypeScript type for open-ended quiz questions.
 *
 * Extends BaseQuestionSchema to include:
 *   - type: literal indicating an open-ended question.
 *   - elements: array of string elements relevant to the question.
 *   - answer: the expected answer string.
 *
 * @constant {import("zod").ZodObject}
 */
import { z } from "zod";
import {
  BaseQuestionSchema,
  QuestionTypes,
} from "@/shared/schemas/base-question";

/**
 * Zod schema and TypeScript type for open-ended quiz questions.
 *
 * Extends BaseQuestionSchema to include:
 *   - type: literal indicating an open-ended question.
 *   - elements: array of string elements relevant to the question.
 *   - answer: the expected answer string.
 *
 * @constant {import("zod").ZodObject}
 */
export const OpenEndedQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionTypes.OPEN_ENDED),
  elements: z.array(z.string()),
  answer: z.string(),
});

/**
 * Type inferred from OpenEndedQuestionSchema.
 *
 * Represents an open-ended question with customizable elements and answer.
 */
export type OpenEndedQuestion = z.infer<typeof OpenEndedQuestionSchema>;
