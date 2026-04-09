import { BaseEventPayload } from '../../eventHandler/event.handler.interface';
import { EventCode } from './event.definition.type';

export interface UserCreatedEvent extends BaseEventPayload {
  type: EventCode.USER_CREATED;
  data: {
    fullName: string;
  };
}
