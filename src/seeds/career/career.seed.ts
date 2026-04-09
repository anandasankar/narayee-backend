import { prisma } from '../../lib/prisma';
import logger from '../../logger';
import { careers } from './career.seed.data';

export async function seedCareers(): Promise<void> {
  logger.info('--------------------------Seeding careers...--------------------------');

  for (const career of careers) {
    await prisma.career.upsert({
      where: { title: career.title },
      update: {},
      create: career,
    });
  }

  logger.info(`--------------------------Seeded ${careers.length} careers--------------------------`);
}
