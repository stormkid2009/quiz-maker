"use client";

import React from "react";
import Link from "next/link";
import QuestionActions from "@/components/buttons/question-actions";

interface PassagePageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function PassagePageWrapper({
  title,
  description,
  children,
}: PassagePageWrapperProps) {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link href="/questions" className="text-blue-600 hover:underline mr-4">
          ← Back to All Questions
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      <div className="bg-white p-6 rounded-lg shadow-sm">{children}</div>

      <QuestionActions loadButtonText="Load Another Passage" />
    </main>
  );
}
