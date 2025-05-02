//Main export file

// Re-export everything for clean imports
export * from "./types";
export * from "./loggers/api";
export * from "./loggers/error";
export * from "./loggers/info";
export * from "./loggers/warn";

// Optional: Create a Logger class for more OOP approach
import { LoggerConfig } from "./types";
import { LogFormatter, createFormatter } from "./formatters";
import { setFormatter } from "./writers";

export class Logger {
  constructor(config?: LoggerConfig) {
    // Initialize with custom config

    // Set up formatter based on config
    if (config?.format) {
      const formatter = createFormatter(
        config.format,
        config.formatOptions
      );
      setFormatter(formatter);
    }
  }
  // Set a new formatter at runtime
  setFormat(format: 'json' | 'text' | 'csv', options?: any): void {
    const formatter = createFormatter(format, options);
    setFormatter(formatter);
  }

  // Set a custom formatter implementation
  setCustomFormatter(formatter: LogFormatter): void {
    setFormatter(formatter);
  }

  // Other logger methods
  error(message: string, error: Error) {
    // Implementation
  }

  apiError(message: string, error: Error, context: any) {
    // Implementation
  }

  info(message: string) {
    // Implementation
  }

  warn(message: string, details?: Record<string, unknown>) {
    // Implementation
  }
}
