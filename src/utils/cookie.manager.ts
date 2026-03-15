import { CookieOptions, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

const ACCESS_COOKIE_TTL = 1 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_TTL = 7 * 24 * 60 * 60 * 1000;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

if (process.env.AUTH_COOKIE_DOMAIN) {
  baseCookieOptions.domain = process.env.AUTH_COOKIE_DOMAIN;
}

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_COOKIE_TTL,
  });

  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_COOKIE_TTL,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken', baseCookieOptions);
  res.clearCookie('refreshToken', baseCookieOptions);
};
