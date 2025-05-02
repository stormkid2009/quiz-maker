// Type definitions and interfacexs

/**
 * Enum representing the log levels
 */
export enum LogLevel {
  ERROR = "ERROR",
  INFO = "INFO",
  WARN = "WARN",
  DEBUG = "DEBUG",
}

/**
 * Interface representing an API error structure of next.js App Router.
 */

export interface ApiError {
  // Your existing ApiError interface
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
  }
}

/**
  * Interface representing a log entry.
  */

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: ApiError;
  // Other properties
}


export interface LoggerConfig {
  logDir?: string;
  maxLogSize?: number;
  rotationInterval?: number;
  // Other configuration options
}
