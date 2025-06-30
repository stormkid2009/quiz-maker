import { QuestionSchema } from "../question";
import { QuestionTypes } from "../base-question";

describe("QuestionSchema (union)", () => {
  const now = new Date();
  const validMCQ = {
    id: "q1",
    content: "What is 2+2?",
    type: QuestionTypes.MCQ,
    options: ["2", "3", "4"],
    rightAnswer: ["4"],
    createdAt: now,
    updatedAt: now,
  };
  const validMultiMCQ = {
    id: "q2",
    content: "Select two.",
    type: QuestionTypes.MULTI_MCQ,
    options: ["A", "B", "C"],
    rightAnswer: ["A", "B"],
    createdAt: now,
    updatedAt: now,
  };
  const validOpenEnded = {
    id: "q3",
    content: "Explain.",
    type: QuestionTypes.OPEN_ENDED,
    elements: ["part1", "part2"],
    answer: "Because.",
    createdAt: now,
    updatedAt: now,
  };
  const validRC = {
    id: "rc1",
    passage: "Read this.",
    type: QuestionTypes.RC,
    relatedQuestions: [
      {
        content: "Main idea?",
        options: ["A", "B"],
        rightAnswer: ["A"],
        type: QuestionTypes.MCQ,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  it("accepts a valid MCQ question", () => {
    expect(() => QuestionSchema.parse(validMCQ)).not.toThrow();
  });

  it("accepts a valid Multi-MCQ question", () => {
    expect(() => QuestionSchema.parse(validMultiMCQ)).not.toThrow();
  });

  it("accepts a valid Open-Ended question", () => {
    expect(() => QuestionSchema.parse(validOpenEnded)).not.toThrow();
  });

  it("accepts a valid Reading Comprehension question", () => {
    expect(() => QuestionSchema.parse(validRC)).not.toThrow();
  });

  it("rejects an object with an unknown type", () => {
    const invalid = { ...validMCQ, type: "UNKNOWN" };
    expect(() => QuestionSchema.parse(invalid)).toThrow();
  });

  it("rejects an object missing required fields", () => {
    const invalid = { type: QuestionTypes.MCQ };
    expect(() => QuestionSchema.parse(invalid)).toThrow();
  });

  it("rejects an object that matches no schema", () => {
    const invalid = { foo: "bar" };
    expect(() => QuestionSchema.parse(invalid)).toThrow();
  });
});
