import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MultiMCQQuestionSchema } from "@/shared/schemas/multi-mcq";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)

export async function GET() {
  try {
    const question = await getOneRandomDoc(
      prisma.situation,
      MultiMCQQuestionSchema
    );
    
    if (!question) {
      return NextResponse.json(
        { error: "No Situation questions found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(question);
  } catch (error) {
    console.error("Situation route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Situation question" },
      { status: 500 }
    );
  }
}
