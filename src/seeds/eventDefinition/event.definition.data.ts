import { EventType } from '@prisma/client';
import { EventCode } from '../../types/notificationTypes/event.definition.type';

export const eventDefinitions = [
  {
    code: EventCode.USER_CREATED,
    name: 'User Created',
    description: 'Triggered when a new user registers',
    eventType: EventType.SYSTEM,
  },
  {
    code: EventCode.PASSWORD_RESET,
    name: 'Password Reset',
    description: 'Triggered when user resets password',
    eventType: EventType.SYSTEM,
  },
  {
    code: EventCode.PAYMENT_SUCCESS,
    name: 'Payment Success',
    description: 'Triggered when payment is successful',
    eventType: EventType.CUSTOM,
  },
  {
    code: EventCode.OTP_REQUESTED,
    name: 'Send OTP',
    description: 'Triggered when OTP is sent to user',
    eventType: EventType.SYSTEM,
  },
];
