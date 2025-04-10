import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpenEndedQuestionSchema } from "@/shared/schemas/open-ended";
import { getOneRandomDoc } from "@/utils/api-helper"; // Shared utility (see step 4)
import {testDatabaseConnection } from "@/utils/database";

export async function GET() {

 console.log("👋 API Open-ended Question is called");
  try {
    const connectedToDB = await testDatabaseConnection();
    if(!connectedToDB){
      console.log(`Unable to connect to DB !`);
    }
    const question = await getOneRandomDoc(
      prisma.composition,
      OpenEndedQuestionSchema
    );
    
    if (!question) {
      return NextResponse.json(
        { error: "No composition questions found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(question);
  } catch (error) {
    console.error("Composition route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Composition question" },
      { status: 500 }
    );
  }
}
