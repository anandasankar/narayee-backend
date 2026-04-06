import dotenv from 'dotenv';
import app from './app';
import logger from './logger';
import { BrokerFactory } from './messageBroker/brokers/BrokerFactory';
import { ConsumerFactory } from './messageBroker/consumers/ConsumerFactory';
import { BROKER_TYPES } from './messageBroker/types/brokerType';
import { connectRedis } from './redis/redis.client';

dotenv.config();

const PORT = process.env.PORT || 5000;

const shutdown = async (signal: string): Promise<void> => {
  logger.warn(`[Server] ${signal} received — shutting down...`);
  const brokers = BrokerFactory.getAllBrokers();
  await Promise.all(brokers.map((broker) => broker.disconnect()));
  process.exit(0);
};

const start = async (): Promise<void> => {
  await connectRedis();

  const broker = BrokerFactory.create(BROKER_TYPES.rabbitmq);
  await broker.connect();

  await ConsumerFactory.runAll();

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
  });

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
