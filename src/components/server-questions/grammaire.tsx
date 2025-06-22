import React from "react";
import GrammaireWrapper from "@/components/wrappers/training-home/grammaire-wrapper";

async function getGrammaireQuestion() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/grammaire`,
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
        `Failed to fetch grammaire question: ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log(`this is fetched data from api: `, data);
    return data;
  } catch (error) {
    console.error("Error fetching grammaire question:", error);
    return null;
  }
}

export default async function Grammaire() {
  const question = await getGrammaireQuestion();

  if (!question) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No grammaire question available.</p>
      </div>
    );
  }

  // Convert to client component through a wrapper since we can't use client-side hooks in a server component
  return (
    <div className="grammaire-question p-4 border border-blue-200 rounded-lg bg-blue-50">
      <h2 className="text-lg font-semibold mb-2">Grammar Question</h2>

      <GrammaireWrapper question={question} />
    </div>
  );
}
