import React from "react";
import Passage from "@/components/training/passage";
import PassagePageWrapper from "@/components/question-page-wrappers/passage-wrapper";

export const metadata = {
  title: "Reading Comprehension",
  description: "Practice with reading passages and comprehension questions",
};

export default function PassagePage() {
  return (
    <PassagePageWrapper
      title="Reading Comprehension"
      description="These questions test your ability to understand and analyze written passages. Read the passage carefully and answer the related questions."
    >
      <Passage />
    </PassagePageWrapper>
  );
}
