import { prisma } from '../lib/prisma';
import logger from '../logger';
import { seedCareers } from './career.seed';

async function main(): Promise<void> {
  logger.info('--------------------------🚀 Running default seed...--------------------------');

  await seedCareers();

  logger.info('--------------------------🎉 Default seed completed--------------------------');
}

main()
  .catch((error) => {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
