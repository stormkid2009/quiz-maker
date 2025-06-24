import React from "react";
import GrammaireServer from "@/components/server/question-pages/grammaire-server";

export const metadata = {
  title: "Grammar Questions",
  description: "Practice grammar with multiple-choice questions",
};

export default  function GrammairePage() {
  return (
<GrammaireServer />
  );
}
