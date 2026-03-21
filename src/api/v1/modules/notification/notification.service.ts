import { Notification } from '@prisma/client';
import { AppError } from '../../../../errors/AppError';
import { HttpStatusCode } from '../../../../types/HttpStatusCode';
import { GetAllResponseDTO, UnparsedFilterObject } from '../../../../types/common.type';
import { CreateNotificationDTO, UpdateNotificationDTO } from './notification.interface';
import { notificationMessage } from './notification.message';
import { notificationRepository } from './notification.repository';

class NotificationService {
  async createNotification(data: CreateNotificationDTO): Promise<void> {
    await notificationRepository.createNotification(data);
  }

  async getNotificationById(id: string): Promise<Notification> {
    const notification = await notificationRepository.getNotificationById(id);

    if (!notification) {
      throw new AppError(HttpStatusCode.NOT_FOUND, notificationMessage.NOTIFICATION_NOT_FOUND, false);
    }

    return notification;
  }

  async updateNotification(id: string, data: UpdateNotificationDTO): Promise<void> {
    await this.getNotificationById(id);
    await notificationRepository.updateNotification(id, data);
  }

  // Admin — paginated list of all notifications
  async getAllNotifications(filterObject: UnparsedFilterObject): Promise<GetAllResponseDTO> {
    return await notificationRepository.getAllNotifications({
      paginationData: {
        pageNo: filterObject.pageNo ? parseInt(filterObject.pageNo) : 1,
        limit: filterObject.limit ? parseInt(filterObject.limit) : 10,
      },
      filters: filterObject.filter ? JSON.parse(filterObject.filter) : undefined,
    });
  }

  // Public — only active, published, non-expired notifications
  async getActiveNotifications(filterObject: UnparsedFilterObject): Promise<GetAllResponseDTO> {
    return await notificationRepository.getActiveNotifications({
      paginationData: {
        pageNo: filterObject.pageNo ? parseInt(filterObject.pageNo) : 1,
        limit: filterObject.limit ? parseInt(filterObject.limit) : 10,
      },
      filters: filterObject.filter ? JSON.parse(filterObject.filter) : undefined,
    });
  }

  async deleteNotification(id: string): Promise<void> {
    await this.getNotificationById(id);
    await notificationRepository.deleteNotification(id);
  }
}

export const notificationService = new NotificationService();
