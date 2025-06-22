import React from "react";
//import Question from "../inputs/question";
import CompositionWrapper from "@/components/wrappers/training-home/composition-wrapper";

async function getCompositionQuestion() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/composition`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch composition question: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching composition question:", error);
    return null;
  }
}

export default async function Composition() {
  const question = await getCompositionQuestion();

  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No composition question available.</p>
      </div>
    );
  }

  // Convert to client component through a wrapper
  return (
    <div className="composition-question p-4 border border-green-200 rounded-lg bg-green-50">
      <h2 className="text-lg font-semibold mb-2">Writing Composition</h2>

      <CompositionWrapper question={question} />
    </div>
  );
}
