import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MCQQuestionSchema } from "@/shared/schemas/mcq";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)
import {testDatabaseConnection } from "@/utils/database";

export async function GET() {

console.log("👋  API MCQ question is called");
  try {
    const connectedToDB = await testDatabaseConnection();
    if(!connectedToDB){
      console.log(`Unable to connect to DB !`);
    }
    const question = await getOneRandomDoc(
      prisma.grammaire,
      MCQQuestionSchema
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
