// File handling & rotation logic

import fs from "fs/promises";
import { DEFAULT_CONFIG } from "./constants";
import path from "path";
import { LogFormatter, createFormatter } from "./formatters";
import { LogEntry } from "./types";

// Store the formatter instance
let formatter: LogFormatter = createFormatter('json',{maxStackDepth:5});

// .......
let writeQueue: Promise<void> = Promise.resolve();
let lastRotationCheck = Date.now();

const { LOG_DIR, LOG_FILE_PATH, MAX_LOG_SIZE ,ROTATION_CHECK_INTERVAL } = DEFAULT_CONFIG;

export async function ensureLogDirectory(logDir = LOG_DIR) {
  // Implementation
  try {
    await fs.mkdir(logDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create logs directory: ", error);
  }
}

export async function rotateLogFile(logFilePath = LOG_FILE_PATH, maxSize = MAX_LOG_SIZE) {
  // Implementation


  const now = new Date();
  try {
    // Check if the log file exists and get its stats.
    const stats = await fs.stat(logFilePath).catch(() => null);

    if (stats && stats.size >= maxSize) {
      const timestamp = now.toISOString().replace(/[:.]/g, "-");
      const newPath = path.join(LOG_DIR, `api-errors-${timestamp}.log`);
      await fs.rename(logFilePath, newPath);
    }
  } catch (error) {
    console.error("Log rotation failed: ", error);
  }
}

// Allow changing the formatter
export function setFormatter(newFormatter: LogFormatter): void {
  formatter = newFormatter;
}


export async function safeAppendToLog(entry: LogEntry, logFilePath = LOG_FILE_PATH): Promise<void> {
  // Implementation
  // Format the entry before writing
  const formattedData = formatter.format(entry) + '\n';
  writeQueue = writeQueue.then(async () => {
    try {
      await ensureLogDirectory();

      // Check log rotation interval.
      if (Date.now() - lastRotationCheck > ROTATION_CHECK_INTERVAL) {
        await rotateLogFile();
        lastRotationCheck = Date.now();
      }

      // Append the data to the log file.
      await fs.appendFile(LOG_FILE_PATH, formattedData, "utf8");
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  });

  return writeQueue;
}
