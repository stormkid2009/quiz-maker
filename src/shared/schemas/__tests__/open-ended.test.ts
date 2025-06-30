import { OpenEndedQuestionSchema } from "../open-ended";
import { QuestionTypes } from "../base-question";

describe("OpenEndedQuestionSchema", () => {
  const now = new Date();
  const validOpenEnded = {
    id: "q1",
    content: "Explain your answer.",
    type: QuestionTypes.OPEN_ENDED,
    elements: ["part1", "part2"],
    answer: "Because it is.",
    createdAt: now,
    updatedAt: now,
  };

  it("accepts a valid open-ended question", () => {
    expect(() => OpenEndedQuestionSchema.parse(validOpenEnded)).not.toThrow();
  });

  it("rejects if type is not OPEN_ENDED", () => {
    const invalid = { ...validOpenEnded, type: "MCQ" };
    expect(() => OpenEndedQuestionSchema.parse(invalid)).toThrow();
  });

  it("rejects if elements is missing or not an array", () => {
    const invalid = { ...validOpenEnded };
    delete invalid.elements;
    expect(() => OpenEndedQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validOpenEnded, elements: "not-an-array" };
    expect(() => OpenEndedQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if answer is missing or not a string", () => {
    const invalid = { ...validOpenEnded };
    delete invalid.answer;
    expect(() => OpenEndedQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validOpenEnded, answer: 42 };
    expect(() => OpenEndedQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if required base fields are missing", () => {
    const invalid = { ...validOpenEnded };
    delete invalid.id;
    expect(() => OpenEndedQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validOpenEnded };
    delete invalid2.content;
    expect(() => OpenEndedQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if createdAt or updatedAt is not a date", () => {
    const invalid = { ...validOpenEnded, createdAt: "2020-01-01" };
    expect(() => OpenEndedQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validOpenEnded, updatedAt: "2020-01-01" };
    expect(() => OpenEndedQuestionSchema.parse(invalid2)).toThrow();
  });
});
