import React from "react";
import Grammaire from "@/components/server-questions/grammaire";
import GrammairePageWrapper from "@/components/wrappers/question-pages/grammaire-wrapper";

export const metadata = {
  title: "Grammar Questions",
  description: "Practice grammar with multiple-choice questions",
};

export default function GrammairePage() {
  return (
    <GrammairePageWrapper
      title="Grammar Questions"
      description="Test your grammar knowledge with these multiple-choice questions. Each question has one correct answer."
    >
      <Grammaire />
    </GrammairePageWrapper>
  );
}
