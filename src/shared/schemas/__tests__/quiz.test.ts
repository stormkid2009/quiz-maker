import {
  BasicQuizSchema,
  FixedStructureQuizSchema,
  ConfigurableQuizSchema,
} from "../quiz";
import { QuestionTypes } from "../base-question";

describe("BasicQuizSchema", () => {
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
  const validQuiz = { questions: [validMCQ] };

  it("accepts a valid basic quiz", () => {
    expect(() => BasicQuizSchema.parse(validQuiz)).not.toThrow();
  });

  it("rejects if questions is missing", () => {
    expect(() => BasicQuizSchema.parse({})).toThrow();
  });

  it("rejects if a question is invalid", () => {
    const invalidQuiz = { questions: [{ ...validMCQ, rightAnswer: [] }] };
    expect(() => BasicQuizSchema.parse(invalidQuiz)).toThrow();
  });
});

describe("FixedStructureQuizSchema", () => {
  const now = new Date();
  const rc = {
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
  const multiMCQ = {
    id: "q2",
    content: "Select two.",
    type: QuestionTypes.MULTI_MCQ,
    options: ["A", "B", "C"],
    rightAnswer: ["A", "B"],
    createdAt: now,
    updatedAt: now,
  };
  const mcq = {
    id: "q3",
    content: "Pick one.",
    type: QuestionTypes.MCQ,
    options: ["A", "B"],
    rightAnswer: ["A"],
    createdAt: now,
    updatedAt: now,
  };
  const openEnded = {
    id: "q4",
    content: "Explain.",
    type: QuestionTypes.OPEN_ENDED,
    elements: ["part1", "part2"],
    answer: "Because.",
    createdAt: now,
    updatedAt: now,
  };
  const validQuiz = { questions: [rc, multiMCQ, mcq, openEnded] };

  it("accepts a valid fixed-structure quiz", () => {
    expect(() => FixedStructureQuizSchema.parse(validQuiz)).not.toThrow();
  });

  it("rejects if questions are not in correct order or type", () => {
    const invalidQuiz = { questions: [mcq, multiMCQ, rc, openEnded] };
    expect(() => FixedStructureQuizSchema.parse(invalidQuiz)).toThrow();
  });

  it("rejects if any question is invalid", () => {
    const invalidQuiz = {
      questions: [rc, multiMCQ, { ...mcq, rightAnswer: [] }, openEnded],
    };
    expect(() => FixedStructureQuizSchema.parse(invalidQuiz)).toThrow();
  });
});

describe("ConfigurableQuizSchema", () => {
  const now = new Date();
  const mcq = {
    id: "q1",
    content: "What is 2+2?",
    type: QuestionTypes.MCQ,
    options: ["2", "3", "4"],
    rightAnswer: ["4"],
    createdAt: now,
    updatedAt: now,
  };
  const validQuiz = {
    title: "Math Quiz",
    description: "A simple math quiz",
    questions: [mcq],
    timeLimit: 30,
    passingScore: 70,
    createdAt: now,
    updatedAt: now,
  };

  it("accepts a valid configurable quiz", () => {
    expect(() => ConfigurableQuizSchema.parse(validQuiz)).not.toThrow();
  });

  it("rejects if questions is empty", () => {
    const invalidQuiz = { ...validQuiz, questions: [] };
    expect(() => ConfigurableQuizSchema.parse(invalidQuiz)).toThrow();
  });

  it("rejects if timeLimit is negative", () => {
    const invalidQuiz = { ...validQuiz, timeLimit: -5 };
    expect(() => ConfigurableQuizSchema.parse(invalidQuiz)).toThrow();
  });

  it("rejects if passingScore is out of range", () => {
    const invalidQuiz = { ...validQuiz, passingScore: 120 };
    expect(() => ConfigurableQuizSchema.parse(invalidQuiz)).toThrow();
    const invalidQuiz2 = { ...validQuiz, passingScore: -10 };
    expect(() => ConfigurableQuizSchema.parse(invalidQuiz2)).toThrow();
  });

  it("accepts if title, description, createdAt, updatedAt are omitted", () => {
    const minimalQuiz = { questions: [mcq] };
    expect(() => ConfigurableQuizSchema.parse(minimalQuiz)).not.toThrow();
  });
});
