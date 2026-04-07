import { prisma } from '../../lib/prisma';
import logger from '../../logger';
import { allNotifications } from './data';

export async function seedNotifications(): Promise<void> {
  logger.info('--------------------------Seeding notifications...--------------------------');

  for (const notification of allNotifications) {
    const { channels, ...notificationData } = notification;

    // Upsert Notification
    const existing = await prisma.notification.findFirst({
      where: {
        name: notificationData.name,
        eventCode: notificationData.eventCode,
        deleted: false,
      },
    });

    const savedNotification = existing
      ? existing
      : await prisma.notification.create({
          data: notificationData,
        });

    // Upsert Channels + Contents
    for (const ch of channels) {
      const { content, ...channelData } = ch;

      const existingChannel = await prisma.notificationChannel.findFirst({
        where: {
          notificationId: savedNotification.id,
          channel: channelData.channel,
          providerCode: channelData.providerCode,
        },
      });

      const savedChannel = existingChannel
        ? existingChannel
        : await prisma.notificationChannel.create({
            data: {
              ...channelData,
              notificationId: savedNotification.id,
            },
          });

      // Upsert Content
      const existingContent = await prisma.notificationChannelContent.findFirst({
        where: { channelId: savedChannel.id },
      });

      if (!existingContent) {
        await prisma.notificationChannelContent.create({
          data: {
            channelId: savedChannel.id,
            ...content,
          },
        });
      }
    }

    logger.info(`Seeded notification: ${notificationData.name}`);
  }

  logger.info('--------------------------Notifications seeded successfully--------------------------');
}
