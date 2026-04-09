import { ResendConfig } from '../types/channels.types';

export class ConfigResolver {
  static getResendConfig(): ResendConfig | null {
    const { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_NAME } = process.env;

    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) return null;

    return {
      apiKey: RESEND_API_KEY,
      fromEmail: RESEND_FROM_EMAIL,
      fromName: RESEND_FROM_NAME,
    };
  }
}
