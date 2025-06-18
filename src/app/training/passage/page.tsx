import React from "react";
import Passage from "@/components/training/passage";
import Link from "next/link";

export const metadata = {
  title: "Reading Comprehension",
  description: "Practice with reading passages and comprehension questions",
};

export default function PassagePage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link href="/questions" className="text-blue-600 hover:underline mr-4">
          ← Back to All Questions
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Reading Comprehension</h1>
      <p className="text-gray-600 mb-8">
        These questions test your ability to understand and analyze written
        passages. Read the passage carefully and answer the related questions.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Passage />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Load Another Passage
        </button>
      </div>
    </main>
  );
}
