import dotenv from 'dotenv';
import app from './app';
import logger from './logger';
import { connectRedis } from './redis/redis.client';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectRedis();
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
});
