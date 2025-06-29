import React from "react";
import PassageServer from "@/components/server/question-pages/passage-server";

/**
 * Page metadata for the reading comprehension training page.
 * @property {string} title - The page title.
 * @property {string} description - The page description for SEO.
 */
export const metadata = {
  title: "Reading Comprehension",
  description: "Practice with reading passages and comprehension questions",
};

/**
 * PassagePage component renders the PassageServer component for reading comprehension questions.
 *
 * @component
 * @returns {JSX.Element} The rendered reading comprehension page.
 */
export default function PassagePage() {
  return <PassageServer />;
}
