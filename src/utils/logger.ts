import fs from "fs/promises";
import path from "path";

/**
 * Enum representing the log levels.
 */
enum LogLevel {
  ERROR = "ERROR",
  INFO = "INFO",
}

/**
 * Interface representing an API error structure.
 */
interface ApiError {
  path?: string;
  method?: string;
  statusCode?: number;
  errorName: string;
  errorMessage: string;
  stack?: string;
  requestBody?: unknown;
}

/**
 * Interface representing a log entry.
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: ApiError;
}

// Define log directory and file path constants.
const LOG_DIR = path.resolve("logs");
const LOG_FILE_PATH = path.join(LOG_DIR, "api-errors.log");
// Define maximum log file size (default: 10MB) and log rotation interval.
const MAX_LOG_SIZE = Number(process.env.MAX_LOG_SIZE) || 10 * 1024 * 1024; // 10MB default
const ROTATION_CHECK_INTERVAL = 1000 * 60 * 5; // Check rotation every 5 minutes

// Track last log rotation check and maintain a write queue for sequential file writes.
let lastRotationCheck = Date.now();
let writeQueue: Promise<void> = Promise.resolve();

/**
 * Ensures that the log directory exists.
 * If the directory does not exist, it is created recursively.
 */
async function ensureLogDirectory() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create logs directory:", error);
  }
}

/**
 * Rotates the log file if it exceeds the maximum allowed size.
 * The current log file is renamed with a timestamp appended to its filename.
 */
async function rotateLogFile() {
  const now = new Date();
  try {
    // Check if the log file exists and get its stats.
    const stats = await fs.stat(LOG_FILE_PATH).catch(() => null);

    if (stats && stats.size >= MAX_LOG_SIZE) {
      const timestamp = now.toISOString().replace(/[:.]/g, "-");
      const newPath = path.join(LOG_DIR, `api-errors-${timestamp}.log`);
      await fs.rename(LOG_FILE_PATH, newPath);
    }
  } catch (error) {
    console.error("Log rotation failed:", error);
  }
}

/**
 * Safely appends the provided log data to the log file.
 * Ensures the log directory exists, checks for file rotation, and writes sequentially using a write queue.
 *
 * @param data - The log data to append.
 * @returns A promise that resolves when the write operation is completed.
 */
async function safeAppendToLog(data: string) {
  writeQueue = writeQueue.then(async () => {
    try {
      await ensureLogDirectory();

      // Check log rotation interval.
      if (Date.now() - lastRotationCheck > ROTATION_CHECK_INTERVAL) {
        await rotateLogFile();
        lastRotationCheck = Date.now();
      }

      // Append the data to the log file.
      await fs.appendFile(LOG_FILE_PATH, data + "\n", "utf8");
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  });

  return writeQueue;
}

/**
 * Creates a log entry object with the given level, message, and optional error data.
 *
 * @param level - The log level (e.g., ERROR, INFO).
 * @param message - The log message.
 * @param error - Optional API error details.
 * @returns A LogEntry object containing the provided log details.
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  error?: ApiError
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    error: error && {
      ...error,
      // Limit stack trace depth for readability.
      stack: error.stack?.split("\n").slice(0, 5).join("\n"),
    },
  };
}

/**
 * Logs an API error with context details to the log file.
 *
 * @param message - Custom message describing the error context.
 * @param error - The caught error from the API.
 * @param context - Additional context including path, method, statusCode, and optional request body.
 */
export async function logApiError(
  message: string,
  error: Error,
  context: {
    path: string;
    method: string;
    statusCode: number;
    requestBody?: unknown;
  }
): Promise<void> {
  const logEntry = createLogEntry(LogLevel.ERROR, message, {
    ...context,
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
    requestBody: context.requestBody,
  });

  await safeAppendToLog(JSON.stringify(logEntry));
}

/**
 * Logs a general error to the log file without additional API context.
 *
 * @param message - Custom message describing the error context.
 * @param error - The error object to log.
 */
export async function logError(message: string, error: Error): Promise<void> {
  const logEntry = createLogEntry(LogLevel.ERROR, message, {
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
  });

  await safeAppendToLog(JSON.stringify(logEntry));
}
