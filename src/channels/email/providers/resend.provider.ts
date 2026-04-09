import { Resend } from 'resend';
import { Provider } from '../../core/provider.interface';
import { EmailOptions, ResendConfig } from '../../types/channels.types';

export class ResendProvider implements Provider {
  private resend: Resend;
  private fromEmail: string;
  private fromName: string;

  constructor(config: ResendConfig) {
    this.resend = new Resend(config.apiKey);
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName ?? 'System';
  }

  async send(to: string, message: string, options?: EmailOptions): Promise<void> {
    const subject = options?.subject ?? 'Notification';
    await this.sendToEmail(to, subject, message);
  }

  async sendToEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    await this.resend.emails.send({
      from: `${this.fromName} <${this.fromEmail}>`,
      to,
      subject,
      html: htmlBody,
    });
  }

  async sendBulkEmails(recipients: string[], subject: string, htmlBody: string): Promise<void> {
    if (!recipients.length) return;

    await this.resend.batch.send(
      recipients.map((to) => ({
        from: `${this.fromName} <${this.fromEmail}>`,
        to,
        subject,
        html: htmlBody,
      })),
    );
  }
}
