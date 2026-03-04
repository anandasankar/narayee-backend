import crypto from 'crypto';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { commonMessages } from '../constants/common.messages';
import { AppError } from '../errors/AppError';
import { GeneratedRefreshToken, RefreshTokenPayload, TokenPayload } from '../types/common.type';
import { HttpStatusCode } from '../types/HttpStatusCode';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const SECRET_KEY = process.env.JWT_SECRET;

export const generateAccessToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, SECRET_KEY, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  } catch {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
  }
};

export const generateRefreshToken = (userId: string, email: string): GeneratedRefreshToken => {
  const tokenId = crypto.randomBytes(32).toString('hex');

  const refreshToken = jwt.sign({ id: userId, email, tokenId }, SECRET_KEY, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });

  return { refreshToken, tokenId };
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    }) as RefreshTokenPayload;
  } catch {
    throw new AppError(HttpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED, false);
  }
};
