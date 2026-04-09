export interface UserCreateEvent {
  userId: string;
  email?: string | null;
  mobileNumber: string;
  fullName: string;
}
