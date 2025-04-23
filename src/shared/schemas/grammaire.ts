import { z } from "zod"

export const GrammaireQuestionSchema = z.object({
  id: z.string(),
  // v: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  content: z.string(),
  options: z.array(z.string()),
  rightAnswer: z.array(z.string()),  // or pluralize if you prefer
  type: z.string(),
})

export type GrammaireQuestion = z.infer<typeof GrammaireQuestionSchema>