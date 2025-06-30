import {
  getQuestion,
  getStaticQuestion,
  getRevalidatedQuestion,
  getDynamicQuestion,
  getMultipleQuestions,
  isValidQuestionData,
  QuestionData,
} from "../question-fetcher";

// Mocking global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console methods
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  process.env.NEXT_PUBLIC_BASE_URL = "http://test.com";
  mockFetch.mockClear();
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore();
  (console.log as jest.Mock).mockRestore();
  delete process.env.NEXT_PUBLIC_BASE_URL;
});

const mockQuestion: QuestionData = {
  id: "1",
  question: "What is 2+2?",
  options: ["3", "4", "5"],
  rightAnswer: ["b"],
};

describe("Question Fetcher", () => {
  describe("fetchQuestion variants", () => {
    it("getQuestion should fetch with default options", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestion,
      });
      const data = await getQuestion("grammaire");
      expect(data).toEqual(mockQuestion);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://test.com/api/v1/grammaire",
        expect.any(Object)
      );
    });

    it("getStaticQuestion should fetch with force-cache", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestion,
      });
      await getStaticQuestion("passage");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://test.com/api/v1/passage",
        expect.objectContaining({ cache: "force-cache" })
      );
    });

    it("getRevalidatedQuestion should fetch with revalidation", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestion,
      });
      await getRevalidatedQuestion("situation");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://test.com/api/v1/situation",
        expect.objectContaining({ next: { revalidate: 3600 } })
      );
    });

    it("getDynamicQuestion should fetch with no-store", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestion,
      });
      await getDynamicQuestion("composition");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://test.com/api/v1/composition",
        expect.objectContaining({ cache: "no-store" })
      );
    });

    it("should return null if fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server Error",
      });
      const data = await getQuestion("grammaire");
      expect(data).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("should return null if NEXT_PUBLIC_BASE_URL is not set", async () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;
      const data = await getQuestion("grammaire");
      expect(data).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "NEXT_PUBLIC_BASE_URL is not defined"
      );
    });
  });

  describe("getMultipleQuestions", () => {
    it("should fetch multiple questions successfully", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockQuestion,
      });
      const results = await getMultipleQuestions("grammaire", 3);
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(mockQuestion);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("should filter out null results from failed fetches", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockQuestion })
        .mockResolvedValueOnce({ ok: false })
        .mockResolvedValueOnce({ ok: true, json: async () => mockQuestion });

      const results = await getMultipleQuestions("grammaire", 3);
      expect(results).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("isValidQuestionData", () => {
    it("should return true for valid question data", () => {
      expect(isValidQuestionData(mockQuestion)).toBe(true);
    });

    it("should return false for invalid data", () => {
      expect(isValidQuestionData(null)).toBe(false);
      expect(isValidQuestionData({})).toBe(false);
      expect(isValidQuestionData({ ...mockQuestion, id: 123 })).toBe(false);
      expect(
        isValidQuestionData({ ...mockQuestion, options: "not-an-array" })
      ).toBe(false);
      expect(isValidQuestionData({ ...mockQuestion, rightAnswer: [] })).toBe(
        false
      );
    });
  });
});
