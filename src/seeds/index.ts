import { prisma } from '../lib/prisma';
import logger from '../logger';
import { seedCareers } from './career/career.seed';
import { seedEventDefinitions } from './eventDefinition/event.definition.seed';
import { seedNotifications } from './notification/notification.seed';
import { seedNotificationProviders } from './notificationProvider/notification.provider.seed';

async function runSeed(): Promise<void> {
  try {
    logger.info('--------------------------🚀 Running default seed...--------------------------');

    await seedCareers();
    await seedEventDefinitions();
    await seedNotificationProviders();
    await seedNotifications();

    logger.info('--------------------------🎉 Default seed completed--------------------------');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void runSeed();
