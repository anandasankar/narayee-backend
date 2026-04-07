import logger from '../../logger';

export class ChannelManager {
  private static instance: ChannelManager;

  // Cache: providerCode → resolved config object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private configCache: Record<string, any> = {};

  private constructor() {}

  public static getInstance(): ChannelManager {
    if (!ChannelManager.instance) {
      ChannelManager.instance = new ChannelManager();
    }
    return ChannelManager.instance;
  }

  // ─── SMS ──────────────────────────────────────────────────────────────────

  // async getSmsChannel(): Promise<SmsChannel> {
  //   const notificationRepository = new NotificationRepository(prisma);
  //   const smsChannel = new SmsChannel({ notificationRepository });

  //   const cacheKey = 'TWILIO';

  //   if (this.configCache[cacheKey]) {
  //     logger.info('[ChannelManager] Using cached Twilio config');
  //     smsChannel.setProvider(TwilioProvider.getInstance(this.configCache[cacheKey] as TwilioConfig));
  //     return smsChannel;
  //   }

  //   const config = resolveTwilioConfig();

  //   if (!config) {
  //     logger.warn('[ChannelManager] Twilio config missing in env; channel returned without provider');
  //     return smsChannel;
  //   }

  //   smsChannel.setProvider(TwilioProvider.getInstance(config));
  //   this.configCache[cacheKey] = config;

  //   logger.info('[ChannelManager] Twilio provider initialized');
  //   return smsChannel;
  // }

  // ─── Cache management ────────────────────────────────────────────────────

  /**
   * Call this if env vars are rotated at runtime and you need fresh configs.
   * Pass a specific key ("SENDGRID" | "TWILIO" | "FCM") or omit to clear all.
   */
  destroyConfigCache(key?: string): void {
    if (key) {
      delete this.configCache[key];
      logger.info(`[ChannelManager] Cleared config cache for: ${key}`);
    } else {
      this.configCache = {};
      logger.info('[ChannelManager] Cleared all config caches');
    }
  }
}
