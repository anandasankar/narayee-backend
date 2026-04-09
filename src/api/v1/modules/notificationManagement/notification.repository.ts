import { NotificationChannelContent } from '@prisma/client';
import { prisma } from '../../../../lib/prisma';
import { GetNotificationResponse } from './notification.interface';

class NotificationRepository {
  async getNotificationByEventCode(eventCode: string): Promise<GetNotificationResponse | null> {
    const notification = await prisma.notification.findFirst({
      where: {
        eventCode: eventCode,
        active: true,
        deleted: false,
      },
      include: {
        channels: {
          include: {
            notificationProvider: true,
          },
        },
      },
    });

    if (!notification) return null;

    return {
      id: notification.id,
      name: notification.name,
      eventCode: notification.eventCode,

      channels: notification.channels.map((channel) => ({
        id: channel.id,
        channel: channel.channel,
        providerCode: channel.providerCode,
        providerId: channel.notificationProvider?.id || null,
        enabled: channel.enabled,
      })),
    };
  }

  async getContentByChannelIds(channelIds: string[]): Promise<NotificationChannelContent[]> {
    if (!channelIds.length) return [];

    return prisma.notificationChannelContent.findMany({
      where: {
        channelId: {
          in: channelIds,
        },
      },
    });
  }
}

export const notificationRepository = new NotificationRepository();
