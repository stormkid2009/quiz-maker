import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";
import { ReadingComprehensionQuestionSchema } from "@/shared/schemas/rc";
import { getOneRandomDoc } from "@/utils/api-helper";
import { testDatabaseConnection } from "@/utils/database";
import { logApiError } from "@/utils/updated-logger";
import { Messages } from "@/types/common";

const msg: Messages = {
  success: "Successfully retrieve random grammaire question  ",
  failure: "Failed to retrieve random grammaire question",
  wrongMethod: "Requested method is not valid",
  invalidData: "Requested data is not valid",
  dbIssues: "something went wrong when connecting to DB",
} as const;
export async function GET(req: NextRequest) {

  console.log("👋  API Reading Comprehension question is  called");
  try {
    if (req.method !== "GET") {
      await logApiError(
        "Connection failed due to wrong request",
        new Error(msg.wrongMethod),
        {
          method: req.method,
          path: req.nextUrl.pathname,
          statusCode: 405
        }
      );
      return NextResponse.json(
        { error: msg.wrongMethod },
        { status: 405 }
      );
    }
    const connectedToDB = await testDatabaseConnection();
    if (!connectedToDB) {

      await logApiError(
        "Failed to connect to DB",
        new Error(msg.dbIssues),
        {
          statusCode: 500,
          path: req.nextUrl.pathname,
          method: req.method
        }
      );
      return NextResponse.json(
        { error: msg.dbIssues },
        { status: 500 }
      );
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
        console.error("Validation error details:", JSON.stringify({
          errors: error.errors,
          flattenedErrors: error.flatten(),
          document: error.message, // This might contain the document that failed validation
        }, null, 2));

        // Try to get the raw document without validation to diagnose the issue
        const rawDocs = await prisma.passage.findMany({ take: 1 });
        if (rawDocs.length > 0) {
          console.log("Raw document structure:", JSON.stringify(rawDocs[0], null, 2));
        }
      }
      throw error;
    }

    if (!question) {
      await logApiError(
        "Did not retrieve valid passage question !",
        new Error(),
        {
          statusCode: 404,
          path: req.nextUrl.pathname,
          method: req.method
        }
      );
      return NextResponse.json(
        { error: "No Passage questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {

    // Ensure the error is an instance of Error for consistent logging
    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Log the error using logApiError
    await logApiError(
      "Unexpected error in Passage route",
      errorObj,
      { statusCode: 500, path: req.nextUrl.pathname, method: req.method }
    );

    // Return the same JSON response as before
    return NextResponse.json(
      { error: "Failed to fetch Passage question", details: errorObj },
      { status: 500 }
    );
  }
}
