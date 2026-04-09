import {
  ChannelType,
  MessageStatus,
  NotificationLogType,
  RecipientType,
  SenderType,
} from '@prisma/client';
import { notificationRepository } from '../api/v1/modules/notificationManagement/notification.repository';
import { notificationLogRepository } from '../api/v1/modules/notificationManagement/notificationLog/notification.log.repository';
import { userRepository } from '../api/v1/modules/user/auth/user.auth.repository';
import { ChannelManager } from '../channels/core/channel.manager';
import logger from '../logger';
import { templateEngine } from '../utils/template.engine';
import {
  CreateNotificationLogDTO,
  NotificationLogMetaDataDTO,
} from './../api/v1/modules/notificationManagement/notificationLog/notification.log.interface';
import { EventPayloadMap } from './event.handler.interface';

export class EventHandler {
  async handleEvent<EventType extends keyof EventPayloadMap>(
    eventCode: EventType,
    payload: EventPayloadMap[EventType],
  ): Promise<void> {
    try {
      logger.info(`[EventHandler] Received event: ${eventCode}`);

      // Step 1: Fetch notification config from DB
      const notification = await notificationRepository.getNotificationByEventCode(eventCode);

      if (!notification) {
        logger.warn(`[EventHandler] No notifications configured for ${eventCode}`);
        return;
      }

      // Step 2: Get all channels — only ENABLED ones
      const allChannels = notification.channels.filter((channel) => channel.enabled);
      const channelIds = allChannels.map((channel) => channel.id);

      if (!channelIds.length) {
        logger.warn(
          `[EventHandler] No enabled channels found for notifications with event: ${eventCode}`,
        );
        return;
      }

      const allContents = await notificationRepository.getContentByChannelIds(channelIds);

      // Step 3: Build template data context from payload
      const templateData: Record<string, unknown> = {
        userId: payload.userId,
        ...('data' in payload && typeof payload.data === 'object' ? payload.data : {}),
      };

      // Step 4: Fetch user once (needed for email recipient address)
      const userDetails = await userRepository.getUserById(payload.userId);

      if (!userDetails) {
        logger.warn(
          `[EventHandler] User not found for userId: ${payload.userId}, aborting event ${eventCode}`,
        );
        return;
      }

      for (const channel of allChannels) {
        const content = allContents.find((c) => c.channelId === channel.id);

        if (!content) {
          logger.warn(
            `[EventHandler] No content found for channel ${channel.channel} (channelId: ${channel.id})`,
          );
          continue;
        }

        // Step 5: Render template with LiquidJS
        let subject: string | undefined;
        let messageBody: string | undefined;

        try {
          const rendered = await templateEngine.renderContent(
            {
              subject: content.subject ?? undefined,
              messageText: content.messageText ?? undefined,
              messageHTML: content.messageHTML ?? undefined,
            },
            templateData,
          );

          subject = rendered.subject;
          // Prefer HTML; fall back to plain text
          messageBody = rendered.messageHTML ?? rendered.messageText;

          logger.info(`[EventHandler] Template rendered for channel: ${channel.channel}`);
        } catch (renderError) {
          logger.error(
            `[EventHandler] Template render failed for channel ${channel.channel}: ${(renderError as Error).message}`,
          );
          continue;
        }

        // Step 6: Create notification log
        const logData: CreateNotificationLogDTO = {
          senderType: SenderType.SYSTEM,
          notificationId: notification.id,
          recipientId: payload.userId,
          recipientType: RecipientType.USER,
          contentId: content.id,
          subject,
          messageBody,
          providerId: channel.providerId,
          logType: NotificationLogType.DEFAULT,
          notificationChannelId: channel.id,
        };

        const notificationLog = await notificationLogRepository.createNotificationLog(logData);

        const metaData: NotificationLogMetaDataDTO = {
          notificationLogId: notificationLog.id,
        };

        logger.info(`[EventHandler] Notification log created for channel: ${channel.channel}`);

        // Step 7: Dispatch to correct channel
        switch (channel.channel) {
          case ChannelType.EMAIL: {
            if (!subject || !messageBody) {
              logger.warn('[EventHandler] EMAIL: Missing subject or messageBody, skipping');

              await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
                status: MessageStatus.ERROR,
                errorMessage: 'Missing subject or messageBody for email',
              });

              break;
            }

            await this.sendEmail(userDetails.email, subject, messageBody, metaData);
            break;
          }

          case ChannelType.IN_APP: {
            // IN_APP has no external provider.
            // The notification log row itself IS the notification.
            if (!messageBody) {
              logger.warn('[EventHandler] IN_APP: Missing messageBody, skipping');

              await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
                status: MessageStatus.ERROR,
                errorMessage: 'Missing messageBody for in-app notification',
              });

              break;
            }

            await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
              status: MessageStatus.OK,
            });

            logger.info(`[EventHandler] IN_APP notification marked SENT for userId: ${payload.userId}`);

            break;
          }

          default: {
            logger.warn(
              `[EventHandler] Unsupported channel type: ${channel.channel} (channelId: ${channel.id})`,
            );

            await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
              status: MessageStatus.ERROR,
              errorMessage: `Unsupported channel: ${channel.channel}`,
            });

            break;
          }
        }
      }
    } catch (error) {
      logger.error(`[EventHandler] Failed for ${eventCode}: ${(error as Error).message}`);
    }
  }

  private async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    metaData: NotificationLogMetaDataDTO,
  ): Promise<void> {
    try {
      const emailChannel = ChannelManager.getInstance().getEmailChannel();

      if (!emailChannel) {
        logger.error('[EventHandler] Email channel not available');

        await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
          status: MessageStatus.ERROR,
          errorMessage: 'Email channel not available',
        });

        return;
      }

      await emailChannel.sendEmail(to, subject, htmlBody, metaData);

      logger.info(`[EventHandler] Email sent successfully to ${to}`);
    } catch (error) {
      logger.error(`[EventHandler] Failed to send email to ${to}: ${(error as Error).message}`);

      await notificationLogRepository.updateNotificationLog(metaData.notificationLogId, {
        status: MessageStatus.ERROR,
        errorMessage: (error as Error).message,
      });
    }
  }
}

export const eventHandler = new EventHandler();
