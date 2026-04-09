import { MessageStatus } from '@prisma/client';
import { notificationLogRepository } from '../../api/v1/modules/notificationManagement/notificationLog/notification.log.repository';
import { NotificationLogMetaDataDTO } from '../../api/v1/modules/notificationManagement/notificationLog/notification.log.interface';
import logger from '../../logger';
import { Channel } from '../core/channel.interface';
import { Provider } from '../core/provider.interface';
import { EmailOptions } from '../types/channels.types';

export class EmailChannel implements Channel {
  private provider!: Provider;

  public setProvider(provider: Provider): void {
    this.provider = provider;
    logger.info('[EmailChannel] Provider set');
  }

  public async send(to: string, message: string, options?: EmailOptions): Promise<void> {
    if (!this.provider) {
      logger.error('[EmailChannel] Email provider not configured');
      return;
    }

    try {
      await this.provider.send(to, message, { subject: options?.subject ?? 'Notification' });
      logger.info(`[EmailChannel] Email sent to ${to}`);
    } catch (error) {
      logger.error(`[EmailChannel] Failed to send email to ${to}: ${(error as Error).message}`);
    }
  }

  public async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    metaData: NotificationLogMetaDataDTO,
  ): Promise<void> {
    if (!this.provider) {
      logger.error('[EmailChannel] Email provider not configured');

      await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
        status: MessageStatus.ERROR,
        errorMessage: 'Provider not configured',
      });

      return;
    }

    try {
      await this.provider.send(to, htmlBody, { subject });
      logger.info(`[EmailChannel] Email sent to ${to}`);

      await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
        status: MessageStatus.OK,
      });
    } catch (error) {
      logger.error(`[EmailChannel] Failed to send email to ${to}: ${(error as Error).message}`);

      await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
        status: MessageStatus.ERROR,
        errorMessage: (error as Error).message,
      });
    }
  }
}
