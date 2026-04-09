import { prisma } from '../../lib/prisma';
import logger from '../../logger';
import { notificationProviders } from './notification.provider.data';

export async function seedNotificationProviders(): Promise<void> {
  logger.info('--------------------------Seeding notification providers...--------------------------');

  for (const provider of notificationProviders) {
    await prisma.notificationProvider.upsert({
      where: { code: provider.code },
      update: {},
      create: provider,
    });
  }

  logger.info(
    `--------------------------Seeded ${notificationProviders.length} notification providers--------------------------`,
  );
}
