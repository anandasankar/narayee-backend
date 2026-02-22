import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from '../logger/logger';
import { sendResponse } from '../utils/sendResponse';
import { Request, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
export const morganMiddleware = morgan(isProduction ? 'combined' : 'dev');

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded: ${req.ip}`);
    sendResponse(res, {
      success: false,
      statusCode: 429,
      message: 'Too many requests',
    });
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  handler: (req: Request, res: Response) => {
    logger.warn(`Auth rate limit exceeded: ${req.ip}`);
    sendResponse(res, {
      success: false,
      statusCode: 429,
      message: 'Too many login attempts',
    });
  },
});
