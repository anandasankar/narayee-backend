// import twilio, { Twilio as TwilioClient } from 'twilio';

// import logger from '../../../logger';
// import { TwilioConfig } from '../../../types/channels.types';
// import { Provider } from '../../core/provider.interface';

// export class TwilioProvider implements Provider {
//   private static instance: TwilioProvider;
//   private readonly client: TwilioClient;
//   private readonly fromNumber: string;

//   private constructor(config: TwilioConfig) {
//     this.client = twilio(config.accountSid, config.authToken);
//     this.fromNumber = config.fromNumber;
//     logger.info('[TwilioProvider] Twilio client initialized');
//   }

//   public static getInstance(config?: TwilioConfig): TwilioProvider {
//     if (!TwilioProvider.instance) {
//       if (!config) {
//         throw new Error('[TwilioProvider] Config must be provided on first initialization');
//       }
//       TwilioProvider.instance = new TwilioProvider(config);
//     }
//     return TwilioProvider.instance;
//   }

//   /**
//    * Satisfies the Provider interface.
//    * The `to` param is the destination number.
//    */
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   async send(to: string, message: string, _options?: Record<string, any>): Promise<void> {
//     await this.sendSMS(to, message);
//   }

//   /**
//    * Direct SMS send — called by SmsChannel which handles logging separately.
//    */
//   async sendSMS(to: string, message: string): Promise<void> {
//     await this.client.messages.create({
//       from: this.fromNumber,
//       to,
//       body: message,
//     });
//   }
// }
