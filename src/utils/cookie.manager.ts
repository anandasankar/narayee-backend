import { Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const setAuthCookies = (res: Response, accessToken: string): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    domain: process.env.AUTH_COOKIE_DOMAIN,
    maxAge: 15 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    domain: process.env.AUTH_COOKIE_DOMAIN,
  });
};
