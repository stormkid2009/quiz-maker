import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z, ZodError } from "zod";
import { MCQQuestionSchema } from "@/shared/schemas/mcq";
import { OpenEndedQuestionSchema } from "@/shared/schemas/open-ended";
import { ReadingComprehensionQuestionSchema } from "@/shared/schemas/rc";
import { MultiMCQQuestionSchema } from "@/shared/schemas/multi-mcq";
import { QuizSchema , type Quiz } from "@/shared/schemas/quiz";
import { testDatabaseConnection } from "@/utils/database";
import { type Question } from "@/shared/schemas/question"; // Import Question type
import { getOneRandomDoc } from "@/utils/api-helper";




// Standardize error responses
function createErrorResponse(message: string, details?: any, status: number = 500) {
  return NextResponse.json(
    { error: message, ...(details && { details }) },
    { status }
  );
}

export async function GET() {
  console.log("👋 Quiz API called");

  try {
    const dbConnected = await testDatabaseConnection();

    if (!dbConnected) {
      return createErrorResponse("Unable to connect to database");
    }

    const questions: Question[] = [];

    try {
      const grammaire = await getOneRandomDoc(
        prisma.grammaire,
        MCQQuestionSchema
      );
      if (grammaire) questions.push(grammaire);
    } catch (e) {
      console.error("Failed to fetch grammaire:", e);
    }

    try {
      const composition = await getOneRandomDoc(
        prisma.composition,
        OpenEndedQuestionSchema
      );
      if (composition) questions.push(composition);
    } catch (e) {
      console.error("Failed to fetch composition:", e);
    }

    try {
      const passage = await getOneRandomDoc(
        prisma.passage,
        ReadingComprehensionQuestionSchema
      );
      if (passage) questions.push(passage);
    } catch (e) {
      console.error("Failed to fetch passage:", e);
    }

    try {
      const situation = await getOneRandomDoc(
        prisma.situation,
        MultiMCQQuestionSchema
      );
      if (situation) questions.push(situation);
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
      if (parseError instanceof ZodError) {
        console.error("Quiz schema validation error:", parseError.errors);
        return createErrorResponse("Failed to create a valid quiz", parseError.errors);
      }
      console.error("Unexpected error:", parseError);
      return createErrorResponse("Unexpected error during quiz validation");
    }
  } catch (err: unknown) {
    console.error("Unhandled error in quiz API:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return createErrorResponse(errorMessage);
  }
}
