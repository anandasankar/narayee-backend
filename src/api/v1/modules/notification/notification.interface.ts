import { NotificationType } from '@prisma/client';

export interface CreateNotificationDTO {
  title: string;
  description: string;
  type: NotificationType;
  publishedAt?: Date;
  expiresAt?: Date;
}

export type UpdateNotificationDTO = Partial<CreateNotificationDTO> & {
  active?: boolean;
};

export interface NotificationFilterDTO {
  title?: string;
  type?: NotificationType;
  active?: boolean;
}
