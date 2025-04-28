import { z } from "zod"
import { MCQQuestionSchema } from "./mcq";
import { MultiMCQQuestionSchema } from "./multi-mcq";
import { ReadingComprehensionQuestionSchema } from "./rc";
import { OpenEndedQuestionSchema } from "./open-ended";
import {GeneralQuestionSchema , type GneralQuestion } from "./general-question";


// Basic quiz schema - array of questions
export const BasicQuizSchema = z.object({
  questions: z.array(GeneralQuestionSchema),
});

// Fixed structure quiz schema (if you need the original behavior)
export const FixedStructureQuizSchema = z.object({
  questions: z.tuple([
    ReadingComprehensionQuestionSchema,
    MultiMCQQuestionSchema,
    MCQQuestionSchema,
    OpenEndedQuestionSchema,
  ])
});

// Configurable quiz schema with min/max questions and optional metadata
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
