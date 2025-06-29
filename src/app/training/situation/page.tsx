import React from "react";
import Situation from "@/components/server/question-pages/situation-server";

/**
 * Page metadata for the situation questions page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Situation Questions",
  description: "Practice with situation-based multiple-choice questions",
};

/**
 * SituationPage component renders the SituationServer component for situation questions.
 *
 * @component
 * @returns {JSX.Element} The situation question page content.
 */
export default function SituationPage() {
  return <Situation />;
}
