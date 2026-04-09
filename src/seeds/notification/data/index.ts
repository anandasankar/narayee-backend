import { otpNotifications } from './otp.sent.data';
import { userNotifications } from './user.event.data';

export const allNotifications = [...userNotifications, ...otpNotifications];
