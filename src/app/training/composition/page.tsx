import React from "react";
import Composition from "@/components/server-questions/composition";
import CompositionPageWrapper from "@/components/wrappers/question-pages/composition-wrapper";

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
