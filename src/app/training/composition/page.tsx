import React from "react";
import CompositionServer from "@/components/server/question-pages/composition-server";

/**
 * Page metadata for the composition writing page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Composition Questions",
  description: "Practice with open-ended writing questions",
};

/**
 * CompositionPage component renders the CompositionServer component for composition writing.
 *
 * @component
 * @returns {JSX.Element} The rendered composition writing page.
 */
export default function CompositionPage() {
  return <CompositionServer />;
}
