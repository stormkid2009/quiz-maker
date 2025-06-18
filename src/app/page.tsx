import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl w-full p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-800">Quiz Maker</h1>
        <p className="text-xl mb-8 text-gray-600">
          Test your knowledge with our interactive quizzes featuring multiple
          types of questions.
        </p>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            Features
          </h2>
          <ul className="text-left space-y-2">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Multiple choice questions
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Open-ended questions
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Reading comprehension
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Multiple answers selection
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quiz"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg transition-colors hover:bg-blue-700"
          >
            Start Quiz
          </Link>

          <Link
            href="/training"
            className="inline-block px-8 py-4 bg-gray-200 text-gray-800 font-semibold text-lg rounded-lg transition-colors hover:bg-gray-300"
          >
            Train yourself on different types of questions
          </Link>
        </div>
      </div>
    </main>
  );
}
