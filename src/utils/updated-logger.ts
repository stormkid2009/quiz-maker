import fs from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

/**
 * Enum representing the log levels.
 */
enum LogLevel {
  ERROR = "ERROR",
  INFO = "INFO",
  WARN = "WARN",
  DEBUG = "DEBUG",
}

/**
 * Interface representing an API error structure for Next.js App Router.
 */
interface ApiError {
  path: string;
  method: string;
  statusCode: number;
  errorName: string;
  errorMessage: string;
  stack?: string;
  requestData?: {
    query?: Record<string, string>;
    params?: Record<string, string>;
    headers?: Record<string, string>;
    body?: unknown;
  };
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
 * Extract relevant information from a NextRequest object
 * 
 * @param request - The NextRequest object
 * @returns Object containing extracted request data
 */
function extractRequestData(request: NextRequest | Request) {
  try {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    
    // Extract headers (limited set for security/privacy)
    const headers: Record<string, string> = {};
    const importantHeaders = [
      'content-type',
      'user-agent',
      'referer',
      'x-request-id',
      'x-correlation-id',
      'x-forwarded-for'
    ];
    
    request.headers.forEach((value, key) => {
      if (importantHeaders.includes(key.toLowerCase())) {
        headers[key] = value;
      }
    });
    
    // Extract search params
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });
    
    return {
      path,
      method,
      headers,
      query
    };
  } catch (error) {
    console.error("Failed to extract request data:", error);
    return {
      path: "unknown",
      method: "unknown"
    };
  }
}

/**
 * Logs an API error with context details to the log file.
 * Compatible with Next.js App Router and NextRequest/NextResponse.
 *
 * @param message - Custom message describing the error context.
 * @param error - The caught error from the API.
 * @param context - Additional context including request, statusCode, and optional params.
 */
export async function logApiError(
  message: string,
  error: Error,
  context: {
    request?: NextRequest | Request;
    path?: string;
    method?: string;
    statusCode: number;
    params?: Record<string, string>;
    requestBody?: unknown;
  }
): Promise<void> {
  // Extract request data if request object is provided
  let requestData: any = {};
  
  if (context.request) {
    const extractedData = extractRequestData(context.request);
    requestData = {
      query: extractedData.query,
      headers: extractedData.headers
    };
    
    // Use extracted path and method if not explicitly provided
    if (!context.path) context.path = extractedData.path;
    if (!context.method) context.method = extractedData.method;
  }
  
  // Add params and body if provided
  if (context.params) requestData.params = context.params;
  if (context.requestBody) requestData.body = context.requestBody;
  
  const logEntry = createLogEntry(LogLevel.ERROR, message, {
    path: context.path || "unknown",
    method: context.method || "unknown",
    statusCode: context.statusCode,
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
    requestData: Object.keys(requestData).length > 0 ? requestData : undefined
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
    path: "unknown",
    method: "unknown",
    statusCode: 500,
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
  });

  await safeAppendToLog(JSON.stringify(logEntry));
}

/**
 * Logs an informational message to the log file.
 * 
 * @param message - The informational message to log.
 */
export async function logInfo(message: string): Promise<void> {
  const logEntry = createLogEntry(LogLevel.INFO, message);
  await safeAppendToLog(JSON.stringify(logEntry));
}

/**
 * Logs a warning message to the log file.
 * 
 * @param message - The warning message to log.
 * @param details - Optional additional details.
 */
export async function logWarn(
  message: string, 
  details?: Record<string, unknown>
): Promise<void> {
  const logEntry = createLogEntry(LogLevel.WARN, message, details as any);
  await safeAppendToLog(JSON.stringify(logEntry));
}
