import { ChannelType, RunMode } from '@prisma/client';
import { EventDefinitionCode } from '../../eventDefinition/event.definition.type';
import { ProviderCode } from '../../notificationProvider/notification.types';

export const userNotifications = [
  {
    name: 'Welcome Notification',
    runMode: RunMode.SYSTEM,
    eventCode: EventDefinitionCode.USER_CREATED,
    active: true,
    channels: [
      {
        channel: ChannelType.EMAIL,
        enabled: true,
        providerCode: ProviderCode.RESEND,
        content: {
          subject: 'Welcome to Coderd! 🎉',
          messageText: null,
          messageHTML: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Welcome to Coderd! 🎉</h2>
              <p>Hi <strong>{{firstName}}</strong>,</p>
              <p>We're thrilled to have you with us. Your account has been created successfully.</p>
              <p>Start exploring our courses and kick off your learning journey today.</p>
              <p style="margin-top: 32px; color: #6B7280;">Cheers,<br/>The Coderd Team</p>
            </div>
          `,
        },
      },
      {
        channel: ChannelType.IN_APP,
        enabled: true,
        providerCode: ProviderCode.IN_APP,
        content: {
          subject: 'Welcome to Coderd!',
          messageText:
            'Hi {{firstName}}, your account has been created successfully. Start exploring our courses!',
          messageHTML: null,
        },
      },
    ],
  },
];
