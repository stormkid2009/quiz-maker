import { NextResponse } from "next/server";
import { QuizSchema } from "@/shared/schemas/quiz";

// Define allowed question types
const VALID_TYPES = ["grammaire", "composition", "passage", "situation"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedTypes = searchParams.get("types")?.split(",") || VALID_TYPES;

  // Validate types
  const invalidTypes = requestedTypes.filter(type => !VALID_TYPES.includes(type));
  if (invalidTypes.length > 0) {
    return NextResponse.json(
      { error: `Invalid question types: ${invalidTypes.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    // Fetch one question from each requested type
    const questions = await Promise.all(
      requestedTypes.map(async (type) => {
        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/quiz/${type}`
          );
          if (!response.ok) return null;
          return response.json();
        } catch (e) {
          console.error(`Failed to fetch ${type}:`, e);
          return null;
        }
      })
    );

    // Filter out failed requests
    const validQuestions = questions.filter(Boolean);
    
    if (validQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions found for requested types" },
        { status: 404 }
      );
    }

    // Validate final quiz
    const quiz = QuizSchema.parse({ questions: validQuestions });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Master route error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
