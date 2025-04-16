// app/components/composition.tsx
import React from 'react';
import { ApiResponse } from 'src/types/common';
import { CompositionQuestion } from 'src/types/questions';
import { logError } from 'src/utils/logger';
import CompositionClient from 'src/components/exams/client/composition';

// Define the type for the question data.
interface QuestionData extends CompositionQuestion {
  _id?: string;
}

async function getRandomQuestion(): Promise<ApiResponse<QuestionData>> {
  try {
    const response = await fetch('/api/questions/composition/random');

    if (!response.ok) {
      const errorText = await response.text();
      await logError("Failed to fetch random composition question", new Error(errorText));
      throw new Error(errorText || "Failed to load random composition question");
    }

    const apiResponse = (await response.json()) as ApiResponse<QuestionData>;

    if (apiResponse.status === 'error' || !apiResponse.data) {
      await logError(
        "API error on fetching random composition question",
        new Error(apiResponse.message || "Invalid response from API")
      );
      throw new Error(apiResponse.message || "Invalid response from API");
    }

    return apiResponse;
  } catch (err) {
    await logError("Unhandled error in getRandomQuestion", err instanceof Error ? err : new Error("Unknown error"));
    throw err;
  }
}

export default async function Composition() {
  let questionData: QuestionData | null = null;
  let error: string | null = null;

  try {
    const apiResponse = await getRandomQuestion();
    questionData = apiResponse.data;
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
  }

  // If there's an error or no questionData, display an error message.
  if (error || !questionData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium mb-2">
          Sorry, we could not load the question. Please try again later.
        </p>
        <p className="text-sm">{error || "No data available"}</p>
      </div>
    );
  }

  // Pass the data directly to the client component
  return <CompositionClient questionData={questionData} />;
}
