import React from "react";
import Composition from "@/components/server/composition";
import Link from "next/link";

export const metadata = {
  title: "Composition Questions",
  description: "Practice with open-ended writing questions",
};

export default function CompositionPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link href="/questions" className="text-blue-600 hover:underline mr-4">
          ← Back to All Questions
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Composition Questions</h1>
      <p className="text-gray-600 mb-8">
        Open-ended writing prompts to test your writing skills. Express your
        thoughts in the text area provided.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Composition />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Load Another Question
        </button>
      </div>
    </main>
  );
}
