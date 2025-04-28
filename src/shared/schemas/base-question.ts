import { z } from "zod";

// Define question types as a Zod enum
export const QuestionTypesSchema = z.enum([
  "MCQ", 
  "Multi-MCQ", 
  "Open-Ended", 
  "RC"
]);

export type QuestionType = z.infer<typeof QuestionTypesSchema>;

export const QuestionTypes = {
  MCQ: "MCQ",
  MULTI_MCQ: "Multi-MCQ",
  OPEN_ENDED: "Open-Ended",
  RC: "RC"
} as const;

// Base question schema
export const BaseQuestionSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  type: QuestionTypesSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
/*
// MCQ Question schema extends the base
export const MCQQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionTypes.MCQ),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()).length(1), // Exactly one correct answer
});

// Multi-select MCQ Question schema
export const MultiMCQQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionTypes.MULTI_MCQ),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()), // Multiple correct answers
});

// Open-ended Question schema
export const OpenEndedQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionTypes.OPEN_ENDED),
  elements: z.array(z.string()), 
  answer: z.string(),
});

// Passage-related question schema (not extending base since it's slightly different)
export const PassageRelatedQuestionSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Reading Comprehension Question schema
export const ReadingComprehensionQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal(QuestionTypes.RC),
  passage: z.string(),
  relatedQuestions: z.array(PassageRelatedQuestionSchema),
});

// Create a union type of all question types using discriminated union
export const QuestionSchema = z.discriminatedUnion("type", [
  MCQQuestionSchema,
  MultiMCQQuestionSchema,
  OpenEndedQuestionSchema,
  ReadingComprehensionQuestionSchema,
]);

// Infer types from schemas
export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;
export type MCQQuestion = z.infer<typeof MCQQuestionSchema>;
export type MultiMCQQuestion = z.infer<typeof MultiMCQQuestionSchema>;
export type OpenEndedQuestion = z.infer<typeof OpenEndedQuestionSchema>;
export type PassageRelatedQuestion = z.infer<typeof PassageRelatedQuestionSchema>;
export type ReadingComprehensionQuestion = z.infer<typeof ReadingComprehensionQuestionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
*/
