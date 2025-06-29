import "./globals.css";
import type { Metadata } from "next";
import React from "react";

/**
 * Application metadata for Next.js (title and description).
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Quiz Maker",
  description: "Create and take quizzes",
};

/**
 * RootLayout component defines the base HTML structure wrapping all pages.
 *
 * @param {{ children: React.ReactNode }} props - The child components to render.
 * @returns {JSX.Element} The root HTML layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
