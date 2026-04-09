import { ChannelType } from '@prisma/client';
import { ProviderCode } from '../../types/notificationTypes/notification.types';

export const notificationProviders = [
  {
    code: ProviderCode.RESEND,
    channel: ChannelType.EMAIL,
    active: true,
  },
  {
    code: ProviderCode.MSG91,
    channel: ChannelType.SMS,
    active: true,
  },
  {
    code: ProviderCode.FCM,
    channel: ChannelType.WEB_PUSH,
    active: true,
  },
  {
    code: ProviderCode.IN_APP,
    channel: ChannelType.IN_APP,
    active: true,
  },
];
