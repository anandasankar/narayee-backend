import { ChannelType, RunMode } from '@prisma/client';
import { EventCode } from '../../../types/notificationTypes/event.definition.type';
import { ProviderCode } from '../../../types/notificationTypes/notification.types';

export const otpNotifications = [
  {
    name: 'Send OTP Notification',
    runMode: RunMode.SYSTEM,
    eventCode: EventCode.OTP_REQUESTED,
    active: true,
    channels: [
      {
        channel: ChannelType.SMS,
        enabled: true,
        providerCode: ProviderCode.MSG91,
        content: {
          subject: undefined,
          messageText:
            'Your OTP is {{otp}}. It is valid for {{expiryMinutes}} minutes. Do not share this with anyone.',
          messageHTML: undefined,
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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your OTP Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background-color:#18181b;padding:24px 32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Your App</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Your OTP Code</p>
              <p style="margin:0 0 24px;font-size:15px;color:#71717a;">Hi <strong style="color:#18181b;">{{firstName}}</strong>, use the code below to proceed.</p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" style="background-color:#f4f4f5;border-radius:10px;padding:24px 16px;">
                    <p style="margin:0 0 6px;font-size:12px;color:#71717a;letter-spacing:1px;text-transform:uppercase;">One-Time Password</p>
                    <p style="margin:0;font-size:36px;font-weight:700;letter-spacing:10px;color:#18181b;font-family:monospace;">{{otp}}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:14px;color:#71717a;">This code expires in <strong style="color:#18181b;">{{expiryMinutes}} minutes</strong>.</p>
              <p style="margin:0;font-size:14px;color:#ef4444;">Never share this code with anyone, including our support team.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f9f9;padding:16px 32px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">If you did not request this code, you can safely ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        },
      },
    ],
  },
];
