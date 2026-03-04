import dotenv from 'dotenv';
import { createClient } from 'redis';
import logger from '../logger';

dotenv.config();

if (!process.env.REDIS_CONNECTION_URL) {
  throw new Error('REDIS_CONNECTION_URL is not defined');
}

export const redisConnectionUrl = process.env.REDIS_CONNECTION_URL;

export const redisClient = createClient({
  url: redisConnectionUrl,
});

/* Register events ONCE */
redisClient.on('connect', () => {
  logger.info('Redis connecting...');
});

redisClient.on('ready', () => {
  logger.info(`Redis client ready on ${redisConnectionUrl}`);
});

redisClient.on('error', (err: Error) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('end', () => {
  logger.warn('Redis client disconnected');
});

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
};

/* Graceful Shutdown */
const shutdownRedis = async (): Promise<void> => {
  try {
    logger.info('Shutting down Redis client...');
    await redisClient.quit();
    logger.info('Redis connection closed.');
  } catch (error) {
    logger.error('Error during Redis shutdown:', error);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdownRedis);
process.on('SIGTERM', shutdownRedis);
