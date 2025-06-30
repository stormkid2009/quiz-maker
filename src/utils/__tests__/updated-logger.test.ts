import {
  logApiError,
  logError,
  logInfo,
  logWarn,
  _setLastRotationCheck,
  writeQueue,
} from "../updated-logger";
import fs from "fs/promises";
import path from "path";
// We don't need NextRequest for the test, a plain object will do.

// Mock fs/promises
jest.mock("fs/promises");
const mockedFs = jest.mocked(fs);

describe("Updated Logger", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  const LOG_DIR = path.resolve("logs");
  const LOG_FILE_PATH = path.join(LOG_DIR, "api-errors.log");

  beforeEach(() => {
    // Reset mocks and spies
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Mock fs functions
    mockedFs.mkdir.mockResolvedValue(undefined);
    mockedFs.stat.mockResolvedValue({ size: 100 } as any);
    mockedFs.rename.mockResolvedValue(undefined);
    mockedFs.appendFile.mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe("logApiError", () => {
    it("should log a detailed API error", async () => {
      const error = new Error("Test API Error");
      const request = {
        url: "http://test.com/api/test?param=1",
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        json: async () => ({ key: "value" }),
      };

      await logApiError("API call failed", error, {
        request: request as any,
        statusCode: 500,
      });
      await writeQueue;

      expect(mockedFs.appendFile).toHaveBeenCalledTimes(1);
      const logContent = JSON.parse(
        mockedFs.appendFile.mock.calls[0][1] as string
      );
      expect(logContent.level).toBe("ERROR");
      expect(logContent.message).toBe("API call failed");
      expect(logContent.error.errorMessage).toBe("Test API Error");
      expect(logContent.error.path).toBe("/api/test");
      expect(logContent.error.statusCode).toBe(500);
    });
  });

  describe("logError", () => {
    it("should log a general error", async () => {
      const error = new Error("General Error");
      await logError("Something went wrong", error);
      await writeQueue;

      expect(mockedFs.appendFile).toHaveBeenCalledTimes(1);
      const logContent = JSON.parse(
        mockedFs.appendFile.mock.calls[0][1] as string
      );
      expect(logContent.level).toBe("ERROR");
      expect(logContent.message).toBe("Something went wrong");
      expect(logContent.error.errorMessage).toBe("General Error");
    });
  });

  describe("logInfo", () => {
    it("should log an info message", async () => {
      await logInfo("User logged in");
      await writeQueue;

      expect(mockedFs.appendFile).toHaveBeenCalledTimes(1);
      const logContent = JSON.parse(
        mockedFs.appendFile.mock.calls[0][1] as string
      );
      expect(logContent.level).toBe("INFO");
      expect(logContent.message).toBe("User logged in");
    });
  });

  describe("logWarn", () => {
    it("should log a warning message", async () => {
      await logWarn("Deprecated API used");
      await writeQueue;

      expect(mockedFs.appendFile).toHaveBeenCalledTimes(1);
      const logContent = JSON.parse(
        mockedFs.appendFile.mock.calls[0][1] as string
      );
      expect(logContent.level).toBe("WARN");
      expect(logContent.message).toBe("Deprecated API used");
    });
  });

  describe("Log Rotation", () => {
    it("should rotate log file if size exceeds MAX_LOG_SIZE", async () => {
      mockedFs.stat.mockResolvedValue({ size: 11 * 1024 * 1024 } as any);
      _setLastRotationCheck(Date.now() - 1000 * 60 * 6); // 6 minutes ago

      await logInfo("trigger rotation");
      await writeQueue;

      expect(mockedFs.rename).toHaveBeenCalledTimes(1);
      const oldPath = mockedFs.rename.mock.calls[0][0];
      const newPath = mockedFs.rename.mock.calls[0][1];
      expect(oldPath).toBe(LOG_FILE_PATH);
      expect(newPath).toContain("api-errors-");
    });
  });
});
