import dotenv from 'dotenv';
import { AppError } from '../../errors/AppError';
import { HttpStatusCode } from '../../types/HttpStatusCode';
import { BROKER_TYPES, BrokerType } from '../types/brokerType';
import { IMessageBroker } from './IMessageBroker';
import { RabbitMQBroker } from './RabbitMQBroker';

dotenv.config();

const rabbitUrl = process.env.RABBITMQ_URL as string;

if (!rabbitUrl) {
  throw new AppError(HttpStatusCode.BAD_REQUEST, 'RABBITMQ_URL is not defined', false);
}

export class BrokerFactory {
  // Singleton registry: one instance per broker type
  private static readonly brokers: Map<BrokerType, IMessageBroker> = new Map();

  /**
   * Returns a singleton broker instance by type.
   * Creates it if it doesn't exist yet.
   */
  static create(type: BrokerType): IMessageBroker {
    if (!this.brokers.has(type)) {
      let instance: IMessageBroker;

      switch (type) {
        case BROKER_TYPES.rabbitmq:
          instance = new RabbitMQBroker(rabbitUrl);
          break;
        default:
          throw new Error(`[BrokerFactory] Unsupported broker type: ${type}`);
      }

      this.brokers.set(type, instance);
    }

    const broker = this.brokers.get(type);
    if (!broker) {
      throw new Error(`[BrokerFactory] Broker of type "${type}" not found after creation`);
    }

    return broker;
  }

  /**
   * Returns all registered broker instances.
   * Useful for graceful shutdown.
   */
  static getAllBrokers(): IMessageBroker[] {
    return Array.from(this.brokers.values());
  }
}
