import { publishUserCreatedEvent } from '../messageBroker/publishers/user.publisher';
import { UserCreateEvent } from '../types/systemTypes/user.event.type';

export const onUserCreate = async (data: UserCreateEvent): Promise<void> => {
  await publishUserCreatedEvent(data);
};
