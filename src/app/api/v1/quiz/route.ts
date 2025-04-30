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
import { logApiError, logInfo } from "@/utils/updated-logger";
import { Messages, ApiResponse } from "@/types/common";

const msg: Messages = {
  success: "successfully retrieve random question",
  failure: "failed to retrieve random question",
  wrongMethod: "the method is not valid",
  invalidData: "the data is not valid",
  dbIssues: "something went wrong connecting to DB",
} as const;

/**
 * Creates a standardized error response
 * @param message Error message
 * @param details Optional error details
 * @param status HTTP status code (defaults to 500)
 */
function createErrorResponse(message: string, details: any = null, status: number = 500) {
  return NextResponse.json(
    {
      success: false,
      message,
      details,
    },
    { status }
  );
}

/**
 * GET route handler for quiz API
 * Fetches random questions from different collections and assembles a quiz
 */
export async function GET(request: Request) {
  await logInfo("Quiz API was called");
  console.log("👋 Quiz API is called!");

  try {
    const dbConnected = await testDatabaseConnection();

    if (!dbConnected) {
      const dbError = new Error(msg.dbIssues);
      await logApiError(msg.dbIssues, dbError, {
        request,
        statusCode: 500
      });
      return createErrorResponse(msg.dbIssues);
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
      const error = e instanceof Error ? e : new Error(String(e));
      await logApiError("Failed to fetch grammaire question", error, {
        request,
        statusCode: 500
      });
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
      const error = e instanceof Error ? e : new Error(String(e));
      await logApiError("Failed to fetch composition question", error, {
        request,
        statusCode: 500
      });
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
      const error = e instanceof Error ? e : new Error(String(e));
      await logApiError("Failed to fetch passage question", error, {
        request,
        statusCode: 500
      });
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
      const error = e instanceof Error ? e : new Error(String(e));
      await logApiError("Failed to fetch situation question", error, {
        request,
        statusCode: 500
      });
      console.error("Failed to fetch situation:", e);
    }

    if (questions.length === 0) {
      const noQuestionsError = new Error("No valid questions found");
      await logApiError("No valid questions were found in any collection", noQuestionsError, {
        request,
        statusCode: 404
      });
      return createErrorResponse("No valid questions found", null, 404);
    }

    console.log(`Creating quiz with ${questions.length} questions`);

    try {
      const quiz: Quiz = QuizSchema.parse({
        questions: questions,
      });

      return NextResponse.json(quiz);
    } catch (parseError: unknown) {
      const error = parseError instanceof Error ? parseError : new Error("Schema parse error");

      // For Zod validation errors, we can extract the detailed errors
      const details = parseError &&
        typeof parseError === 'object' &&
        'errors' in parseError ?
        (parseError as { errors: unknown }).errors : null;

      await logApiError("Quiz schema validation error", error, {
        request,
        statusCode: 400,
        requestBody: { questionCount: questions.length }
      });

      console.error("Quiz schema validation error:", parseError);
      return createErrorResponse("Failed to create a valid quiz", details, 400);
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    const errorMessage = error.message || "Unknown error";

    await logApiError("Unhandled error in quiz API", error, {
      request,
      statusCode: 500
    });

    console.error("Unhandled error in quiz API:", err);
    return createErrorResponse(errorMessage);
  }
}

/**
 * Method not allowed handler for other HTTP methods
 */
export async function POST(request: Request) {
  await logApiError("Method not allowed", new Error("POST method not supported"), {
    request,
    statusCode: 405
  });
  return createErrorResponse(msg.wrongMethod, null, 405);
}

export async function PUT(request: Request) {
  await logApiError("Method not allowed", new Error("PUT method not supported"), {
    request,
    statusCode: 405
  });
  return createErrorResponse(msg.wrongMethod, null, 405);
}

export async function DELETE(request: Request) {
  await logApiError("Method not allowed", new Error("DELETE method not supported"), {
    request,
    statusCode: 405
  });
  return createErrorResponse(msg.wrongMethod, null, 405);
}

export async function PATCH(request: Request) {
  await logApiError("Method not allowed", new Error("PATCH method not supported"), {
    request,
    statusCode: 405
  });
  return createErrorResponse(msg.wrongMethod, null, 405);
}
