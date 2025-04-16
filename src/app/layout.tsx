import './globals.css'
import type { Metadata } from 'next'
import React from 'react';
export const metadata: Metadata = {
  title: 'Quiz Maker',
  description: 'Create and take quizzes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
