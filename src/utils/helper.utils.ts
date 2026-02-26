import cors from 'cors';
import { RequestHandler } from 'express';

/**
 * Pagination Method
 */
export const paginationMethod = (pageNo: number, limit: number): { skip: number; take: number } => {
  const skip = (pageNo - 1) * limit;

  return {
    skip: skip || 0,
    take: limit || 10,
  };
};

/**
 * Parse Cookies
 */
export const parseCookies = (cookies: string): string => {
  let cookieArray = cookies.split(';');

  const accessTokenCookie = cookieArray.find((cookie) => cookie.startsWith('access_token='));

  cookieArray = accessTokenCookie?.split('=') || [];

  return cookieArray[1];
};

/**
 * Random File Name Generator
 */
export const fileRandomName = (length: number, extension = ''): string => {
  const timestamp = Date.now();

  const randomString = Math.random()
    .toString(36)
    .substring(2, 2 + length);

  return `${timestamp}${randomString}${extension ? '.' + extension : ''}`;
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
