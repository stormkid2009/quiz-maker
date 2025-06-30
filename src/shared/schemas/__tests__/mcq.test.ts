import { MCQQuestionSchema } from "../mcq";
import { QuestionTypes } from "../base-question";

describe("MCQQuestionSchema", () => {
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

  it("accepts a valid MCQ question", () => {
    expect(() => MCQQuestionSchema.parse(validMCQ)).not.toThrow();
  });

  it("rejects if type is not MCQ", () => {
    const invalid = { ...validMCQ, type: "RC" };
    expect(() => MCQQuestionSchema.parse(invalid)).toThrow();
  });

  it("rejects if options is missing or not an array", () => {
    const invalid = { ...validMCQ };
    delete invalid.options;
    expect(() => MCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMCQ, options: "not-an-array" };
    expect(() => MCQQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if rightAnswer is not length 1", () => {
    const invalid = { ...validMCQ, rightAnswer: [] };
    expect(() => MCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMCQ, rightAnswer: ["4", "3"] };
    expect(() => MCQQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if required base fields are missing", () => {
    const invalid = { ...validMCQ };
    delete invalid.id;
    expect(() => MCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMCQ };
    delete invalid2.content;
    expect(() => MCQQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if createdAt or updatedAt is not a date", () => {
    const invalid = { ...validMCQ, createdAt: "2020-01-01" };
    expect(() => MCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMCQ, updatedAt: "2020-01-01" };
    expect(() => MCQQuestionSchema.parse(invalid2)).toThrow();
  });
});
