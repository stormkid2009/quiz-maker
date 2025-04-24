
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {SituationQuestionSchema } from "@/shared/schemas/situation";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)

export async function GET() {
  try {
    const question = await getOneRandomDoc(
      prisma.situation,
      SituationQuestionSchema
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
