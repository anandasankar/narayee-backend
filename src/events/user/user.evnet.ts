import { publishUserCreatedEvent } from '../../messageBroker/events/publishers/user.publisher';
import { OnUserCreateParams } from './user.event.interface';

export const onUserCreate = async (data: OnUserCreateParams): Promise<void> => {
  await publishUserCreatedEvent(data);
};
