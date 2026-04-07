import { ChannelType, RunMode } from '@prisma/client';
import { EventDefinitionCode } from '../../eventDefinition/event.definition.type';
import { ProviderCode } from '../../notificationProvider/notification.types';

export const otpNotifications = [
  {
    name: 'Send OTP Notification',
    runMode: RunMode.SYSTEM,
    eventCode: EventDefinitionCode.OTP_REQUESTED,
    active: true,
    channels: [
      {
        channel: ChannelType.SMS,
        enabled: true,
        providerCode: ProviderCode.MSG91,
        content: {
          subject: null,
          messageText:
            'Your OTP is {{otp}}. It is valid for {{expiryMinutes}} minutes. Do not share this with anyone.',
          messageHTML: null,
        },
      },
      {
        channel: ChannelType.EMAIL,
        enabled: true,
        providerCode: ProviderCode.RESEND,
        content: {
          subject: 'Your OTP Code',
          messageText:
            'Hi {{firstName}}, your OTP is {{otp}}. It will expire in {{expiryMinutes}} minutes.',
          messageHTML: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Your OTP Code</h2>
              <p>Hi <strong>{{firstName}}</strong>,</p>
              <p>Your One-Time Password (OTP) is:</p>
              <h1 style="letter-spacing: 4px;">{{otp}}</h1>
              <p>This OTP is valid for {{expiryMinutes}} minutes.</p>
              <p style="color: red;">Do not share this code with anyone.</p>
            </div>
          `,
        },
      },
    ],
  },
];
