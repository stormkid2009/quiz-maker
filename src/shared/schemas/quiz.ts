import { z } from "zod"
import { GrammaireQuestionSchema } from "./grammaire"
import { CompositionQuestionSchema } from "./composition"
import { PassageQuestionSchema } from "./passage"
import { SituationQuestionSchema } from "./situation"

export const QuizSchema = z.object({
  questions: z
    .tuple([
      GrammaireQuestionSchema,
      CompositionQuestionSchema,
     // PassageQuestionSchema,
      SituationQuestionSchema,
    ])
    .transform(qs => qs as Array<
      z.infer<
        typeof GrammaireQuestionSchema
      > /* union of all four if you’d rather */
    >),
})

export type Quiz = z.infer<typeof QuizSchema>
