import { eventHandler } from '../../../eventHandler/event.handler';
import logger from '../../../logger';
import { EventCode } from '../../../types/notificationTypes/event.definition.type';
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

          await eventHandler.handleEvent(EventCode.USER_CREATED, {
            type: EventCode.USER_CREATED,
            userId: event.payload.userId,
            data: {
              fullName: event.payload.fullName,
            },
          });
        } catch (err) {
          logger.error(`[Consumer] Failed to process ${USER_CREATED_ROUTING_KEY}`, {
            userId: event.payload.userId,
            error: err,
          });
          throw err;
        }
      },
      { queueName: USER_CREATED_ROUTING_KEY, durable: true },
    );

    logger.info(`[Consumer] userCreatedConsumer listening on [${USER_CREATED_ROUTING_KEY}]`);
  } catch (err) {
    logger.error('[Consumer] Failed to start userCreatedConsumer', err);
  }
};
