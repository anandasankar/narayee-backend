import cors from 'cors';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { commonMessages } from '../constants/common.messages';
import logger from '../logger';
import { HttpStatusCode } from '../types/HttpStatusCode';
import { sendResponse } from './send.response';

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
  max: 3,

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

/**
 * CORS Options
 */
export const corsOptions = (): RequestHandler => {
  const whitelist = process.env.CORS_ORIGIN_URLS?.split(',') || [];

  return cors({
    optionsSuccessStatus: 200,
    credentials: true,

    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (whitelist.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
  });
};
