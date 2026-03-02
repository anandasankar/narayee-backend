import { z } from 'zod';

/**
 * pageNo validation
 */
export const pageNoValidation = z
  .string()
  .optional()
  .transform((val) => (val ? parseInt(val, 10) : 1))
  .refine((val) => !val || val > 0, {
    message: 'pageNo must be greater than 0',
  });

/**
 * limit validation
 */
export const limitValidation = z
  .string()
  .optional()
  .transform((val) => (val ? parseInt(val, 10) : 10))
  .refine((val) => !val || val > 0, {
    message: 'limit must be greater than 0',
  });
