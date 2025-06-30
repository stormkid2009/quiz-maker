/**
 * Schemas and types for single-answer multiple-choice (MCQ) questions.
 */
import { z } from "zod";
import { BaseQuestionSchema, QuestionTypes } from "./base-question";

/**
 * Zod schema and TypeScript type for single-answer MCQ questions.
 *
 * Extends BaseQuestionSchema to include:
 *   - type: literal indicating MCQ.
 *   - options: array of option strings.
 *   - rightAnswer: array with exactly one correct answer key.
 *
 * @constant {import("zod").ZodObject}
 */
export const MCQQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionTypes.MCQ),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()).length(1), // exactly one correct answer
});

/**
 * Type inferred from MCQQuestionSchema.
 *
 * Represents a single-answer multiple-choice question.
 */
export type MCQQuestion = z.infer<typeof MCQQuestionSchema>;
