import amqp, { Channel, ChannelModel } from 'amqplib';
import logger from '../../logger';
import { IMessageBroker } from './IMessageBroker';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const EXCHANGE = 'system.events';
const DLX_EXCHANGE = 'system.events.dlx';
const DLQ = 'system.events.dlq';

export class RabbitMQBroker implements IMessageBroker {
  private connection!: ChannelModel;
  private channel!: Channel;
  private isConnected = false;

  constructor(private readonly uri: string) {}

  private isReconnecting = false;

  async connect(): Promise<void> {
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        this.connection = await amqp.connect(this.uri);
        this.channel = await this.connection.createChannel();

        await this.channel.prefetch(10);

        await this.channel.assertExchange(EXCHANGE, 'topic', { durable: true });
        await this.channel.assertExchange(DLX_EXCHANGE, 'topic', { durable: true });

        await this.channel.assertQueue(DLQ, { durable: true });
        await this.channel.bindQueue(DLQ, DLX_EXCHANGE, '#');

        this.connection.on('close', () => {
          logger.warn('[RabbitMQ] Connection closed. Reconnecting...');
          this.isConnected = false;

          if (!this.isReconnecting) {
            this.isReconnecting = true;

            setTimeout(async () => {
              await this.connect();
              this.isReconnecting = false;
            }, RETRY_DELAY_MS);
          }
        });

        this.connection.on('error', (err: Error) => {
          logger.error('[RabbitMQ] Connection error:', err.message);
        });

        this.isConnected = true;
        this.isReconnecting = false;

        logger.info('[RabbitMQ] ✅ Connected successfully');
        return;
      } catch (err) {
        attempt++;
        logger.error(
          `[RabbitMQ] ❌ Attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY_MS}ms...`,
          err,
        );

        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      }
    }

    throw new Error('[RabbitMQ] Failed to connect after maximum retries');
  }

  async publish<T>(routingKey: string, message: T): Promise<void> {
    if (!this.isConnected) {
      throw new Error('[RabbitMQ] Cannot publish — broker is not connected');
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(JSON.stringify(message));
    } catch {
      throw new Error('[RabbitMQ] Failed to serialize message to JSON');
    }

    const sent = this.channel.publish(EXCHANGE, routingKey, buffer, {
      persistent: true,
      contentType: 'application/json',
      timestamp: Date.now(),
    });

    if (!sent) {
      throw new Error(`[RabbitMQ] Failed to publish → [${routingKey}]`);
    }

    logger.info(`[RabbitMQ] 📤 Published → [${routingKey}]`);
  }

  async subscribe<T>(
    routingKey: string,
    handler: (msg: T) => Promise<void> | void,
    options?: { queueName?: string; durable?: boolean },
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error('[RabbitMQ] Cannot subscribe — broker is not connected');
    }

    const isNamedQueue = !!options?.queueName;

    const q = await this.channel.assertQueue(options?.queueName ?? '', {
      exclusive: !isNamedQueue,
      durable: options?.durable ?? isNamedQueue,
      arguments: {
        'x-dead-letter-exchange': DLX_EXCHANGE,
        'x-dead-letter-routing-key': `dead.${routingKey}`,
        'x-message-ttl': 86400000,
      },
    });

    await this.channel.bindQueue(q.queue, EXCHANGE, routingKey);

    await this.channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      let parsed: T;
      try {
        parsed = JSON.parse(msg.content.toString());
      } catch {
        logger.error(`[RabbitMQ] ❌ Invalid JSON on [${routingKey}] — sending to DLQ`);
        this.channel.nack(msg, false, false);
        return;
      }

      try {
        await handler(parsed);
        this.channel.ack(msg);
      } catch (err) {
        logger.error(`[RabbitMQ] ❌ Handler failed [${routingKey}]`, err);
        this.channel.nack(msg, false, false);
      }
    });

    logger.info(`[RabbitMQ] Subscribed → [${routingKey}] on queue [${q.queue}]`);
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.isConnected = false;
      logger.info('[RabbitMQ] 🔌 Disconnected cleanly');
    } catch (err) {
      logger.error('[RabbitMQ] Error during disconnect:', err);
    }
  }
}
