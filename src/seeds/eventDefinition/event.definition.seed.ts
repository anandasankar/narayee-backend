import { prisma } from '../../lib/prisma';
import logger from '../../logger';
import { eventDefinitions } from './event.definition.data';

export async function seedEventDefinitions(): Promise<void> {
  logger.info('------------------Seeding event definitions...------------------');

  for (const event of eventDefinitions) {
    await prisma.eventDefinition.upsert({
      where: { code: event.code },
      update: {
        name: event.name,
        description: event.description,
        eventType: event.eventType,
      },
      create: event,
    });
  }

  logger.info(`------------------Seeded ${eventDefinitions.length} event definitions------------------`);
}
