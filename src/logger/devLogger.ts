import winston, { createLogger, format, transports } from 'winston';
const { timestamp, combine, printf, errors, colorize, simple } = format;

const buildDevLogger = (): winston.Logger => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  });

  return createLogger({
    level: 'debug',

    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),

    transports: [
      new transports.Console(),

      new transports.File({
        filename: 'log/error.log',
        level: 'error',
      }),
    ],

    exceptionHandlers: [
      new transports.Console({
        format: combine(colorize(), simple()),
      }),

      new transports.File({
        filename: 'log/exceptions.log',
      }),
    ],

    rejectionHandlers: [
      new transports.Console({
        format: combine(colorize(), simple()),
      }),

      new transports.File({
        filename: 'log/rejections.log',
      }),
    ],
  });
};

export default buildDevLogger;
