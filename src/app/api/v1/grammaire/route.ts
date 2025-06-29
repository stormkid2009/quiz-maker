import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MCQQuestionSchema } from "@/shared/schemas/mcq";
import { getOneRandomDoc } from "@/utils/api-helper";
import { testDatabaseConnection } from "@/utils/database";
import { logApiError } from "@/utils/updated-logger";
import { Messages } from "@/types/common";

/**
 * Messages used for API responses and error logging
 */
const msg: Messages = {
  success: "Successfully retrieved random grammar question",
  failure: "Failed to retrieve random grammar question",
  wrongMethod: "Requested method is not valid",
  invalidData: "Requested data is not valid",
  dbIssues: "Something went wrong when connecting to the database",
} as const;

/**
 * GET endpoint to retrieve a random grammar question
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} Returns a JSON response with either:
 * - A random grammar question on success (200)
 * - An error message with appropriate status code on failure
 *
 * @throws {Error} Logs any unhandled errors to the error logging system
 *
 * @example
 * // Successful response
 * GET /api/v1/grammaire
 *
 * // Response
 * {
 *   "id": 1,
 *   "question": "Select the correct sentence",
 *   "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
 *   "correctAnswer": "Option 1"
 * }
 */
export async function GET(req: NextRequest) {
  console.log("👋  API Grammar question is called");

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

    const question = await getOneRandomDoc(prisma.grammaire, MCQQuestionSchema);

    if (!question) {
      await logApiError(
        "No grammar questions found in the database",
        new Error(msg.failure),
        {
          statusCode: 404,
          path: req.nextUrl.pathname,
          method: req.method,
        }
      );
      return NextResponse.json(
        { error: "No grammar questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    await logApiError("Error in grammar question API", errorObj, {
      statusCode: 500,
      path: req.nextUrl.pathname,
      method: req.method,
    });

    return NextResponse.json(
      { error: "Failed to fetch grammar question" },
      { status: 500 }
    );
  }
}
