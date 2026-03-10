import { CookieOptions, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const COOKIE_TTL = 24 * 60 * 60 * 1000;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: COOKIE_TTL,
};

if (process.env.AUTH_COOKIE_DOMAIN) {
  baseCookieOptions.domain = process.env.AUTH_COOKIE_DOMAIN;
}

export const setAuthCookies = (res: Response, accessToken: string): void => {
  res.cookie('accessToken', accessToken, baseCookieOptions);
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken', baseCookieOptions);
};
