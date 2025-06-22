import React from "react";
import Grammaire from "@/components/server/question-pages/grammaire";

export const metadata = {
  title: "Grammar Questions",
  description: "Practice grammar with multiple-choice questions",
};

export default async function GrammairePage() {
  return (
<Grammaire />
  );
}
