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
  id: z.string(),
  content: z.string(),
  type: QuestionTypesSchema,
  createdAt: z.date(),
  updatedAt: z.date(), 
});

// Infer type for base question
// This is the base schema for all questions
export type BaseQuestion = z.infer<typeof BaseQuestionSchema>;

