import React from "react";
import Situation from "@/components/server/situation";
import Link from "next/link";

export const metadata = {
  title: "Situation Questions",
  description: "Practice with situation-based multiple-choice questions",
};

export default function SituationPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link href="/questions" className="text-blue-600 hover:underline mr-4">
          ← Back to All Questions
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Situation Questions</h1>
      <p className="text-gray-600 mb-8">
        These questions present real-world situations and require multiple
        selections. Select all that apply in each situation.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Situation />
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
