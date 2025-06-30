import {
  BaseQuestionSchema,
  QuestionTypesSchema,
  QuestionTypes,
} from "../base-question";

describe("BaseQuestionSchema", () => {
  const now = new Date();
  const validBase = {
    id: "q1",
    content: "Base question content",
    type: QuestionTypes.MCQ,
    createdAt: now,
    updatedAt: now,
  };

  it("accepts a valid base question", () => {
    expect(() => BaseQuestionSchema.parse(validBase)).not.toThrow();
  });

  it("rejects if id is missing or not a string", () => {
    const invalid = { ...validBase };
    delete invalid.id;
    expect(() => BaseQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validBase, id: 123 };
    expect(() => BaseQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if content is missing or not a string", () => {
    const invalid = { ...validBase };
    delete invalid.content;
    expect(() => BaseQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validBase, content: 123 };
    expect(() => BaseQuestionSchema.parse(invalid2)).toThrow();
  });

  it("rejects if type is missing or not a valid type", () => {
    const invalid = { ...validBase };
    delete invalid.type;
    expect(() => BaseQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validBase, type: "INVALID" };
    expect(() => BaseQuestionSchema.parse(invalid2)).toThrow();
  });

  it("accepts all valid types", () => {
    Object.values(QuestionTypes).forEach((type) => {
      expect(() =>
        BaseQuestionSchema.parse({ ...validBase, type })
      ).not.toThrow();
    });
  });

  it("rejects if createdAt or updatedAt is missing or not a date", () => {
    const invalid = { ...validBase };
    delete invalid.createdAt;
    expect(() => BaseQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validBase, createdAt: "2020-01-01" };
    expect(() => BaseQuestionSchema.parse(invalid2)).toThrow();
    const invalid3 = { ...validBase };
    delete invalid3.updatedAt;
    expect(() => BaseQuestionSchema.parse(invalid3)).toThrow();
    const invalid4 = { ...validBase, updatedAt: "2020-01-01" };
    expect(() => BaseQuestionSchema.parse(invalid4)).toThrow();
  });
});

describe("QuestionTypesSchema", () => {
  it("accepts all valid types", () => {
    Object.values(QuestionTypes).forEach((type) => {
      expect(() => QuestionTypesSchema.parse(type)).not.toThrow();
    });
  });

  it("rejects invalid types", () => {
    expect(() => QuestionTypesSchema.parse("INVALID")).toThrow();
    expect(() => QuestionTypesSchema.parse("")).toThrow();
    expect(() => QuestionTypesSchema.parse(123)).toThrow();
  });
});
