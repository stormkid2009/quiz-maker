import React from "react";
import Link from "next/link";

/**
 * Page metadata for the training question types page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Question Types",
  description:
    "Train yourself with exploring different types of questions in our quiz system",
};

/**
 * Training QuestionsPage component lists available question types and navigation links.
 *
 * @component
 * @returns {JSX.Element} The overview page of question types.
 */
export default function QuestionsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Question Types</h1>
      <p className="text-gray-600 text-center mb-8">
        This page demonstrates all the different types of questions available in
        our quiz system. Each question is fetched from its corresponding API
        endpoint.
      </p>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 mb-10">
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-blue-100 px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Grammar (MCQ)</h2>
            <Link
              href="/training/grammaire"
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Jump to Training ***
            </Link>
          </div>
          <div className="p-4 bg-white">
            <p>
              {" "}
              This kind of questions has multi choices and only one answer is
              valid{" "}
            </p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-purple-100 px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Situation (Multi-MCQ)</h2>
            <Link
              href="/training/situation"
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
            >
              Jump to Training ***
            </Link>
          </div>
          <div className="p-4 bg-white">
            <p>
              {" "}
              This kind of Questions has multi choices with two valid answers{" "}
            </p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-green-100 px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Composition (Open-Ended)</h2>
            <Link
              href="/training/composition"
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Jump to Training ***
            </Link>
          </div>
          <div className="p-4 bg-white">
            <p>
              {" "}
              This kind of questions is open end so the evaluation will be from
              an expert{" "}
            </p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-amber-100 px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reading Comprehension</h2>
            <Link
              href="/training/passage"
              className="px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700"
            >
              Jump to Training ***
            </Link>
          </div>
          <div className="p-4 bg-white">
            <p>
              {" "}
              This kind of questions has one text for Comprehension and multi
              sub questions with multi choice with one valid answer{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/quiz"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Take Full Quiz
        </Link>
      </div>
    </main>
  );
}
