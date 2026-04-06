import { AnnouncementType } from '@prisma/client';
import { z } from 'zod';
import { limitValidation, pageNoValidation, parseJson } from '../../../../utils/common.validation';

const announcementTypeEnum = z.nativeEnum(AnnouncementType);

export const createAnnouncementSchema = z.object({
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

      type: announcementTypeEnum,

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

export const updateAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid announcement id format' }),
  }),

  body: z
    .object({
      title: z.string().min(3).max(150).optional(),
      description: z.string().min(10).max(1000).optional(),
      type: announcementTypeEnum.optional(),
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

export const getAnnouncementByIdSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid announcement id format' }),
  }),
});

export const announcementFilterSchema = z
  .object({
    title: z.string().optional(),
    type: announcementTypeEnum.optional(),
    active: z
      .union([z.boolean(), z.enum(['true', 'false'])])
      .transform((val) => (typeof val === 'string' ? val === 'true' : val))
      .optional(),
  })
  .strict();

export const getAllAnnouncementsSchema = z.object({
  query: z
    .object({
      filter: z
        .string()
        .optional()
        .transform((value) => parseJson(value))
        .pipe(announcementFilterSchema)
        .optional(),

      pageNo: pageNoValidation,
      limit: limitValidation,
    })
    .strict(),
});

export const deleteAnnouncementSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid announcement id format' }),
  }),
});
