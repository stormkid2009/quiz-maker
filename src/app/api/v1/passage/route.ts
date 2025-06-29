import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";
import { ReadingComprehensionQuestionSchema } from "@/shared/schemas/rc";
import { getOneRandomDoc } from "@/utils/api-helper";
import { testDatabaseConnection } from "@/utils/database";
import { logApiError } from "@/utils/updated-logger";
import { Messages } from "@/types/common";

/**
 * Messages used for API responses and error logging
 */
const msg: Messages = {
  success: "Successfully retrieved random reading comprehension question",
  failure: "Failed to retrieve random reading comprehension question",
  wrongMethod: "Requested method is not valid",
  invalidData: "Requested data is not valid",
  dbIssues: "Something went wrong when connecting to the database",
} as const;

/**
 * GET endpoint to retrieve a random reading comprehension question
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} Returns a JSON response with either:
 * - A random reading comprehension question on success (200)
 * - An error message with appropriate status code on failure
 *
 * @throws {ZodError} When there's a validation error with the question data
 * @throws {Error} Logs any unhandled errors to the error logging system
 *
 * @example
 * // Successful response
 * GET /api/v1/passage
 *
 * // Response
 * {
 *   "id": 1,
 *   "passage": "Reading passage text...",
 *   "relatedQuestions": [
 *     {
 *       "id": 1,
 *       "question": "What is the main idea of the passage?",
 *       "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
 *       "correctAnswer": "Option 1"
 *     }
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
  console.log("👋  API Reading Comprehension question is called");
  try {
    if (req.method !== "GET") {
      await logApiError(
        "Connection failed due to wrong request",
        new Error(msg.wrongMethod),
        {
          method: req.method,
          path: req.nextUrl.pathname,
          statusCode: 405,
        }
      );
      return NextResponse.json({ error: msg.wrongMethod }, { status: 405 });
    }

    const connectedToDB = await testDatabaseConnection();
    if (!connectedToDB) {
      await logApiError("Failed to connect to DB", new Error(msg.dbIssues), {
        statusCode: 500,
        path: req.nextUrl.pathname,
        method: req.method,
      });
      return NextResponse.json({ error: msg.dbIssues }, { status: 500 });
    }

    let question;
    try {
      question = await getOneRandomDoc(
        prisma.passage,
        ReadingComprehensionQuestionSchema
      );
    } catch (error) {
      // Check if it's a Zod validation error
      if (error instanceof ZodError) {
        // Log detailed error info
        console.error(
          "Validation error details:",
          JSON.stringify(
            {
              errors: error.errors,
              flattenedErrors: error.flatten(),
              document: error.message,
            },
            null,
            2
          )
        );

        // Try to get the raw document without validation to diagnose the issue
        const rawDocs = await prisma.passage.findMany({ take: 1 });
        if (rawDocs.length > 0) {
          console.log(
            "Raw document structure:",
            JSON.stringify(rawDocs[0], null, 2)
          );
        }
      }
      throw error;
    }

    if (!question) {
      await logApiError(
        "No valid passage questions found",
        new Error(msg.failure),
        {
          statusCode: 404,
          path: req.nextUrl.pathname,
          method: req.method,
        }
      );
      return NextResponse.json(
        { error: "No reading comprehension questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    // Ensure the error is an instance of Error for consistent logging
    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Log the error using logApiError
    await logApiError("Error in reading comprehension question API", errorObj, {
      statusCode: 500,
      path: req.nextUrl.pathname,
      method: req.method,
    });

    return NextResponse.json(
      {
        error:
          "An error occurred while fetching the reading comprehension question",
      },
      { status: 500 }
    );
  }
}
