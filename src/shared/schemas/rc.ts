import { z } from "zod";
import { QuestionTypes } from "./base-question";


// we will not use schema.extend here
// because using it with big object like our case with reading comprehension
// which contain array of relatedQuestions 
// will lead to validation error with zod



// Define schema to match your Prisma PassageRelatedQuestion type
export const RelatedQuestionSchema = z.object({
  content: z.string(),
  options: z.array(z.string()).min(2), // At least 2 options for multiple choice
  rightAnswer: z.array(z.string()).length(1), // Single correct answer for MCQ
  type: z.literal(QuestionTypes.MCQ) // Must be MCQ type
});

// Define schema to match your Prisma Passage model
export const ReadingComprehensionQuestionSchema = z.object({
  id: z.string(),
  passage: z.string(),
  type: z.literal(QuestionTypes.RC),
  relatedQuestions: z.array(RelatedQuestionSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});


// Infer type for RelatedQuestion
// and ReadingComprehensionQuestion
export type RelatedQuestion = z.infer<typeof RelatedQuestionSchema>;
export type ReadingComprehensionQuestion = z.infer<typeof ReadingComprehensionQuestionSchema>;
