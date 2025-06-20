import React from "react";
import Situation from "@/components/training/situation";
import SituationPageWrapper from "@/components/question-page-wrappers/situation-wrapper";

export const metadata = {
  title: "Situation Questions",
  description: "Practice with situation-based multiple-choice questions",
};

export default function SituationPage() {
  return (
    <SituationPageWrapper
      title="Situation Questions"
      description="These questions present real-world situations and require multiple selections. Select all that apply in each situation."
    >
      <Situation />
    </SituationPageWrapper>
  );
}
