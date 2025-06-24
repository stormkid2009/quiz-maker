import React from "react";
import PassageServer from "@/components/server/question-pages/passage-server";

export const metadata = {
  title: "Reading Comprehension",
  description: "Practice with reading passages and comprehension questions",
};

export default function PassagePage() {
  return <PassageServer />;
}
