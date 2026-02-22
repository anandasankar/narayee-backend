import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const devLogger = winston.createLogger({
  level: 'debug',

  format: winston.format.combine(
    winston.format.colorize(),

    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),

    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
  ),

  transports: [new winston.transports.Console()],
});

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const prodLogger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),

    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),

      level: 'error',
    }),
    new winston.transports.Console(),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
    }),
  ],
});

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
export default logger;
