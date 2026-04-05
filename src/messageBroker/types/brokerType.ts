export const BROKER_TYPES = {
  rabbitmq: 'rabbitmq',
} as const;

export type BrokerType = (typeof BROKER_TYPES)[keyof typeof BROKER_TYPES];
