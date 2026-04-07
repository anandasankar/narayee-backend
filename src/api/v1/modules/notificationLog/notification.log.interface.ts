import {
  ChannelType,
  MessageStatus,
  NotificationLogType,
  RecipientType,
  SenderType,
} from '@prisma/client';

export interface CreateNotificationLogDTO {
  senderType?: SenderType;
  senderId?: string;
  notificationId?: string;
  recipientId?: string;
  recipientType: RecipientType;
  contentId?: string;
  subject?: string;
  messageBody?: string;
  status?: MessageStatus;
  providerId?: string;
  channelType?: ChannelType;
  logType?: NotificationLogType;
  notificationChannelId?: string;
}

export interface UpdateNotificationLogDTO {
  status?: MessageStatus;
  errorMessage?: string;
  attempt?: number;
  sentAt?: Date | null;
  isRead?: boolean;
}
