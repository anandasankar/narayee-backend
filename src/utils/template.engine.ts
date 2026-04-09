import { Liquid } from 'liquidjs';
import logger from '../logger';
import { TemplateInput, TemplateRenderResult } from '../types/template.engine.type';

class TemplateEngine {
  private engine: Liquid;

  constructor() {
    this.engine = new Liquid({
      strictFilters: false,
      strictVariables: false,
      trimTagLeft: true,
      trimTagRight: true,
    });

    this.registerCustomFilters();
  }

  private registerCustomFilters(): void {
    // Capitalize first letter of each word
    this.engine.registerFilter('titlecase', (value: string) => {
      if (!value) return '';
      return value
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    });

    // Mask sensitive data like email or phone
    this.engine.registerFilter('mask', (value: string, type: 'email' | 'phone' = 'email') => {
      if (!value) return '';
      if (type === 'email') {
        const [local, domain] = value.split('@');
        if (!domain) return value;
        return `${local.slice(0, 2)}***@${domain}`;
      }
      if (type === 'phone') {
        return value.replace(/(\d{2})\d+(\d{2})/, '$1******$2');
      }
      return value;
    });

    // Format date
    this.engine.registerFilter('formatDate', (value: string | Date, format = 'DD/MM/YYYY') => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return format.replace('DD', day).replace('MM', month).replace('YYYY', String(year));
    });

    // Currency format
    this.engine.registerFilter('currency', (value: number, symbol = '₹', decimals = 2) => {
      if (typeof value !== 'number') return value;
      return `${symbol}${value.toFixed(decimals)}`;
    });

    // Truncate long text
    this.engine.registerFilter('truncate', (value: string, length = 100, suffix = '...') => {
      if (!value || value.length <= length) return value;
      return value.slice(0, length) + suffix;
    });
  }

  /**
   * Render a single template string with the given data context
   */
  async renderString(template: string, data: Record<string, unknown>): Promise<string> {
    try {
      return await this.engine.parseAndRender(template, data);
    } catch (error) {
      logger.error(`[TemplateEngine] Failed to render template: ${(error as Error).message}`);
      logger.debug(`[TemplateEngine] Template: ${template}`);
      logger.debug(`[TemplateEngine] Data: ${JSON.stringify(data)}`);
      throw new Error(`Template rendering failed: ${(error as Error).message}`);
    }
  }

  /**
   * Render all content fields (subject, messageText, messageHTML) in one call
   */
  async renderContent(
    content: TemplateInput,
    data: Record<string, unknown>,
  ): Promise<TemplateRenderResult> {
    const result: TemplateRenderResult = {};

    try {
      if (content.subject) {
        result.subject = await this.renderString(content.subject, data);
      }

      if (content.messageText) {
        result.messageText = await this.renderString(content.messageText, data);
      }

      if (content.messageHTML) {
        result.messageHTML = await this.renderString(content.messageHTML, data);
      }

      logger.info('[TemplateEngine] Content rendered successfully');
      return result;
    } catch (error) {
      logger.error(`[TemplateEngine] renderContent failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Validate a template without rendering (syntax check)
   */
  async validateTemplate(template: string): Promise<{ valid: boolean; error?: string }> {
    try {
      await this.engine.parse(template);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  }
}

export const templateEngine = new TemplateEngine();
