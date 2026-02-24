import winston, { createLogger, format, transports } from 'winston';

const { timestamp, combine, errors, json } = format;

const buildProdLogger = (): winston.Logger => {
  return createLogger({
    level: 'info',

    format: combine(timestamp(), errors({ stack: true }), json()),

    defaultMeta: {},

    transports: [
      new transports.Console(),

      new transports.File({
        filename: 'log/error.log',
        level: 'error',
      }),
    ],

    exceptionHandlers: [
      new transports.File({
        filename: 'log/exceptions.log',
      }),
    ],

    rejectionHandlers: [
      new transports.File({
        filename: 'log/rejections.log',
      }),
    ],
  });
};

export default buildProdLogger;
