
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PassageQuestionSchema } from "@/shared/schemas/passage";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)

export async function GET() {
  try {
    const question = await getOneRandomDoc(
      prisma.passage,
      PassageQuestionSchema
    );
    
    if (!question) {
      return NextResponse.json(
        { error: "No Passage questions found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(question);
  } catch (error) {
    console.error("Passage route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Passage question" },
      { status: 500 }
    );
  }
}
