import { z, ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { HttpStatusCode } from '../types/HttpStatusCode';

export const pageNoValidation = z
  .string()
  .optional()
  .default('1')
  .transform((x) => (x ? Number(x) : 1))
  .refine((num) => num >= 1, {
    message: 'Page number must be at least 1',
  });

export const limitValidation = z
  .string()
  .optional()
  .default('10')
  .transform((x) => (x ? Number(x) : 10))
  .refine((num) => num >= 1 && num <= 1000, {
    message: 'Limit must be between 1-1000',
  });

export const parseJson = (val: string | undefined): Record<string, unknown> => {
  if (!val) {
    return {};
  }

  try {
    return JSON.parse(val);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw error;
    }

    throw new AppError(HttpStatusCode.BAD_REQUEST, 'Invalid JSON format in filter', false);
  }
};
