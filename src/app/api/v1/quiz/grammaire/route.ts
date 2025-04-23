import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GrammaireQuestionSchema } from "@/shared/schemas/grammaire";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)

export async function GET() {
  try {
    const question = await getOneRandomDoc(
      prisma.grammaire,
      GrammaireQuestionSchema
    );
    
    if (!question) {
      return NextResponse.json(
        { error: "No grammaire questions found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(question);
  } catch (error) {
    console.error("Grammaire route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch grammaire question" },
      { status: 500 }
    );
  }
}
