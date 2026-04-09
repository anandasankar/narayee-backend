import logger from '../../logger';
import { userCreatedConsumer } from './service/user.consumer.service';

export class ConsumerFactory {
  static async runAll(): Promise<void> {
    logger.info('[ConsumerFactory] Starting all consumers...');

    await Promise.all([userCreatedConsumer()]);

    logger.info('[ConsumerFactory] ✅ All consumers running');
  }
}
