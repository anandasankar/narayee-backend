import { z } from 'zod';
import { limitValidation, pageNoValidation } from '../../../../../utils/common.validation';

/* -------------------- Reusable Validators -------------------- */

export const passwordValidation = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(25, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])/,
    'Password must contain uppercase, lowercase, number, and special character',
  );

export const mobileNumberValidation = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
  .transform((val) => `+91${val}`);

const singleNameValidation = z
  .string()
  .trim()
  .min(1, 'This field is required')
  .max(25, 'Must be less than 25 characters')
  .regex(/^[A-Za-z]+$/, 'Only alphabets allowed (no spaces)')
  .transform((val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
/* -------------------- Base Schema -------------------- */

const createUserBodySchema = z
  .object({
    firstName: singleNameValidation,
    middleName: singleNameValidation.optional(),
    lastName: singleNameValidation,
    email: z.string().trim().email('Invalid email address').optional(),
    mobileNumber: mobileNumberValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .strict();

/* -------------------- Final Schema -------------------- */

export const createUserSchema = z.object({
  body: createUserBodySchema
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password and Confirm Password must match',
      path: ['confirmPassword'],
    })
    .transform(({ confirmPassword: _confirmPassword, ...rest }) => rest),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, 'First name cannot be empty')
        .max(25, 'First name must be less than 25 characters')
        .optional(),

      middleName: z.string().trim().max(25, 'Middle name must be less than 25 characters').optional(),

      lastName: z
        .string()
        .trim()
        .min(1, 'Last name cannot be empty')
        .max(25, 'Last name must be less than 25 characters')
        .optional(),

      email: z.string().trim().email('Invalid email address').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    })
    .strict(),
});

export const getAllUsersSchema = z.object({
  query: z
    .object({
      pageNo: pageNoValidation,
      limit: limitValidation,
      search: z.string().trim().optional(),
    })
    .strict(),
});

export const loginUserSchema = z.object({
  body: z
    .object({
      identifier: z.string().min(1, 'Email or mobile number is required'),
      password: z.string().min(1, 'Password is required'),
    })
    .strict(),
});
export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: passwordValidation,
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'New password cannot be the same as the current password',
      path: ['newPassword'],
    })
    .strict(),
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const deleteUserSchema = z.object({
  body: z
    .object({
      password: z.string().min(1, 'Password is required'),
    })
    .strict(),
});
