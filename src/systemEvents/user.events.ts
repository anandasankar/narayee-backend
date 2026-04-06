import { publishUserCreatedEvent } from '../messageBroker/publishers/user.publisher';

export const onUserCreate = async (data: {
  userId: string;
  email?: string | null;
  mobileNumber: string;
  fullName: string;
}): Promise<void> => {
  await publishUserCreatedEvent(data);
};
