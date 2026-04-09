import { EventCode } from '../types/notificationTypes/event.definition.type';
import { UserCreatedEvent } from '../types/notificationTypes/user.event.type';

export interface BaseEventPayload {
  userId: string;
}

export interface EventPayloadMap {
  [EventCode.USER_CREATED]: UserCreatedEvent;
}
