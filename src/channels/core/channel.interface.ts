import { Provider } from './provider.interface';

export interface Channel {
  setProvider(provider: Provider): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(to: string, message: string, options?: Record<string, any>): Promise<void>;
}
