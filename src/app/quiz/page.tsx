import React from "react";
import QuizContainer from "@/components/quiz/quiz-container";

export const metadata = {
  title: "Quiz",
  description: "Take a quiz with different types of questions",
};

export default function QuizPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Challenge</h1>
      <QuizContainer />
    </main>
  );
}
