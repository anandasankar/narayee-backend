import logger from '../../../logger';
import { BrokerFactory } from '../../brokers/BrokerFactory';
import { BROKER_TYPES } from '../../types/brokerType';
import { USER_CREATED_ROUTING_KEY, UserCreatedEvent } from '../../types/user.publisher.interface';

const broker = BrokerFactory.create(BROKER_TYPES.rabbitmq);

export const publishUserCreatedEvent = async (payload: UserCreatedEvent['payload']): Promise<void> => {
  try {
    const event: UserCreatedEvent = {
      type: USER_CREATED_ROUTING_KEY,
      payload,
    };

    await broker.publish(USER_CREATED_ROUTING_KEY, event);

    logger.info(`[Publisher] 📤 ${USER_CREATED_ROUTING_KEY} published`, {
      userId: payload.userId,
    });
  } catch (err) {
    logger.error(`[Publisher] ❌ Failed to publish ${USER_CREATED_ROUTING_KEY}`, {
      userId: payload.userId,
      error: err,
    });
    throw err;
  }
};
