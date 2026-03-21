import { NotificationType } from '@prisma/client';
import { z } from 'zod';
import { limitValidation, pageNoValidation, parseJson } from '../../../../utils/common.validation';

const notificationTypeEnum = z.nativeEnum(NotificationType);

export const createNotificationSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title must be less than 150 characters'),

      description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters'),

      type: notificationTypeEnum,

      publishedAt: z
        .string()
        .datetime({ message: 'Invalid date-time format. Use ISO 8601 format.' })
        .transform((val) => new Date(val))
        .optional(),

      expiresAt: z
        .string()
        .datetime({ message: 'Invalid date-time format. Use ISO 8601 format.' })
        .transform((val) => new Date(val))
        .optional(),
    })
    .strict()
    .refine(
      (data) => {
        if (data.publishedAt && data.expiresAt) {
          return data.expiresAt > data.publishedAt;
        }
        return true;
      },
      { message: 'expiresAt must be after publishedAt', path: ['expiresAt'] },
    ),
});

export const updateNotificationSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid notification id format' }),
  }),

  body: z
    .object({
      title: z.string().min(3).max(150).optional(),
      description: z.string().min(10).max(1000).optional(),
      type: notificationTypeEnum.optional(),
      active: z.boolean().optional(),
      publishedAt: z
        .string()
        .datetime({ message: 'Invalid date-time format. Use ISO 8601 format.' })
        .transform((val) => new Date(val))
        .optional(),
      expiresAt: z
        .string()
        .datetime({ message: 'Invalid date-time format. Use ISO 8601 format.' })
        .transform((val) => new Date(val))
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const getNotificationByIdSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid notification id format' }),
  }),
});

export const notificationFilterSchema = z
  .object({
    title: z.string().optional(),
    type: notificationTypeEnum.optional(),
    active: z
      .union([z.boolean(), z.enum(['true', 'false'])])
      .transform((val) => (typeof val === 'string' ? val === 'true' : val))
      .optional(),
  })
  .strict();

export const getAllNotificationsSchema = z.object({
  query: z
    .object({
      filter: z
        .string()
        .optional()
        .transform((value) => parseJson(value))
        .pipe(notificationFilterSchema)
        .optional(),

      pageNo: pageNoValidation,
      limit: limitValidation,
    })
    .strict(),
});

export const deleteNotificationSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid notification id format' }),
  }),
});
