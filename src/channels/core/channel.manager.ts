import logger from '../../logger';
import { ConfigResolver } from '../config/config.resolver';
import { EmailChannel } from '../email/email.channel';
import { ResendProvider } from '../email/providers/resend.provider';

export class ChannelManager {
  private static instance: ChannelManager;
  private emailChannel: EmailChannel | null = null;

  private constructor() {}

  public static getInstance(): ChannelManager {
    if (!ChannelManager.instance) {
      ChannelManager.instance = new ChannelManager();
    }
    return ChannelManager.instance;
  }

  getEmailChannel(): EmailChannel {
    if (this.emailChannel) return this.emailChannel;

    const emailChannel = new EmailChannel();
    const resendConfig = ConfigResolver.getResendConfig();

    if (!resendConfig) {
      logger.error('[ChannelManager] Resend config missing — email provider not set');
      this.emailChannel = emailChannel;
      return emailChannel;
    }

    emailChannel.setProvider(new ResendProvider(resendConfig));
    logger.info('[ChannelManager] Resend provider initialized');

    this.emailChannel = emailChannel;
    return emailChannel;
  }
}
