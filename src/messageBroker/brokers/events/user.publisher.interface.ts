export const USER_CREATED_ROUTING_KEY = 'user.created';

export interface UserCreatedEvent {
  type: typeof USER_CREATED_ROUTING_KEY;
  payload: {
    userId: string;
    email?: string | null;
    mobileNumber: string;
    fullName: string;
  };
}
