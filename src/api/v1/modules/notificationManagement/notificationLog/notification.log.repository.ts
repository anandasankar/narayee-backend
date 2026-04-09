import { NotificationLog } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { CreateNotificationLogDTO, UpdateNotificationLogDTO } from './notification.log.interface';

class NotificationLogRepository {
  async createNotificationLog(data: CreateNotificationLogDTO): Promise<NotificationLog> {
    return await prisma.notificationLog.create({
      data: {
        senderType: data.senderType,
        senderId: data.senderId,
        notificationId: data.notificationId,
        recipientId: data.recipientId,
        recipientType: data.recipientType,
        contentId: data.contentId,
        subject: data.subject,
        messageBody: data.messageBody,
        status: data.status,
        providerId: data.providerId,
        channelType: data.channelType,
        logType: data.logType,
        notificationChannelId: data.notificationChannelId,
      },
    });
  }

  async createManyNotificationLogs(data: CreateNotificationLogDTO[]): Promise<number> {
    const result = await prisma.notificationLog.createMany({
      data: data.map((d) => ({
        senderType: d.senderType,
        senderId: d.senderId,
        notificationId: d.notificationId,
        recipientId: d.recipientId,
        recipientType: d.recipientType,
        contentId: d.contentId,
        subject: d.subject,
        messageBody: d.messageBody,
        status: d.status,
        providerId: d.providerId,
        channelType: d.channelType,
        logType: d.logType,
        notificationChannelId: d.notificationChannelId,
      })),
    });
    return result.count;
  }

  async updateNotificationLog(id: string, data: UpdateNotificationLogDTO): Promise<void> {
    await prisma.notificationLog.update({
      where: { id },
      data,
    });
  }

  async markAsRead(id: string): Promise<void> {
    await prisma.notificationLog.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsReadForRecipient(recipientId: string): Promise<void> {
    await prisma.notificationLog.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true },
    });
  }

  async incrementAttempt(id: string): Promise<void> {
    await prisma.notificationLog.update({
      where: { id },
      data: { attempt: { increment: 1 } },
    });
  }

  async getUnreadCountForRecipient(recipientId: string): Promise<number> {
    return await prisma.notificationLog.count({
      where: { recipientId, isRead: false },
    });
  }
}

export const notificationLogRepository = new NotificationLogRepository();
