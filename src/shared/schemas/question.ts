/**
 * Zod schema and TypeScript union for all quiz question variants.
 * Combines MCQ, Multi-MCQ, Open-Ended, and Reading Comprehension schemas.
 *
 * @file src/shared/schemas/question.ts
 */

import { z } from "zod";
import { MCQQuestionSchema } from "./mcq";
import { MultiMCQQuestionSchema } from "./multi-mcq";
import { OpenEndedQuestionSchema } from "./open-ended";
import { ReadingComprehensionQuestionSchema } from "./rc";

// Create a union type of all questions using discriminated union

/**
 * Zod schema for all quiz question variants.
 * Combines MCQ, Multi-MCQ, Open-Ended, and Reading Comprehension schemas.
 *
 * @constant {import("zod").ZodDiscriminatedUnion}
 */
export const QuestionSchema = z.discriminatedUnion("type", [
  MCQQuestionSchema,
  MultiMCQQuestionSchema,
  OpenEndedQuestionSchema,
  ReadingComprehensionQuestionSchema,
]);

/**
 * TypeScript type inferred from QuestionSchema.
 * Represents any quiz question variant.
 */
export type Question = z.infer<typeof QuestionSchema>;
