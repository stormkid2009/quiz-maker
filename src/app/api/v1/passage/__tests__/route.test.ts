import { GET } from "../route";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

jest.mock("@/lib/prisma", () => ({
  passage: {
    findMany: jest.fn().mockResolvedValue([]),
  },
}));
jest.mock("@/utils/api-helper", () => ({
  getOneRandomDoc: jest.fn(),
}));
jest.mock("@/utils/database", () => ({
  testDatabaseConnection: jest.fn(),
}));
jest.mock("@/utils/updated-logger", () => ({
  logApiError: jest.fn(),
}));

describe("GET /api/v1/passage", () => {
  const createRequest = (method = "GET") =>
    ({
      method,
      nextUrl: { pathname: "/api/v1/passage" },
    } as unknown as NextRequest);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a reading comprehension question on success", async () => {
    const question = {
      id: 1,
      passage: "Reading passage text...",
      relatedQuestions: [
        {
          id: 1,
          question: "What is the main idea of the passage?",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: "Option 1",
        },
      ],
    };
    require("@/utils/database").testDatabaseConnection.mockResolvedValue(true);
    require("@/utils/api-helper").getOneRandomDoc.mockResolvedValue(question);
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual(question);
  });

  it("returns 405 for wrong method", async () => {
    const req = createRequest("POST");
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(405);
    expect(data).toEqual({ error: expect.any(String) });
  });

  it("returns 500 if database connection fails", async () => {
    require("@/utils/database").testDatabaseConnection.mockResolvedValue(false);
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data).toEqual({ error: expect.any(String) });
  });

  it("returns 404 if no question found", async () => {
    require("@/utils/database").testDatabaseConnection.mockResolvedValue(true);
    require("@/utils/api-helper").getOneRandomDoc.mockResolvedValue(null);
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data).toEqual({ error: expect.any(String) });
  });

  it("returns 500 on Zod validation error", async () => {
    require("@/utils/database").testDatabaseConnection.mockResolvedValue(true);
    require("@/utils/api-helper").getOneRandomDoc.mockImplementation(() => {
      throw new ZodError([]);
    });
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data).toEqual({ error: expect.any(String) });
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
    expect(data).toEqual({ error: expect.any(String) });
  });
});
