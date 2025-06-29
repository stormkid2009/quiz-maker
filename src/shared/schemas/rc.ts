/**
 * Schemas and types for reading comprehension (RC) questions.
 */
import { z } from "zod";
import { QuestionTypes } from "./base-question";

// we will not use schema.extend here
// because using it with big object like our case with reading comprehension
// which contain array of relatedQuestions
// will lead to validation error with zod

/**
 * Zod schema for passage-related multiple choice questions.
 *
 * Validates objects with:
 *   - content: question prompt text.
 *   - options: array of at least 2 possible answers.
 *   - rightAnswer: array with exactly 1 correct answer key.
 *   - type: literal value indicating MCQ type.
 *
 * @constant {import("zod").ZodObject}
 */
export const RelatedQuestionSchema = z.object({
  content: z.string(),
  options: z.array(z.string()).min(2), // At least 2 options for multiple choice
  rightAnswer: z.array(z.string()).length(1), // Single correct answer for MCQ
  type: z.literal(QuestionTypes.MCQ), // Must be MCQ type
});

/**
 * Zod schema for reading comprehension questions.
 *
 * Validates objects with:
 *   - id: unique question identifier.
 *   - passage: the passage text.
 *   - type: literal value indicating RC type.
 *   - relatedQuestions: array of RelatedQuestionSchema.
 *   - createdAt: Date timestamp.
 *   - updatedAt: Date timestamp.
 *
 * @constant {import("zod").ZodObject}
 */
export const ReadingComprehensionQuestionSchema = z.object({
  id: z.string(),
  passage: z.string(),
  type: z.literal(QuestionTypes.RC),
  relatedQuestions: z.array(RelatedQuestionSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type inferred from RelatedQuestionSchema.
 *
 * Represents a single related multiple choice question.
 */
export type RelatedQuestion = z.infer<typeof RelatedQuestionSchema>;

/**
 * Type inferred from ReadingComprehensionQuestionSchema.
 *
 * Represents a reading comprehension question with nested related questions.
 */
export type ReadingComprehensionQuestion = z.infer<
  typeof ReadingComprehensionQuestionSchema
>;
