export interface IMessageBroker {
  connect(): Promise<void>;
  publish<T>(topic: string, message: T): Promise<void>;
  subscribe<T>(
    topic: string,
    handler: (msg: T) => void,
    options?: { queueName?: string; durable?: boolean },
  ): Promise<void>;
  disconnect(): Promise<void>;
}
