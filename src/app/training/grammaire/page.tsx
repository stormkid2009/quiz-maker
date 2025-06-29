import React from "react";
import GrammaireServer from "@/components/server/question-pages/grammaire-server";

/**
 * Page metadata for the grammar training page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Grammar Questions",
  description: "Practice with grammar multiple-choice questions",
};

/**
 * GrammairePage component renders the GrammaireServer component for grammar questions.
 *
 * @component
 * @returns {JSX.Element} The rendered grammar question page.
 */
export default function GrammairePage() {
  return <GrammaireServer />;
}
