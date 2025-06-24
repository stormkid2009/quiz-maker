"use client";

// client component wrapper for grammaire question in question pages
import React from "react";
import Link from "next/link";
import { useState } from "react";
import QuestionActions from "@/components/buttons/question-actions";
import BackToQuestions from "@/components/buttons/back-to-questions";

interface GrammairePageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  rightAnswer: string;
}

export default function GrammairePageWrapper({
  title,
  description,
  children,
  rightAnswer,
}: GrammairePageWrapperProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  // Here we define the *actual* logic
  const showTheAnswer = () => {
    console.log("Setting answer to visible!");
    setIsAnswerVisible(true);
  };

  const loadNewGrammarQuestion = () => {
    console.log("Fetching a new grammar question...");
    // In a real app, you'd fetch data here and reset state
    window.location.reload(); // Or use the default behavior
  };
  return (
    <main className="container mx-auto py-8 px-4">
<BackToQuestions />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      <div className="bg-white p-6 rounded-lg shadow-sm">{children}</div>
      {isAnswerVisible && (
        <p className="bg-black p-2 text-purple-600 ">
          This is the correct Answer : {rightAnswer}
        </p>
      )}

      {/* 
  We pass our logic functions as props to QuestionActions.
  QuestionActions will then pass them to the useQuestionActions hook.
*/}
      <QuestionActions
        onShowAnswer={showTheAnswer}
        onLoadNew={loadNewGrammarQuestion}
      />
    </main>
  );
}
