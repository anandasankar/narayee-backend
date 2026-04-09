export interface GetNotificationResponse {
  id: string;
  name: string;
  eventCode: string | null;

  channels: {
    id: string;
    channel: string;
    providerCode: string;
    providerId: string | null;
    enabled: boolean;
  }[];
}
