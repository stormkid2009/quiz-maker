import { NextResponse } from "next/server";
import { ZodError } from "zod";
import prisma from "@/lib/prisma";
import { ReadingComprehensionQuestionSchema } from "@/shared/schemas/rc";
import { getOneRandomDoc } from "@/utils/api-helper";

export async function GET() {
  try {
    let rawQuestion;
    try {
      rawQuestion = await getOneRandomDoc(
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
    
    if (!rawQuestion) {
      return NextResponse.json(
        { error: "No Passage questions found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rawQuestion);
  } catch (error) {
    console.error("Passage route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Passage question", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
