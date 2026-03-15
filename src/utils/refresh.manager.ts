import crypto from 'crypto';
import { redisClient } from '../redis/redis.client';

const REFRESH_EXPIRE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Store Refresh Token
 */
export const storeRefreshToken = async (
  userId: string,
  tokenId: string,
  refreshToken: string,
): Promise<void> => {
  const hashed = hashToken(refreshToken);

  await redisClient.set(`refresh:${userId}:${tokenId}`, hashed, { EX: REFRESH_EXPIRE_SECONDS });
};

/**
 * Validate Refresh Token
 */
export const validateStoredRefreshToken = async (
  userId: string,
  tokenId: string,
  refreshToken: string,
): Promise<boolean> => {
  const key = `refresh:${userId}:${tokenId}`;
  const storedHash = await redisClient.get(key);

  if (!storedHash) return false;

  return storedHash === hashToken(refreshToken);
};

/**
 * Delete Refresh Token
 */
export const deleteRefreshToken = async (userId: string, tokenId: string): Promise<void> => {
  await redisClient.del(`refresh:${userId}:${tokenId}`);
};

/**
 * Delete User All Refresh Token
 */
export const deleteAllUserRefreshTokens = async (userId: string): Promise<void> => {
  const pattern = `refresh:${userId}:*`;
  const keys = await redisClient.keys(pattern);

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
