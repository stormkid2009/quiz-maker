import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { QuestionSchema, type Question } from "@/shared/schemas/question";
import { MCQQuestionSchema } from "@/shared/schemas/mcq";
import { OpenEndedQuestionSchema } from "@/shared/schemas/open-ended";
import { ReadingComprehensionQuestionSchema } from "@/shared/schemas/rc";
import { MultiMCQQuestionSchema } from "@/shared/schemas/multi-mcq";
import { QuizSchema, type Quiz } from "@/shared/schemas/quiz";
import { testDatabaseConnection } from "@/utils/database";
import { getOneRandomDoc } from "@/utils/api-helper";

function createErrorResponse(message: string, details?: any, status: number = 500) {
  return NextResponse.json(
    { error: message, ...(details && { details }) },
    { status }
  );
}

export async function GET() {
  console.log("👋 Quiz API is called !");

  try {
    const dbConnected = await testDatabaseConnection();

    if (!dbConnected) {
      return createErrorResponse("Unable to connect to database");
    }

    const questions: Question[] = [];

    // Fetch Grammaire (MCQ)
    try {
      const grammaire = await getOneRandomDoc(
        prisma.grammaire,
        MCQQuestionSchema
      );
      if (grammaire) {
        // Ensure type is literal value
        const fixedGrammaire = {
          ...grammaire,
          type: "MCQ" as const,
        };
        questions.push(fixedGrammaire);
      }
    } catch (e) {
      console.error("Failed to fetch grammaire:", e);
    }

    // Fetch Composition (Open-Ended)
    try {
      const composition = await getOneRandomDoc(
        prisma.composition,
        OpenEndedQuestionSchema
      );
      if (composition) {
        // Ensure type is literal value
        const fixedComposition = {
          ...composition,
          type: "Open-Ended" as const,
        };
        questions.push(fixedComposition);
      }
    } catch (e) {
      console.error("Failed to fetch composition:", e);
    }

    // Fetch Passage (Reading Comprehension)
    try {
      const passage = await getOneRandomDoc(
        prisma.passage,
        ReadingComprehensionQuestionSchema
      );
      if (passage) {
        // Ensure type is literal value
        const fixedPassage = {
          ...passage,
          type: "RC" as const,
          relatedQuestions: passage.relatedQuestions.map((question) => ({
            ...question,
            type: "MCQ" as const, // Ensure related questions are of type MCQ
          })),
        };
        questions.push(fixedPassage);
      }
    } catch (e) {
      console.error("Failed to fetch passage:", e);
    }

    // Fetch Situation (Multi-MCQ)
    try {
      const situation = await getOneRandomDoc(
        prisma.situation,
        MultiMCQQuestionSchema
      );
      if (situation) {
        // Ensure type is literal value
        const fixedSituation = {
          ...situation,
          type: "Multi-MCQ" as const,
        };
        questions.push(fixedSituation);
      }
    } catch (e) {
      console.error("Failed to fetch situation:", e);
    }

    if (questions.length === 0) {
      console.error("No valid questions were found in any collection");
      return createErrorResponse("No valid questions found", null, 404);
    }

    console.log(`Creating quiz with ${questions.length} questions`);

    try {
      const quiz: Quiz = QuizSchema.parse({
        questions: questions,
      });

      return NextResponse.json(quiz);
    } catch (parseError) {
      console.error("Quiz schema validation error:", parseError);
      return createErrorResponse("Failed to create a valid quiz", parseError.errors);
    }
  } catch (err: unknown) {
    console.error("Unhandled error in quiz API:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
}
