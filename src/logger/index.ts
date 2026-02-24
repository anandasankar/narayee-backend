import winston from 'winston';
import buildDevLogger from './devLogger';
import buildProdLogger from './prodLogger';

let logger: winston.Logger;

if (process.env.NODE_ENV !== 'production') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;
