// Congiguration constants

import path from "path";

export const DEFAULT_CONFIG = {
  // Define log directory and file path constants.
  LOG_DIR: path.resolve("logs"),
  LOG_FILE_PATH: path.join(path.resolve("logs"), "api-errors.log"),
  // Define maximum log file size and log rotation interval.
  MAX_LOG_SIZE: 10 * 1024 * 1024, // 10MB
  ROTATION_CHECK_INTERVAL: 1000 * 60 * 5, // 5 minutes
};
