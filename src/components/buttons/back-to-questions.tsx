import React from "react";
import Link from "next/link";

/**
 * BackToQuestions component renders a link to navigate back to the training overview page.
 *
 * @component
 * @returns {JSX.Element} The back navigation link element.
 */
export default function BackToQuestions() {
  return (
    <div className="mb-6 flex items-center">
      <Link href="/training" className="text-blue-600 hover:underline mr-4">
        ← Back to All Questions
      </Link>
    </div>
  );
}
