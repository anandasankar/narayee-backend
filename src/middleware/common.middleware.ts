import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sendResponse } from '../utils/sendResponse';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { commonMessages } from '../constants/common.messages';
import { HttpStatusCode } from '../types/HttpStatusCode';

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
      statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
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
      statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
      message: 'Too many login attempts',
    });
  },
});

export const requestValidator = (
  err: SyntaxError & { status?: number; body?: unknown },
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    sendResponse(res, {
      message: commonMessages.INVALID_JSON,
      statusCode: 400,
      success: false,
    });
  } else {
    next();
  }
};
