import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MultiMCQQuestionSchema } from "@/shared/schemas/multi-mcq";
import { getOneRandomDoc } from "@/utils/api-helper";
import { testDatabaseConnection } from "@/utils/database";
import { logApiError } from "@/utils/updated-logger";
import { Messages } from "@/types/common";

/**
 * Messages used for API responses and error logging
 */
const msg: Messages = {
  success: "Successfully retrieve random situation question",
  failure: "Failed to retrieve random situation question",
  wrongMethod: "Requested method is not valid",
  invalidData: "Requested data is not valid",
  dbIssues: "Something went wrong when connecting to DB",
} as const;

/**
 * GET endpoint to retrieve a random situation question
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} Returns a JSON response with either:
 * - A random situation question on success (200)
 * - An error message with appropriate status code on failure
 *
 * @throws {Error} Logs any unhandled errors to the error logging system
 *
 * @example
 * // Successful response
 * GET /api/v1/situation
 *
 * // Response
 * {
 *   "id": 1,
 *   "question": "Sample situation question...",
 *   "options": [...],
 *   "correctAnswers": [...]
 * }
 */
export async function GET(req: NextRequest) {
  console.log("👋  API Multi_MCQ Question is called");
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

    const connnectedToDB = await testDatabaseConnection();
    if (!connnectedToDB) {
      await logApiError("Failed to connect to DB", new Error(msg.dbIssues), {
        statusCode: 500,
        path: req.nextUrl.pathname,
        method: req.method,
      });
      return NextResponse.json({ error: msg.dbIssues }, { status: 500 });
    }

    const question = await getOneRandomDoc(
      prisma.situation,
      MultiMCQQuestionSchema
    );

    if (!question) {
      await logApiError(
        "Failed to retrieve data from the server",
        new Error(msg.failure),
        {
          statusCode: 404,
        }
      );
      return NextResponse.json(
        { error: "No situation questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    await logApiError(
      "Unknown issues occurred",
      error instanceof Error ? error : new Error(String(error)),
      {
        statusCode: 500,
        path: req.nextUrl.pathname,
        method: req.method,
      }
    );
    return NextResponse.json(
      { error: "Failed to fetch situation question" },
      { status: 500 }
    );
  }
}
