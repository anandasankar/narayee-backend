export interface ResendConfig {
  apiKey: string;
  fromEmail: string;
  fromName?: string;
}

export interface EmailOptions {
  subject?: string;
  [key: string]: unknown;
}
