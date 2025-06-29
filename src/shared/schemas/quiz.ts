/**
 * Zod schemas for quiz structures.
 *
 * Defines schemas for basic, fixed-structure, and configurable quizzes.
 * @file src/shared/schemas/quiz.ts
 */
import { z } from "zod";
import { MCQQuestionSchema } from "./mcq";
import { MultiMCQQuestionSchema } from "./multi-mcq";
import { ReadingComprehensionQuestionSchema } from "./rc";
import { OpenEndedQuestionSchema } from "./open-ended";
import { QuestionSchema, type Question } from "./question";

/**
 * Basic quiz schema: validates an object with a questions array of any Question type.
 *
 * @constant {import("zod").ZodObject}
 */
export const BasicQuizSchema = z.object({
  questions: z.array(QuestionSchema),
});

/**
 * Fixed-structure quiz schema: validates an object with questions tuple in specific order:
 *   [ReadingComprehension, MultiMCQ, MCQ, OpenEnded].
 *
 * @constant {import("zod").ZodObject}
 */
export const FixedStructureQuizSchema = z.object({
  questions: z.tuple([
    ReadingComprehensionQuestionSchema,
    MultiMCQQuestionSchema,
    MCQQuestionSchema,
    OpenEndedQuestionSchema,
  ]),
});

/**
 * Configurable quiz schema: validates an object with optional metadata and questions.
 * Ensures at least one question and supports optional title, description,
 * timeLimit (minutes), passingScore (percentage), createdAt, and updatedAt.
 *
 * @constant {import("zod").ZodObject}
 */
export const ConfigurableQuizSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  questions: z.array(QuestionSchema).min(1),
  timeLimit: z.number().positive().optional(), // in minutes
  passingScore: z.number().min(0).max(100).optional(), // percentage
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Export types
export type BasicQuiz = z.infer<typeof BasicQuizSchema>;
export type FixedStructureQuiz = z.infer<typeof FixedStructureQuizSchema>;
export type ConfigurableQuiz = z.infer<typeof ConfigurableQuizSchema>;

// Default export for backward compatibility
export type Quiz = BasicQuiz;
export const QuizSchema = BasicQuizSchema;
