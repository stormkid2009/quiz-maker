/**
 * Shared Zod schemas and TypeScript types for base question structure.
 * Includes definitions for question types and base question validation.
 */
import { z } from "zod";

/**
 * Zod enum schema for supported question types.
 * @constant {import("zod").ZodEnum}
 */
export const QuestionTypesSchema = z.enum([
  "MCQ",
  "Multi-MCQ",
  "Open-Ended",
  "RC",
]);

/**
 * TypeScript type for valid question types inferred from QuestionTypesSchema.
 */
export type QuestionType = z.infer<typeof QuestionTypesSchema>;

/**
 * Constant object mapping question type keys to literal values.
 * Ensures consistent usage of question type strings across the codebase.
 */
export const QuestionTypes = {
  MCQ: "MCQ",
  MULTI_MCQ: "Multi-MCQ",
  OPEN_ENDED: "Open-Ended",
  RC: "RC",
} as const;

/**
 * Zod object schema for the base question fields.
 * @constant {import("zod").ZodObject}
 */
export const BaseQuestionSchema = z.object({
  id: z.string(),
  content: z.string(),
  type: QuestionTypesSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * TypeScript type inferred from BaseQuestionSchema.
 * Represents the minimal set of fields for any quiz question.
 */
export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;
