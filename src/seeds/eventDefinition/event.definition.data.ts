import { EventType } from '@prisma/client';
import { EventDefinitionCode } from './event.definition.type';

export const eventDefinitions = [
  {
    code: EventDefinitionCode.USER_CREATED,
    name: 'User Created',
    description: 'Triggered when a new user registers',
    eventType: EventType.SYSTEM,
  },
  {
    code: EventDefinitionCode.PASSWORD_RESET,
    name: 'Password Reset',
    description: 'Triggered when user resets password',
    eventType: EventType.SYSTEM,
  },
  {
    code: EventDefinitionCode.PAYMENT_SUCCESS,
    name: 'Payment Success',
    description: 'Triggered when payment is successful',
    eventType: EventType.CUSTOM,
  },
  {
    code: EventDefinitionCode.OTP_REQUESTED,
    name: 'Send OTP',
    description: 'Triggered when OTP is sent to user',
    eventType: EventType.SYSTEM,
  },
];
