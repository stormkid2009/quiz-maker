import {z} from "zod";
import {MCQQuestionSchema} from "@/shared/schemas/mcq";
import {MultiMCQQuestionSchema } from "@/shared/schemas/multi-mcq";
import {OpenEndedQuestionSchema } from "@/shared/schemas/open-ended";
import {ReadingComprehensionQuestionSchema } from "@/shared/schemas/rc";


// Create a union type of all questions using discriminated union

export const GeneralQuestionSchema = z.discriminatedUnion("type",[
  MCQQuestionSchema,
  MultiMCQQuestionSchema,
  OpenEndedQuestionSchema,
  ReadingComprehensionQuestionSchema,
]);

// infer type for general purpose question 
export type GeneralQuestion = z.infer<typeof GeneralQuestionSchema>;

