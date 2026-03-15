import { z } from 'zod';
import { limitValidation, pageNoValidation } from '../../../../../utils/common.validation';

export const requiredString = (field: string, max = 25): z.ZodType<string> =>
  z
    .string()
    .optional()
    .transform((val) => val?.trim() ?? '')
    .refine((val) => val.length > 0, {
      message: `${field} is required`,
    })
    .refine((val) => val.length <= max, {
      message: `${field} must be less than ${max} characters`,
    }) as z.ZodType<string>;

export const createAdminSchema = z.object({
  body: z
    .object({
      firstName: requiredString('First name'),
      middleName: z.string().trim().max(25, 'Middle name must be less than 25 characters').optional(),
      lastName: requiredString('Last name'),
      email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email address' }),

      mobileNumber: z
        .string()
        .trim()
        .regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid mobile number')
        .optional(),

      password: z
        .string()
        .optional()
        .refine((val) => val !== undefined && val !== '', {
          message: 'Password is required',
        })
        .refine((val) => val!.length >= 6, {
          message: 'Password must be at least 6 characters',
        })
        .refine((val) => val!.length <= 25, {
          message: 'Password too long',
        })
        .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])/.test(val!), {
          message: 'Password must contain uppercase, lowercase, number, special character',
        }),
    })
    .strict(),
});

export const updateAdminSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .min(1, 'First name cannot be empty')
        .max(25, 'First name must be less than 25 characters')
        .optional(),

      middleName: z.string().max(25, 'Middle name must be less than 25 characters').optional(),

      lastName: z
        .string()
        .min(1, 'Last name cannot be empty')
        .max(25, 'Last name must be less than 25 characters')
        .optional(),

      email: z.string().email('Invalid email address').optional(),

      mobileNumber: z
        .string()
        .trim()
        .regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid mobile number')
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    })
    .strict(),
});

export const getAllAdminSchema = z.object({
  query: z
    .object({
      pageNo: pageNoValidation,
      limit: limitValidation,
    })
    .strict(),
});

export const loginAdminSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .trim()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email is invalid' }),

      password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters' }),
    })
    .strict(),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),

      newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(25, 'Password too long')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])/,
          'Password must contain uppercase, lowercase, number, special character',
        ),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'New password cannot be the same as the current password',
      path: ['newPassword'],
    })
    .strict(),
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
  }),
});

export const deleteAdminSchema = z.object({
  body: z
    .object({
      password: z.string().min(1, 'Password is required'),
    })
    .strict(),
});
