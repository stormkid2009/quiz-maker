import { MultiMCQQuestionSchema } from "../multi-mcq";
import { QuestionTypes } from "../base-question";

describe("MultiMCQQuestionSchema", () => {
  const now = new Date();
  const validMultiMCQ = {
    id: "q1",
    content: "Select two correct answers.",
    type: QuestionTypes.MULTI_MCQ,
    options: ["A", "B", "C"],
    rightAnswer: ["A", "B"],
    createdAt: now,
    updatedAt: now,
  };

  it("accepts a valid Multi-MCQ question", () => {
    expect(() => MultiMCQQuestionSchema.parse(validMultiMCQ)).not.toThrow();
  });

  it("rejects if type is not MULTI_MCQ", () => {
    const invalid = { ...validMultiMCQ, type: "MCQ" };
    expect(() => MultiMCQQuestionSchema.parse(invalid)).toThrow();
  });

  it("rejects if options is missing or not an array", () => {
    const invalid = { ...validMultiMCQ };
    delete invalid.options;
    expect(() => MultiMCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMultiMCQ, options: "not-an-array" };
    expect(() => MultiMCQQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if rightAnswer is not length 2", () => {
    const invalid = { ...validMultiMCQ, rightAnswer: [] };
    expect(() => MultiMCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMultiMCQ, rightAnswer: ["A"] };
    expect(() => MultiMCQQuestionSchema.parse(invalid2)).toThrow();
    const invalid3 = { ...validMultiMCQ, rightAnswer: ["A", "B", "C"] };
    expect(() => MultiMCQQuestionSchema.parse(invalid3)).toThrow();
  });

  it("rejects if required base fields are missing", () => {
    const invalid = { ...validMultiMCQ };
    delete invalid.id;
    expect(() => MultiMCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMultiMCQ };
    delete invalid2.content;
    expect(() => MultiMCQQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if createdAt or updatedAt is not a date", () => {
    const invalid = { ...validMultiMCQ, createdAt: "2020-01-01" };
    expect(() => MultiMCQQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validMultiMCQ, updatedAt: "2020-01-01" };
    expect(() => MultiMCQQuestionSchema.parse(invalid2)).toThrow();
  });
});
