import { GET } from "../route";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  grammaire: {},
  passage: {},
  situation: {},
}));
jest.mock("@/utils/api-helper", () => ({
  getOneRandomDoc: jest.fn(),
}));
jest.mock("@/utils/database", () => ({
  testDatabaseConnection: jest.fn(),
}));
jest.mock("@/utils/updated-logger", () => ({
  logApiError: jest.fn(),
  logInfo: jest.fn(),
}));

describe("GET /api/v1/quiz", () => {
  const createRequest = () => ({ method: "GET" } as unknown as NextRequest);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a quiz with all question types on success", async () => {
    require("@/utils/database").testDatabaseConnection.mockResolvedValue(true);
    require("@/utils/api-helper")
      .getOneRandomDoc.mockResolvedValueOnce({
        id: "1",
        content: "Grammar?",
        type: "MCQ",
        options: ["A"],
        rightAnswer: ["A"],
        createdAt: new Date(),
        updatedAt: new Date(),
      }) // grammaire
      .mockResolvedValueOnce({
        id: "2",
        passage: "Passage",
        type: "RC",
        relatedQuestions: [
          {
            content: "RC?",
            options: ["B", "C"],
            rightAnswer: ["B"],
            type: "MCQ",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }) // passage
      .mockResolvedValueOnce({
        id: "3",
        content: "Situation?",
        type: "Multi-MCQ",
        options: ["C", "D"],
        rightAnswer: ["C", "D"],
        createdAt: new Date(),
        updatedAt: new Date(),
      }); // situation
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveProperty("questions");
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions.length).toBe(3);
    expect(data.questions[0].type).toBe("MCQ");
    expect(data.questions[1].type).toBe("RC");
    expect(data.questions[2].type).toBe("Multi-MCQ");
  });

  it("returns 500 if database connection fails", async () => {
    require("@/utils/database").testDatabaseConnection.mockResolvedValue(false);
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data).toHaveProperty("message");
  });

  it("returns 404 if no questions are found", async () => {
    require("@/utils/database").testDatabaseConnection.mockResolvedValue(true);
    require("@/utils/api-helper")
      .getOneRandomDoc.mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data).toHaveProperty("message");
  });

  it("returns 500 on unexpected error", async () => {
    require("@/utils/database").testDatabaseConnection.mockImplementation(
      () => {
        throw new Error("fail");
      }
    );
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data).toHaveProperty("message");
  });
});
