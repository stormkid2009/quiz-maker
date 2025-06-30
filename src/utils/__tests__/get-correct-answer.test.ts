import { getCorrectAnswer } from "../get-correct-answer";

describe("getCorrectAnswer", () => {
  const question = {
    id: 1,
    options: ["Apple", "Banana", "Cherry", "Date"],
  };

  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it('should return the correct answer using the "rightAnswer" property (string)', () => {
    const q = { ...question, rightAnswer: "b" };
    expect(getCorrectAnswer(q)).toEqual(["Banana"]);
  });

  it('should return the correct answers using the "rightAnswer" property (array)', () => {
    const q = { ...question, rightAnswer: ["a", "c"] };
    expect(getCorrectAnswer(q)).toEqual(["Apple", "Cherry"]);
  });

  it('should return the correct answer using the "answer" property (string)', () => {
    const q = { ...question, answer: "d" };
    expect(getCorrectAnswer(q)).toEqual(["Date"]);
  });

  it('should return the correct answers using the "answer" property (array)', () => {
    const q = { ...question, answer: ["b", "d"] };
    expect(getCorrectAnswer(q)).toEqual(["Banana", "Date"]);
  });

  it('should prefer "rightAnswer" over "answer" if both exist', () => {
    const q = { ...question, rightAnswer: "a", answer: "c" };
    expect(getCorrectAnswer(q)).toEqual(["Apple"]);
  });

  it("should return an empty array if the answer key is invalid", () => {
    const q = { ...question, rightAnswer: "f" };
    expect(getCorrectAnswer(q)).toEqual([]);
  });

  it("should return an empty array and log a warning if no answer property is found", () => {
    const q = { ...question };
    // @ts-expect-error
    expect(getCorrectAnswer(q)).toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(
      `No correct answer found for question ${q.id}`,
      q
    );
  });

  it("should handle an empty options array gracefully", () => {
    const q = { id: 2, options: [], rightAnswer: "a" };
    expect(getCorrectAnswer(q)).toEqual([]);
  });
});
