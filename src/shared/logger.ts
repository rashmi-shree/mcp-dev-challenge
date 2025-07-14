import winston, { LoggerOptions } from "winston";
import { config } from "../server/config";

const transports: winston.transport[] = [
  new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  new winston.transports.File({ filename: "logs/combined.log" }),
];

// Add console transport for development
if (config.nodeEnv !== "production") {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Create logger configuration
const loggerConfig: LoggerOptions = {
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "mcp-dev-challenge" },
  transports,
};

export const logger = winston.createLogger(loggerConfig);
