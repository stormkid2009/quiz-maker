import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MultiMCQQuestionSchema } from "@/shared/schemas/multi-mcq";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)
import { testDatabaseConnection } from "@/utils/database";

export async function GET() {
  
 console.log("👋  API Multi_MCQ Question is  called");
  try {
    const connnectedToDB = await testDatabaseConnection();
    if(!connnectedToDB){
      consoel.log(`Unable to connecto to DB !`);
    }
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
