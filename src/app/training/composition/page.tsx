import React from "react";
import Composition from "@/components/training/composition";
import CompositionPageWrapper from "@/components/question-page-wrappers/composition-wrapper";

export const metadata = {
  title: "Composition Questions",
  description: "Practice with open-ended writing questions",
};

export default function CompositionPage() {
  return (
    <CompositionPageWrapper
      title="Composition Questions"
      description="Open-ended writing prompts to test your writing skills. Express your thoughts in the text area provided."
    >
      <Composition />
    </CompositionPageWrapper>
  );
}
