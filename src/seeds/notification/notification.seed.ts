import { prisma } from '../../lib/prisma';
import logger from '../../logger';
import { allNotifications } from './data';

export async function seedNotifications(): Promise<void> {
  logger.info('--------------------------Seeding notifications...--------------------------');

  for (const notification of allNotifications) {
    const { channels, ...notificationData } = notification;

    let savedNotification = await prisma.notification.findFirst({
      where: {
        name: notificationData.name,
        eventCode: notificationData.eventCode,
        deleted: false,
      },
    });

    if (savedNotification) {
      savedNotification = await prisma.notification.update({
        where: { id: savedNotification.id },
        data: notificationData,
      });
    } else {
      savedNotification = await prisma.notification.create({
        data: notificationData,
      });
    }

    for (const ch of channels) {
      const { content, ...channelData } = ch;

      let savedChannel = await prisma.notificationChannel.findFirst({
        where: {
          notificationId: savedNotification.id,
          channel: channelData.channel,
          providerCode: channelData.providerCode,
        },
      });

      if (savedChannel) {
        savedChannel = await prisma.notificationChannel.update({
          where: { id: savedChannel.id },
          data: channelData,
        });
      } else {
        savedChannel = await prisma.notificationChannel.create({
          data: {
            ...channelData,
            notificationId: savedNotification.id,
          },
        });
      }

      const existingContent = await prisma.notificationChannelContent.findFirst({
        where: { channelId: savedChannel.id },
      });

      if (existingContent) {
        await prisma.notificationChannelContent.update({
          where: { id: existingContent.id },
          data: content,
        });
      } else {
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
