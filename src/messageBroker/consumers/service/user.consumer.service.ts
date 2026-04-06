import logger from '../../../logger';
import { BrokerFactory } from '../../brokers/BrokerFactory';
import {
  USER_CREATED_ROUTING_KEY,
  UserCreatedEvent,
} from '../../brokers/events/user.publisher.interface';
import { BROKER_TYPES } from '../../types/brokerType';

const broker = BrokerFactory.create(BROKER_TYPES.rabbitmq);

export const userCreatedConsumer = async (): Promise<void> => {
  try {
    await broker.subscribe<UserCreatedEvent>(
      USER_CREATED_ROUTING_KEY,
      async (event) => {
        try {
          logger.info(`[Consumer] 📨 ${USER_CREATED_ROUTING_KEY} received`, {
            userId: event.payload.userId,
            email: event.payload.email,
          });

          // TODO: your business logic
          // await emailService.sendWelcome(event.payload)
          // await notificationService.send(event.payload)
        } catch (err) {
          logger.error(`[Consumer] ❌ Failed to process ${USER_CREATED_ROUTING_KEY}`, {
            userId: event.payload.userId,
            error: err,
          });
          throw err; // RabbitMQBroker catches this → nack → DLQ
        }
      },
      { queueName: USER_CREATED_ROUTING_KEY, durable: true },
    );

    logger.info(`[Consumer] ✅ userCreatedConsumer listening on [${USER_CREATED_ROUTING_KEY}]`);
  } catch (err) {
    logger.error('[Consumer] ❌ Failed to start userCreatedConsumer', err);
  }
};
