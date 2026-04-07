import logger from '../../logger';
import { Provider } from '../core/provider.interface';

export class SmsChannel {
  private provider!: Provider;

  public setProvider(provider: Provider): void {
    this.provider = provider;
    logger.info(`[SmsChannel] Provider set: ${provider.constructor.name}`);
  }

  public async sendSMS(to: string, message: string): Promise<void> {
    if (!this.provider) {
      logger.error('SMS provider not configured');
      return;
    }

    try {
      await this.provider.send(to, message);

      logger.info(`[SmsChannel] SMS sent to ${to}`);
    } catch (error) {
      logger.error(`[SmsChannel] Failed to send SMS to ${to}: ${(error as Error).message}`);
    }
  }
}
