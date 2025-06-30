import { testDatabaseConnection } from "../database";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    $runCommandRaw: jest.fn(),
  },
}));

const mockedPrisma = jest.mocked(prisma);

describe("testDatabaseConnection", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
    jest.clearAllMocks();
  });

  it("should return true and log success on successful connection", async () => {
    mockedPrisma.$runCommandRaw.mockResolvedValue({} as any);
    const result = await testDatabaseConnection();
    expect(result).toBe(true);
    expect(prisma.$runCommandRaw).toHaveBeenCalledWith({ ping: 1 });
    expect(console.log).toHaveBeenCalledWith(
      "✅ Database connection successful"
    );
  });

  it("should return false and log an error on failed connection", async () => {
    const dbError = new Error("DB connection failed");
    mockedPrisma.$runCommandRaw.mockRejectedValue(dbError);
    const result = await testDatabaseConnection();
    expect(result).toBe(false);
    expect(prisma.$runCommandRaw).toHaveBeenCalledWith({ ping: 1 });
    expect(console.error).toHaveBeenCalledWith(
      "❌ Database connection error:",
      dbError
    );
  });
});
