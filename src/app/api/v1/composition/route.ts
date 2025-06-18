import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpenEndedQuestionSchema } from "@/shared/schemas/open-ended";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)
import { testDatabaseConnection } from "@/utils/database";
import { logApiError } from "@/utils/updated-logger";
import { Messages } from "@/types/common";


const msg: Messages = {
  success: "Successfully retrieve random composition question  ",
  failure: "Failed to retrieve random composition question",
  wrongMethod: "Requested method is not valid",
  invalidData: "Requested  data is not valid",
  dbIssues: "something went wrong when connecting to DB",
} as const;

export async function GET(req: NextRequest) {

  console.log("👋 API Open-ended Question is called");
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
      //console.log(`Unable to connect to DB !`);

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
    const question = await getOneRandomDoc(
      prisma.composition,
      OpenEndedQuestionSchema
    );

    if (!question) {
      await logApiError(
        "Failed to retrieve data from the server",
        new Error(msg.failure),
        {
          statusCode: 404
        }
      );
      return NextResponse.json(
        { error: "No composition questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    await logApiError(
      "Unkown issues happened ",
      new Error(msg.invalidData),
      {
        statusCode: 500
      }
    );
    return NextResponse.json(
      { error: "Failed to fetch Composition question" },
      { status: 500 }
    );
  }
}
